# Unified Explorer application handoff — development only

**Status:** Not published to the live website. Branch `explorer-unified-onboarding-20261118`.

## Purpose and boundaries

Visitors may select any combination of Angler's Navigator, Hand Over Foot, Angler's Arrows, and Angler's Jigsaw on `/explorer/apply/`, complete one application, sign one NDA covering those selections, and continue to the existing Feedback Explorer Portal to request app-by-app enrollment. Sherpa Caddie remains on its existing closed-alpha route.

The development form preserves the full 13-section NDA and handwritten signature process of the working app-specific forms, generalized for the selected app names. **The legal adaptation requires review before going live.** The signed PDF includes the full text shown to the applicant, selected app list, name/email, date/timestamp, agreement ID, and handwritten signature.

This handoff does not create a Supabase account, approve an app, or add anyone to Cloudflare Access. Those actions remain separate and protected by the server-side authorization flow.

## Google Apps Script contract

The new unified web app deployment must accept `POST` text/plain JSON and reply with JSON such as `{"ok":true}` on success. The posted fields are:

- `appsBeingTested`: nonempty array of unique app names, selected from the four allowed beta apps; **validate all names on the server**.
- `appBeingTested`: the first selected name, provided for backwards compatibility only. **Do not treat it as the full application**.
- `fullName`, `email`, `phone`, `cityState`, `contactMethod`, `device`, `experience`: same applicant fields as the legacy form.
- `ndaName`, `ndaEmail`, `ndaDate`, `agreed`, `ageConfirmed`: NDA attestations; validate signer name and email match applicant, 18+ confirmation, and date.
- `pdfBase64` and `filename`: PDF attachment containing the **full NDA terms and handwritten signature**, not just an acknowledgment page.
- `agreementId`, `signedAt`, `formStartedAt`, `formVersion='unified-2'`, `privacyNoticeVersion`, `userAgent`, `company` honeypot, and `submissionToken`: administrative/anti-abuse fields.

Preserve server-side field limits, timing checks, PDF size limits, rate limits, and privacy protections from the existing Apps Script. Ensure both the applicant email and ARTEZIQ admin email identify **all selected apps** and include the signed PDF. The old single-app endpoint does **not** satisfy this contract even if it returns `ok: true`. The legacy script in this repository requires a multi-app update before it can be used with the unified page.

The existing Apps Script may already have been edited outside GitHub. **Check its deployed code and confirm the response/email behavior; do not blindly overwrite the live Apps Script with an older source copy.**

## Release sequence (none performed yet)

1. Review the adapted NDA text against the current approved ARTEZIQ NDA and verify the four-app allow-list.
2. Confirm and publish the multi-app Apps Script Web App using the intended ARTEZIQ account. Capture the new version's `/exec` URL.
3. Set `ENDPOINT` in `explorer/apply/index.html` to that verified URL on the development branch. Until then the page intentionally refuses to submit.
4. Run an actual disposable-account application and check: emailed PDF has all 13 NDA sections, checked apps, dates and signature; both intended recipients receive it exactly once; invalid/incomplete submissions do not send.
5. Follow the confirmation link into `https://davidfliesen.github.io/feedback/explorer.html?apps=...`; create/sign in to a **disposable Explorer** account and request selected apps in one click. Confirm each appears as Pending for Founder review, no automatic approval.
6. Confirm Founder review/approval, app launch, Ladybug submission, and that existing beta users and feedback remain intact. For protected apps, grant Cloudflare Access separately before claiming a one-step login experience.
7. Only after all tests pass, merge/deploy the two repositories and verify both domains, caching, and mobile behavior. GitHub commit success alone is **not production deployment**.

No live account creation, email, database mutation, or deployment is part of the development commits.
