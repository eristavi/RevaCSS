import {test,expect} from '@playwright/test';
import {createRequire} from 'node:module';
import {manualTopics,exampleCount} from '../../docs/src/data/manual-test.js';
import {expectOnlyOptionalSettings} from './helpers/settings.mjs';
const require=createRequire(import.meta.url);
const route='/guide/manual-test/';

for(const width of [320,390,1280])test(`complete fixture coverage, references, accessibility and reflow at ${width}px`,async({page})=>{
 test.setTimeout(120000);
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.setViewportSize({width,height:900});await page.goto(route);
 await expect(page.locator('[data-manual-family]')).toHaveCount(manualTopics.length+1);
 await expect(page.locator('[data-manual-example]')).toHaveCount(exampleCount);
 await expectOnlyOptionalSettings(page);
 expect(await page.evaluate(()=>({width:innerWidth,overflow:document.documentElement.scrollWidth-innerWidth}))).toEqual({width,overflow:0});
 const problems=await page.evaluate(()=>{
  const ids=[...document.querySelectorAll('[id]')].map(el=>el.id);
  const missing=[];
  for(const el of document.querySelectorAll('*'))for(const attribute of ['for','aria-labelledby','aria-describedby','aria-controls','popovertarget','list']){
   for(const id of (el.getAttribute(attribute)||'').split(/\s+/).filter(Boolean))if(!document.getElementById(id))missing.push(`${attribute}: ${id}`);
  }
  return {duplicates:ids.filter((id,i)=>ids.indexOf(id)!==i),missing};
 });expect(problems).toEqual({duplicates:[],missing:[]});
 // Lazy full-document examples have their own landmarks and native behaviour.
 for(const frame of await page.locator('[data-manual-example] iframe').all()){
  await frame.scrollIntoViewIfNeeded();await expect(frame.contentFrame().locator('body > :first-child')).toBeVisible();
 }
 await page.addScriptTag({path:require.resolve('axe-core')});
 expect(await page.evaluate(async()=> (await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})))).toEqual([]);
 expect(errors).toEqual([]);
});

test.describe('native test-page controls without JavaScript',()=>{
 test.use({javaScriptEnabled:false});
 // The complete catalog is substantially larger than an individual fixture.
 // Allow software-rendered WebKit to load and traverse it without skipping
 // pointer checks, native motion or any assertions.
 test.setTimeout(120000);
 test('validation, choices and reset remain native',async({page})=>{
  await page.goto(route);
  await page.locator('#stress-form button[type=submit]').click();
  await expect(page.locator('#stress-required')).toBeFocused();
  await page.locator('#stress-required').fill('Fictional reviewer');
  // Validate from the focused field using native Enter, including long-page
  // focus scrolling; the first submission above checks the pointer action.
  await page.locator('#stress-required').press('Enter');
  await expect(page.locator('#stress-invalid')).toBeFocused();
  await expect(page.locator('#stress-disabled')).toBeDisabled();
  await expect(page.locator('#stress-readonly')).toHaveAttribute('readonly','');
  await page.locator('#stress-select').selectOption('long');
  await page.locator('#stress-textarea').fill('Changed review text');
  await page.locator('#stress-form button[type=reset]').click();
  await expect(page.locator('#stress-required')).toHaveValue('');
  await expect(page.locator('#stress-select')).toHaveValue('');
  await expect(page.locator('#stress-textarea')).not.toHaveValue('Changed review text');
  await page.locator('#stress-required').fill('Fictional reviewer');
  await page.locator('#stress-invalid').fill('reviewer@example.test');
  await page.locator('#stress-select').selectOption('short');
  await page.locator('#stress-required').press('Enter');
  await expect(page).toHaveURL(/\?[^#]*required-name=Fictional\+reviewer[^#]*#stress-forms$/);
  await expect(page.locator('#stress-required')).toHaveValue('');
 });
 test('disclosures, radio panels and popovers operate independently',async({page})=>{
  await page.goto(route);
  const disclosure=page.locator('#fixture-disclosures-details');await disclosure.locator('summary').click();await expect(disclosure.locator('details')).toHaveAttribute('open','');
  const tabs=page.locator('#fixture-tabs-tabs-basic');await tabs.getByText('Preferences',{exact:true}).click();await expect(tabs.getByRole('heading',{name:'Your preferences'})).toBeVisible();
  const dropdown=page.locator('#fixture-dropdowns-dropdown-links');await dropdown.getByRole('button',{name:'Resources',exact:true}).click();await expect(dropdown.locator('[popover]')).toBeVisible();await page.keyboard.press('Escape');await expect(dropdown.locator('[popover]')).toBeHidden();
 });
 for(const width of [390,1280])test(`full navigation opens nested menus at ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:900});await page.goto(route);
  const nav=page.getByRole('navigation',{name:'light manual navigation',exact:true});
  for(const label of [...(width<768?['Menu']:[]),'Components','More'])await nav.getByRole('button',{name:label,exact:true}).click();
  await expect(nav.getByRole('link',{name:'Tables',exact:true})).toBeVisible();
  await page.keyboard.press('Escape');await expect(nav.getByRole('link',{name:'Tables',exact:true})).toBeHidden();
 });
});
