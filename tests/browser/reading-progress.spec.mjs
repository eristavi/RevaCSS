import {test,expect} from '@playwright/test';
test.use({javaScriptEnabled:false});
async function fixture(page,request,{scoped=false,long=true}={}) {
  const files=scoped?['reva.scoped.css','reva.reading-progress.scoped.css']:['reva.css','reva.reading-progress.css'];
  const css=await Promise.all(files.map(async file=>{const response=await request.get('/reva/'+file);expect(response.ok()).toBe(true);return response.text();}));
  await page.setContent(`<!doctype html><html lang="en"><head><style>${css.join('\n')}html{scroll-behavior:auto}body{margin:0}</style></head><body><div ${scoped?'class="reva"':''}><div id="bar" data-reading-progress="page" aria-hidden="true"></div><div id="none" data-reading-progress="none" aria-hidden="true"></div><div id="invalid" data-reading-progress="invalid" aria-hidden="true"></div><main style="height:${long?'4000':'100'}px"><h1>Reading fixture</h1><a href="#end">Jump to end</a><p id="end">Content</p></main></div>${scoped?'<div id="outside" data-reading-progress="page" aria-hidden="true"></div>':''}</body></html>`);
}
const fraction=locator=>locator.evaluate(el=>Number.parseFloat(getComputedStyle(el).scale));
for(const scoped of [false,true])test(`page indicator follows root scroll and reverses (${scoped?'scoped':'global'})`,async({page,request})=>{
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.setViewportSize({width:375,height:700});
  await fixture(page,request,{scoped});
  const bar=page.locator('#bar');
  await expect(page.locator('#none')).toHaveCSS('display','none');await expect(page.locator('#invalid')).toHaveCSS('display','none');
  const supported=await page.evaluate(()=>CSS.supports('animation-timeline','scroll(root block)')&&CSS.supports('animation-duration','auto'));
  if(!supported){await expect(bar).toHaveCSS('display','none');return;}
  await expect(bar).toHaveCSS('pointer-events','none');
  await expect.poll(()=>fraction(bar)).toBeLessThan(.01);
  await page.evaluate(()=>scrollTo(0,(document.documentElement.scrollHeight-innerHeight)/2));
  await expect.poll(()=>fraction(bar)).toBeGreaterThan(.48);await expect.poll(()=>fraction(bar)).toBeLessThan(.52);
  await page.evaluate(()=>scrollTo(0,document.documentElement.scrollHeight));await expect.poll(()=>fraction(bar)).toBeGreaterThan(.99);
  await page.evaluate(()=>scrollTo(0,0));await expect.poll(()=>fraction(bar)).toBeLessThan(.01);
  await page.evaluate(()=>document.documentElement.dir='rtl');expect(await bar.evaluate(el=>{const s=getComputedStyle(el);return Math.abs(Number.parseFloat(s.transformOrigin)-el.getBoundingClientRect().width)<1;})).toBe(true);
  if(scoped)await expect(page.locator('#outside')).toHaveCSS('animation-name','none');
  await page.evaluate(()=>document.body.setAttribute('data-motion','none'));await expect(bar).toHaveCSS('display',scoped?'block':'none');
  // Each .reva boundary starts its own defaults. A local setting still applies.
  await bar.evaluate(el=>el.parentElement.setAttribute('data-motion','none'));await expect(bar).toHaveCSS('display','none');
  await bar.evaluate(el=>el.setAttribute('data-motion','subtle'));await expect(bar).toHaveCSS('display','block');
  await page.emulateMedia({reducedMotion:'reduce'});await expect(bar).toHaveCSS('display','none');
  await page.emulateMedia({reducedMotion:'no-preference',forcedColors:'active'});await expect(bar).toHaveCSS('display','none');
  await page.emulateMedia({forcedColors:'none',media:'print'});await expect(bar).toHaveCSS('display','none');
});
test('a page without overflow never presents a full progress bar',async({page,request})=>{
  await page.emulateMedia({reducedMotion:'no-preference'});await page.setViewportSize({width:375,height:700});await fixture(page,request,{long:false});
  if(!await page.evaluate(()=>CSS.supports('animation-timeline','scroll(root block)')&&CSS.supports('animation-duration','auto'))){await expect(page.locator('#bar')).toHaveCSS('display','none');return;}
  await expect.poll(()=>fraction(page.locator('#bar'))).toBe(0);
});
