import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
const css=async scoped=>(await Promise.all([`dist/reva.${scoped?'scoped.':''}css`,`dist/reva.glass${scoped?'.scoped':''}.css`].map(p=>readFile(p,'utf8')))).join('\n');
const rgba=(page,selector,property='backgroundColor')=>page.locator(selector).evaluate((el,p)=>{const c=document.createElement('canvas').getContext('2d');c.fillStyle=getComputedStyle(el)[p];c.fillRect(0,0,1,1);return [...c.getImageData(0,0,1,1).data];},property);
const filter=(page,selector)=>page.locator(selector).evaluate(el=>getComputedStyle(el).backdropFilter||getComputedStyle(el).webkitBackdropFilter);
const pixels=async(page,selector,points)=>{
 const box=await page.locator(selector).boundingBox();
 const png=await page.screenshot({animations:'disabled',scale:'css'});
 points=points.map(([x,y])=>[Math.round(box.x)+x,Math.round(box.y)+y]);
 return page.evaluate(async({url,points})=>{const img=new Image();img.src=url;await img.decode();const c=document.createElement('canvas');c.width=img.width;c.height=img.height;const ctx=c.getContext('2d');ctx.drawImage(img,0,0);return points.map(([x,y])=>[...ctx.getImageData(x,y,1,1).data]);},{url:'data:image/png;base64,'+png.toString('base64'),points});
};
for(const theme of ['light','dark']) test(`${theme} glass visibly transmits the backdrop and matches native blur rendering`,async({page,browserName})=>{
 await page.goto('/plain/');await page.setContent(`<main data-material="glass" data-theme="${theme}" id="stage"><article class="card" id="paint" aria-label="Glass sample"></article></main>`);
 await page.addStyleTag({content:await css(false)});
 await page.addStyleTag({content:'body{margin:0}#stage{padding:48px;background:black}#paint{width:240px;height:120px}'});
 const sample=async()=> (await pixels(page,'#paint',[[120,60]]))[0];
 const black=await sample();await page.locator('#stage').evaluate(el=>el.style.background='white');const white=await sample();
 // Old 90% backing transmitted only about 25 RGB steps; the corrected paint
 // must visibly transmit at least a quarter of the backdrop through its sheen.
 for(let i=0;i<3;i++) expect(white[i]-black[i]).toBeGreaterThanOrEqual(64);
 expect((await rgba(page,'#paint'))[3]/255).toBeCloseTo(.7,2);expect(await filter(page,'#paint')).toContain('16px');
 // Compare two simultaneously painted samples, rather than changing the
 // compositor filter on one sample between captures.
 await page.setContent(`<main data-material="glass" data-theme="${theme}" id="checker"><article class="card" id="blurred" aria-label="Blurred sample"></article><article class="card" id="sharp" aria-label="Sharp sample"></article><div id="oracle"></div></main>`);
 await page.addStyleTag({content:await css(false)});
 await page.addStyleTag({content:'body{margin:0}#checker{padding:48px;display:flex;gap:48px;background:repeating-linear-gradient(90deg,black 0 12px,white 12px 24px)}#checker .card{width:240px;height:120px;flex:none}#sharp{backdrop-filter:none;-webkit-backdrop-filter:none}#oracle{width:240px;height:120px;flex:none;position:relative;background:rgb(255 255 255 / 70%);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px)}'});
 await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
 const blurred=await pixels(page,'#blurred',[[100,60],[112,60]]);
 const sharp=await pixels(page,'#sharp',[[100,60],[112,60]]);
 const oracle=await pixels(page,'#oracle',[[100,60],[112,60]]);
 const frameworkDifference=Math.abs(blurred[0][0]-blurred[1][0]), nativeDifference=Math.abs(oracle[0][0]-oracle[1][0]);
 expect(Math.abs(sharp[0][0]-sharp[1][0])).toBeGreaterThanOrEqual(64);
 expect(await filter(page,'#blurred')).toContain('16px');
 if(nativeDifference<24) {
  expect(frameworkDifference).toBeLessThan(24);
 } else {
  // A native control distinguishes capture/backend limitations from CSS bugs.
  // Do not claim rendered blur when even the plain CSS control cannot paint it.
  expect(nativeDifference).toBeGreaterThanOrEqual(64);
  expect(frameworkDifference).toBeGreaterThanOrEqual(64);
  expect(Math.abs(frameworkDifference-nativeDifference)).toBeLessThan(6);
  test.info().annotations.push({type:'native-blur-capture-limit',description:`${browserName}: native blur is absent in this capture; real-browser blur remains a manual release check.`});
  console.log(`Native blur capture limitation: ${browserName}; transparency verified, actual blur requires a real-browser check.`);
 }
});
for(const scoped of [false,true]) test(`${scoped?'scoped':'global'} readable glass colours inherit through local themes and material resets`,async({page})=>{
 await page.goto('/plain/');await page.setContent(`<main ${scoped?'class="reva"':''} data-material="glass" data-theme="light"><article class="card" id="card"><figure><figcaption id="muted">Supporting text</figcaption></figure><a href="#card" id="link">Link</a><input aria-label="Name" id="field"><button id="action">Continue</button><section data-theme="dark"><figure><figcaption id="dark-muted">Dark supporting text</figcaption></figure><a href="#card" id="dark-link">Dark link</a></section><section data-material="solid"><article class="card" id="solid"><figure><figcaption id="solid-muted">Normal supporting text</figcaption></figure><a href="#card" id="solid-link">Normal link</a></article><article class="card" data-material="glass" id="reentry"><a href="#card" id="reentry-link">Glass link</a></article></section></article></main>`);
 await page.addStyleTag({content:await css(scoped)});
 expect((await rgba(page,'#card'))[3]/255).toBeCloseTo(.7,2);
 expect((await rgba(page,'#action'))[3]/255).toBeCloseTo(.9,2);
 expect(await rgba(page,'#field','borderTopColor')).toEqual([24,32,45,255]);
 expect(await rgba(page,'#muted','color')).toEqual([24,32,45,255]);expect(await rgba(page,'#link','color')).toEqual([24,42,135,255]);
 expect(await rgba(page,'#dark-muted','color')).toEqual([242,245,252,255]);expect(await rgba(page,'#dark-link','color')).toEqual([234,240,255,255]);
 expect(await rgba(page,'#solid-muted','color')).toEqual([82,96,115,255]);expect(await rgba(page,'#solid-link','color')).toEqual([36,56,184,255]);expect((await rgba(page,'#solid'))[3]).toBe(255);
 expect(await rgba(page,'#reentry-link','color')).toEqual([24,42,135,255]);expect((await rgba(page,'#reentry'))[3]/255).toBeCloseTo(.7,2);
 await page.locator('#card').evaluate(el=>el.dataset.contrast='more');expect((await rgba(page,'#card'))[3]).toBe(255);expect(await filter(page,'#card')).toBe('none');
 await page.locator('#card').evaluate(el=>el.dataset.contrast='auto');expect((await rgba(page,'#card'))[3]/255).toBeCloseTo(.7,2);
});

for(const scoped of [false,true]) test(`${scoped?'scoped':'global'} glass theme wrappers leave rounded corners and layout gaps transparent`,async({page})=>{
 await page.goto('/plain/');
 await page.setContent(`<main ${scoped?'class="reva"':''} id="stage"><section class="stack" data-material="glass" data-theme="dark" data-tone="cool" data-depth="flat" id="wrapper"><article class="card" id="rounded">Frosted surface</article><section data-material="solid" id="reset"><article class="card" id="opaque">Opaque reset</article><section data-theme="light" id="solid-theme">Solid theme wrapper</section><article class="card" data-material="glass" data-theme="light" id="resume">Glass re-entry</article></section></section></main>`);
 await page.addStyleTag({content:await css(scoped)});
 await page.addStyleTag({content:'#stage{padding:40px;background:rgb(200 80 120)}#rounded{height:160px;border-radius:32px}'});
 expect((await rgba(page,'#wrapper'))[3]).toBe(0);
 expect((await rgba(page,'#rounded'))[3]/255).toBeCloseTo(.7,2);
 expect((await rgba(page,'#opaque'))[3]).toBe(255);
 expect((await rgba(page,'#solid-theme'))[3]).toBe(255);
 expect((await rgba(page,'#resume'))[3]/255).toBeCloseTo(.7,2);
 expect(await rgba(page,'#rounded','color')).toEqual([242,245,252,255]);
 const card=await page.locator('#rounded').boundingBox(), reset=await page.locator('#reset').boundingBox();
 expect(reset.y-card.y-card.height).toBeGreaterThanOrEqual(15.99);
 const samples=await pixels(page,'#rounded',[[1,1],[5,5],[20,card.height+8]]);
 for(const sample of samples) expect(sample).toEqual([200,80,120,255]);
});
test('glass documentation separates the surface and solid reset at desktop and phone widths',async({page})=>{
 for(const width of [1280,375]) {
  await page.setViewportSize({width,height:900});await page.goto('/themes/glass/');
  const wrapper=page.locator('#glass-surface .example-demo > section');
  expect((await rgba(page,'#glass-surface .example-demo > section'))[3]).toBe(0);
  const card=await wrapper.locator(':scope > .card').boundingBox();
  const reset=await wrapper.locator(':scope > section').boundingBox();
  expect(reset.y-card.y-card.height).toBeGreaterThanOrEqual(15.99);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
});
