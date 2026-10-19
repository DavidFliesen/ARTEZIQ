# ARTEZIQ Website

**ARTEZIQ — Where ART and IQ meet to make things EZ.**

This repository contains the public ARTEZIQ website and the individual product pages for ARTEZIQ apps and creative technology projects.

Public website:

https://arteziq.com

ARTEZIQ is a Disabled Veteran Owned Small Business focused on AI-powered apps and creative technology that simplify everyday things.

**Analytics/privacy quick reference:** GA4 measurement ID `G-Z94JEHVXL8`. The shared consent and diagnostic code lives in `/analytics.js`; the public privacy notice lives at `/privacy/`. See **GA4 Analytics & Campaign Tracking**, **EEA / UK / Switzerland Consent Mode**, **Explorer Data Handling & Retention**, and **Analytics Diagnostics and Deployment** below. The `?ga_debug=1` test is **built into `/analytics.js`**, not a separate page or standalone installation.

---

## Current ARTEZIQ Apps

### Angler's Navigator
**Tackle, Bait & Flies**

A fishing companion designed to help anglers make better decisions based on location, date, time, weather, tides, observations, likely species, lure selection, and practical fishing techniques.

Page:

`/anglersnavigator/`

Explorer Program:

`/explorer/anglersnavigator/`

---

### Sherpa Caddie
**Your Guide. Your Game. Your Best Round.**

A beginner-friendly golf companion that combines the practical help of a caddie with the guidance of a coach. Sherpa Caddie helps golfers choose clubs, read the course, select safer targets, check playing conditions, and stay mentally focused one shot at a time.

Page:

`/sherpacaddie/`

Explorer Program:

`/explorer/sherpacaddie/`

---

### Hand Over Foot
**Classic Card Game**

A digital rummy-style card game inspired by Hand and Foot Canasta. The game is designed for solo play against an AI opponent with Easy, Club, and Shark difficulty levels.

Page:

`/handoverfoot/`

Explorer Program:

`/explorer/handoverfoot/`

---

### Angler's Arrows
**Fish Puzzle Game**

A fishing-themed arrow puzzle game that helps players discover and identify different fish species.

Page:

`/anglersarrows/`

Explorer Program:

`/explorer/anglersarrows/`

---

### Angler's Jigsaw
**Fishing Jigsaw Game**

A fishing-themed jigsaw collection for puzzle play and species discovery.

Page:

`/anglersjigsaw/`

Explorer Program:

`/explorer/anglersjigsaw/`

---

### Stillwater
**Chair Tai Chi**

A gentle Chair Tai Chi and Qigong experience designed around guided movement and accessible wellness.

Page:

`/stillwater/`

---

### Mint Vision
**AI Coin Identifier**

An AI-assisted coin identification concept designed to help users recognize and learn more about coins.

Page:

`/mintvision/`

---

### Hair Apparent
**AI Hairstyle Preview**

A hairstyle visualization concept designed to let users explore different looks before making a change.

Page:

`/hairapparent/`

---

## ARTEZIQ Explorer Program

The **ARTEZIQ Explorer Program** allows selected users to help evaluate pre-release ARTEZIQ apps and provide practical, real-world feedback during development.

Explorer applicants may be asked to:

- test pre-release software;
- report bugs or confusing behavior;
- identify usability problems;
- provide feedback about features and workflow;
- test the app on their own device;
- help ARTEZIQ improve the product before release.

Explorer participation is voluntary and unpaid.

### Current Explorer Apps

Explorer applications are currently available for:

- Angler's Navigator
- Sherpa Caddie
- Hand Over Foot
- Angler's Arrows
- Angler's Jigsaw

Each app has its own Explorer application page so the application and NDA are specific to the product being tested.

### Explorer NDA

Each Explorer page includes the complete ARTEZIQ Tester Non-Disclosure Agreement.

The NDA:

- identifies the specific app covered by the agreement;
- displays the full agreement directly on the page;
- collects the tester's name, email, and date;
- requires acknowledgement of the agreement;
- includes a handwritten signature pad;
- identifies David Fliesen on behalf of ARTEZIQ;
- generates a completed NDA PDF;
- supports submission through the ARTEZIQ Google Apps Script web application.

The Explorer form and NDA are intentionally kept app-specific. Do not combine the five Explorer pages into one generic form unless the application and NDA continue to clearly identify the exact app the tester is agreeing to evaluate and keep confidential.

---

## Website Structure

The public site is a static GitHub Pages website.

Typical repository structure:

```text
/
├── index.html
├── README.md
├── CNAME
├── home.css
├── app-pages.css
├── analytics.js               # GA4, region check, consent, optional diagnostics
├── privacy/
│   └── index.html             # public Privacy Policy
│
├── assets/
│   ├── arteziq-logo.png
│   ├── anglers-navigator-hero.png
│   ├── sherpa-caddie-logo.png
│   ├── hand-over-foot-hero.png
│   ├── stillwater-chair-tai-chi-hero.png
│   ├── mint-vision-hero.png
│   ├── hair-apparent-hero.png
│   ├── arteziq-explorer-program.png
│   └── home/
│       └── app icons and homepage graphics
│
├── anglersnavigator/
│   └── index.html
│
├── sherpacaddie/
│   └── index.html
│
├── handoverfoot/
│   └── index.html
│
├── anglersarrows/
│   └── index.html
│
├── anglersjigsaw/
│   └── index.html
│
├── stillwater/
│   └── index.html
│
├── mintvision/
│   └── index.html
│
├── hairapparent/
│   └── index.html
│
└── explorer/
    ├── index.html
    ├── anglersnavigator/
    │   └── index.html
    ├── sherpacaddie/
    │   └── index.html
    ├── handoverfoot/
    │   └── index.html
    ├── anglersarrows/
    │   └── index.html
    ├── anglersjigsaw/
    │   └── index.html
    └── google-apps-script.gs   # deployment source (NOT auto-deployed by GitHub)
```

---

## Homepage

The homepage presents the current ARTEZIQ app lineup.

Current display order:

1. Angler's Navigator
2. Sherpa Caddie
3. Hand Over Foot
4. Angler's Arrows
5. Angler's Jigsaw
6. Stillwater
7. Mint Vision
8. Hair Apparent

The homepage uses ARTEZIQ's black, white, and gold visual identity while allowing each app to retain its own accent color.

The homepage also displays iOS and Android platform references and a gold-outlined Disabled Veteran Owned Small Business text panel.

---

## App Page Navigation

The individual app pages use a shared navigation pattern with:

- **Previous** on the left;
- the ARTEZIQ logo centered;
- **Next** on the right.

Current navigation sequence:

`Hair Apparent → Angler's Navigator → Sherpa Caddie → Hand Over Foot → Angler's Arrows → Angler's Jigsaw → Stillwater → Mint Vision → Hair Apparent`

The centered ARTEZIQ logo links back to the main website.

---

## Shared App Page Design

Desktop and tablet layout:

- app artwork or hero image on the left;
- app title, description, and features on the right.

Phone layout:

1. ARTEZIQ logo
2. Previous / Next navigation
3. App hero image
4. App title
5. Subtitle
6. Description
7. Feature list
8. Explorer button when applicable
9. Copyright

Standard development status wording:

**Being developed for iOS and Android**

---

## Explorer Program Image

The Explorer pages use:

`/assets/arteziq-explorer-program.png`

The current Explorer artwork is intended to communicate the community-testing concept through approachable activities associated with ARTEZIQ apps, including fishing, golf, and card play.

Explorer banner messaging:

**ARTEZIQ Explorer Program**

**Test • Discover • Shape what comes next**

**Help evaluate pre-release ARTEZIQ apps and provide real-world feedback.**

---

## Google Apps Script Submission Service

The Explorer application pages are static HTML hosted on GitHub Pages. Form submission, PDF handling, and email delivery are handled separately through a deployed Google Apps Script Web App.

The server-side script validates:

- required fields;
- supported Explorer apps;
- applicant email;
- phone information;
- contact method;
- NDA name and email consistency;
- NDA date;
- signature/PDF data;
- anti-spam fields;
- submission timing;
- basic rate limiting.

The currently approved Explorer app names must remain synchronized between the website forms and the Google Apps Script backend:

```text
Angler's Navigator
Sherpa Caddie
Hand Over Foot
Angler's Arrows
Angler's Jigsaw
```

When adding another app to the Explorer Program, update both:

1. the public Explorer application page; and
2. the Google Apps Script server-side allow-list.

After changing the Google Apps Script code, deploy a **new version of the existing Web App deployment** and verify that the `/exec` URL used by the Explorer pages is correct.

The Google Apps Script source is operational backend code and should be managed in the Google Apps Script project rather than treated as a normal public website page.

---

## GA4 Analytics & Campaign Tracking

**Implementation reference (October 19, 2026):** This section describes the **latest VPN-region diagnostic release** in `ARTEZIQ-GA4-VPN-region-fix.zip`. Merely updating this README does **not** install that release; deploy its `/analytics.js` and `/privacy/index.html` as well. If the live GitHub version lacks `ga_debug`, it is still the older release.

- **GA4 Measurement ID:** `G-Z94JEHVXL8` (public identifier, not a secret).
- **GA4 console:** https://analytics.google.com/
- **Site:** https://arteziq.com/ (GitHub Pages, domain/DNS at Porkbun).
- **Single tag loader:** `/analytics.js`, included by the public site's HTML pages. It conditionally loads `https://www.googletagmanager.com/gtag/js?id=G-Z94JEHVXL8` and calls `gtag('config', 'G-Z94JEHVXL8')` only when permitted.
- **Do not** add Google's standard tag separately in every HTML page: that can create duplicate tracking or bypass consent logic.
- **GA4 numeric Property ID** is different from the `G-...` Measurement ID; obtain it in **GA4 → Admin → Property details**. The Feedback Control Panel will need the numeric ID for its Google Analytics Data API backend.

### Measurement goals and events

| Event name | Intended meaning | Example non-personal event parameters |
| --- | --- | --- |
| `page_view` | GA4 page views after the loader is permitted | GA4 automatic dimensions |
| `app_click` | A user opens an app from the homepage | `app_name`, `destination_path`, `link_location` |
| `explorer_click` | A user opens an Explorer link from an app page | `app_name`, `destination_path`, `link_location` |
| `explorer_app_selected` | A user selects an app while browsing `/explorer/` | `app_name`, `destination_path`, `link_location` |
| `explorer_application_submitted` | An Explorer NDA/application was accepted by the Apps Script backend | `app_name` |
| `explorer_application_error` | Explorer submission failed | `app_name`, generic `error_type` only |
| `survey_open` | Survey page opened | `survey_id`, `destination_path` |
| `survey_submitted` | Survey backend accepted the submission | `survey_id` |

These are the events designed into the current site package. **Verify actual delivery in GA4** after publishing, especially first-load events and the Explorer/survey success paths. Do not mark submission events successful based merely on clicking Submit; success requires a successful backend response. GA4 collection cannot retroactively recover visits made before tagging or visits blocked by consent/ad blockers.

**GA4 setup after deploying:**

1. Visit the site from a permitted location, then check **GA4 → Reports → Realtime** for a `page_view`.
2. Check **Admin → Events** to see custom events after triggering each one.
3. Mark **`explorer_application_submitted`** as a **Key Event**. Do not mark submission failures as conversions.
4. Register event-scoped custom dimensions for `app_name`, `destination_path`, `link_location`, `error_type`, and `survey_id` if they are needed in reports.
5. Review **Admin → Data retention**, with 14 months as an intended setting where available; confirm the actual GA4 property setting rather than assuming it has been configured.
6. Leave Google advertising/remarketing functionality disabled unless the privacy design and legal notices are reviewed again.

### Campaign links

Example campaign URLs (use consistently lowercase UTM values):

```text
https://arteziq.com/?utm_source=linkedin&utm_medium=social&utm_campaign=explorer_recruiting
https://arteziq.com/explorer/?utm_source=phwff&utm_medium=qr&utm_campaign=charleston_demo
https://arteziq.com/explorer/?utm_source=how&utm_medium=qr&utm_campaign=saint_helena_demo
```

Use GA4's standard campaign/source/medium dimensions; do not add identifying information to campaign parameters or URLs. The intended funnel is **Campaign → Homepage/app → Explorer → accepted application**.

---

## EEA / UK / Switzerland Consent Mode

**Scope:** EU/EEA (EU member countries, Iceland, Liechtenstein, Norway), United Kingdom, and Switzerland. The code compares a two-letter ISO country code against its regulated-region list, including `GB` for the UK and `CH` for Switzerland.

**Privacy design in the latest VPN-region release:**

1. `/analytics.js` initially sets Google's `analytics_storage`, `ad_storage`, `ad_user_data`, and `ad_personalization` consent signals to `denied`.
2. Before loading GA4, it checks the visitor's country with `https://api.country.is/`. A fresh lookup is performed **on every page load**—there is no 24-hour country cache in the latest release, so a changed VPN location should be detected on refresh.
3. **Confirmed EEA / UK / Switzerland:** basic consent mode. Do **not** load the GA4 script or send analytics events before opt-in. Show **Allow analytics** / **Decline analytics** if there is no valid saved consent choice.
4. **Confirmed other country, including US:** no automatic consent banner. Load GA4 unless that browser previously recorded an explicit refusal.
5. **Country lookup failure or timeout:** do **not** load GA4. The current release also does **not** display an automatic banner on lookup failure, to avoid a popup for unclassified visitors; those visits will not be measured. This is an availability/privacy tradeoff, not proof the visitor is outside Europe.
6. Ad storage, ad user data, and ad personalization remain denied for everyone. The site is not configured for Google Ads remarketing.

**Presentation:** In the regulated regions, a plain centered **Privacy & Analytics** text link is inserted immediately above the page's copyright/footer when a real `<footer>` element is present. The consent panel is not automatically shown for US visitors. A privacy-preferences link on `/privacy/` can open the panel deliberately from any region. The public Privacy Policy is available at https://arteziq.com/privacy/ for everyone.

**Saved choices:** The current corrected release uses browser-local `arteziq_analytics_consent_v2`; a prior explicit decline from `v1` remains respected for US tracking. The former globally displayed *allow* selection is **not** reused as informed European consent in the new release. Browser storage and consent are not shared between Private Browsing sessions, devices, or separate browsers.

**Third-party and limitation:** The browser's request to Country.is exposes the visitor's network IP to that service in the ordinary course of routing. The website uses only the country classification and does not intentionally store the returned IP. Country-by-IP is an approximation; VPNs, network routing, proxies, geolocation errors, and blocked requests can change behavior. Static GitHub Pages cannot guarantee geographic/legal classification with a browser-only check. Regional consent management is a technical measure, **not** a legal guarantee of GDPR/UK GDPR/Swiss FADP compliance.

---

## Explorer Data Handling, Privacy Notice & Retention

**The Explorer NDA is a confidentiality agreement, not a substitute for a privacy notice.** Each individual Explorer form includes a short privacy notice linking to `/privacy/`, plus a required **18-or-older** confirmation. The corresponding Google Apps Script backend verifies the age checkbox and privacy-notice version submitted with the application.

**Data requested:** full name, email, phone, city/state, preferred contact method, testing device, experience/intended use, selected app, NDA name/email/date, handwritten signature, agreement ID and timestamp, and limited form-security metadata including form timing and browser user-agent. Survey pages can collect survey responses and contact details where requested. Do not put sensitive information into optional/free-form entries unless necessary.

**Purpose:** consider and administer Explorer applications, create/send a signed NDA, communicate about selected tests, prevent spam/abuse, and perform product research. See `/privacy/` for applicable legal bases and international transfer notices.

**Processing and storage in the currently reviewed backend (`/explorer/google-apps-script.gs`):**

- Frontend produces a signed NDA PDF and sends the application/PDF to ARTEZIQ's Google Apps Script Web App.
- The backend emails the applicant a signed NDA copy and emails ARTEZIQ an application summary with the signed PDF attached at `arteziq.apps@gmail.com`.
- The reviewed backend does **not** intentionally save those application records or signed PDFs to a separate Drive folder, Supabase database, or GitHub repository; operational copies therefore exist primarily in the email accounts and provider systems. Verify any later backend revisions separately.
- The anti-abuse limit is approximately 15 minutes and uses a SHA-256-derived key for the email-plus-app value in Apps Script cache (the key itself is short-lived).
- Google provides Apps Script/mail services; GitHub provides static hosting. International processing/transfers can occur through providers.

**Published retention intentions:** Explorer application and ARTEZIQ NDA copies for the Explorer relationship plus **3 years**, unless legal obligations/claims require longer; surveys normally up to **24 months**; rate-limit cache approximately **15 minutes**. These periods must be **enforced operationally** through mailbox/data deletion procedures—not merely stated on the website. The applicant controls their emailed NDA copy. GA4 data retention must be configured independently in the GA4 property.

**Privacy requests:** `arteziq.apps@gmail.com` for access, correction, deletion, objection, restriction, or portability where applicable. Confirm identity before releasing private records and keep an appropriate request-handling process. GDPR/UK GDPR responses generally should be sent without undue delay and ordinarily within one month, subject to permitted extensions.

**Data minimization:** Do not send names, emails, phone numbers, signatures, NDA text, or free-form application/survey responses to GA4. Do not add PII in URLs, event parameters, or query strings. App names, paths, source/medium/campaign, and generic success/failure status are intended analytics metadata. Reassess whether phone and city/state must remain mandatory for all applicants.

**Operational/legal follow-ups:** Periodically review Google/GitHub processor terms, international transfer mechanisms, who can access signed PDFs, secure mailbox access, backup deletion, rights requests, and any need for an EU/UK representative or further legal review if actively targeting European applicants. Review the policy and implementation **before** adding storage (e.g., Supabase/Drive), advertising tags, health/sensitive data, or materially changing data collection.

**Important:** This README describes the website code and declared practices. It is not legal advice and does not independently certify compliance with GDPR, UK GDPR, or Swiss law. The actual public policy is `/privacy/index.html`.

---

## Analytics Diagnostics and Deployment

**The Analytics Diagnostic Test is built into `/analytics.js` in `ARTEZIQ-GA4-VPN-region-fix.zip`. It is not an additional HTML page or a second Google tag.** The `?ga_debug=1` query parameter simply activates a diagnostic panel if—and only if—that version of `analytics.js` is installed. Normal visitors without that query parameter do not see the panel.

Diagnostic test link:

```text
https://arteziq.com/?ga_debug=1
```

In the corrected release it displays: **Detected country** (`US`, `CH`, `GB`, etc., or `unknown`); **Region** (`standard`, `consent-required`, or `unknown`); **GA4 loaded** (`yes`/`no`); **Stored consent**; and **Country lookup** (`ok`/failure). This reports code state, not independently verified receipt of hits in GA4.

**Suggested tests (prefer new Private Browsing tabs and a fresh page reload after switching VPNs):**

| Situation | Expected country | Expected consent UI | GA4 loaded |
| --- | --- | --- | --- |
| US visitor, no prior decline | `US` | No automatic banner | `yes` |
| Switzerland VPN, no valid v2 consent | `CH` | Prompt for analytics | `no` |
| UK or EEA visitor, no valid v2 consent | `GB`, `FR`, etc. | Prompt for analytics | `no` |
| Regulated visitor clicked Allow | `CH`, `GB`, etc. | Saved decision; no repeat popup | `yes` |
| Regulated visitor clicked Decline | `CH`, `GB`, etc. | Saved decision; no repeat popup | `no` |
| Lookup blocked/timed out | `unknown` | No automatic banner (current policy) | `no` |

**If your Swiss VPN still reports `US`,** the country lookup is not seeing the VPN location; check VPN routing, browser network settings, and the lookup response. If a new Swiss session reports `CH` but no banner appears, inspect stored consent and verify that the correct `analytics.js` is deployed. If the diagnostic panel does not appear at all, check the published `/analytics.js` file for `ga_debug` and verify you have deployed the *VPN-region fix*, not the older region-aware release.

**Deployment (when installing the current diagnostic ZIP):**

1. Replace **`/analytics.js`** at the repository root and **`/privacy/index.html`** with the two files from `ARTEZIQ-GA4-VPN-region-fix.zip`.
2. Upload the updated `README.md` from this documentation handoff to the repository root.
3. Wait for GitHub Pages publication, refresh Safari (clear cached site resources if necessary), and test the diagnostic link.
4. Run both **US** and **Switzerland VPN** checks. Then verify an allowed US session in GA4 **Reports → Realtime**.
5. Do **not** add a duplicate Google tag manually in HTML. Do **not** change the Explorer Apps Script simply to update the country/consent loader.

**Future changes:** Keep this README and `/privacy/` synchronized with changes to regional consent logic, analytics event names, data processors, NDA storage/retention, and the Feedback Control Panel integration. The separate `ARTEZIQ-GA4-Feedback-Control-Panel-Handoff.zip` documents the planned analytics dashboard; it does **not** automatically configure the GA4 Data API connection or give the Feedback Control Panel access to GA4. Use server-side API credentials only.

---

## Publishing with GitHub Pages

The site is published from the ARTEZIQ GitHub repository using GitHub Pages.

Expected GitHub Pages configuration:

- Branch: `main`
- Folder: `/(root)`
- Custom domain: `arteziq.com`

The root `CNAME` file should contain:

```text
arteziq.com
```

Do not remove the `CNAME` file when replacing or uploading website files.

---

## Domain and Subdomains

The ARTEZIQ domain is managed through Porkbun.

The primary website is:

https://arteziq.com

App-specific subdomains can be configured in Porkbun as URL forwards to the corresponding folders on the main site.

Examples:

```text
anglersnavigator.arteziq.com → https://arteziq.com/anglersnavigator/
sherpacaddie.arteziq.com     → https://arteziq.com/sherpacaddie/
handoverfoot.arteziq.com     → https://arteziq.com/handoverfoot/
stillwater.arteziq.com       → https://arteziq.com/stillwater/
mintvision.arteziq.com       → https://arteziq.com/mintvision/
hairapparent.arteziq.com     → https://arteziq.com/hairapparent/
```

These are redirects/forwards to the GitHub Pages folders rather than separate hosted websites.

---

## Brand Guidelines

Primary ARTEZIQ website styling:

- black background;
- white primary text;
- gold accent elements;
- clean modern typography;
- ARTEZIQ logo with **EZ** highlighted in gold.

The ARTEZIQ concept is:

**ART + IQ = EZ**

The site should communicate useful, approachable technology rather than a luxury-brand aesthetic.

---

## Updating the Website

When making an update:

1. Change only the files required for that update.
2. Preserve existing working pages and assets unless they specifically need modification.
3. Verify every image path and internal link before publishing.
4. Verify Previous / Next navigation after adding or moving an app.
5. Verify Explorer links independently for every participating app.
6. Verify the app-specific NDA names the correct app.
7. Verify the Google Apps Script endpoint before testing a live Explorer submission.
8. Keep `CNAME` in the repository root.
9. Test the published site on both desktop/tablet and phone layouts.

For multi-file development updates, changed-file packages should contain only the files that actually changed rather than repackaging the entire website.

---

## Current Explorer Routes

```text
https://arteziq.com/explorer/anglersnavigator/
https://arteziq.com/explorer/sherpacaddie/
https://arteziq.com/explorer/handoverfoot/
https://arteziq.com/explorer/anglersarrows/
https://arteziq.com/explorer/anglersjigsaw/
```

Each route must load its own complete application and NDA page. An empty `index.html` in any Explorer folder will result in a blank white page on GitHub Pages.

---

## Copyright

© 2026 ARTEZIQ. All rights reserved.
