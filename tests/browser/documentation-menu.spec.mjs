import {waitForPopover} from './helpers/popover.mjs';
import { test, expect } from '@playwright/test';
import { topics } from '../../docs/src/data/examples.js';
import { createRequire } from 'node:module';
const require=createRequire(import.meta.url);
const pages=['/','/guide/','/attributes/','/reference/','/themes/glass/','/themes/palettes/','/themes/button-materials/','/plain/',...topics.map(t=>`/components/${t.slug}/`),'/components/top-menu/',...['light','dark','auto'].flatMap(theme=>[`/preview/${theme}/`,`/preview/menu/${theme}/`,`/preview/glass/${theme}/`,`/preview/defaults/${theme}/`])];
const nav=page=>page.getByRole('navigation',{name:'Documentation',exact:true});
const openMenu=async(page,name)=>{const button=nav(page).getByRole('button',{name,exact:true});const id=await button.getAttribute('popovertarget');await button.click();await waitForPopover(page.locator('#'+id));};
const openTheme=async page=>{await nav(page).getByRole('button',{name:'Customize',exact:true}).click();await waitForPopover(page.locator('#demo-customizer-popup'));};
test.describe('shared documentation header without browser JavaScript',()=>{
 test.use({javaScriptEnabled:false});
 let expected;
 test.beforeAll(async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();
  await page.goto('/');expected=await nav(page).locator('.menu-desktop a').evaluateAll(els=>els.map(el=>({label:el.textContent,href:el.getAttribute('href')})));await context.close();
 });
 // Inspect each document in a fresh page: preview frames and navigation history
 // must not accumulate across an inventory of unrelated documentation routes.
 for(let start=0;start<pages.length;start+=4){
  const group=pages.slice(start,start+4);
  test(`shared header and unique panel targets: ${group[0]} through ${group.at(-1)}`,async({context})=>{
   // The existing attributes reference alone can take about a minute to lay
   // out in Linux WebKit; keep its complete styled inventory within the group.
   test.setTimeout(120000);
   for(const route of group){
    const page=await context.newPage();
    try {
    await page.goto(route,{waitUntil:'domcontentloaded'});await expect(nav(page)).toHaveCount(1);
    const entries=await nav(page).locator('.menu-desktop a').evaluateAll(els=>els.map(el=>({label:el.textContent,href:el.getAttribute('href')})));
    expect(entries,route).toEqual(expected);
    expect(await nav(page).locator('.customizer-group > summary').allTextContents()).toEqual(['Colours','Surfaces','Layout','Navbar','Typography and controls','Effects and accessibility']);
    expect(await nav(page).locator('#demo-theme option').count()).toBe(3);
    const invalid=await page.evaluate(()=>{const ids=[...document.querySelectorAll('[id]')].map(el=>el.id);return {duplicates:ids.filter((id,i)=>ids.indexOf(id)!==i),targets:[...document.querySelectorAll('[popovertarget]')].filter(el=>!document.getElementById(el.getAttribute('popovertarget'))).map(el=>el.outerHTML)};});
    expect(invalid,route).toEqual({duplicates:[],targets:[]});await expect(page.locator('#reva-settings-runtime')).toHaveCount(1);
    } finally {await page.close();}
   }
  });
 }
 for(const width of [1280,375])test(`theme choices update the page and code while preserving local overrides at ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:900});await page.emulateMedia({colorScheme:'light'});await page.goto('/components/buttons/');
  const colours=()=>page.locator('#variants pre').evaluate(el=>({body:getComputedStyle(document.body).backgroundColor,code:getComputedStyle(el).backgroundColor}));
  const light=await colours();await openTheme(page);
  await page.locator('#demo-theme').selectOption('dark');const dark=await colours();expect(dark.body).not.toBe(light.body);expect(dark.code).not.toBe(light.code);
  await page.mouse.click(2,800);await expect(page.locator('#demo-customizer-popup')).toBeHidden();
  await openTheme(page);await page.locator('#demo-theme').selectOption('light');expect(await colours()).toEqual(light);
  await page.locator('#demo-theme').selectOption('auto');await page.emulateMedia({colorScheme:'dark'});expect(await colours()).toEqual(dark);
  await page.keyboard.press('Escape');
  if(width<768){
   const trigger=nav(page).getByRole('button',{name:'Menu',exact:true});
   await expect(trigger.locator('svg[aria-hidden="true"]')).toHaveCount(1);
   expect((await trigger.textContent()).trim()).toBe('');
   expect((await trigger.boundingBox()).width).toBeGreaterThanOrEqual(44);
   expect(await trigger.evaluate(el=>getComputedStyle(el,'::before').content)).toBe('none');
   await openMenu(page,'Menu');
  }
  await openMenu(page,'Components');await openMenu(page,'Forms and actions');await nav(page).getByRole('link',{name:'Forms',exact:true}).click();
  await expect(page).toHaveURL(/\/components\/forms\/$/);await expect(page.locator('#demo-theme')).toHaveValue('auto');
  await page.goto('/preview/light/');await openTheme(page);await page.locator('#demo-theme').selectOption('dark');
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
test('customizer and documentation navigation pass accessibility checks in light and dark',async({page})=>{
 for(const width of [1280,375])for(const theme of ['Light','Dark']){
  await page.setViewportSize({width,height:900});await page.goto('/guide/');await openTheme(page);await page.locator('#demo-theme').selectOption(theme.toLowerCase());
  // Reopen in the selected theme: Firefox's anchor-positioned computed background
  // can retain the previous colour scheme while the already-open panel paints correctly.
  await page.keyboard.press('Escape');await openTheme(page);
  await page.addScriptTag({path:require.resolve('axe-core')});const violations=await page.evaluate(async()=> (await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}})).violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})));expect(violations).toEqual([]);
 }
});
