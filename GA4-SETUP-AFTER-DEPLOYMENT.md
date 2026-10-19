# ARTEZIQ GA4 — After Deployment Setup

Measurement ID: `G-Z94JEHVXL8`

## What the website package already does

- Loads one shared `analytics.js` on every HTML page.
- Uses privacy-first basic consent behavior.
- Google Analytics is not loaded until the visitor chooses **Allow analytics**.
- Advertising storage, ad user data, and ad personalization remain denied.
- A visitor can decline analytics and still use the website, Explorer forms, and surveys.
- A persistent **Privacy & Analytics** control lets visitors change their choice.
- No Explorer names, emails, phone numbers, signatures, NDA text, survey answers, or free-form responses are sent to GA4.
- UTM parameters are preserved automatically by GA4 when a visitor consents.

Tracked ARTEZIQ events:
- `page_view` — GA4 automatic page tracking after consent.
- `app_click` — homepage to an app page.
- `explorer_click` — an app page to Explorer.
- `explorer_app_selected` — Explorer directory app selection.
- `explorer_application_submitted` — only after the Apps Script backend returns success.
- `explorer_application_error` — generic failure event with no error text or form data.
- `survey_open`
- `survey_submitted`

## 1. Deploy the website files

Upload the changed files to the root of the `DavidFliesen/ARTEZIQ` GitHub Pages repository.

Do not add Google's raw gtag snippet separately. The shared `analytics.js` is the only GA4 loader and prevents duplicate tags.

## 2. Update the Explorer Google Apps Script

This package changes `explorer/google-apps-script.gs`.

In your existing ARTEZIQ Explorer Apps Script project:

1. Open script.google.com.
2. Open the existing ARTEZIQ Explorer project.
3. Replace the existing Code.gs contents with the updated `explorer/google-apps-script.gs`.
4. Save.
5. Choose **Deploy → Manage deployments**.
6. Edit the existing Web App deployment.
7. Choose **New version**.
8. Keep:
   - Execute as: **Me**
   - Who has access: **Anyone**
9. Deploy.

The existing `/exec` URL remains the same.

Why this backend update is needed:
- Requires the 18+ confirmation.
- Records the privacy-notice version.
- Uses a SHA-256 hash instead of a reversible email/app string for the short-lived rate-limit key.

## 3. Verify Realtime

After GitHub Pages publishes:

1. Open Google Analytics.
2. Open the ARTEZIQ property.
3. Go to **Reports → Realtime**.
4. Open `https://arteziq.com/` in a private/incognito browser.
5. Choose **Decline analytics** first.
6. Confirm the site still works. You should not expect that visit in GA4.
7. Use **Privacy & Analytics**, choose **Allow analytics**, then reload/navigate the site.
8. Within a short period, confirm the visit appears in Realtime.

## 4. Mark the Explorer submission as a Key Event

In GA4 Admin:

1. Open **Admin**.
2. Go to **Events** / **Key events** (Google's label may vary).
3. Find `explorer_application_submitted` after at least one successful test submission has reached GA4.
4. Mark it as a **Key event**.

Do not mark `explorer_application_error` as a key event.

## 5. Create useful custom dimensions

GA4 collects event parameters, but custom event parameters are easier to use in reports after registering them.

Create these event-scoped custom dimensions:

| Dimension name | Scope | Event parameter |
|---|---|---|
| App Name | Event | `app_name` |
| Destination Path | Event | `destination_path` |
| Link Location | Event | `link_location` |
| Error Type | Event | `error_type` |
| Survey ID | Event | `survey_id` |

UTM parameters such as `utm_source`, `utm_medium`, and `utm_campaign` do not need custom dimensions; GA4 already understands campaign attribution.

## 6. Recommended Data Retention

In **Admin → Data collection and modification → Data retention**:

- Set event-data retention to **14 months** if available.
- Do not enable unnecessary advertising features.
- Keep Google Signals/ads personalization off unless ARTEZIQ later has a documented need and updates its consent/privacy approach.

## 7. Recommended campaign URLs

LinkedIn example:

`https://arteziq.com/?utm_source=linkedin&utm_medium=social&utm_campaign=explorer_recruiting`

PHWFF QR example:

`https://arteziq.com/explorer/?utm_source=phwff&utm_medium=qr&utm_campaign=charleston_demo`

HOW example:

`https://arteziq.com/explorer/?utm_source=how&utm_medium=qr&utm_campaign=saint_helena_demo`

Use consistent lowercase values.

## 8. Find the numeric GA4 Property ID

The Feedback Control Panel integration will need the numeric GA4 **Property ID**, not the Measurement ID.

In GA4:
1. **Admin**
2. Open **Property details**
3. Copy the numeric **Property ID**

Put that number into the Feedback Control Panel handoff when you work in that ChatGPT thread.

## 9. Test the complete Explorer funnel

After deploying the updated Apps Script and site:

1. Accept analytics.
2. Visit the homepage through a UTM campaign URL.
3. Click an app.
4. Click its Explorer CTA.
5. Complete a test NDA/application.
6. Confirm:
   - submission succeeds;
   - applicant receives the NDA;
   - ARTEZIQ receives the admin copy;
   - `explorer_application_submitted` appears in GA4 Realtime/DebugView or Events.

No personal form fields should appear in GA4.
