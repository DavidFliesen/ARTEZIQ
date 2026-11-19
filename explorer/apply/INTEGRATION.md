# Unified Explorer application handoff — development only

**Status:** Not published to the live website. Branch `explorer-unified-onboarding-20261118`.

## Purpose and boundaries

Visitors may select any combination of Angler's Navigator, Hand Over Foot, Angler's Arrows, and Angler's Jigsaw on `/explorer/apply/`, complete one application, sign one NDA covering those selections, and continue to the existing Feedback Explorer Portal to request app-by-app enrollment. Sherpa Caddie remains on its existing closed-alpha route.

The development form preserves the full 13-section NDA and handwritten signature process of the working app-specific forms, generalized for the selected app names. **The legal adaptation requires review before going live.** The signed PDF includes the full text shown to the applicant, selected app list, name/email, date/timestamp, agreement ID, and handwritten signature.

This handoff does not create a Supabase account, approve an app, or add anyone to Cloudflare Access. Those actions remain separate and protected by the server-side authorization flow.

## Deployment and verification update — November 18, 2026

- **New standalone web app deployed by the Founder:** `https://script.google.com/macros/s/AKfycbykzFI9zXYY_xqVyicbcKPGaTdP-E7loiFU9u9DzsCHfY5Wdc0Oe6ZucTu6aBv8Ligo/exec`.
- The development form's `ENDPOINT` is set to that address. The old single-app code and deployed endpoint have not been changed.
- The development-branch GitHub Actions job `deployed-endpoint-health` performed **GET only** and verified HTTP **200** with `{"ok":true,"service":"arteziq-explorer-unified","version":"1"}`. Google redirected the ContentService response to `script.googleusercontent.com`, as expected. See <https://github.com/DavidFliesen/ARTEZIQ/actions/runs/44426326436>.
- A follow-up read-only GET with `Origin: https://arteziq.com` received `Access-Control-Allow-Origin: *` on the redirected JSON response, supporting cross-origin GET compatibility. GitHub Actions run <https://github.com/DavidFliesen/ARTEZIQ/actions/runs/44426650194> passed both test and endpoint-health jobs. **This does not establish Safari POST/CORS success.**
- Chrome read a cross-origin JSON validation error from the live endpoint after sending an intentionally invalid POST containing no applicant data. The signed form and its portal link passed with the backend response simulated in both Chrome and Playwright WebKit. See [Chrome and endpoint results](https://github.com/DavidFliesen/ARTEZIQ/actions/runs/44429225387) and [WebKit results](https://github.com/DavidFliesen/ARTEZIQ/actions/runs/44427922304/job/135237476507).
- The [development Feedback Portal run](https://github.com/DavidFliesen/feedback/actions/runs/44438951521) passed its sign-in, account confirmation, enrollment, simulated approval, and password recovery checks. Actual email delivery, account verification, Founder approval, and access to the protected app remain unverified. The production hold is still in effect.

## Deploy the 13+ application update

In the existing **standalone unified** Apps Script project, update `Code.gs` from
[`explorer/unified-apps-script.gs`](../unified-apps-script.gs). Use **Deploy → Manage deployments**
to edit the existing web app deployment and select **New version**, keeping its current `/exec` URL.
The original app-specific project uses a different endpoint. The read-only check
`node scripts/check-unified-endpoint.mjs --require-teen-support` confirms version `2`
and minimum tester age `13` before the new form goes live.

## Google Apps Script contract

The new unified web app deployment must accept `POST` text/plain JSON and reply with JSON such as `{"ok":true}` on success. The posted fields are:

- `appsBeingTested`: nonempty array of unique app names, selected from the four allowed beta apps; **validate all names on the server**.
- `appBeingTested`: the first selected name, provided for backwards compatibility only. **Do not treat it as the full application**.
- `fullName`, `email`, `phone`, `cityState`, `contactMethod`, `device`, `experience`: same applicant fields as the legacy form.
- `ndaName`, `ndaEmail`, `ndaDate`, `agreed`, `minimumAgeConfirmed`: NDA attestations, including eligibility at age 13 or older. The new form does not transmit the age range. The server also accepts previous `unified-2` payloads with their original `ageConfirmed` field.
- `pdfBase64` and `filename`: PDF attachment containing the **full NDA terms and handwritten signature**, not just an acknowledgment page.
- `agreementId`, `signedAt`, `formStartedAt`, `formVersion='unified-3'`, `privacyNoticeVersion`, `userAgent`, `company` honeypot, and `submissionToken`: administrative/anti-abuse fields.

Preserve server-side field limits, timing checks, PDF size limits, rate limits, and privacy protections from the existing Apps Script. Ensure both the applicant email and ARTEZIQ admin email identify **all selected apps** and include the signed PDF. The old single-app endpoint does **not** satisfy this contract even if it returns `ok: true`. The legacy script in this repository requires a multi-app update before it can be used with the unified page.

The existing Apps Script may already have been edited outside GitHub. **Check its deployed code and confirm the response/email behavior; do not blindly overwrite the live Apps Script with an older source copy.**

## Multi-app Apps Script implementation — completed in source

`explorer/unified-apps-script.gs` is a **new, standalone server implementation**. It does not overwrite the existing `explorer/google-apps-script.gs`, and the production single-app `/exec` deployment remains untouched. This new handler:

- Verifies the four-app allowlist, unique selection, first-app compatibility field, applicant fields, signer/email matching, NDA acceptance, age eligibility, form version/timing, honeypot, and PDF header/trailer/size.
- Sends **exactly one** NDA attachment to the ARTEZIQ admin mailbox and **one** copy to the applicant, with **all selected app names in both emails**.
- Provides a harmless `doGet()` health check that responds with `{"ok":true,"service":"arteziq-explorer-unified","version":"1"}` and sends no email.
- Uses a script lock, a seven-day deduplication record, a fifteen-minute per-email throttle, Google MailApp's remaining quota, and additional 36-recipient/hour and 70-recipient/day caps for the unified endpoint. These caps are for **this separate endpoint**, not the existing invitation gateway.
- Responds `delivery_uncertain` if sending fails after the delivery attempt starts. Retry does **not** automatically resend emails; manually review the ARTEZIQ sent mailbox first.
- The public submission token is an **identifier, not authentication**. Server checks and quotas limit abuse, but a future CAPTCHA (with server-side verification) remains advisable before higher-traffic use.

Automated code test: `tests/explorer-unified-server.test.cjs`, included in `.github/workflows/explorer-unified-tests.yml`. The GitHub Actions test run `44421053094` passed **34 tests** (29 server behavior tests and 5 static form tests). These tests mock Apps Script and MailApp; no emails were sent.

### Exact remaining publication steps — requires Google account owner

1. Open <https://script.google.com/home/projects/create> while signed in as **`arteziq.apps@gmail.com`**. Create a **new standalone project**, named `ARTEZIQ Explorer Unified Applications`. Do **not** open or replace the old, working single-app script.
2. Open `Code.gs`, remove the sample `myFunction` and paste the *entire* contents of [`explorer/unified-apps-script.gs`](../unified-apps-script.gs). Save.
3. Choose **Deploy → New deployment → Select type (gear) → Web app**. Description: `Unified Explorer v1`; **Execute as: Me**; **Who has access: Anyone**. Authorize the requested Apps Script/Gmail permissions while signed into the intended ARTEZIQ sender account.
4. Copy the **Web app URL ending in `/exec`**. Visit that URL in a browser, including a private window if possible. Its harmless health check must report `"service":"arteziq-explorer-unified"` and `"version":"1"`. This GET does **not** send mail.
5. **Done in development:** the new URL is configured in `explorer/apply/index.html` after a successful read-only health check. Keep the unified site unpublished until the NDA adaptation is reviewed and end-to-end tests pass.
6. Test a single disposable NDA submission with an email account under your control, and inspect **both email copies**, their complete PDF, the agreement ID, and the selected apps. Do not use actual beta tester information for this first test.
7. Test from both Safari on iPad/iPhone and a desktop browser. Apps Script ContentService redirects responses to `script.googleusercontent.com`, which can affect cross-origin response handling. A successful GitHub test or GET health check does **not** establish that browser `fetch` can read the POST response on these devices.
8. Only when the signed application reaches the Feedback Portal, the Founder can approve the correct enrollments, and protected launches work, merge and deploy the two development branches.

**Manual approval boundary:** A signed NDA and the applicant's selections are not proof of Supabase enrollment, Founder approval, or Cloudflare access. The Founder still reviews the record and approves each selected app.

## Release sequence (none performed yet)

1. Review the adapted NDA text against the current approved ARTEZIQ NDA and verify the four-app allow-list.
2. **Done:** the Founder deployed the standalone `explorer/unified-apps-script.gs` Web App; GitHub Actions confirmed HTTP 200 and the expected service/version on GET using the intended ARTEZIQ account. Capture the new version's `/exec` URL.
3. **Done in development:** `ENDPOINT` in `explorer/apply/index.html` uses the new `/exec` URL. No production website deployment was performed.
4. Run an actual disposable-account application and check: emailed PDF has all 13 NDA sections, checked apps, dates and signature; both intended recipients receive it exactly once; invalid/incomplete submissions do not send.
5. Follow the confirmation link into `https://davidfliesen.github.io/feedback/explorer.html?apps=...`; create/sign in to a **disposable Explorer** account and request selected apps in one click. Confirm each appears as Pending for Founder review, no automatic approval.
6. Confirm Founder review/approval, app launch, Ladybug submission, and that existing beta users and feedback remain intact. For protected apps, grant Cloudflare Access separately before claiming a one-step login experience.
7. Only after all tests pass, merge/deploy the two repositories and verify both domains, caching, and mobile behavior. GitHub commit success alone is **not production deployment**.

No live account creation, email, database mutation, or deployment is part of the development commits.
