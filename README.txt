ARTEZIQ EEA/UK/Switzerland-Only Analytics Consent Patch

Upload these two files to the same locations in the GitHub repo:
- /analytics.js
- /privacy/index.html

New behavior:
- EEA / UK / Switzerland:
  * Consent banner appears for visitors without a saved choice.
  * GA4 remains blocked until analytics consent is granted.
  * “Privacy & Analytics” appears as centered underlined text immediately above
    “© 2026 ARTEZIQ. All Rights Reserved.”
  * The text link reopens the consent panel.
- Other detected countries:
  * No consent popup.
  * No Privacy & Analytics link.
  * GA4 loads automatically.
- If the country lookup cannot determine a country:
  * No consent popup is shown.
  * GA4 may load automatically.
- Advertising-related Google consent remains denied everywhere.

No other website files need to be replaced for this change.
