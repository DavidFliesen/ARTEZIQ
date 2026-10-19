ARTEZIQ GA4 + Privacy/GDPR Update
Generated from the user-supplied current GitHub repository ZIP.

GA4 Measurement ID: G-Z94JEHVXL8

Key additions:
- analytics.js: shared consent-controlled GA4 loader and event tracker
- privacy/index.html: Privacy Policy
- all HTML pages load analytics.js
- Explorer forms: privacy notice, 18+ confirmation, improved validation/error handling
- Explorer Apps Script: privacy-notice version + 18+ enforcement + hashed rate-limit key
- survey: privacy notice + submitted/open analytics events
- sitemap: Privacy Policy
- GA4-SETUP-AFTER-DEPLOYMENT.md
- PRIVACY-GDPR-IMPLEMENTATION-NOTES.md
- feedback-analytics-handoff/*

Important:
The Analytics consent banner is intentionally shown to ALL visitors because a static
GitHub Pages site has no reliable first-party regional detection. This is more
conservative than attempting to identify only EEA/UK/Swiss visitors.
