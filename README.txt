ARTEZIQ GA4 Consent Visibility Fix (2026-10-19)

Upload these two replacements into DavidFliesen/ARTEZIQ:
  analytics.js
  privacy/index.html

CONFIRMED CAUSE:
The earlier CSS gave #arteziq-privacy-control a display:block declaration.
This overrode the HTML hidden attribute, so the privacy link was visible
even when the US/non-EEA code hid it. Clicking that link opened the consent
panel. This did not by itself prove GA4 was failing to track US visitors.

FIXED:
- Explicit CSS rule #arteziq-privacy-control[hidden]{display:none!important}.
- The link is created as hidden, and only revealed for detected EEA/UK/CH.
- US/non-EEA: no consent banner or homepage/footer link, GA4 loads automatically
  unless the visitor explicitly declined in the past.
- Detected EEA/UK/CH: banner and centered text link above the copyright; GA4
  does not load until the visitor accepts.
- Unknown region or failed country lookup: no popup and no GA4. This
  fail-closed behavior prioritizes EEA visitor privacy; it may cause some
  sessions to be missed if the lookup cannot be completed.
- The dedicated /privacy/ page contains an Open analytics preferences link,
  including for users outside Europe who want to change a saved choice.

No other files or Google Apps Script changes are required.

TEST:
- Open the homepage in a private window from a US connection; no popup or
  Privacy & Analytics link should appear.
- In GA4 Realtime, your visit should show up after processing and normal
  browser/network conditions (unless an ad/tracker blocker prevents GA4).
- On the /privacy/ page, Open analytics preferences remains available.
- Test EU behavior with browser region simulation or a reliable EU network;
  accept/decline should be shown only there.

If Safari still shows the old button, GitHub Pages/browser may be caching
analytics.js. Retry after a hard reload or clear cached site data.
