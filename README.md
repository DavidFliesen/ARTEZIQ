# ARTEZIQ Public Website

This repository contains the public ARTEZIQ website and five informational app pages.

## Structure

- `/index.html` — main ARTEZIQ landing page
- `/anglersnavigator/`
- `/handoverfoot/`
- `/stillwater/`
- `/mintvision/`
- `/hairapparent/`

The app development code should remain in separate repositories.

## GitHub Pages

1. Upload these files to the root of the ARTEZIQ repository.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Select the `main` branch and `/ (root)`.
5. Enter `arteziq.com` as the custom domain.
6. Enable **Enforce HTTPS** after GitHub verifies the domain.

## Porkbun forwarding destinations

- `anglersnavigator.arteziq.com` → `https://arteziq.com/anglersnavigator/`
- `handoverfoot.arteziq.com` → `https://arteziq.com/handoverfoot/`
- `stillwater.arteziq.com` → `https://arteziq.com/stillwater/`
- `mintvision.arteziq.com` → `https://arteziq.com/mintvision/`
- `hairapparent.arteziq.com` → `https://arteziq.com/hairapparent/`

Use permanent 301 forwarding. The browser address will change to the corresponding folder URL after the redirect.
