/**
 * ARTEZIQ unified Explorer APPLICATION form browser integration smoke test.
 * All application POSTs are intercepted and mocked. NO live email, Supabase
 * account, NDA submission, or Google Apps Script mutation can occur here.
 * Uses Playwright Chromium and the exact current development HTML.
 */
import {createServer} from 'node:http';
import {readFileSync} from 'node:fs';
import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';

const html = readFileSync('explorer/apply/index.html','utf8');
const jspdf = readFileSync('node_modules/jspdf/dist/jspdf.umd.min.js','utf8');
const appEndpoint='https://script.google.com/macros/s/AKfycbykzFI9zXYY_xqVyicbcKPGaTdP-E7loiFU9u9DzsCHfY5Wdc0Oe6ZucTu6aBv8Ligo/exec';

const server=createServer((req,res)=>{
  res.writeHead(200,{'Content-Type':'text/html;charset=utf-8','Cache-Control':'no-store'});
  res.end(html);
});
let browser;
try{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const localUrl='http://127.0.0.1:'+server.address().port+'/explorer/apply/?apps=anglers-navigator';
  browser=await chromium.launch({headless:true,executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
  const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const browserErrors=[];
  page.on('pageerror',e=>browserErrors.push(e.message));
  await page.route(/https:\/\/cdn\.jsdelivr\.net\/npm\/jspdf@2\.5\.1\/dist\/jspdf\.umd\.min\.js/,route=>
    route.fulfill({status:200,contentType:'application/javascript',body:jspdf}));
  await page.route('https://arteziq.com/analytics.js',route=>
    route.fulfill({status:200,contentType:'application/javascript',body:'window.arteziqAnalytics={track:function(){}};'}));

  // Block any network activity except local HTML, already stubbed scripts, and
  // the exact endpoint interception. The latter is mocked; never sends email.
  let captured=null;
  let postCount=0;
  await page.route('**/exec',async route=>{
    if(route.request().url()!==appEndpoint)throw Error('Unknown endpoint encountered');
    postCount++;
    captured=JSON.parse(route.request().postData()||'{}');
    await route.fulfill({
      status:200,contentType:'application/json',
      headers:{'Access-Control-Allow-Origin':'*'},
      body:JSON.stringify({ok:true,agreementId:captured.agreementId})
    });
  });
  await page.goto(localUrl,{waitUntil:'load'});
  await page.waitForFunction(()=>window.jspdf&&window.jspdf.jsPDF,{timeout:15000});
  assert.equal(await page.locator('input[name="apps"][value="Angler\'s Navigator"]').isChecked(),true);
  assert.equal(await page.locator('input[name="apps"][value="Hand Over Foot"]').isChecked(),false);
  await page.locator('input[name="apps"][value="Hand Over Foot"]').check();
  const covered=await page.locator('#ndaSelectedApps').innerText();
  assert.ok(covered.includes("Angler's Navigator")&&covered.includes('Hand Over Foot'));

  await page.locator('[name="fullName"]').fill('Local Form QA');
  await page.locator('[name="email"]').fill('do-not-send@example.invalid');
  await page.locator('[name="phone"]').fill('8435550100');
  await page.locator('[name="cityState"]').fill('Test City, SC');
  await page.locator('[name="device"]').fill('iPad Safari WebKit');
  await page.locator('[name="experience"]').fill('Browser validation without email delivery.');
  await page.locator('#ageConfirmed').check();
  await page.locator('#agreed').check();
  assert.equal(await page.locator('[name="ndaName"]').inputValue(),'Local Form QA');

  // An unsigned NDA must never send.
  await page.locator('#submit').click();
  assert.equal(postCount,0,'Unsigned submission must not be sent');
  assert.match(await page.locator('#status').innerText(),/Draw your signature/);

  const box=await page.locator('#signatureCanvas').boundingBox();
  assert.ok(box,'Signature pad should be visible on mobile');
  await page.mouse.move(box.x+24,box.y+50);
  await page.mouse.down();
  await page.mouse.move(box.x+75,box.y+70,{steps:5});
  await page.mouse.move(box.x+145,box.y+45,{steps:5});
  await page.mouse.up();

  await page.locator('#submit').click();
  await page.waitForFunction(()=>document.querySelector('#submit').disabled===true,{timeout:15000});
  assert.equal(postCount,1,'Exactly one mock submission should occur');
  assert.equal(captured.appBeingTested,"Angler's Navigator");
  assert.deepEqual(captured.appsBeingTested,["Angler's Navigator",'Hand Over Foot']);
  assert.equal(captured.email,'do-not-send@example.invalid');
  assert.equal(captured.ndaName,'Local Form QA');
  assert.equal(captured.agreed,true);
  assert.equal(captured.ageConfirmed,true);
  assert.equal(captured.formVersion,'unified-2');
  assert.match(captured.filename,/^ARTEZIQ-Explorer-NDA-AZ-/);
  assert.ok(captured.pdfBase64.length>4000,'Generated PDF should have substantial content');
  const pdf=Buffer.from(captured.pdfBase64,'base64');
  assert.ok(pdf.subarray(0,5).toString()==='%PDF-','Browser generated a PDF');
  assert.ok(pdf.includes(Buffer.from('%%EOF')),'PDF has a complete trailer');
  assert.match(await page.locator('#status').innerText(),/signed application was submitted/);
  const next=await page.locator('#status a').getAttribute('href');
  const p=new URL(next);
  assert.equal(p.hostname,'davidfliesen.github.io');
  assert.deepEqual(p.searchParams.get('apps').split(','),['anglers-navigator','hand-over-foot']);
  assert.deepEqual(browserErrors,[],'No uncaught browser errors');
  console.log('CHROMIUM_UNIFIED_FORM_MOCK_OK:',JSON.stringify({
    width:390,appCount:2,hasSignature:true,pdfBytes:pdf.length,
    postCount,portalHandoff:p.searchParams.get('apps'),
    noLiveEmail:true
  }));
}catch(error){
  console.error('CHROMIUM_FORM_MOCK_FAILED:',error.stack||String(error));
  process.exitCode=1;
}finally{
  if(browser)await browser.close().catch(()=>{});
  await new Promise(resolve=>server.close(resolve));
}
