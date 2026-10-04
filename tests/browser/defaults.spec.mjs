import { expectOnlyOptionalSettings } from './helpers/settings.mjs';
import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
const require=createRequire(import.meta.url);
const rootSettings={width:'narrow',table:'striped',size:'large',ratio:'square',fit:'contain',gap:'large'};
const style = (page, selector, property) => page.locator(selector).first().evaluate((el,p)=>getComputedStyle(el)[p],property);
const pixel = (page, selector, property='backgroundColor') => page.locator(selector).first().evaluate((el,p)=>{
 const ctx=document.createElement('canvas').getContext('2d');ctx.fillStyle=getComputedStyle(el)[p];ctx.fillRect(0,0,1,1);return [...ctx.getImageData(0,0,1,1).data];
},property);
async function checkDefaults(page) {
 for (const selector of ['#defaults-button','#defaults-link','#defaults-input','#defaults-select','#defaults-textarea']) expect(await style(page,selector,'fontSize')).toBe('18px');
 expect(await style(page,'#defaults-text','fontSize')).toBe('16px');
 expect(await style(page,'#defaults-row','gap')).toBe('32px');
 expect(await style(page,'#defaults-stack','gap')).toBe('32px');
 expect(await style(page,'#defaults-container','width')).toBe('768px');
 expect(await pixel(page,'#defaults-table tbody tr:nth-child(2)')).not.toEqual([0,0,0,0]);
 expect(await style(page,'#defaults-table td','borderInlineStartWidth')).toBe('0px');
 expect(await style(page,'#defaults-image','aspectRatio')).toBe('1 / 1');
 expect(await style(page,'#defaults-image','objectFit')).toBe('contain');
 expect(await style(page,'#defaults-image','height')).toBe('320px');
 expect(await style(page,'#defaults-reset-button','fontSize')).toBe('16px');
 expect(await style(page,'#defaults-reset-stack','gap')).toBe('16px');
 expect(await pixel(page,'#defaults-reset-table tbody tr:nth-child(2)')).toEqual([0,0,0,0]);
 expect(await style(page,'#defaults-reset-image','aspectRatio')).toBe('auto');
 expect(await style(page,'#defaults-reset-image','objectFit')).toBe('cover');
 expect(await style(page,'#defaults-reset-image','height')).toBe('180px');
}
for (const theme of ['light','dark']) test(`${theme} html defaults and neutral resets work without JavaScript`,async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:1280,height:900}});
 const page=await context.newPage();await page.goto(`/preview/defaults/${theme}/`);
 for(const [key,value] of Object.entries(rootSettings)) await expect(page.locator('html')).toHaveAttribute('data-'+key,value);
 await checkDefaults(page);await expectOnlyOptionalSettings(page);await context.close();
});
for (const build of ['minified','modular','scoped']) test(`${build} builds support inherited defaults`,async({page})=>{
 const css=build==='modular'?(await Promise.all(['tokens','base','components'].map(name=>readFile(`dist/reva.${name}.css`,'utf8')))).join('\n'):await readFile(`dist/reva.${build==='minified'?'min':'scoped'}.css`,'utf8');
 await page.route('**/reva/reva.css*',route=>route.fulfill({contentType:'text/css',body:css}));
 await page.setViewportSize({width:1280,height:900});await page.goto('/preview/defaults/light/');
 if(build==='scoped') {
  await page.locator('main').evaluate((el,settings)=>{el.className='reva';el.dataset.theme='light';Object.assign(el.dataset,settings);const outside=document.createElement('img');outside.id='outside-image';outside.dataset.ratio='square';outside.dataset.fit='contain';el.after(outside);},rootSettings);
  expect(await style(page,'#outside-image','aspectRatio')).toBe('auto');
  expect(await style(page,'#outside-image','objectFit')).toBe('fill');
 }
 await checkDefaults(page);
});
test('nearest settings, valid resets and invalid values preserve other defaults',async({page})=>{
 await page.setViewportSize({width:1600,height:900});await page.goto('/preview/defaults/light/');
 await page.evaluate(()=>{
  const inherited=document.querySelector('#defaults-container');inherited.dataset.size='small';inherited.dataset.table='bordered';inherited.dataset.gap='small';inherited.dataset.ratio='portrait';
  document.querySelector('#defaults-button').dataset.size='medium';
  document.querySelector('#defaults-image').dataset.ratio='auto';
  const section=document.createElement('section');section.dataset.width='standard';section.innerHTML='<div class="container" id="width-reset">Standard width</div>';document.querySelector('main').append(section);
 });
 expect(await style(page,'#defaults-button','fontSize')).toBe('16px');
 expect(await style(page,'#defaults-input','fontSize')).toBe('14px');
 expect(await style(page,'#defaults-stack','gap')).toBe('8px');
 expect(await style(page,'#defaults-table td','borderInlineStartWidth')).toBe('1px');
 expect(await pixel(page,'#defaults-table tbody tr:nth-child(2)')).toEqual([0,0,0,0]);
 expect(await style(page,'#defaults-image','aspectRatio')).toBe('auto');
 expect(await style(page,'#defaults-image','objectFit')).toBe('contain');
 expect(await style(page,'#width-reset','width')).toBe('1200px');
 expect(await style(page,'#defaults-reset-table td','borderInlineStartWidth')).toBe('0px');
 await page.locator('#defaults-container').evaluate(el=>{el.dataset.size='unknown';el.dataset.table='unknown';el.dataset.gap='unknown';el.dataset.ratio='unknown';});
 expect(await style(page,'#defaults-input','fontSize')).toBe('18px');
 expect(await style(page,'#defaults-stack','gap')).toBe('32px');
 expect(await style(page,'#defaults-table td','borderInlineStartWidth')).toBe('0px');
 expect(await pixel(page,'#defaults-table tbody tr:nth-child(2)')).not.toEqual([0,0,0,0]);
});
test('inherited stripes resolve local tones and gap presets follow local density',async({page})=>{
 await page.goto('/preview/defaults/light/');
 await page.locator('#defaults-table').evaluate(el=>{el.dataset.theme='dark';el.dataset.tone='warm';});
 const actual=await pixel(page,'#defaults-table tbody tr:nth-child(2)');
 expect(actual).toEqual([53,46,38,255]);
 await page.locator('#defaults-container').evaluate(el=>el.dataset.density='compact');
 expect(Number.parseFloat(await style(page,'#defaults-stack','gap'))).toBeCloseTo(25.6,4);
 expect(Number.parseFloat(await style(page,'#defaults-reset-stack','gap'))).toBeCloseTo(12.8,4);
 await page.locator('#defaults-container').evaluate(el=>el.dataset.density='spacious');
 expect(await style(page,'#defaults-stack','gap')).toBe('40px');
 expect(await style(page,'#defaults-reset-stack','gap')).toBe('20px');
});
test('unconfigured native elements preserve default styling',async({page})=>{
 await page.goto('/preview/light/');
 await page.evaluate(()=>{const probe=document.createElement('section');probe.id='default-probe';probe.innerHTML='<div class="stack"><button type="button">Default</button><table><tbody><tr><td>One</td></tr><tr><td>Two</td></tr></tbody></table><img width="320" height="180" src="/images/example-landscape.svg" alt="Hills"></div>';document.body.append(probe);});
 expect(await style(page,'#default-probe button','fontSize')).toBe('16px');
 expect(await style(page,'#default-probe .stack','gap')).toBe('16px');
 expect(await style(page,'#default-probe td','borderInlineStartWidth')).toBe('0px');
 expect(await pixel(page,'#default-probe tr:nth-child(2)')).toEqual([0,0,0,0]);
 expect(await style(page,'#default-probe img','aspectRatio')).toBe('auto');
});
test('ordinary custom CSS overrides inherited component defaults',async({page})=>{
 await page.goto('/preview/defaults/light/');await page.addStyleTag({content:'#defaults-button { font-size:21px; } #defaults-stack { gap:7px; } #defaults-container { width:555px; } #defaults-image { aspect-ratio:4 / 3; object-fit:cover; } #defaults-table td { border:3px solid currentColor; }'});
 expect(await style(page,'#defaults-button','fontSize')).toBe('21px');expect(await style(page,'#defaults-stack','gap')).toBe('7px');expect(await style(page,'#defaults-container','width')).toBe('555px');expect(await style(page,'#defaults-image','aspectRatio')).toBe('4 / 3');expect(await style(page,'#defaults-image','objectFit')).toBe('cover');expect(await style(page,'#defaults-table td','borderInlineStartWidth')).toBe('3px');
});
for(const theme of ['light','dark']) test(`${theme} page-wide defaults reflow and pass automated accessibility checks`,async({page})=>{
 await page.setViewportSize({width:320,height:900});await page.goto(`/preview/defaults/${theme}/`);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.addScriptTag({path:require.resolve('axe-core')});
 const violations=await page.evaluate(async()=> (await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}})).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})));
 expect(violations).toEqual([]);
});

test('all inherited component presets produce their intended geometry',async({page})=>{
 await page.setViewportSize({width:1600,height:1000});await page.goto('/preview/defaults/light/');
 for(const [value,width] of [['narrow',768],['standard',1200],['wide',1440]]) {
  await page.locator('html').evaluate((el,value)=>el.dataset.width=value,value);
  expect(Number.parseFloat(await style(page,'#defaults-container','width'))).toBe(width);
 }
 for(const [value,font] of [['small',14],['medium',16],['large',18]]) {
  await page.locator('html').evaluate((el,value)=>el.dataset.size=value,value);
  expect(Number.parseFloat(await style(page,'#defaults-input','fontSize'))).toBe(font);
 }
 for(const [value,height] of [['auto',180],['square',320],['landscape',240],['portrait',320*4/3],['wide',180]]) {
  await page.locator('html').evaluate((el,value)=>el.dataset.ratio=value,value);
  expect(Number.parseFloat(await style(page,'#defaults-image','height'))).toBeCloseTo(height,1);
 }
 for(const [value,gap] of [['none',0],['small',8],['medium',16],['large',32]]) {
  await page.locator('html').evaluate((el,value)=>el.dataset.gap=value,value);
  expect(Number.parseFloat(await style(page,'#defaults-row','gap'))).toBe(gap);
 }
 for(const value of ['cover','contain']) {
  await page.locator('html').evaluate((el,value)=>el.dataset.fit=value,value);
  expect(await style(page,'#defaults-image','objectFit')).toBe(value);
 }
 for(const value of ['plain','striped','bordered']) {
  await page.locator('html').evaluate((el,value)=>el.dataset.table=value,value);
  expect(await style(page,'#defaults-table td','borderInlineStartWidth')).toBe(value==='bordered'?'1px':'0px');
  const background=await pixel(page,'#defaults-table tbody tr:nth-child(2)');
  expect(background[3]).toBe(value==='striped'?255:0);
 }
});
