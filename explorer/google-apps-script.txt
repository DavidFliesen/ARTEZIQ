/*
ARTEZIQ Explorer Program submission endpoint
Deploy as a Google Apps Script Web App:
  Execute as: Me
  Who has access: Anyone

IMPORTANT:
1. Set ADMIN_EMAIL to the mailbox where you want Explorer requests sent.
2. Copy the deployed Web App URL into SUBMIT_ENDPOINT inside explorer/index.html.
3. Keep SHARED_SUBMISSION_TOKEN the same in BOTH this file and explorer/index.html.
   This token is not a secret on a public site, but it helps block trivial abuse.
*/
const ADMIN_EMAIL = "arteziq.apps@gmail.com";
const SHARED_SUBMISSION_TOKEN = "arteziq-explorer-v1";
const ALLOWED_APPS = ["Angler's Navigator", "Sherpa Caddie", "Hand Over Foot"];
const MAX_POST_BYTES = 3500000;
const MAX_PDF_BYTES = 2500000;
const MIN_COMPLETION_MS = 5000;          // require at least 5 seconds on the form
const MAX_FORM_AGE_MS = 1000 * 60 * 60 * 24; // reject forms older than 24 hours
const RATE_LIMIT_MINUTES = 15;

const FIELD_LIMITS = {
  appBeingTested: 80,
  fullName: 120,
  email: 160,
  phone: 40,
  cityState: 120,
  contactMethod: 30,
  device: 120,
  experience: 3000,
  ndaName: 120,
  ndaEmail: 160,
  ndaDate: 20,
  filename: 180,
  agreementId: 80,
  signedAt: 80,
  formVersion: 40,
  userAgent: 400
};

function doPost(e) {
  try {
    const payloadLength = Number(e && e.postData && e.postData.length) || 0;
    if (!payloadLength) throw new Error('No submission payload was received.');
    if (payloadLength > MAX_POST_BYTES) throw new Error('Submission payload is too large.');

    const raw = e.postData.contents || '{}';
    const incoming = JSON.parse(raw);
    const data = sanitizePayload_(incoming);

    validateRequired_(data, [
      'appBeingTested','fullName','email','phone','cityState','contactMethod','device',
      'experience','ndaName','ndaEmail','ndaDate','pdfBase64','filename','formStartedAt',
      'formVersion','submissionToken'
    ]);

    if (data.company) throw new Error('Submission rejected.'); // honeypot
    if (data.submissionToken !== SHARED_SUBMISSION_TOKEN) throw new Error('Invalid submission token.');
    if (!data.agreed) throw new Error('NDA agreement was not accepted.');
    if (!ALLOWED_APPS.includes(data.appBeingTested)) throw new Error('Explorer applications are not open for that app.');
    if (!isValidEmail_(data.email)) throw new Error('Please provide a valid email address.');
    if (!isValidEmail_(data.ndaEmail)) throw new Error('Please provide a valid NDA email address.');
    if (normalizeSpaces_(data.ndaName) !== normalizeSpaces_(data.fullName)) throw new Error('Tester name must match the contact name.');
    if (data.ndaEmail.toLowerCase() !== data.email.toLowerCase()) throw new Error('NDA email must match the contact email.');
    if (!isLikelyPhone_(data.phone)) throw new Error('Please provide a valid phone number.');
    if (!['Email','Phone','Text Message'].includes(data.contactMethod)) throw new Error('Invalid preferred contact method.');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data.ndaDate)) throw new Error('Date must be in YYYY-MM-DD format.');
    if (!/\.pdf$/i.test(data.filename)) throw new Error('Signed NDA must be a PDF.');

    validateFieldLengths_(data);
    validateFormTiming_(data.formStartedAt);
    enforceRateLimit_(data.email, data.appBeingTested);

    const pdfBytes = Utilities.base64Decode(data.pdfBase64);
    if (!pdfBytes || !pdfBytes.length) throw new Error('Signed NDA PDF is missing.');
    if (pdfBytes.length > MAX_PDF_BYTES) throw new Error('Signed NDA PDF is too large.');

    const pdfBlob = Utilities.newBlob(pdfBytes, 'application/pdf', data.filename);

    const applicantSubject = 'Your signed ARTEZIQ Explorer Program NDA';
    const applicantBody =
      'Thank you for requesting consideration for the ARTEZIQ Explorer Program for ' + data.appBeingTested + '.\n\n' +
      'Attached is a PDF copy of the NDA you completed and signed.\n' +
      'Agreement ID: ' + (data.agreementId || 'Not provided') + '\n' +
      'Signed: ' + (data.signedAt || 'Not provided') + '\n\n' +
      'Your request is being considered. If selected, ARTEZIQ will contact you using the information you provided.\n\n' +
      'ARTEZIQ';

    MailApp.sendEmail({
      to: data.email,
      subject: applicantSubject,
      body: applicantBody,
      attachments: [pdfBlob],
      name: 'ARTEZIQ Explorer Program'
    });

    if (ADMIN_EMAIL && ADMIN_EMAIL !== 'YOUR_EMAIL_HERE') {
      const adminBody =
        'New ARTEZIQ Explorer Program request\n\n' +
        'App Being Tested: ' + data.appBeingTested + '\n' +
        'Name: ' + data.fullName + '\n' +
        'Email: ' + data.email + '\n' +
        'Phone: ' + data.phone + '\n' +
        'City / State: ' + data.cityState + '\n' +
        'Preferred Contact: ' + data.contactMethod + '\n' +
        'Primary Testing Device: ' + data.device + '\n' +
        'Agreement ID: ' + (data.agreementId || 'Not provided') + '\n' +
        'Signed: ' + (data.signedAt || 'Not provided') + '\n' +
        'Form Version: ' + data.formVersion + '\n' +
        'User Agent: ' + (data.userAgent || 'Not provided') + '\n\n' +
        'Experience / intended use:\n' + data.experience;

      MailApp.sendEmail({
        to: ADMIN_EMAIL,
        subject: 'New ARTEZIQ Explorer Request - ' + data.appBeingTested + ' - ' + data.fullName,
        body: adminBody,
        attachments: [pdfBlob],
        name: 'ARTEZIQ Explorer Program'
      });
    }

    return jsonResponse_({ ok: true });
  } catch (err) {
    console.error(err);
    return jsonResponse_({ ok: false, error: String(err.message || err) });
  }
}

function sanitizePayload_(incoming) {
  const data = {};
  Object.keys(incoming || {}).forEach((key) => {
    const value = incoming[key];
    if (typeof value === 'string') {
      data[key] = value.replace(/\s+/g, ' ').trim();
    } else {
      data[key] = value;
    }
  });
  return data;
}

function validateRequired_(data, keys) {
  keys.forEach((key) => {
    if (data[key] === undefined || data[key] === null || data[key] === '') {
      throw new Error('Missing required field: ' + key);
    }
  });
}

function validateFieldLengths_(data) {
  Object.keys(FIELD_LIMITS).forEach((key) => {
    if (data[key] && String(data[key]).length > FIELD_LIMITS[key]) {
      throw new Error('Field is too long: ' + key);
    }
  });
  if (data.pdfBase64 && data.pdfBase64.length > MAX_PDF_BYTES * 2) {
    throw new Error('Encoded PDF data is too large.');
  }
}

function validateFormTiming_(startedAt) {
  const start = Number(startedAt);
  if (!start || !isFinite(start)) throw new Error('Invalid form timing data.');
  const elapsed = Date.now() - start;
  if (elapsed < MIN_COMPLETION_MS) throw new Error('Form was submitted too quickly.');
  if (elapsed > MAX_FORM_AGE_MS) throw new Error('Form session has expired. Please reload the page and try again.');
}

function enforceRateLimit_(email, appName) {
  const cache = CacheService.getScriptCache();
  const key = 'exp:' + Utilities.base64EncodeWebSafe((email + '|' + appName).toLowerCase());
  if (cache.get(key)) {
    throw new Error('A recent submission for this email already exists. Please wait before submitting again.');
  }
  cache.put(key, '1', RATE_LIMIT_MINUTES * 60);
}

function normalizeSpaces_(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function isValidEmail_(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
}

function isLikelyPhone_(value) {
  const digits = String(value || '').replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
}

function jsonResponse_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
