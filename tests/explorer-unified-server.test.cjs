'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const crypto = require('node:crypto');

const source = fs.readFileSync('explorer/unified-apps-script.gs', 'utf8');
const now = () => Date.now();
const APP_NAV = "Angler's Navigator";
const APP_HAND = 'Hand Over Foot';
const APP_ARROWS = "Angler's Arrows";
const APP_JIGSAW = "Angler's Jigsaw";

function validPayload(overrides = {}) {
  const id = 'AZ-' + Date.now() + '-abcdef123456';
  const pdf = Buffer.from('%PDF-1.7\n' + 'Signed ARTEZIQ NDA terms and signature'.repeat(4) + '\n%%EOF\n');
  return {
    appBeingTested: APP_NAV,
    appsBeingTested: [APP_NAV, APP_HAND],
    fullName: 'Tester Example', email: 'explorer@example.com',
    phone: '843-555-0100', cityState: 'Summerville, SC',
    contactMethod: 'Email', device: 'iPhone 13',
    experience: 'Evaluating the app for beta testing.',
    ndaName: 'Tester Example', ndaEmail: 'explorer@example.com',
    ndaDate: '2026-11-18', agreed: true, ageConfirmed: true,
    pdfBase64: pdf.toString('base64'),
    agreementId: id, signedAt: new Date().toISOString(),
    filename: 'ARTEZIQ-Explorer-NDA-' + id + '.pdf',
    formStartedAt: Date.now() - 10000,
    formVersion: 'unified-2', privacyNoticeVersion: '2026-10-18-v1',
    userAgent: 'Unit-test Browser', submissionToken: 'arteziq-explorer-v1', company: '',
    ...overrides
  };
}
function setup({failOnSend = 0,quota = 100,lockOk = true} = {}) {
  const props = new Map(), cache = new Map(), sent = [];
  let lockAcquired = false, releaseCount = 0, sendAttempts = 0;
  const sandbox = {
    Date,JSON,Math,Array,Object,Set,Number,String,Error,
    console: {error() {}},
    ContentService: {
      MimeType:{JSON:'json'},
      createTextOutput: s => ({body:s,setMimeType(){return this}})
    },
    Utilities: {
      DigestAlgorithm: {SHA_256:'sha256'},
      computeDigest: (algorithm,input) => [...crypto.createHash('sha256').update(input).digest()],
      base64EncodeWebSafe: bytes => Buffer.from(bytes).toString('base64url'),
      base64Decode: str => [...Buffer.from(str,'base64')],
      newBlob: (bytes,mime,name) => ({bytes,mime,name})
    },
    MailApp: {
      getRemainingDailyQuota: () => quota,
      sendEmail: args => {
        sendAttempts++;
        if (sendAttempts===failOnSend)throw Error('Simulated delivery error');
        sent.push(args);
      }
    },
    CacheService: {getScriptCache: () => ({
      get: key => cache.get(key)||null,
      put: (key,value) => cache.set(key,value)
    })},
    PropertiesService: {getScriptProperties: () => ({
      getProperty:key => props.get(key)||null,
      setProperty:(key,value) => props.set(key,value),
      deleteProperty:key => props.delete(key)
    })},
    LockService: {getScriptLock:()=>({
      tryLock:() => {lockAcquired=lockOk;return lockOk;},
      releaseLock:() => {releaseCount++;lockAcquired=false;}
    })}
  };
  vm.createContext(sandbox);
  vm.runInContext(source,sandbox,{filename:'unified-apps-script.gs'});
  function post(payload) {
    const raw=JSON.stringify(payload);
    const out=sandbox.doPost({postData:{contents:raw,length:raw.length}});
    return JSON.parse(out.body);
  }
  return {post,sent,props,cache,sandbox,get releaseCount(){return releaseCount},get sendAttempts(){return sendAttempts}};
}

test('complete 2-app submission sends exactly one signed attachment to founder and applicant',()=>{
  const t=setup();
  const application=validPayload();
  const result=t.post(application);
  assert.equal(result.ok,true);
  assert.equal(t.sent.length,2);
  assert.equal(t.sent[0].to,'arteziq.apps@gmail.com');
  assert.equal(t.sent[1].to,application.email);
  for(const mail of t.sent) {
    assert.ok(mail.body.includes(APP_NAV),'first app must appear in email');
    assert.ok(mail.body.includes(APP_HAND),'second app must appear in email');
    assert.equal(mail.attachments.length,1,'One complete NDA PDF attached');
    assert.equal(mail.attachments[0].mime,'application/pdf');
    assert.equal(mail.attachments[0].name,application.filename);
    assert.match(mail.attachments[0].bytes.map(v=>String.fromCharCode(v)).join(''),/%%EOF/);
  }
  assert.equal(t.releaseCount,1);
});

test('new 13+ application accepts the minimum-age confirmation without retaining an age range',()=>{
  const t=setup();
  const p=validPayload({formVersion:'unified-3',ageConfirmed:undefined,minimumAgeConfirmed:true});
  assert.equal(t.post(p).ok,true);
  assert.equal(t.sent.length,2);
  assert.doesNotMatch(t.sent[0].body,/age range|birth date/i);
});

test('repeat application gives duplicate success without sending additional emails',()=>{
  const t=setup(), p=validPayload();
  assert.equal(t.post(p).ok,true);
  const second=t.post(p);
  assert.equal(second.ok,true);
  assert.equal(second.duplicate,true);
  assert.equal(t.sent.length,2);
});

test('same apps in a different order cannot bypass idempotency',()=>{
  const t=setup(),p=validPayload();
  assert.equal(t.post(p).ok,true);
  const reversed=validPayload({
    appsBeingTested:[APP_HAND,APP_NAV],
    appBeingTested:APP_HAND
  });
  const response=t.post(reversed);
  assert.equal(response.duplicate,true);
  assert.equal(t.sent.length,2);
});

test('all four approved apps can be submitted with one NDA and the alpha app is excluded',()=>{
  const t=setup(),apps=[APP_NAV,APP_HAND,APP_ARROWS,APP_JIGSAW];
  assert.equal(t.post(validPayload({appsBeingTested:apps})).ok,true);
  assert.ok(t.sent[1].body.includes(APP_JIGSAW));
  const t2=setup();
  const denied=t2.post(validPayload({appBeingTested:'Sherpa Caddie',appsBeingTested:['Sherpa Caddie']}));
  assert.equal(denied.ok,false);
  assert.equal(t2.sent.length,0);
});

for(const [label,change] of [
  ['duplicate app names',{appsBeingTested:[APP_NAV,APP_NAV]}],
  ['unsupported app',{appsBeingTested:[APP_NAV,'Fake App']}],
  ['no selected app',{appsBeingTested:[]}],
  ['wrong primary app',{appBeingTested:APP_JIGSAW}],
  ['no age confirmation',{ageConfirmed:false}],
  ['no NDA consent',{agreed:false}],
  ['new form with only the legacy age confirmation',{formVersion:'unified-3'}],
  ['new form with rejected age eligibility',{formVersion:'unified-3',minimumAgeConfirmed:false}],
  ['new form with a string for age eligibility',{formVersion:'unified-3',minimumAgeConfirmed:'true'}],
  ['string instead of age boolean',{ageConfirmed:'true'}],
  ['mismatched signer',{ndaName:'Other Name'}],
  ['mismatched NDA email',{ndaEmail:'other@example.com'}],
  ['invalid phone',{phone:'111'}],
  ['invalid preferred contact',{contactMethod:'Carrier Pigeon'}],
  ['honeypot filled',{company:'spam'}],
  ['invalid form version',{formVersion:'unified-1'}],
  ['too-fast form',{formStartedAt:Date.now()}],
  ['signed date out of range',{signedAt:'2024-01-01T00:00:00.000Z'}],
  ['bad PDF body',{pdfBase64:Buffer.from('not a PDF'.repeat(20)).toString('base64')}],
  ['unsafe PDF file name',{filename:'../../filename.pdf'}],
  ['missing required email',{email:''}]
]) {
  test('rejects '+label+' before sending or reserving quota',()=>{
    const t=setup();
    const result=t.post(validPayload(change));
    assert.equal(result.ok,false,JSON.stringify(result));
    assert.equal(t.sent.length,0);
    assert.equal(t.releaseCount,0);
    assert.equal(t.props.size,0,'No quota or deduplication state should be reserved');
  });
}

test('partial failure is reported as uncertain and retry cannot send duplicate admin NDA',()=>{
  const t=setup({failOnSend:2}), p=validPayload();
  const first=t.post(p);
  assert.equal(first.ok,false);
  assert.equal(first.status,'delivery_uncertain');
  assert.equal(t.sent.length,1,'Founder got the only confirmed message');
  assert.equal(t.releaseCount,1);
  const second=t.post(p);
  assert.equal(second.ok,false);
  assert.equal(second.status,'delivery_uncertain');
  assert.equal(t.sent.length,1);
  assert.equal(t.sendAttempts,2,'No retries after uncertain delivery');
});

test('failure before first message is treated as uncertain for safe manual review',()=>{
  const t=setup({failOnSend:1}),p=validPayload();
  assert.equal(t.post(p).status,'delivery_uncertain');
  assert.equal(t.post(p).status,'delivery_uncertain');
  assert.equal(t.sendAttempts,1);
});

test('quota rejection does not reserve or send anything',()=>{
  const t=setup({quota:1});
  const response=t.post(validPayload());
  assert.equal(response.ok,false);
  assert.equal(t.sent.length,0);
  assert.equal(t.props.size,0);
});

test('global hour and day recipient caps are enforced',()=>{
  const t=setup();
  const props=t.sandbox.PropertiesService.getScriptProperties();
  const hour=Math.floor(now()/3600000),day=Math.floor(now()/86400000);
  props.setProperty('ux2_quota',JSON.stringify({hour,hourCount:36,day,dayCount:50}));
  assert.equal(t.post(validPayload()).ok,false);
  assert.equal(t.sent.length,0);
  props.setProperty('ux2_quota',JSON.stringify({hour,hourCount:0,day,dayCount:70}));
  assert.equal(t.post(validPayload()).ok,false);
  assert.equal(t.sent.length,0);
});

test('lock contention blocks sending with no mutation',()=>{
  const t=setup({lockOk:false});
  assert.equal(t.post(validPayload()).ok,false);
  assert.equal(t.sent.length,0);
  assert.equal(t.props.size,0);
});

test('recent applications from same email but different app sets are throttled',()=>{
  const t=setup();
  const p=validPayload();
  assert.equal(t.post(p).ok,true);
  const fresh=validPayload({
    appsBeingTested:[APP_JIGSAW],appBeingTested:APP_JIGSAW
  });
  const result=t.post(fresh);
  assert.equal(result.ok,false);
  assert.equal(t.sent.length,2);
});

test('GET health response is not a submission and never sends mail',()=>{
  const t=setup();
  const response=JSON.parse(t.sandbox.doGet().body);
  assert.deepEqual(response,{ok:true,service:'arteziq-explorer-unified',version:'2',minimumTesterAge:13});
  assert.equal(t.sent.length,0);
});
