# ARTEZIQ Feedback Control Panel — GA4 Analytics Tab Handoff

## Objective

Add an **Analytics** tab to the existing ARTEZIQ Feedback Control Panel that reads aggregate GA4 reporting data for `arteziq.com`.

GA4 Measurement ID: `G-Z94JEHVXL8`

The integration also needs the numeric **GA4 Property ID**. Obtain it from:
GA4 → Admin → Property details.

## Security architecture

Do **not** call the Google Analytics Data API directly from browser JavaScript with private credentials.

Recommended architecture:

`Feedback Control Panel browser`
→ authenticated ARTEZIQ backend / Supabase Edge Function
→ Google Analytics Data API
→ aggregate response to the dashboard

Store service credentials/server tokens only in server-side secrets. Never commit them to GitHub.

Reuse the Feedback Control Panel's existing login/role model:
- Founder/admin: full Analytics tab.
- Staff roles: only if explicitly granted analytics permission.
- Explorer/tester accounts: no analytics access.

## Website event taxonomy already implemented

Automatic GA4:
- `page_view`

ARTEZIQ custom events:
- `app_click`
  - `app_name`
  - `destination_path`
  - `link_location=homepage`
- `explorer_click`
  - `app_name`
  - `destination_path`
  - `link_location=app_page`
- `explorer_app_selected`
  - `app_name`
  - `destination_path`
  - `link_location=explorer_directory`
- `explorer_application_submitted`
  - `app_name`
- `explorer_application_error`
  - `app_name`
  - `error_type=submission_failed`
- `survey_open`
  - `survey_id`
  - `destination_path`
- `survey_submitted`
  - `survey_id`

Never request or display Explorer names, emails, phone numbers, signatures, NDA text, or survey free-text from GA4. They are not intentionally sent to GA4.

## Recommended dashboard

### Summary cards
- Active users
- Sessions
- Views
- Explorer directory visits
- Successful Explorer applications
- Explorer conversion rate

Date presets:
- Today
- 7 days
- 30 days
- 90 days
- Custom date range

### Acquisition
- Session source / medium
- Session campaign
- First user source / medium
- Landing page
- Users
- Sessions
- Key events / Explorer submissions

### ARTEZIQ app interest
For each app:
- app page views
- homepage `app_click`
- `explorer_click`
- `explorer_application_submitted`
- conversion rate from app page → Explorer submission

### Explorer funnel
1. Homepage or campaign landing
2. App page
3. Explorer directory / Explorer application
4. Successful Explorer application

Break down by:
- app
- source / medium
- campaign
- device category
- country / region where available in aggregate

### Top pages
- Page path
- Views
- Active users
- Average engagement time

### Campaign table
- Campaign
- Source
- Medium
- Sessions
- Users
- Explorer submissions
- Conversion rate

## Suggested Data API queries

### Overview
Dimensions:
- none or date

Metrics:
- activeUsers
- sessions
- screenPageViews
- engagedSessions
- averageSessionDuration
- eventCount
- keyEvents

### Campaigns
Dimensions:
- sessionCampaignName
- sessionSource
- sessionMedium

Metrics:
- sessions
- activeUsers
- keyEvents

### Pages
Dimensions:
- pagePath
- pageTitle

Metrics:
- screenPageViews
- activeUsers
- averageSessionDuration

### Events by app
Dimensions:
- eventName
- customEvent:app_name

Metrics:
- eventCount
- activeUsers

Filter eventName to:
`app_click`, `explorer_click`, `explorer_application_submitted`, `explorer_application_error`

## Custom dimensions expected in GA4

Create event-scoped custom dimensions:
- `app_name`
- `destination_path`
- `link_location`
- `error_type`
- `survey_id`

## API/cache recommendation

The dashboard does not need live per-second GA4 requests.

Recommended:
- Realtime card: optional separate realtime query.
- Standard dashboard: cache aggregate responses 5–15 minutes.
- Rate limit dashboard refreshes.
- Log server-side API failures without logging credentials.

## Privacy requirements

- Analytics tab displays aggregate data only.
- Do not combine GA4 data with Explorer applicant identity.
- Do not attempt to identify individual visitors.
- Do not expose GA4 identifiers in client-visible logs.
- Respect GA4 thresholding/aggregation behavior.
- Keep access behind the Feedback Control Panel's role-based authentication.

## Acceptance criteria

1. Founder/admin can open Analytics tab.
2. Date range changes all widgets.
3. Campaign table reports UTM campaign performance.
4. App funnel reports Explorer conversions per app.
5. No PII is requested from or shown by GA4.
6. API credentials exist only server-side.
7. Permission failures do not expose secrets.
8. Dashboard has a visible "Last updated" timestamp.
