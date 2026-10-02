import {waitForPopover} from './helpers/popover.mjs';
import { test, expect } from '@playwright/test';
import { topics } from '../../docs/src/data/examples.js';
import { createRequire } from 'node:module';
const require=createRequire(import.meta.url);
const pages=['/','/guide/','/attributes/','/reference/','/themes/glass/','/themes/palettes/','/plain/',...topics.map(t=>`/components/${t.slug}/`),'/components/top-menu/',...['light','dark','auto'].flatMap(theme=>[`/preview/${theme}/`,`/preview/menu/${theme}/`,`/preview/glass/${theme}/`,`/preview/defaults/${theme}/`])];
const nav=page=>page.getByRole('navigation',{name:'Documentation',exact:true});
const openMenu=async(page,name)=>{const button=nav(page).getByRole('button',{name,exact:true});const id=await button.getAttribute('popovertarget');await button.click();await waitForPopover(page.locator('#'+id));};
const openTheme=async page=>{await nav(page).getByRole('button',{name:'Theme',exact:true}).click();await waitForPopover(page.locator('#docs-theme-panel'));};
test.describe('shared documentation header without browser JavaScript',()=>{
 test.use({javaScriptEnabled:false});
 test('every documentation and preview page uses the same menu and valid unique panel targets',async({page})=>{
  test.setTimeout(60000);
  let expected;
  for(const route of pages){
   await page.goto(route);await expect(nav(page)).toHaveCount(1);
   const entries=await nav(page).locator('.menu-desktop a').evaluateAll(els=>els.map(el=>({label:el.textContent,href:el.getAttribute('href')})));
   if(!expected)expected=entries;expect(entries,route).toEqual(expected);
   expect(await nav(page).locator('details').count()).toBe(0);
   expect(await nav(page).locator('input[name="docs-theme"]').count()).toBe(3);
   const invalid=await page.evaluate(()=>{const ids=[...document.querySelectorAll('[id]')].map(el=>el.id);return {duplicates:ids.filter((id,i)=>ids.indexOf(id)!==i),targets:[...document.querySelectorAll('[popovertarget]')].filter(el=>!document.getElementById(el.getAttribute('popovertarget'))).map(el=>el.outerHTML)};});
   expect(invalid,route).toEqual({duplicates:[],targets:[]});expect(await page.locator('script').count()).toBe(0);
  }
 });
 for(const width of [1280,375])test(`theme choices update the page and code while preserving local overrides at ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:900});await page.emulateMedia({colorScheme:'light'});await page.goto('/components/buttons/');
  const colours=()=>page.locator('#variants pre').evaluate(el=>({body:getComputedStyle(document.body).backgroundColor,code:getComputedStyle(el).backgroundColor}));
  const light=await colours();await openTheme(page);
  await page.getByLabel('Dark',{exact:true}).check();const dark=await colours();expect(dark.body).not.toBe(light.body);expect(dark.code).not.toBe(light.code);
  await page.mouse.click(2,800);await expect(page.locator('#docs-theme-panel')).toBeHidden();
  await openTheme(page);await page.getByLabel('Light',{exact:true}).check();expect(await colours()).toEqual(light);
  await page.getByLabel('System',{exact:true}).check();await page.emulateMedia({colorScheme:'dark'});expect(await colours()).toEqual(dark);
  await page.keyboard.press('Escape');
  if(width<768)await openMenu(page,'Menu');
  await openMenu(page,'Components');await openMenu(page,'Forms and actions');await nav(page).getByRole('link',{name:'Forms',exact:true}).click();
  await expect(page).toHaveURL(/\/components\/forms\/$/);await expect(page.locator('#docs-theme-auto')).toBeChecked();
  await page.goto('/preview/light/');await openTheme(page);await page.getByLabel('Dark',{exact:true}).check();
  expect(await page.locator('body').evaluate(el=>getComputedStyle(el).backgroundColor)).toBe('rgb(16, 16, 16)');
  expect(await page.locator('.card[data-theme=light]').evaluate(el=>getComputedStyle(el).backgroundColor)).toBe('rgb(255, 253, 248)');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 });
 test('shared documentation submenus light-dismiss on desktop and phone',async({page})=>{
  for(const width of [1280,375]){
   await page.setViewportSize({width,height:900});await page.goto('/guide/');
   if(width<768)await openMenu(page,'Menu');
   await openMenu(page,'Components');await openMenu(page,'Forms and actions');
   await expect(nav(page).getByRole('link',{name:'Forms',exact:true})).toBeVisible();await page.mouse.click(2,800);
   await expect(nav(page).locator('[popover]:popover-open')).toHaveCount(0);
  }
 });
});
test('theme panel and documentation navigation pass accessibility checks in light and dark',async({page})=>{
 for(const width of [1280,375])for(const theme of ['Light','Dark']){
  await page.setViewportSize({width,height:900});await page.goto('/guide/');await openTheme(page);await page.getByLabel(theme,{exact:true}).check();
  // Reopen in the selected theme: Firefox's anchor-positioned computed background
  // can retain the previous colour scheme while the already-open panel paints correctly.
  await page.keyboard.press('Escape');await openTheme(page);
  await page.addScriptTag({path:require.resolve('axe-core')});const violations=await page.evaluate(async()=> (await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}})).violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})));expect(violations).toEqual([]);
 }
});
