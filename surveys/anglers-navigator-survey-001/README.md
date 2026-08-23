# Angler's Navigator Survey 001

Public GitHub Pages route after upload:

`https://arteziq.com/surveys/anglers-navigator-survey-001/`

## Files

- `index.html` — the public survey page.
- `google-apps-script.gs` — the Google Apps Script backend that emails submissions to `arteziq.apps@gmail.com`.

## Google Apps Script setup

1. Create a new project at Google Apps Script.
2. Replace the default `Code.gs` contents with `google-apps-script.gs`.
3. Save the project.
4. Deploy → **New deployment** → **Web app**.
5. Set **Execute as: Me**.
6. Set **Who has access: Anyone**.
7. Authorize the script when Google asks.
8. Copy the deployed Web App URL ending in `/exec`.
9. In `index.html`, replace:

   `PASTE_YOUR_APPS_SCRIPT_EXEC_URL_HERE`

   with that `/exec` URL.
10. Upload the `surveys/anglers-navigator-survey-001/` folder to the ARTEZIQ GitHub repository.

## Notes

The backend sends each completed survey to `arteziq.apps@gmail.com`.

If the respondent supplies an email address, it also sends that person a courtesy copy of their answers.

The form includes:
- a hidden honeypot field;
- minimum completion-time checking;
- a 24-hour form-session limit;
- per-respondent rate limiting based on email/browser fingerprint;
- field-length validation;
- optional email validation;
- survey/version identifiers for tracking future survey revisions.

The Google Apps Script file is backend source code and does **not** need to be uploaded to the public GitHub Pages folder unless you want to keep a source copy there. It must be pasted into the Google Apps Script project and deployed there to run.
