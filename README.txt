ARTEZIQ GA4 VPN / Switzerland Consent Correction

REPLACE ONLY THESE TWO EXISTING FILES IN YOUR GITHUB REPOSITORY:
  analytics.js
  privacy/index.html

NO GOOGLE ANALYTICS PROPERTY OR GOOGLE APPS SCRIPT CHANGES NEEDED.

Problem found in the published analytics.js:
- An earlier country lookup was cached in localStorage for 24 hours.
- Switching a VPN from the US to Switzerland did not invalidate the cached US classification.
- Previous releases also saved a global consent choice that might not have
  been collected from a visitor physically in a regulated region.

Fix:
- Fresh country lookup before GA4 is activated on EACH page load.
- No region cache or stored country is used.
- Uses a new versioned explicit consent preference for EEA/UK/Swiss visitors.
- Preserves an earlier explicit opt-out; no prior automatic tracking is treated
  as EEA consent.
- EEA/UK/Swiss visitors without a valid new consent decision see the banner.
- Confirmed US/non-regulated visitors see NO banner; GA4 loads unless opted out.
- Unknown location: neither GA4 nor the consent popup is shown, fail closed.
- Existing hidden/centered footer link remains only in regulated regions.
- When analytics consent is withdrawn, the page reloads so the previously
  loaded Google tag does not remain active on that page.

TEST:
1. First upload the two files to your repo root and privacy folder.
2. Connect your VPN to Switzerland, open a NEW Safari Private Browsing tab,
   and go to https://arteziq.com/?ga_debug=1
3. Verify the diagnostic says Detected country: CH and Region: consent-required.
   The banner should be visible if you have no saved consent in that session.
4. With VPN set to US, open a new Private Browsing tab and visit the same
   debug link; diagnostic should report US/standard, GA4 loaded: yes, no banner.
5. For normal visitors who do not include ?ga_debug=1, no diagnostic is shown.

If Country.is reports a country other than Switzerland when using your Swiss
VPN, the VPN/browser may route that request differently or its IP geolocation
may be outdated. If it reports lookup_failed/timeout, GA4 stays blocked for safety.
