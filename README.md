# ARTEZIQ Website

**ARTEZIQ — Where ART and IQ meet to make things EZ.**

This repository contains the public ARTEZIQ website and the individual product pages for ARTEZIQ apps and creative technology projects.

Public website:

https://arteziq.com

ARTEZIQ is a Disabled Veteran Owned Small Business focused on AI-powered apps and creative technology that simplify everyday things.

---

## Current ARTEZIQ Apps

### Angler's Navigator
**Tackle & Bait Edition**

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

The Explorer form and NDA are intentionally kept app-specific. Do not combine the three Explorer pages into one generic form unless the application and NDA continue to clearly identify the exact app the tester is agreeing to evaluate and keep confidential.

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
    └── handoverfoot/
        └── index.html
```

---

## Homepage

The homepage presents the current ARTEZIQ app lineup.

Current display order:

1. Angler's Navigator
2. Sherpa Caddie
3. Hand Over Foot
4. Stillwater
5. Mint Vision
6. Hair Apparent

The homepage uses ARTEZIQ's black, white, and gold visual identity while allowing each app to retain its own accent color.

The homepage also displays iOS and Android platform references and the Disabled Veteran Owned Small Business badge.

---

## App Page Navigation

The individual app pages use a shared navigation pattern with:

- **Previous** on the left;
- the ARTEZIQ logo centered;
- **Next** on the right.

Current navigation sequence:

`Hair Apparent → Angler's Navigator → Sherpa Caddie → Hand Over Foot → Stillwater → Mint Vision → Hair Apparent`

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
```

When adding another app to the Explorer Program, update both:

1. the public Explorer application page; and
2. the Google Apps Script server-side allow-list.

After changing the Google Apps Script code, deploy a **new version of the existing Web App deployment** and verify that the `/exec` URL used by the Explorer pages is correct.

The Google Apps Script source is operational backend code and should be managed in the Google Apps Script project rather than treated as a normal public website page.

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
```

Each route must load its own complete application and NDA page. An empty `index.html` in any Explorer folder will result in a blank white page on GitHub Pages.

---

## Copyright

© 2026 ARTEZIQ. All rights reserved.
