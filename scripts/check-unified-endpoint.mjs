// Read-only health check for the founder-provided Apps Script Web App.
// Safe to run from CI: GET only; never sends an NDA or email.
const endpoint = 'https://script.google.com/macros/s/AKfycbykzFI9zXYY_xqVyicbcKPGaTdP-E7loiFU9u9DzsCHfY5Wdc0Oe6ZucTu6aBv8Ligo/exec';
let response;
try {
  response = await fetch(endpoint, {
    method: 'GET',
    redirect: 'follow',
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(20000)
  });
} catch (error) {
  console.error('UNIFIED_ENDPOINT_UNREACHABLE:', error.message);
  process.exit(1);
}
const body = await response.text();
if (!response.ok) {
  console.error('UNIFIED_ENDPOINT_HTTP_ERROR:', response.status, 'final host:', new URL(response.url).hostname);
  console.error('First response characters:', body.slice(0, 180).replace(/\s+/g,' '));
  process.exit(1);
}
let data;
try { data = JSON.parse(body); }
catch {
  console.error('UNIFIED_ENDPOINT_NOT_JSON: final host:', new URL(response.url).hostname, 'response:', body.slice(0, 180).replace(/\s+/g,' '));
  process.exit(1);
}
if (data.ok !== true || data.service !== 'arteziq-explorer-unified' || String(data.version) !== '1') {
  console.error('UNIFIED_ENDPOINT_UNEXPECTED_SERVICE:', JSON.stringify({ ok: data.ok, service: data.service, version: data.version }));
  process.exit(1);
}
console.log('UNIFIED_ENDPOINT_HEALTH_OK:', JSON.stringify({ service: data.service, version: data.version, status: response.status, finalHost: new URL(response.url).hostname }));
