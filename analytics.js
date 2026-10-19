/*
ARTEZIQ region-aware analytics loader
GA4 Measurement ID: G-Z94JEHVXL8

- EEA / UK / Switzerland: basic consent mode; GA4 does not load until accepted.
- Other regions: GA4 loads automatically unless previously declined.
- Country lookup uses api.country.is only to determine a two-letter country code.
- Consent UI appears automatically only for detected EEA / UK / Switzerland visitors.
- Country detection is repeated for every page; prior U.S. region results are never reused.
- If country detection fails, neither GA4 nor the consent UI is loaded.
- Footer text link is CSS-hidden outside the regulated regions.
- Advertising storage, ad user data, and ad personalization stay denied everywhere.
*/
(() => {
  'use strict';

  const MEASUREMENT_ID = 'G-Z94JEHVXL8';
  const CONSENT_KEY = 'arteziq_analytics_consent_v2';
  const LEGACY_CONSENT_KEY = 'arteziq_analytics_consent_v1';
  const CONSENT_VERSION = 2;
  const GEO_ENDPOINT = 'https://api.country.is/';
  const GEO_TIMEOUT_MS = 3500;

  const CONSENT_REQUIRED_COUNTRIES = new Set([
    'AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT',
    'LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE',
    'IS','LI','NO','GB','CH'
  ]);

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

  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied'
  });

  let googleLoaded = false;
  let regionClass = 'unknown';
  let detectedCountry = 'unknown';
  let regionError = '';

  function readChoice() {
    try {
      const value = JSON.parse(localStorage.getItem(CONSENT_KEY) || 'null');
      if (!value || value.version !== CONSENT_VERSION) return null;
      return value.choice === 'granted' || value.choice === 'denied' ? value.choice : null;
    } catch (_) { return null; }
  }

  // Respect an explicit refusal from older releases. A former 'allow' does not
  // count as informed regional opt-in because the old banner appeared globally.
  function previousExplicitDecline() {
    try {
      const saved = JSON.parse(localStorage.getItem(LEGACY_CONSENT_KEY) || 'null');
      return !!(saved && saved.version === 1 && saved.choice === 'denied');
    } catch (_) { return false; }
  }

  function writeChoice(choice) {
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify({
        choice, version: CONSENT_VERSION, savedAt: new Date().toISOString()
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
    window.gtag('consent','update',{
      analytics_storage:'granted', ad_storage:'denied',
      ad_user_data:'denied', ad_personalization:'denied'
    });
    window.gtag('js', new Date());
    window.gtag('config', MEASUREMENT_ID);
    const script=document.createElement('script');
    script.async=true;
    script.src=`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(MEASUREMENT_ID)}`;
    script.referrerPolicy='strict-origin-when-cross-origin';
    document.head.appendChild(script);
  }

  function denyAnalytics() {
    window.gtag('consent','update',{
      analytics_storage:'denied', ad_storage:'denied',
      ad_user_data:'denied', ad_personalization:'denied'
    });
    eraseGaCookies();
  }

  function normalizePath(url) {
    try {
      const u=new URL(url,location.href);
      let p=u.pathname.replace(/\/index\.html$/i,'/');
      if (!p.endsWith('/') && !/\.[a-z0-9]+$/i.test(p)) p+='/';
      return p;
    } catch (_) { return ''; }
  }

  function currentAppName() { return APP_PATHS[normalizePath(location.href)] || null; }

  function track(eventName, params={}) {
    if (!googleLoaded) return false;
    window.gtag('event',eventName,{...params,transport_type:'beacon'});
    return true;
  }

  function makeStyles() {
    if (document.getElementById('arteziq-privacy-styles')) return;
    const style=document.createElement('style');
    style.id='arteziq-privacy-styles';
    style.textContent=`
      #arteziq-consent{position:fixed;left:16px;right:16px;bottom:16px;z-index:2147483000;max-width:850px;margin:0 auto;padding:18px;background:rgba(10,12,14,.985);color:#f5f5f5;border:1px solid rgba(220,165,46,.75);border-radius:16px;box-shadow:0 18px 50px rgba(0,0,0,.55);font-family:Arial,Helvetica,sans-serif;line-height:1.45}
      #arteziq-consent[hidden]{display:none!important} #arteziq-consent strong{color:#fff} #arteziq-consent p{margin:0 0 12px;color:#d9dde0;font-size:14px} #arteziq-consent a{color:#f1c75b;text-decoration:underline}
      .arteziq-consent-actions{display:flex;gap:10px;flex-wrap:wrap}.arteziq-consent-actions button{border-radius:10px;padding:10px 14px;font-weight:700;cursor:pointer;font-family:inherit;font-size:14px}
      #arteziq-accept-analytics{background:#dca52e;color:#090909;border:1px solid #dca52e} #arteziq-decline-analytics{background:transparent;color:#fff;border:1px solid #7d858a}
      #arteziq-privacy-control{display:block;width:fit-content;margin:0 auto 10px;padding:0;background:transparent;border:0;color:#d9bf71;font:13px Arial,Helvetica,sans-serif;line-height:1.3;text-align:center;text-decoration:underline;text-underline-offset:2px;cursor:pointer}
      #arteziq-privacy-control[hidden]{display:none!important}
      #arteziq-privacy-control:hover,#arteziq-privacy-control:focus-visible{color:#f1d36c}
      @media(max-width:520px){#arteziq-consent{left:10px;right:10px;bottom:10px;padding:15px}.arteziq-consent-actions button{flex:1 1 140px}}
    `;
    document.head.appendChild(style);
  }

  function ensureConsentUI() {
    makeStyles();
    let panel=document.getElementById('arteziq-consent');
    if (!panel) {
      panel=document.createElement('section');
      panel.id='arteziq-consent'; panel.hidden=true;
      panel.setAttribute('role','dialog'); panel.setAttribute('aria-modal','false'); panel.setAttribute('aria-labelledby','arteziq-consent-title');
      panel.innerHTML=`<p id="arteziq-consent-title"><strong>Privacy & analytics</strong></p><p>ARTEZIQ uses Google Analytics to understand website traffic and campaign performance. In regions where analytics consent is required, Google Analytics does not load until you allow it. You can change your choice later. <a href="https://arteziq.com/privacy/">Privacy Policy</a></p><div class="arteziq-consent-actions"><button type="button" id="arteziq-accept-analytics">Allow analytics</button><button type="button" id="arteziq-decline-analytics">Decline analytics</button></div>`;
      document.body.appendChild(panel);
      document.getElementById('arteziq-accept-analytics').addEventListener('click',()=>{writeChoice('granted');loadGoogleAnalytics();panel.hidden=true;});
      document.getElementById('arteziq-decline-analytics').addEventListener('click',()=>{
        writeChoice('denied'); denyAnalytics(); panel.hidden=true;
        if(googleLoaded) window.location.reload();
      });
    }
    let control=document.getElementById('arteziq-privacy-control');
    if (!control) {
      control=document.createElement('a');
      control.id='arteziq-privacy-control';
      control.hidden=true;
      control.href='/privacy/';
      control.textContent='Privacy & Analytics';
      control.setAttribute('aria-label','Open privacy and analytics choices');
      control.addEventListener('click',(event)=>{event.preventDefault();panel.hidden=false;});

      const footer=document.querySelector('footer');
      if(footer&&footer.parentNode) footer.parentNode.insertBefore(control,footer);
      else document.body.appendChild(control);
    }
    return {panel,control};
  }

  function showConsentBanner(){
    const ui=ensureConsentUI();
    ui.control.hidden=false;
    ui.panel.hidden=false;
  }

  function setupAutomaticEvents() {
    const pagePath=normalizePath(location.href);
    if (pagePath.startsWith('/surveys/')) track('survey_open',{survey_id:pagePath.split('/').filter(Boolean).pop()||'survey',destination_path:pagePath});
    document.addEventListener('click',(event)=>{
      const a=event.target.closest&&event.target.closest('a[href]'); if(!a)return;
      const destinationPath=normalizePath(a.href); if(!destinationPath)return;
      if(pagePath==='/'&&APP_PATHS[destinationPath]){track('app_click',{app_name:APP_PATHS[destinationPath],destination_path:destinationPath,link_location:'homepage'});return;}
      if(pagePath==='/explorer/'&&APP_PATHS[destinationPath]){track('explorer_app_selected',{app_name:APP_PATHS[destinationPath],destination_path:destinationPath,link_location:'explorer_directory'});return;}
      const appName=currentAppName(); if(appName&&destinationPath.startsWith('/explorer/')) track('explorer_click',{app_name:appName,destination_path:destinationPath,link_location:'app_page'});
    },{capture:true});
  }

  async function detectRegionClass() {
    // No country cache: a visitor may switch VPNs or cross borders at any time.
    // A fresh lookup happens before ANY GA4 script can load on each page view.
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), GEO_TIMEOUT_MS);
    try {
      const response = await fetch(GEO_ENDPOINT, {
        method: 'GET', mode: 'cors', cache: 'no-store', credentials: 'omit',
        referrerPolicy: 'no-referrer', signal: controller.signal
      });
      if (!response.ok) throw new Error('Country lookup failed');
      const data = await response.json();
      const country = String(data && data.country || '').toUpperCase();
      if (!/^[A-Z]{2}$/.test(country)) throw new Error('No valid country returned');
      detectedCountry = country;
      return CONSENT_REQUIRED_COUNTRIES.has(country) ? 'consent-required' : 'standard';
    } catch (error) {
      detectedCountry = 'unknown';
      regionError = (error && error.name === 'AbortError') ? 'timeout' : 'lookup_failed';
      return 'unknown';
    } finally {
      clearTimeout(timer);
    }
  }

  async function initializePrivacyAndAnalytics() {
    const ui=ensureConsentUI();
    ui.panel.hidden=true;
    ui.control.hidden=true;

    regionClass=await detectRegionClass();

    // Outside EEA / UK / Switzerland: no consent UI; GA4 loads automatically.
    if(regionClass==='standard'){
      // Track normal U.S./non-regulated-region traffic without interrupting visitors.
      // A visitor who explicitly declined earlier remains opted out.
      const choice = readChoice();
      if(choice==='denied' || (choice===null && previousExplicitDecline())) denyAnalytics();
      else loadGoogleAnalytics();
      showDiagnostic();
      return;
    }

    // EEA / UK / Switzerland: keep the text link available and use basic consent mode.
    if(regionClass==='consent-required'){
      ui.control.hidden=false;
      // Only an explicit decision saved by this corrected release is valid
      // for regulated-region consent.
      const explicitChoice=readChoice();

      if(explicitChoice==='granted'){
        loadGoogleAnalytics();
        showDiagnostic();
        return;
      }

      if(explicitChoice==='denied'){
        denyAnalytics();
        showDiagnostic();
        return;
      }

      denyAnalytics();
      ui.panel.hidden=false;
      showDiagnostic();
      return;
    }

    // On an unreliable country lookup, do not show the consent interface and
    // do not load GA4. This avoids improperly tracking an undetected EEA visitor.
    // Only a confirmed 'standard' country is tracked automatically.
    denyAnalytics();
    showDiagnostic();
  }

  function showDiagnostic() {
    const query = new URLSearchParams(location.search);
    if(query.get('ga_debug') !== '1') return;
    const details = document.createElement('aside');
    details.id = 'arteziq-ga-diagnostic';
    details.setAttribute('role', 'status');
    details.style.cssText = 'position:relative;z-index:10;width:fit-content;max-width:94%;margin:14px auto;padding:12px 15px;border:1px solid #dca52e;border-radius:8px;background:#131313;color:#fafafa;text-align:left;font:13px Arial,sans-serif;line-height:1.6';
    const consent = readChoice() || (previousExplicitDecline() ? 'previously declined' : 'none');
    const rows = [
      'Analytics diagnostic (visible only with ?ga_debug=1)',
      'Detected country: ' + detectedCountry,
      'Region: ' + regionClass,
      'GA4 loaded: ' + (googleLoaded ? 'yes' : 'no'),
      'Stored consent: ' + consent,
      'Country lookup: ' + (regionError || 'ok')
    ];
    rows.forEach((value, index) => {
      const div = document.createElement('div');
      div.textContent = value;
      if(index === 0) div.style.fontWeight = 'bold';
      details.appendChild(div);
    });
    const footer = document.querySelector('footer');
    if(footer && footer.parentNode) footer.parentNode.insertBefore(details, footer);
    else document.body.appendChild(details);
  }

  window.arteziqAnalytics={
    track,
    openPreferences(){
      // Explicitly requested settings (e.g. from /privacy/) may be opened by anyone.
      showConsentBanner();
    },
    getConsent:readChoice,
    getRegionClass(){return regionClass;},
    getDetectedCountry(){return detectedCountry;},
    measurementId:MEASUREMENT_ID
  };

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>{setupAutomaticEvents();initializePrivacyAndAnalytics();});
  else {setupAutomaticEvents();initializePrivacyAndAnalytics();}
})();
