'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const application=fs.readFileSync('explorer/apply/index.html','utf8');
const landing=fs.readFileSync('explorer/index.html','utf8');

test('new NDA includes all original numbered sections plus acceptance',()=>{
  for(let i=1;i<=13;i++)assert.match(application,new RegExp('<h3>'+i+'\\. '),'Missing NDA section '+i);
  assert.match(application,/<h3>Acceptance<\/h3>/);
  assert.match(application,/id="ndaSelectedApps"/);
  assert.match(application,/id="signatureCanvas"/);
  assert.match(application,/id="ageConfirmed"/);
  assert.match(application,/id="agreed"/);
});

test('application script has valid JavaScript syntax and uses the new unified endpoint',()=>{
  const scripts=[...application.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)]
    .map(x=>x[1]).filter(x=>x.trim());
  assert.equal(scripts.length,1,'Expected one self-contained application script');
  assert.doesNotThrow(()=>new vm.Script(scripts[0],{filename:'apply-inline.js'}));
  const expected = 'https://script.google.com/macros/s/AKfycbykzFI9zXYY_xqVyicbcKPGaTdP-E7loiFU9u9DzsCHfY5Wdc0Oe6ZucTu6aBv8Ligo/exec';
  assert.ok(application.includes("const ENDPOINT='"+expected+"'"), 'The new endpoint must be configured exactly');
  assert.doesNotMatch(application,/REPLACE_WITH_VERIFIED_UNIFIED_APPS_SCRIPT_ENDPOINT/);
  assert.match(application,/ENDPOINT\.startsWith\('REPLACE_'\)/);
});

test('payload and attached PDF cover every selected app and complete NDA',()=>{
  for(const field of [
    'appsBeingTested','appBeingTested','ndaEmail','ageConfirmed',
    'formStartedAt','privacyNoticeVersion','submissionToken',
    'pdfBase64','agreementId','signedAt'
  ])assert.ok(application.includes(field),'Required contract field missing: '+field);
  assert.match(application,/ndaTerms'\)\.innerText/,'Full agreement text must be included in the PDF');
  assert.match(application,/canvas\.toDataURL\('image\/png'\)/,'Handwritten signature must appear in the PDF');
  assert.match(application,/next\.searchParams\.set\('apps'/,'App selection must reach the Feedback portal');
  assert.match(application,/new URLSearchParams\(location\.search\)/,'Selections must prefill from app cards');
});

test('all four open beta app cards lead to unified application and Sherpa remains independent',()=>{
  for(const slug of ['anglers-navigator','hand-over-foot','anglers-arrows','anglers-jigsaw']){
    assert.ok(landing.includes('/explorer/apply/?apps='+slug),slug+' does not link to unified application');
  }
  assert.match(landing,/href="\/explorer\/sherpacaddie\/"/);
  assert.match(landing,/November 1 – December 31, 2026/);
  assert.match(landing,/arteziq-explorer-program\.png/);
});

test('application does not expose applicant identity to analytics',()=>{
  assert.match(application,/https:\/\/arteziq\.com\/analytics\.js/);
  assert.match(application,/track\('explorer_application_submitted',\{app_name:name\}\)/);
  assert.doesNotMatch(application,/track\([^;]*(?:email:|fullName:|ndaName:)/);
});
