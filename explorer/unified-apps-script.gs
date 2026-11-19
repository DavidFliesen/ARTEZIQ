/*
 * ARTEZIQ Explorer — unified multi-app application handler (v2, 2026-11-18)
 *
 * NEW STANDALONE APPS SCRIPT PROJECT ONLY.
 * Do not replace explorer/google-apps-script.gs or the existing deployed web app.
 *
 * Deploy as a Web app from arteziq.apps@gmail.com:
 *   Execute as: Me
 *   Who has access: Anyone
 * Copy the newly verified /exec URL into explorer/apply/index.html.
 *
 * WARNING: submissionToken is in the public website. It is NOT a secret or
 * an authentication mechanism. Public forms need ongoing abuse monitoring.
 * This handler sends email; never deploy it without verifying account/quota.
 */

const UNIFIED_ADMIN_EMAIL = 'arteziq.apps@gmail.com';
const UNIFIED_PUBLIC_TOKEN = 'arteziq-explorer-v1';
const UNIFIED_ALLOWED_APPS = Object.freeze([
  "Angler's Navigator",
  'Hand Over Foot',
  "Angler's Arrows",
  "Angler's Jigsaw"
]);
const UNIFIED_MAX_POST_BYTES = 3500000;
const UNIFIED_MAX_PDF_BYTES = 2500000;
const UNIFIED_MIN_FORM_AGE_MS = 5000;
const UNIFIED_MAX_FORM_AGE_MS = 86400000;
const UNIFIED_DEDUPE_MS = 7 * 86400000;
const UNIFIED_MAX_RECIPIENTS_PER_HOUR = 36;
const UNIFIED_MAX_RECIPIENTS_PER_DAY = 70;
const UNIFIED_FIELD_LIMITS = Object.freeze({
  fullName: 120, email: 160, phone: 40, cityState: 120,
  contactMethod: 30, device: 120, experience: 3000,
  ndaName: 120, ndaEmail: 160, ndaDate: 20,
  appBeingTested: 80, filename: 180, agreementId: 80,
  signedAt: 80, formVersion: 80, privacyNoticeVersion: 80,
  userAgent: 400, submissionToken: 80
});

/* Public, non-identifying health check. Does not send email. */
function doGet() {
  return unifiedJson_({ok: true, service: 'arteziq-explorer-unified', version: '2', minimumTesterAge: 13});
}

function doPost(e) {
  try {
    if (!e || !e.postData || typeof e.postData.contents !== 'string') {
      unifiedFail_('No application was received.');
    }
    const raw = e.postData.contents;
    if (raw.length === 0 || raw.length > UNIFIED_MAX_POST_BYTES) {
      unifiedFail_('Application size is invalid or too large.');
    }
    let payload;
    try { payload = JSON.parse(raw); }
    catch (_) { unifiedFail_('Application data is not valid JSON.'); }

    const data = unifiedValidate_(payload);
    const bytes = unifiedValidatePdf_(data.pdfBase64);
    const blob = Utilities.newBlob(bytes, 'application/pdf', data.filename);
    const lock = LockService.getScriptLock();
    if (!lock.tryLock(10000)) {
      unifiedFail_('Application service is busy. Please try again shortly.');
    }

    try {
      const props = PropertiesService.getScriptProperties();
      const dedupeKey = unifiedDedupeKey_(data);
      const now = Date.now();
      const prior = props.getProperty(dedupeKey);
      if (prior) {
        let previous;
        try { previous = JSON.parse(prior); } catch (_) { previous = null; }
        if (previous && now - Number(previous.at) < UNIFIED_DEDUPE_MS) {
          if (previous.state === 'complete') {
            return unifiedJson_({
              ok: true, duplicate: true,
              message: 'Application was already accepted; no additional emails were sent.'
            });
          }
          return unifiedJson_({
            ok: false, status: 'delivery_uncertain',
            error: 'A previous submission may have been emailed. Contact ARTEZIQ before resubmitting.'
          });
        }
        props.deleteProperty(dedupeKey);
      }

      // 15-minute per-email throttle across differing app combinations.
      const throttleKey = 'uxth_' + unifiedDigest_(data.email.toLowerCase());
      if (CacheService.getScriptCache().get(throttleKey)) {
        unifiedFail_('An application was submitted recently from this email. Please wait before submitting again.');
      }

      if (MailApp.getRemainingDailyQuota() < 2) {
        unifiedFail_('Application email service has reached its daily sending limit. Please try another day.');
      }
      unifiedReserveQuota_(props, now, 2);

      // Save intent BEFORE the first email. A transient failure cannot silently
      // send duplicate legal agreements on automatic/manual repeat requests.
      const marker = {at: now, state: 'sending', id: data.agreementId};
      props.setProperty(dedupeKey, JSON.stringify(marker));
      CacheService.getScriptCache().put(throttleKey, '1', 15 * 60);

      const appList = data.appsBeingTested.join(', ');
      const adminBody = [
        'New ARTEZIQ Explorer Program application — ONE signed NDA for multiple apps.',
        '',
        'Selected applications: ' + appList,
        'Applicant: ' + data.fullName,
        'Email: ' + data.email,
        'Phone: ' + data.phone,
        'City / State: ' + data.cityState,
        'Preferred contact: ' + data.contactMethod,
        'Primary testing device: ' + data.device,
        'Agreement ID: ' + data.agreementId,
        'Signed: ' + data.signedAt,
        'NDA date: ' + data.ndaDate,
        'Form version: ' + data.formVersion,
        'Privacy notice version: ' + data.privacyNoticeVersion,
        '',
        'Experience and intended use:',
        data.experience,
        '',
        'Attached is the applicant-supplied PDF of the signed full NDA.',
        'The application does not automatically grant Supabase or Cloudflare access.',
        'Verify this NDA before manually approving each requested app.'
      ].join('\n');
      const applicantBody = [
        'Thank you for applying to the ARTEZIQ Explorer Program.',
        '',
        'Your application covers: ' + appList,
        'Agreement ID: ' + data.agreementId,
        'Signed: ' + data.signedAt,
        '',
        'Your signed NDA PDF is attached. Save it for your records.',
        'Next, use the Explorer Portal to create or sign in to your Explorer account',
        'and request access to each selected app. Every app requires ARTEZIQ approval.',
        'Explorer Portal: https://davidfliesen.github.io/feedback/explorer.html',
        '',
        'Submitting this application does not guarantee enrollment or launch access.',
        'ARTEZIQ'
      ].join('\n');

      try {
        // Founder gets a copy first, even if applicant delivery subsequently fails.
        MailApp.sendEmail({
          to: UNIFIED_ADMIN_EMAIL,
          subject: 'ARTEZIQ Explorer Application — ' + data.fullName + ' — ' + appList,
          body: adminBody,
          attachments: [blob],
          name: 'ARTEZIQ Explorer Program'
        });
        marker.state = 'admin_sent';
        props.setProperty(dedupeKey, JSON.stringify(marker));
        MailApp.sendEmail({
          to: data.email,
          subject: 'Your signed ARTEZIQ Explorer Program NDA',
          body: applicantBody,
          attachments: [blob],
          name: 'ARTEZIQ Explorer Program'
        });
        marker.state = 'complete';
        props.setProperty(dedupeKey, JSON.stringify(marker));
      } catch (sendError) {
        // MailApp can fail after a message is accepted for delivery.
        // Never automatically repeat when the delivery state is uncertain.
        marker.state = 'uncertain';
        props.setProperty(dedupeKey, JSON.stringify(marker));
        console.error('Unified Explorer email delivery uncertain: ' + String(sendError));
        return unifiedJson_({
          ok: false, status: 'delivery_uncertain',
          error: 'Email delivery could not be confirmed. Do not resubmit yet; contact arteziq.apps@gmail.com.'
        });
      }
      return unifiedJson_({ok: true, agreementId: data.agreementId});
    } finally {
      lock.releaseLock();
    }
  } catch (err) {
    if (!err || !err.isPublicSubmissionError) {
      console.error('Unified Explorer application failed: ' + String(err));
    }
    return unifiedJson_({
      ok: false,
      error: err && err.isPublicSubmissionError
        ? err.message
        : 'The application could not be processed. Please contact arteziq.apps@gmail.com if the problem continues.'
    });
  }
}

function unifiedValidate_(data) {
  if (!data || Array.isArray(data) || typeof data !== 'object') {
    unifiedFail_('Application details are missing.');
  }
  const required = [
    'fullName', 'email', 'phone', 'cityState', 'contactMethod', 'device',
    'experience', 'ndaName', 'ndaEmail', 'ndaDate',
    'filename', 'agreementId', 'signedAt', 'formVersion',
    'privacyNoticeVersion', 'submissionToken', 'appBeingTested'
  ];
  const clean = {};
  required.forEach(function(field) {
    if (typeof data[field] !== 'string') unifiedFail_('Required field is missing: ' + field);
    const text = data[field].replace(/\s+/g, ' ').trim();
    if (!text || text.length > UNIFIED_FIELD_LIMITS[field]) {
      unifiedFail_('Required field is invalid: ' + field);
    }
    clean[field] = text;
  });
  if (data.agreed !== true) unifiedFail_('NDA acceptance is required.');
  if (data.company) unifiedFail_('Application rejected.');
  if (clean.submissionToken !== UNIFIED_PUBLIC_TOKEN ||
      !['unified-2', 'unified-3'].includes(clean.formVersion)) {
    unifiedFail_('The application form version is not supported.');
  }
  // The earlier form asked for 18+. Keep its payload compatible without reusing
  // its confirmation field for the new 13+ policy.
  const eligible = clean.formVersion === 'unified-3'
    ? data.minimumAgeConfirmed === true
    : data.ageConfirmed === true;
  if (!eligible) unifiedFail_('Age eligibility confirmation is required.');
  if (!Array.isArray(data.appsBeingTested) ||
      data.appsBeingTested.length < 1 ||
      data.appsBeingTested.length > UNIFIED_ALLOWED_APPS.length) {
    unifiedFail_('Choose one or more supported applications.');
  }
  const selected = data.appsBeingTested;
  if (selected.some(function(app){return typeof app !== 'string' || !UNIFIED_ALLOWED_APPS.includes(app);}) ||
      new Set(selected).size !== selected.length ||
      clean.appBeingTested !== selected[0]) {
    unifiedFail_('The selected applications are not valid.');
  }
  clean.appsBeingTested = selected.slice();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean.email) ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean.ndaEmail) ||
      clean.email.toLowerCase() !== clean.ndaEmail.toLowerCase()) {
    unifiedFail_('The NDA email must match a valid applicant email.');
  }
  if (clean.fullName !== clean.ndaName) {
    unifiedFail_('The signed name must match the applicant name.');
  }
  if (clean.phone.replace(/\D/g, '').length < 7 ||
      clean.phone.replace(/\D/g, '').length > 15) {
    unifiedFail_('Enter a valid contact phone number.');
  }
  if (!['Email', 'Phone', 'Text Message'].includes(clean.contactMethod)) {
    unifiedFail_('Preferred contact method is invalid.');
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(clean.ndaDate) ||
      !/^AZ-[A-Za-z0-9-]{10,70}$/.test(clean.agreementId) ||
      !/^ARTEZIQ-Explorer-NDA-AZ-[A-Za-z0-9-]+\.pdf$/.test(clean.filename) ||
      clean.filename !== 'ARTEZIQ-Explorer-NDA-' + clean.agreementId + '.pdf') {
    unifiedFail_('The NDA date or agreement reference is invalid.');
  }
  const age = Date.now() - Number(data.formStartedAt);
  if (!Number.isFinite(age) || age < UNIFIED_MIN_FORM_AGE_MS ||
      age > UNIFIED_MAX_FORM_AGE_MS) {
    unifiedFail_('The form session expired or was completed too quickly. Reload and try again.');
  }
  const signedMs = Date.parse(clean.signedAt);
  if (!Number.isFinite(signedMs) || Math.abs(Date.now() - signedMs) > 10 * 60000) {
    unifiedFail_('The signature timestamp is invalid.');
  }
  if (typeof data.pdfBase64 !== 'string' ||
      data.pdfBase64.length < 100 ||
      data.pdfBase64.length > Math.ceil(UNIFIED_MAX_PDF_BYTES / 3) * 4 + 10 ||
      !/^[A-Za-z0-9+/]+={0,2}$/.test(data.pdfBase64)) {
    unifiedFail_('The signed NDA PDF is missing or too large.');
  }
  clean.pdfBase64 = data.pdfBase64;
  return clean;
}

function unifiedValidatePdf_(encoded) {
  let bytes;
  try { bytes = Utilities.base64Decode(encoded); }
  catch (_) { unifiedFail_('The signed NDA PDF cannot be decoded.'); }
  if (!bytes || bytes.length < 32 || bytes.length > UNIFIED_MAX_PDF_BYTES) {
    unifiedFail_('The signed NDA PDF is missing or too large.');
  }
  const head = String.fromCharCode.apply(null, bytes.slice(0, 5).map(function(v){return v & 255;}));
  if (head !== '%PDF-') unifiedFail_('The signed NDA attachment is not a PDF.');
  const end = bytes.slice(-1024).map(function(v){return String.fromCharCode(v & 255);}).join('');
  if (end.indexOf('%%EOF') === -1) unifiedFail_('The signed NDA PDF is incomplete.');
  return bytes;
}

function unifiedDigest_(text) {
  const bytes = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256, text
  );
  return Utilities.base64EncodeWebSafe(bytes).replace(/=+$/, '').slice(0, 43);
}
function unifiedDedupeKey_(data) {
  const input = data.email.toLowerCase() + '|' +
    data.appsBeingTested.slice().sort().join('|');
  return 'ux2_' + unifiedDigest_(input);
}

/*
 * Cap recipients for this separate web app. Counts are reserved before sends,
 * so quota safety is conservative even if MailApp returns an error.
 * A real quota check through MailApp still runs on each request.
 */
function unifiedReserveQuota_(props, now, recipients) {
  const hour = Math.floor(now / 3600000);
  const day = Math.floor(now / 86400000);
  let tally = {};
  try { tally = JSON.parse(props.getProperty('ux2_quota') || '{}'); }
  catch (_) { tally = {}; }
  if (tally.hour !== hour) { tally.hour = hour; tally.hourCount = 0; }
  if (tally.day !== day) { tally.day = day; tally.dayCount = 0; }
  tally.hourCount = Number(tally.hourCount) || 0;
  tally.dayCount = Number(tally.dayCount) || 0;
  if (tally.hourCount + recipients > UNIFIED_MAX_RECIPIENTS_PER_HOUR ||
      tally.dayCount + recipients > UNIFIED_MAX_RECIPIENTS_PER_DAY) {
    unifiedFail_('The daily application email limit has been reached. Please try again later.');
  }
  tally.hourCount += recipients;
  tally.dayCount += recipients;
  props.setProperty('ux2_quota', JSON.stringify(tally));
}

function unifiedFail_(message) {
  const err = new Error(message);
  err.isPublicSubmissionError = true;
  throw err;
}
function unifiedJson_(value) {
  return ContentService.createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}
