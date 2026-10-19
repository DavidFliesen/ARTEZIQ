/*
ARTEZIQ privacy-first analytics loader
GA4 Measurement ID: G-Z94JEHVXL8

Implementation:
- Google Analytics is NOT loaded until the visitor explicitly accepts analytics.
- The preference is remembered in localStorage.
- Ad storage, ad user data, and ad personalization remain denied.
- Visitors can change their choice at any time using the Privacy & Analytics control.
- No form field values or other personal data are sent to GA4 by this file.
*/
(() => {
  'use strict';

  const MEASUREMENT_ID = 'G-Z94JEHVXL8';
  const CONSENT_KEY = 'arteziq_analytics_consent_v1';
  const CONSENT_VERSION = 1;
  const APP_PATHS = {
    '/anglersnavigator/': "Angler's Navigator",
    '/sherpacaddie/': 'Sherpa Caddie',
    '/handoverfoot/': 'Hand Over Foot',
    '/anglersarrows/': "Angler's Arrows",
    '/anglersjigsaw/': "Angler's Jigsaw",
    '/stillwater/': 'Stillwater',
    '/mintvision/': 'Mint Vision',
    '/hairapparent/': 'Hair Apparent'
  };

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function(){ window.dataLayer.push(arguments); };

  // Default to no analytics and no advertising-related storage.
  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied'
  });

  let googleLoaded = false;

  function readChoice() {
    try {
      const value = JSON.parse(localStorage.getItem(CONSENT_KEY) || 'null');
      if (!value || value.version !== CONSENT_VERSION) return null;
      return value.choice === 'granted' || value.choice === 'denied' ? value.choice : null;
    } catch (_) {
      return null;
    }
  }

  function writeChoice(choice) {
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify({
        choice,
        version: CONSENT_VERSION,
        savedAt: new Date().toISOString()
      }));
    } catch (_) {}
  }

  function eraseGaCookies() {
    try {
      document.cookie.split(';').forEach(cookie => {
        const name = cookie.split('=')[0].trim();
        if (!name.startsWith('_ga')) return;
        const expires = 'expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = `${name}=;${expires};path=/;SameSite=Lax`;
        document.cookie = `${name}=;${expires};path=/;domain=.arteziq.com;SameSite=Lax`;
      });
    } catch (_) {}
  }

  function loadGoogleAnalytics() {
    if (googleLoaded) return;
    googleLoaded = true;

    window.gtag('consent', 'update', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
    window.gtag('js', new Date());
    window.gtag('config', MEASUREMENT_ID);

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(MEASUREMENT_ID)}`;
    script.referrerPolicy = 'strict-origin-when-cross-origin';
    document.head.appendChild(script);
  }

  function denyAnalytics() {
    window.gtag('consent', 'update', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
    eraseGaCookies();
  }

  function normalizePath(url) {
    try {
      const u = new URL(url, location.href);
      let p = u.pathname.replace(/\/index\.html$/i, '/');
      if (!p.endsWith('/') && !/\.[a-z0-9]+$/i.test(p)) p += '/';
      return p;
    } catch (_) {
      return '';
    }
  }

  function currentAppName() {
    const p = normalizePath(location.href);
    return APP_PATHS[p] || null;
  }

  function track(eventName, params = {}) {
    if (readChoice() !== 'granted') return false;
    loadGoogleAnalytics();

    // Allow only caller-supplied non-PII metadata. Never pass form values here.
    const safe = {
      ...params,
      transport_type: 'beacon'
    };
    window.gtag('event', eventName, safe);
    return true;
  }

  function makeStyles() {
    if (document.getElementById('arteziq-privacy-styles')) return;
    const style = document.createElement('style');
    style.id = 'arteziq-privacy-styles';
    style.textContent = `
      #arteziq-consent {
        position: fixed; left: 16px; right: 16px; bottom: 16px; z-index: 2147483000;
        max-width: 850px; margin: 0 auto; padding: 18px;
        background: rgba(10,12,14,.985); color: #f5f5f5;
        border: 1px solid rgba(220,165,46,.75); border-radius: 16px;
        box-shadow: 0 18px 50px rgba(0,0,0,.55);
        font-family: Arial, Helvetica, sans-serif; line-height: 1.45;
      }
      #arteziq-consent[hidden] { display: none !important; }
      #arteziq-consent strong { color: #fff; }
      #arteziq-consent p { margin: 0 0 12px; color: #d9dde0; font-size: 14px; }
      #arteziq-consent a { color: #f1c75b; text-decoration: underline; }
      .arteziq-consent-actions { display: flex; gap: 10px; flex-wrap: wrap; }
      .arteziq-consent-actions button {
        border-radius: 10px; padding: 10px 14px; font-weight: 700; cursor: pointer;
        font-family: inherit; font-size: 14px;
      }
      #arteziq-accept-analytics { background: #dca52e; color: #090909; border: 1px solid #dca52e; }
      #arteziq-decline-analytics { background: transparent; color: #fff; border: 1px solid #7d858a; }
      #arteziq-privacy-control {
        position: fixed; left: 10px; bottom: 10px; z-index: 2147482000;
        background: rgba(8,10,12,.92); color: #e8d59c; border: 1px solid rgba(220,165,46,.55);
        border-radius: 999px; padding: 7px 11px; font: 12px Arial, Helvetica, sans-serif;
        cursor: pointer; box-shadow: 0 4px 18px rgba(0,0,0,.35);
      }
      @media (max-width: 520px) {
        #arteziq-consent { left: 10px; right: 10px; bottom: 10px; padding: 15px; }
        .arteziq-consent-actions button { flex: 1 1 140px; }
      }
    `;
    document.head.appendChild(style);
  }

  function renderConsent() {
    makeStyles();

    let panel = document.getElementById('arteziq-consent');
    if (!panel) {
      panel = document.createElement('section');
      panel.id = 'arteziq-consent';
      panel.setAttribute('role', 'dialog');
      panel.setAttribute('aria-modal', 'false');
      panel.setAttribute('aria-labelledby', 'arteziq-consent-title');
      panel.innerHTML = `
        <p id="arteziq-consent-title"><strong>Privacy & analytics</strong></p>
        <p>
          ARTEZIQ uses Google Analytics only if you allow analytics. Until you accept,
          the Google Analytics tag does not load. We use a local preference setting to
          remember your choice. You can change it later.
          <a href="https://arteziq.com/privacy/">Privacy Policy</a>
        </p>
        <div class="arteziq-consent-actions">
          <button type="button" id="arteziq-accept-analytics">Allow analytics</button>
          <button type="button" id="arteziq-decline-analytics">Decline analytics</button>
        </div>`;
      document.body.appendChild(panel);

      document.getElementById('arteziq-accept-analytics').addEventListener('click', () => {
        writeChoice('granted');
        loadGoogleAnalytics();
        panel.hidden = true;
      });
      document.getElementById('arteziq-decline-analytics').addEventListener('click', () => {
        writeChoice('denied');
        denyAnalytics();
        panel.hidden = true;
      });
    }

    let control = document.getElementById('arteziq-privacy-control');
    if (!control) {
      control = document.createElement('button');
      control.type = 'button';
      control.id = 'arteziq-privacy-control';
      control.textContent = 'Privacy & Analytics';
      control.setAttribute('aria-label', 'Open privacy and analytics choices');
      control.addEventListener('click', () => {
        panel.hidden = false;
        panel.scrollIntoView({behavior:'smooth', block:'nearest'});
      });
      document.body.appendChild(control);
    }

    panel.hidden = !!readChoice();
  }

  function setupAutomaticEvents() {
    const pagePath = normalizePath(location.href);

    if (pagePath.startsWith('/surveys/')) {
      track('survey_open', {
        survey_id: pagePath.split('/').filter(Boolean).pop() || 'survey',
        destination_path: pagePath
      });
    }

    document.addEventListener('click', (event) => {
      const a = event.target.closest && event.target.closest('a[href]');
      if (!a) return;

      const destinationPath = normalizePath(a.href);
      if (!destinationPath) return;

      if (pagePath === '/' && APP_PATHS[destinationPath]) {
        track('app_click', {
          app_name: APP_PATHS[destinationPath],
          destination_path: destinationPath,
          link_location: 'homepage'
        });
        return;
      }

      if (pagePath === '/explorer/' && APP_PATHS[destinationPath]) {
        track('explorer_app_selected', {
          app_name: APP_PATHS[destinationPath],
          destination_path: destinationPath,
          link_location: 'explorer_directory'
        });
        return;
      }

      const appName = currentAppName();
      if (appName && destinationPath.startsWith('/explorer/')) {
        track('explorer_click', {
          app_name: appName,
          destination_path: destinationPath,
          link_location: 'app_page'
        });
      }
    }, {capture: true});
  }

  window.arteziqAnalytics = {
    track,
    openPreferences() {
      const panel = document.getElementById('arteziq-consent');
      if (panel) panel.hidden = false;
    },
    getConsent: readChoice,
    measurementId: MEASUREMENT_ID
  };

  const initialChoice = readChoice();
  if (initialChoice === 'granted') loadGoogleAnalytics();
  else denyAnalytics();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      renderConsent();
      setupAutomaticEvents();
    });
  } else {
    renderConsent();
    setupAutomaticEvents();
  }
})();
