ARTEZIQ Region-Aware Analytics Consent Patch

Upload these two files to the same paths in the GitHub repo:
- /analytics.js
- /privacy/index.html

Behavior after this patch:
- EEA / UK / Switzerland: consent banner appears and GA4 stays blocked until accepted.
- Other regions: no consent popup; GA4 loads automatically unless the visitor previously declined.
- If country detection fails or times out, the site falls back to the consent banner.
- The small Privacy & Analytics control remains available so a visitor can change the choice.
- Advertising-related Google consent remains denied everywhere.

No other site files need to be replaced for this change.
