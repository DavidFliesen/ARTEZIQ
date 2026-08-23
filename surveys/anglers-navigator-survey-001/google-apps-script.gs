/**
 * ARTEZIQ — Angler's Navigator Tackle & Bait Survey
 * Google Apps Script Web App backend (same architecture as the Explorer program's
 * submission handler, simplified — no NDA/PDF/signature handling needed here).
 *
 * SETUP
 * 1. Go to https://script.google.com -> New project.
 * 2. Delete the placeholder code, paste this entire file in.
 * 3. Save (Ctrl/Cmd+S), name the project something like "Angler's Navigator Survey".
 * 4. Deploy -> New deployment -> gear icon -> select type "Web app".
 *      Description: anything you like
 *      Execute as: Me
 *      Who has access: Anyone
 * 5. Click Deploy. The first time, Google will ask you to authorize the script —
 *    approve it (it's your own script, running under your own account).
 * 6. Copy the "Web app" URL shown after deploying (it ends in /exec).
 * 7. Open surveys/anglers-navigator-survey-001/index.html, find the line:
 *      const SUBMIT_ENDPOINT = "PASTE_YOUR_APPS_SCRIPT_EXEC_URL_HERE";
 *    and paste your URL in place of the placeholder text.
 *
 * REDEPLOYING AFTER EDITS
 * Editing this file alone does NOT update the live /exec URL. After any change:
 *   Deploy -> Manage deployments -> pencil/edit icon -> Version: "New version" -> Deploy.
 * The URL stays the same, so survey.html doesn't need to change.
 */

const ADMIN_EMAIL = "arteziq.apps@gmail.com";
const SURVEY_ID = "anglers-navigator-survey-001";
const MIN_SECONDS = 4;
const MAX_FORM_AGE_SECONDS = 60 * 60 * 24; // 24 hours
const RATE_LIMIT_SECONDS = 30;              // per respondent fingerprint

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error("No survey data received.");
    }
    const data = JSON.parse(e.postData.contents);

    // Honeypot: real visitors never see or fill this field (it's positioned off-screen
    // in the HTML). If it's filled, a bot did it. Report success without sending mail so
    // the bot has no signal that it was caught.
    if (data.company) {
      return jsonResponse_({ ok: true });
    }

    // Filled out faster than any human could actually read and answer the form —
    // same silent-success treatment as the honeypot.
    const elapsed = Number(data.elapsedSeconds || 0);
    if (elapsed < MIN_SECONDS) {
      return jsonResponse_({ ok: true });
    }

    if (String(data.surveyId || "") !== SURVEY_ID) {
      throw new Error("Invalid survey identifier.");
    }

    if (elapsed > MAX_FORM_AGE_SECONDS) {
      throw new Error("This survey session has expired. Please reload the page and try again.");
    }

    // Apps Script does not expose the visitor IP address. Instead, rate-limit a
    // lightweight fingerprint based on the optional email plus browser user-agent.
    // This avoids the original system-wide cooldown, which could block two legitimate
    // people who happened to submit at nearly the same time.
    const fingerprintSource =
      String(data.email || "").toLowerCase() + "|" +
      String(data.userAgent || "").slice(0, 200);
    const digest = Utilities.computeDigest(
      Utilities.DigestAlgorithm.SHA_256,
      fingerprintSource || "anonymous"
    );
    const fingerprint = Utilities.base64EncodeWebSafe(digest).slice(0, 40);
    const cache = CacheService.getScriptCache();
    const rateKey = "survey:" + SURVEY_ID + ":" + fingerprint;
    if (cache.get(rateKey)) {
      return jsonResponse_({ ok: false, error: "Please wait a short time before submitting again." });
    }
    cache.put(rateKey, "1", RATE_LIMIT_SECONDS);

    validateLengths_(data);

    const submittedAt = new Date();
    const body =
      "New Angler's Navigator Survey Response\n\n" +
      "Submitted: " + submittedAt + "\n\n" +
      formatAnswers_(data);

    MailApp.sendEmail({
      to: ADMIN_EMAIL,
      subject: "New Angler's Navigator Survey Response" +
        (data.name ? " - " + String(data.name).slice(0, 80) : ""),
      body: body,
      name: "ARTEZIQ Survey"
    });

    // Optional courtesy copy to the respondent, only if they gave a plausible email.
    const email = String(data.email || "").trim();
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      MailApp.sendEmail({
        to: email,
        subject: "Your Angler's Navigator Survey Answers",
        body: "Thanks for taking the time! Here's a copy of what you submitted:\n\n" + formatAnswers_(data),
        name: "ARTEZIQ Survey"
      });
    }

    return jsonResponse_({ ok: true });
  } catch (err) {
    console.error(err);
    return jsonResponse_({ ok: false, error: String(err.message || err) });
  }
}

function formatAnswers_(data) {
  const ignoredFields = ["company", "elapsedSeconds", "surveyId", "formVersion", "userAgent"];
  return Object.keys(data)
    .filter(function (key) { return ignoredFields.indexOf(key) === -1; })
    .map(function (key) {
      const label = key.replace(/([A-Z])/g, " $1").replace(/^./, function (c) { return c.toUpperCase(); });
      return label + ":\n" + String(data[key] || "(none)") + "\n";
    })
    .join("\n");
}


function validateLengths_(data) {
  const limits = {
    name: 120,
    email: 160,
    lureBrands: 2000,
    otherLures: 3000,
    liveBait: 2000,
    otherBait: 2000,
    comments: 4000,
    formVersion: 80,
    userAgent: 500
  };

  Object.keys(limits).forEach(function (key) {
    if (data[key] && String(data[key]).length > limits[key]) {
      throw new Error("Field is too long: " + key);
    }
  });

  const email = String(data.email || "").trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Please provide a valid email address.");
  }
}

function jsonResponse_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
