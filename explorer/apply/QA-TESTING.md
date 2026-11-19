# ARTEZIQ Explorer — controlled browser QA

**Development branch:** `explorer-unified-onboarding-20261118`  
**Site:** `DavidFliesen/ARTEZIQ`  
**Production is unchanged.** The unified application is not linked from the live site.

## Completed automated checks

- Deployed Apps Script GET health: HTTP 200, `arteziq-explorer-unified` version 1.
- Browser POST with intentionally invalid JSON: HTTP 200 with `ok:false` and correct server-side validation error. **Cannot send an email** because there are no applicant fields or PDF.
- Full mobile-size Chromium form with **intercepted POST**: signed PDF successfully generated, two apps preserved, unsigned submit blocked, one mock submission, correct Feedback Portal continuation link. **No real application or email sent.**
- 34 static/unit/server-behavior tests pass.

Evidence: <https://github.com/DavidFliesen/ARTEZIQ/actions/runs/44428650282>

**WebKit/Safari:** Separate iOS-like WebKit verification was attempted. The first run was blocked by Ubuntu 26.04 support and the revised Ubuntu 24.04 installer has been slow. Do not claim real Safari compatibility until that test or an iPad Safari check passes.

## Obtain the development form without publishing it

GitHub Actions attaches a `unified-explorer-preview` artifact containing the complete `index.html` and this guide. It is a file package, **not a hosted public link**. A static web server is needed for a faithful manual browser test.

Option A — computer with Python already installed:
1. Download the artifact from the latest successful **Explorer Unified Application Tests** run on this branch.
2. Extract the ZIP; keep `index.html` and this guide together.
3. Open a terminal in the extracted directory.
4. Start the preview: `python3 -m http.server 8765 --bind 127.0.0.1` on Mac/Linux or `py -m http.server 8765 --bind 127.0.0.1` on Windows (if Python is installed).
5. Open `http://127.0.0.1:8765/index.html?apps=anglers-navigator` in the browser. **Do not open via a third-party HTML preview host**; applicant data and legal documents are sensitive.
6. Stop the server with Ctrl+C when finished.

Option B — private GitHub Codespaces workspace (only if the account has Codespaces enabled):
1. Open the ARTEZIQ repository, select branch `explorer-unified-onboarding-20261118`, choose **Code → Codespaces** and open/create a codespace on that branch.
2. Run `python3 -m http.server 8765 --bind 0.0.0.0` in the Codespaces terminal.
3. In **Ports**, open port 8765 via its authenticated, private forwarded URL. The path `/explorer/apply/?apps=anglers-navigator` loads the development form.
4. Keep the port **Private**, not Public. Stop the server and Codespace when testing is complete. Codespaces may incur usage charges.

## One genuine end-to-end NDA test (requires the tester's own action)

The QA automations **cannot legitimately sign a legal NDA on a person's behalf**. A real tester must review the NDA and draw their own signature.

Use a sender-controlled test email and a real authorized applicant name:
1. Choose **Angler's Navigator** and **Hand Over Foot**. Fill in the required fields, read the entire 13-section NDA, accept its terms, confirm age 18+, and draw your own signature.
2. Submit **once**. If the form says delivery is uncertain, inspect the mailbox first; **do not click Submit repeatedly**. The backend protects against duplicates and can withhold automatic resends.
3. Verify one signed NDA email reached the applicant mailbox and a second reached `arteziq.apps@gmail.com`. Both must name **both selected apps** and attach one full, readable multi-page NDA PDF with the app list, date, agreement ID, and drawn signature.
4. Click **Continue to Explorer account setup**. Confirm the Feedback Portal has both app selections and only offers **Request access to selected apps** for eligible, not-yet-requested apps.
5. Create/sign in to a disposable Explorer account as the test applicant (not an existing beta tester). Request access once. Confirm two **Pending** enrollments appear in the Founder dashboard and that an unapproved test user cannot launch a restricted app.
6. Approve deliberately through the Founder dashboard; verify approved app launch and an in-app Ladybug feedback report. If Cloudflare Access protects the beta PWA, check its separately managed email allowlist; Supabase approval alone cannot bypass Cloudflare.
7. Verify existing tester accounts, feedback, invitation history, and application links are unchanged.

## Rollout boundary

The **production** ARTEZIQ landing page and Feedback Dashboard remain unchanged until the complete NDA is reviewed, the real Safari browser test passes, and the Founder explicitly authorizes deployment. An isolated file preview is not a production release.
