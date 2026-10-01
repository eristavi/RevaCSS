import { test, expect } from '@playwright/test';
import { createRequire } from 'node:module';
const require=createRequire(import.meta.url);
const style=(page,selector,property)=>page.locator(selector).evaluate((el,p)=>getComputedStyle(el)[p],property);
test('primary and tinted secondary actions remain readable in every accent and theme',async({page})=>{
 await page.goto('/plain/');
 await page.evaluate(()=>{
  document.body.innerHTML='<main><h1>Button colours</h1></main>';
  for(const theme of ['light','dark']) for(const accent of ['blue','violet','teal','green','orange','rose']) {
   const section=document.createElement('section');section.className='card';section.dataset.theme=theme;section.dataset.accent=accent;
   section.innerHTML=`<h2>${theme} ${accent}</h2><button type="button">Continue</button> <button type="button" class="secondary">Back</button> <input type="button" class="secondary" value="Native back"> <a href="#" class="button secondary">Destination</a>`;
   document.querySelector('main').append(section);
  }
 });
 for(const theme of ['light','dark']) {
  const buttons=page.locator(`[data-theme=${theme}] .secondary`);
  const colours=await buttons.evaluateAll(els=>els.filter(el=>el.tagName==='BUTTON').map(el=>getComputedStyle(el).backgroundColor));
  expect(new Set(colours).size).toBe(6);
 }
 await page.addScriptTag({path:require.resolve('axe-core')});
 const violations=await page.evaluate(async()=> (await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}})).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})));
 expect(violations).toEqual([]);
});
test('keyboard focus, disabled controls and native press feedback preserve shared settings',async({page})=>{
 await page.goto('/plain/');await page.evaluate(()=>{
  document.documentElement.dataset.shape='pill';document.documentElement.dataset.size='small';document.documentElement.dataset.motion='expressive';
  document.body.innerHTML='<main><button type="button" id="primary">Continue</button><button type="button" id="disabled" disabled>Unavailable</button><input type="button" id="native" value="Native action"><a href="#primary" class="button" id="link">Destination</a></main>';
 });
 await page.keyboard.press('Tab');await expect(page.locator('#primary')).toBeFocused();expect(await style(page,'#primary','outlineStyle')).toBe('solid');
 for(const selector of ['#primary','#native','#link']) {
  expect(await style(page,selector,'borderRadius')).toBe('999px');expect(await style(page,selector,'fontSize')).toBe('14px');expect(parseFloat(await style(page,selector,'height'))).toBeGreaterThanOrEqual(44);
  await page.locator(selector).hover();await page.mouse.down();
  await expect.poll(async()=>page.locator(selector).evaluate(el=>new DOMMatrix(getComputedStyle(el).transform).m42)).toBe(2);
  expect(await style(page,selector,'boxShadow')).toBe('none');await page.mouse.up();
 }
 await page.locator('#disabled').hover();expect(await style(page,'#disabled','filter')).toBe('none');expect(await style(page,'#disabled','transform')).toBe('none');
 await page.locator('html').evaluate(el=>el.dataset.motion='none');await page.locator('#primary').hover();await page.mouse.down();
 expect(await page.locator('#primary').evaluate(el=>new DOMMatrix(getComputedStyle(el).transform).m42)).toBe(0);await page.mouse.up();
 await page.locator('html').evaluate(el=>el.dataset.motion='expressive');await page.emulateMedia({reducedMotion:'reduce'});
 expect((await style(page,'#primary','transitionDuration')).split(',').every(v=>v.trim()==='0s')).toBe(true);
 await page.locator('#primary').hover();await page.mouse.down();expect(await page.locator('#primary').evaluate(el=>new DOMMatrix(getComputedStyle(el).transform).m42)).toBe(0);await page.mouse.up();
});
