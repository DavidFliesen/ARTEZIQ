/**
 * Browser CORS smoke test for ARTEZIQ's deployed, separate unified endpoint.
 * STRICTLY INVALID POST: sends only '{}' as text/plain, which must fail validation
 * BEFORE quota reservation and MailApp. NEVER submit a real application from CI.
 */
import { createServer } from 'node:http';
import { chromium } from 'playwright-core';

const ENDPOINT='https://script.google.com/macros/s/AKfycbykzFI9zXYY_xqVyicbcKPGaTdP-E7loiFU9u9DzsCHfY5Wdc0Oe6ZucTu6aBv8Ligo/exec';
const server=createServer((request,response)=>{
  response.writeHead(200,{'Content-Type':'text/html','Cache-Control':'no-store'});
  response.end('<!doctype html><title>ARTEZIQ unified endpoint browser smoke test</title>');
});
let browser;
try{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const port=server.address().port;
  const chromePath=process.env.CHROME_PATH||'/usr/bin/google-chrome';
  browser=await chromium.launch({executablePath:chromePath,headless:true,args:['--no-sandbox']});
  const page=await browser.newPage();
  const errors=[];
  page.on('console',message=>{
    if(message.type()==='error') errors.push(message.text().slice(0,250));
  });
  await page.goto('http://127.0.0.1:'+port+'/',{waitUntil:'load'});
  const result=await page.evaluate(async endpoint=>{
    const controller=new AbortController();
    const timer=setTimeout(()=>controller.abort(),25000);
    try {
      const response=await fetch(endpoint,{
        method:'POST',
        headers:{'Content-Type':'text/plain;charset=utf-8'},
        body:'{}', // intentionally invalid: does not include any applicant fields or PDF
        redirect:'follow',
        credentials:'omit',
        signal:controller.signal
      });
      let text='';
      try{text=await response.text()}catch(e){text='BODY_READ_FAILED: '+String(e)}
      let parsed;
      try{parsed=JSON.parse(text)}catch{}
      return {mode:'response',status:response.status,ok:response.ok,
        parsed:parsed?{ok:parsed.ok,error:parsed.error,status:parsed.status}:null,
        bodyPreview:text.slice(0,180)};
    }catch(error){
      return {mode:'fetch-error',errorName:error.name,errorMessage:error.message};
    }finally{clearTimeout(timer)}
  },ENDPOINT);
  console.log('BROWSER_INVALID_POST_RESULT:',JSON.stringify(result));
  if(errors.length) console.log('BROWSER_CONSOLE_ERRORS:',JSON.stringify(errors));
  if(result.mode!=='response'||result.status!==200||result.parsed?.ok!==false){
    console.error('BROWSER_INVALID_POST_CANNOT_CONFIRM_JSON_ERROR; do not allow real user submissions yet.');
    process.exitCode=1;
  }else{
    console.log('BROWSER_INVALID_POST_REJECTED_AS_EXPECTED: no NDA or recipient data was submitted.');
  }
}catch(error){
  console.error('BROWSER_TEST_INFRA_ERROR:',error.stack||String(error));
  process.exitCode=1;
}finally{
  if(browser)await browser.close().catch(()=>{});
  await new Promise(resolve=>server.close(resolve));
}
