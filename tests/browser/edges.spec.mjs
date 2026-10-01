import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
const pseudo=(page,selector,property)=>page.locator(selector).evaluate((el,p)=>getComputedStyle(el,'::after').getPropertyValue(p),property);
const style=(page,selector,property)=>page.locator(selector).evaluate((el,p)=>getComputedStyle(el).getPropertyValue(p),property);
const fixture='<article class="card" id="card"><h1>Edges</h1><button id="action">Continue</button><a href="#card" class="button secondary" id="link">Back</a><button id="plain" data-edge="plain">Plain</button><button disabled id="disabled">Unavailable</button><input type="button" value="Native action" id="native"></article>';
for(const build of ['global','minified','modular','scoped']) test(`${build} edges inherit and reset without changing component geometry`,async({page})=>{
 const css=build==='modular'?(await Promise.all(['tokens','base','components'].map(n=>readFile(`dist/reva.${n}.css`,'utf8')))).join('\n'):await readFile(`dist/reva.${build==='global'?'css':build==='minified'?'min.css':'scoped.css'}`,'utf8');
 await page.goto('/plain/');await page.locator('link[rel=stylesheet]').evaluateAll(els=>els.forEach(el=>el.remove()));await page.addStyleTag({content:css});
 await page.evaluate(({fixture,scoped})=>{document.body.innerHTML=`<main${scoped?' class="reva"':''}>${fixture}</main><button id="outside">Outside</button>`;}, {fixture,scoped:build==='scoped'});
 const root=build==='scoped'?'main':'html';
 const before=await page.locator('#action').boundingBox();expect(await pseudo(page,'#action','content')).toBe('none');
 await page.locator(root).evaluate(el=>{el.dataset.edge='animated';el.dataset.shape='pill';el.dataset.border='defined';el.dataset.accent='teal';});
 for(const id of ['action','link','card']) {expect(await pseudo(page,'#'+id,'content')).toBe('""');expect(await pseudo(page,'#'+id,'animation-name')).toBe('re-edge-turn');expect(await pseudo(page,'#'+id,'padding-top')).toBe('2px');expect(await pseudo(page,'#'+id,'pointer-events')).toBe('none');expect(await pseudo(page,'#'+id,'mask-composite')).toContain('exclude');}
 expect(await pseudo(page,'#action','border-top-left-radius')).toBe('999px');expect(await pseudo(page,'#card','border-top-left-radius')).toBe('24px');
 expect(await pseudo(page,'#plain','content')).toBe('none');expect(await pseudo(page,'#disabled','animation-name')).toBe('none');
 if(build==='scoped') expect(await pseudo(page,'#outside','content')).toBe('none');
 await page.locator(root).evaluate(el=>{el.dataset.shape='rounded';el.dataset.border='subtle';});
 const after=await page.locator('#action').boundingBox();expect(after.width).toBe(before.width);expect(after.height).toBe(before.height);
 await page.locator(root).evaluate(el=>el.dataset.border='none');expect(await pseudo(page,'#action','padding-top')).toBe('0px');
 await page.locator('#action').evaluate(el=>el.dataset.edge='gradient');expect(await pseudo(page,'#action','animation-name')).toBe('none');
 await page.locator(root).evaluate(el=>el.dataset.edge='plain');expect(await pseudo(page,'#card','content')).toBe('none');expect(await pseudo(page,'#link','content')).toBe('none');
 if(build==='scoped') {
  await page.locator('body').evaluate(el=>el.insertAdjacentHTML('beforeend','<button class="reva" data-edge="shine" id="boundary">Boundary action</button><button class="reva" data-edge="animated" disabled id="boundary-disabled">Unavailable boundary</button>'));
  await page.locator('#boundary').hover();expect(await pseudo(page,'#boundary','animation-name')).toBe('re-edge-turn');
  expect(await pseudo(page,'#boundary-disabled','animation-name')).toBe('none');
 }

});
test('shine runs once for hover or keyboard focus; motion settings stop movement',async({page})=>{
 await page.goto('/plain/');await page.evaluate(fixture=>{document.body.innerHTML='<main>'+fixture+'</main>';document.documentElement.dataset.edge='shine';},fixture);
 expect(await pseudo(page,'#action','animation-name')).toBe('none');
 await page.keyboard.press('Tab');await expect(page.locator('#action')).toBeFocused();expect(await style(page,'#action','outline-style')).toBe('solid');
 expect(await pseudo(page,'#action','animation-name')).toBe('re-edge-turn');expect(await pseudo(page,'#action','animation-duration')).toBe('0.8s');expect(await pseudo(page,'#action','animation-iteration-count')).toBe('1');
 await page.locator('#link').hover();expect(await pseudo(page,'#link','animation-name')).toBe('re-edge-turn');
 await page.locator('html').evaluate(el=>{el.dataset.edge='animated';el.dataset.motion='none';});expect(await pseudo(page,'#action','animation-play-state')).toBe('paused');
 const angle=await pseudo(page,'#action','--re-edge-angle');await page.waitForTimeout(150);expect(await pseudo(page,'#action','--re-edge-angle')).toBe(angle);
 await page.locator('#action').evaluate(el=>el.dataset.motion='subtle');expect(await pseudo(page,'#action','animation-play-state')).toBe('running');
 await expect.poll(async()=>pseudo(page,'#action','--re-edge-angle')).not.toBe(angle);
 await page.emulateMedia({reducedMotion:'reduce'});expect(await pseudo(page,'#action','animation-name')).toBe('none');expect(await pseudo(page,'#link','animation-name')).toBe('none');
});
test('contrast, forced colour and print retain the regular border and focus',async({page})=>{
 await page.emulateMedia({contrast:'more'});await page.goto('/plain/');
 await page.evaluate(()=>{document.body.innerHTML='<main><button id="initial-contrast" data-edge="animated">Initial preference</button></main>';});
 await expect.poll(()=>page.evaluate(()=>matchMedia('(prefers-contrast: more)').matches)).toBe(true);
 expect(await pseudo(page,'#initial-contrast','display')).toBe('none');
 await page.emulateMedia({contrast:'no-preference'});
 await expect.poll(()=>page.evaluate(()=>matchMedia('(prefers-contrast: more)').matches)).toBe(false);
 await page.goto('/plain/');await page.evaluate(fixture=>{document.body.innerHTML='<main>'+fixture+'</main>';document.documentElement.dataset.edge='animated';document.documentElement.dataset.contrast='more';},fixture);
 expect(await pseudo(page,'#action','display')).toBe('none');
 await page.locator('#action').evaluate(el=>el.dataset.contrast='auto');expect(await pseudo(page,'#action','display')).toBe('block');
 await page.emulateMedia({contrast:'more',reducedMotion:'reduce'});await expect.poll(()=>page.evaluate(()=>matchMedia('(prefers-contrast: more)').matches)).toBe(true);await expect.poll(()=>pseudo(page,'#action','display')).toBe('none');
 await page.emulateMedia({contrast:'no-preference',forcedColors:'active'});await expect.poll(()=>pseudo(page,'#action','display')).toBe('none');await expect.poll(()=>style(page,'#action','border-top-width')).toBe('1px');
 await page.emulateMedia({forcedColors:'none',media:'print'});await expect.poll(()=>pseudo(page,'#action','display')).toBe('none');
});
test('glass edges leave the interior and solid exceptions unchanged',async({page})=>{
 await page.goto('/themes/glass/');await page.evaluate(fixture=>{document.body.innerHTML='<main data-material="glass">'+fixture+'<section data-material="solid"><button id="solid">Solid</button></section></main>';},fixture);
 const paint=async selector=>page.locator(selector).evaluate(el=>{const s=getComputedStyle(el);return [s.backgroundColor,s.backgroundImage,s.backdropFilter,s.color];});
 const before=await paint('#action'), solid=await paint('#solid');
 await page.locator('html').evaluate(el=>el.dataset.edge='animated');expect(await paint('#action')).toEqual(before);expect(await paint('#solid')).toEqual(solid);
 expect(await pseudo(page,'#action','content')).toBe('""');expect(await pseudo(page,'#solid','content')).toBe('""');
 await page.locator('#action').click();await expect(page.locator('#action')).toBeFocused();
});
test('missing composite masking falls back to unchanged core borders',async({page})=>{
 const css=(await readFile('dist/reva.css','utf8')).replace('@supports (mask-composite: exclude)', '@supports (reva-unsupported-mask: exclude)');
 await page.goto('/plain/');await page.locator('link[rel=stylesheet]').evaluateAll(els=>els.forEach(el=>el.remove()));await page.addStyleTag({content:css});
 await page.evaluate(fixture=>{document.body.innerHTML='<main>'+fixture+'</main>';document.documentElement.dataset.edge='animated';},fixture);
 expect(await pseudo(page,'#action','content')).toBe('none');expect(await style(page,'#action','border-top-width')).toBe('1px');expect(await style(page,'#action','position')).toBe('static');
});
