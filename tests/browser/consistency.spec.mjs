import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
const style=(page,selector,property)=>page.locator(selector).evaluate((el,p)=>getComputedStyle(el)[p],property);
const markup=`<article class="card" id="probe-card"><button id="probe-button">Action</button><input id="probe-input" aria-label="Name"><select id="probe-select" aria-label="Choice"><option>One</option></select><textarea id="probe-textarea" aria-label="Message"></textarea><fieldset id="probe-fieldset"><legend>Group</legend></fieldset><details id="probe-details"><summary>Details</summary>Content</details><dialog id="probe-dialog">Dialog</dialog><div popover id="probe-popover">Popover</div><code id="probe-code">Source</code><table id="probe-table"><caption>Data</caption><thead><tr><th>Heading</th></tr></thead><tbody><tr><td id="probe-cell">One</td></tr><tr><td>Two</td></tr></tbody></table><img id="probe-image" alt="Landscape" src="/images/example-landscape.svg" width="320" height="180"><video id="probe-video" width="320" height="180"></video><nav class="top-menu" id="probe-menu" aria-label="Probe"><ul class="menu-items menu-desktop"><li><details class="menu-dropdown" open><summary id="probe-action">Products</summary><ul class="menu-panel" id="probe-panel"><li><a href="#probe-card">Item</a></li></ul></details></li></ul></nav><section id="probe-local" data-shape="square" data-border="none"><button id="probe-reset">Reset</button><input id="probe-reset-input" aria-label="Local name"><table data-table="bordered"><tbody><tr><td id="probe-reset-cell">Local</td></tr></tbody></table></section></article>`;
for(const build of ['global','minified','modular','scoped']) test(`${build} shared appearance reaches every supported surface and local overrides`,async({page})=>{
 const css=build==='modular'?(await Promise.all(['tokens','base','components'].map(n=>readFile(`dist/reva.${n}.css`,'utf8')))).join('\n'):await readFile(`dist/reva.${build==='global'?'css':build==='minified'?'min.css':'scoped.css'}`,'utf8');
 await page.goto('/plain/');await page.locator('link[rel=stylesheet]').evaluateAll(els=>els.forEach(el=>el.remove()));await page.addStyleTag({content:css});
 await page.evaluate(({markup,scoped})=>{document.body.innerHTML=`<main id="probe-root"${scoped?' class="reva"':''}>${markup}</main>`; const root=scoped?document.querySelector('main'):document.documentElement;root.dataset.theme='dark';root.dataset.table='bordered';}, {markup,scoped:build==='scoped'});
 const root=build==='scoped'?'#probe-root':'html';
 for(const [shape,radius,buttonRadius] of [['square',0,0],['subtle',4.8,4.8],['rounded',12,12],['pill',24,999]]) {
  await page.locator(root).evaluate((el,value)=>el.dataset.shape=value,shape);
  for(const id of ['card','input','select','textarea','fieldset','details','dialog','popover','table','image','video','menu','panel']) expect(parseFloat(await style(page,'#probe-'+id,'borderTopLeftRadius')),id).toBeCloseTo(radius,2);
  expect(parseFloat(await style(page,'#probe-table th','borderTopLeftRadius'))).toBeCloseTo(radius,2);
  expect(parseFloat(await style(page,'#probe-button','borderTopLeftRadius'))).toBe(buttonRadius);
  expect(parseFloat(await style(page,'#probe-code','borderTopLeftRadius'))).toBeCloseTo(Math.min(radius,3.6),2);
  expect(await style(page,'#probe-reset','borderTopLeftRadius')).toBe('0px');
 }
 for(const [border,width] of [['none','0px'],['subtle','1px'],['defined','2px']]) {
  await page.locator(root).evaluate((el,value)=>el.dataset.border=value,border);
  for(const id of ['card','input','select','textarea','fieldset','details','dialog','popover','menu','panel','button']) expect(await style(page,'#probe-'+id,'borderTopWidth'),id).toBe(width);
  expect(await style(page,'#probe-cell','borderInlineStartWidth')).toBe(width);
  expect(await style(page,'#probe-reset-input','borderTopWidth')).toBe('0px');
  expect(await style(page,'#probe-reset-cell','borderInlineStartWidth')).toBe('0px');
 }
 await page.locator(root).evaluate(el=>{el.dataset.depth='flat';el.dataset.size='large';el.dataset.motion='none';el.dataset.ratio='square';el.dataset.fit='contain';});
 for(const id of ['card','fieldset','details','dialog','popover','menu','panel','button']) expect(await style(page,'#probe-'+id,'boxShadow')).toBe('none');
 for(const id of ['button','input','select','textarea','action']) expect(await style(page,'#probe-'+id,'fontSize')).toBe('18px');
 for(const id of ['image','video']) {expect(await style(page,'#probe-'+id,'aspectRatio')).toBe('1 / 1');expect(await style(page,'#probe-'+id,'objectFit')).toBe('contain');}
 expect(await style(page,'#probe-button','transitionDuration')).toBe('0s, 0s');
 await page.locator('#probe-reset-input').evaluate(el=>el.setAttribute('aria-invalid','true'));expect(await style(page,'#probe-reset-input','borderTopWidth')).toBe('2px');
 if(build==='scoped') {await page.locator('main').evaluate(el=>{const outside=document.createElement('button');outside.id='probe-outside';outside.textContent='Outside';el.after(outside);});expect(await style(page,'#probe-outside','backgroundImage')).toBe('none');}
});
test('a theme alone supplies complete defaults and switching theme preserves geometry',async({page})=>{
 await page.goto('/plain/');await page.evaluate(markup=>{document.body.innerHTML=`<main>${markup}</main>`;document.documentElement.dataset.theme='light';},markup);
 const before=await page.locator('#probe-card').evaluate(el=>{const s=getComputedStyle(el);return {radius:s.borderRadius,padding:s.padding,border:s.borderTopWidth,shadow:s.boxShadow,background:s.backgroundColor};});
 expect(before.radius).toBe('12px');expect(before.padding).toBe('24px');expect(before.border).toBe('1px');expect(before.background).toBe('rgb(255, 255, 255)');expect(await style(page,'#probe-button','fontSize')).toBe('16px');
 await page.locator('html').evaluate(el=>el.dataset.theme='dark');
 const after=await page.locator('#probe-card').evaluate(el=>{const s=getComputedStyle(el);return {radius:s.borderRadius,padding:s.padding,border:s.borderTopWidth,shadow:s.boxShadow,background:s.backgroundColor};});
 expect(after).toEqual({...before,background:'rgb(26, 32, 48)'});
 expect(await style(page,'#probe-input','color')).toBe('rgb(242, 245, 252)');
});
