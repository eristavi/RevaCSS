import {test,expect} from '@playwright/test';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
test.describe('native patterns without JavaScript',()=>{
 test.use({javaScriptEnabled:false});
 test('star choices preserve keyboard selection, form values, reset and disabled state',async({page})=>{
  await page.goto('/components/rating/');const form=page.locator('#rating-choice form');
  await form.locator('label').filter({hasText:'3 stars'}).click();
  await expect(form.getByRole('radio',{name:'3 stars',exact:true})).toBeChecked();
  expect(await form.evaluate(el=>new FormData(el).get('product-rating'))).toBe('3');
  await form.getByRole('radio',{name:'3 stars',exact:true}).focus();await page.keyboard.press('ArrowRight');
  await expect(form.getByRole('radio',{name:'4 stars',exact:true})).toBeChecked();
  expect(await form.locator('label > svg').nth(0).evaluate(el=>getComputedStyle(el).fill)).not.toBe('none');
  expect(await form.locator('label > svg').nth(4).evaluate(el=>getComputedStyle(el).fill)).toBe('none');
  await form.getByRole('button',{name:'Clear rating',exact:true}).click();await expect(form.locator('input:checked')).toHaveCount(0);
  for(const radio of await page.locator('#rating-disabled fieldset.rating input').all())await expect(radio).toBeDisabled();
 });
 for(const width of [320,390,1440])test(`all four patterns reflow in light and dark at ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:900});
  for(const mode of ['light','dark']){
   await page.emulateMedia({colorScheme:mode});
   for(const component of ['steps','rating','calendar','message-thread']){
    await page.goto('/components/'+component+'/');
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),component+' '+mode).toBe(true);
   }
  }
 });
 test('calendar dates and event destinations stay native; steps expose the current stage',async({page})=>{
  await page.goto('/components/calendar/');await expect(page.locator('.calendar time')).toHaveCount(31);
  await expect(page.locator('.calendar tbody tr').first().locator('td').nth(3)).toContainText('1');
  await page.locator('.calendar').getByRole('link',{name:'Design review, October 5'}).click();
  await expect(page).toHaveURL(/#calendar-review$/);await expect(page.locator('#calendar-review')).toBeVisible();
  await page.goto('/components/steps/');await expect(page.locator('.steps [aria-current="step"]')).toHaveText('Delivery');
 });
 test('message ownership follows logical direction while preserving reading order',async({page})=>{
  await page.goto('/components/message-thread/');const thread=page.locator('.message-thread');
  const incoming=thread.locator('article').first(),outgoing=thread.locator('article[data-variant="primary"]');
  expect((await outgoing.boundingBox()).x).toBeGreaterThan((await incoming.boundingBox()).x);
  await thread.evaluate(el=>el.dir='rtl');
  expect((await outgoing.boundingBox()).x).toBeLessThan((await incoming.boundingBox()).x);
  await expect(thread.locator('li')).toHaveCount(3);await expect(thread.locator('li').nth(1)).toContainText('You');
 });
});
test('new patterns pass accessibility checks and retain forced-colour boundaries',async({page})=>{
 for(const component of ['steps','rating','calendar','message-thread']){
  await page.goto('/components/'+component+'/');await page.addScriptTag({path:require.resolve('axe-core')});
  const violations=await page.evaluate(async()=> (await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})));
  expect(violations,component).toEqual([]);
 }
 await page.goto('/components/calendar/');await page.emulateMedia({forcedColors:'active'});
 expect(await page.locator('.calendar td:has(time[aria-current])').evaluate(el=>getComputedStyle(el).outlineWidth)).toBe('2px');
});
