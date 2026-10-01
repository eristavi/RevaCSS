import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
const css=async scoped=>(await Promise.all([`dist/reva.${scoped?'scoped.':''}css`,`dist/reva.glass${scoped?'.scoped':''}.css`].map(p=>readFile(p,'utf8')))).join('\n');
const rgba=(page,selector,property='backgroundColor')=>page.locator(selector).evaluate((el,p)=>{const c=document.createElement('canvas').getContext('2d');c.fillStyle=getComputedStyle(el)[p];c.fillRect(0,0,1,1);return [...c.getImageData(0,0,1,1).data];},property);
const filter=(page,selector)=>page.locator(selector).evaluate(el=>getComputedStyle(el).backdropFilter||getComputedStyle(el).webkitBackdropFilter);
const pixels=async(page,selector,points)=>{
 const png=await page.locator(selector).screenshot({animations:'disabled'});
 return page.evaluate(async({url,points})=>{const img=new Image();img.src=url;await img.decode();const c=document.createElement('canvas');c.width=img.width;c.height=img.height;const ctx=c.getContext('2d');ctx.drawImage(img,0,0);return points.map(([x,y])=>[...ctx.getImageData(x,y,1,1).data]);},{url:'data:image/png;base64,'+png.toString('base64'),points});
};
for(const theme of ['light','dark']) test(`${theme} glass visibly transmits the backdrop and renders actual blur`,async({page})=>{
 await page.goto('/plain/');await page.setContent(`<main data-material="glass" data-theme="${theme}" id="stage"><article class="card" id="paint" aria-label="Glass sample"></article></main>`);
 await page.addStyleTag({content:await css(false)});
 await page.addStyleTag({content:'body{margin:0}#stage{padding:48px;background:black}#paint{width:240px;height:120px}'});
 const sample=async()=> (await pixels(page,'#paint',[[120,60]]))[0];
 const black=await sample();await page.locator('#stage').evaluate(el=>el.style.background='white');const white=await sample();
 // Old 90% backing transmitted only about 25 RGB steps; the corrected paint
 // must visibly transmit at least a quarter of the backdrop through its sheen.
 for(let i=0;i<3;i++) expect(white[i]-black[i]).toBeGreaterThanOrEqual(64);
 expect((await rgba(page,'#paint'))[3]/255).toBeCloseTo(.7,2);expect(await filter(page,'#paint')).toContain('16px');
 await page.locator('#stage').evaluate(el=>el.style.background='repeating-linear-gradient(90deg, black 0 12px, white 12px 24px)');
 const blurred=await pixels(page,'#paint',[[100,60],[112,60]]);
 await page.locator('#paint').evaluate(el=>{el.style.backdropFilter='none';el.style.webkitBackdropFilter='none';});
 const sharp=await pixels(page,'#paint',[[100,60],[112,60]]);
 expect(Math.abs(sharp[0][0]-sharp[1][0])).toBeGreaterThanOrEqual(64);
 expect(Math.abs(blurred[0][0]-blurred[1][0])).toBeLessThan(24);
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
