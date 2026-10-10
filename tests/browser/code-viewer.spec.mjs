import { expectOnlyOptionalSettings } from './helpers/settings.mjs';
import { test, expect } from '@playwright/test';
import { createRequire } from 'node:module';
const require=createRequire(import.meta.url);
// Native focus scrolling can still be moving after focus() resolves. Observe
// the actual control's position before testing its pointer interaction.
async function settleControl(control) {
 let previous,stable=0;
 await expect.poll(async()=>{
  const bounds=await control.boundingBox();
  stable=bounds && previous && Math.abs(bounds.x-previous.x)<.01 && Math.abs(bounds.y-previous.y)<.01?stable+1:0;
  previous=bounds;return stable;
 },{intervals:[100,100,100,200]}).toBeGreaterThanOrEqual(2);
}


test('complete demo sources remain literal, selectable and wrappable without highlighting',async({browser,request})=>{
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:375,height:900}});
 const page=await context.newPage();
 for(const route of ['dashboard','shop','blog','marketing']){
  await page.goto('/demos/'+route+'/');
  await page.locator('details:has(pre.source-code) > summary').click();
  const pre=page.locator('pre.source-code');await expect(pre).toHaveCount(1);
  const code=pre.locator('code');const source=await code.textContent();
  expect(source.toLowerCase()).toContain('<!doctype html>');
  expect(await code.locator('*').count()).toBe(0);
  const link=page.locator('.demo-customizer a[download]');
  const response=await request.get(await link.getAttribute('href'));
  expect(response.ok()).toBe(true);expect(source).toBe(await response.text());
  await pre.locator('..').getByLabel('Wrap lines').focus();
  await page.keyboard.press('Tab');await expect(pre).toBeFocused();
  expect(await pre.evaluate(el=>getComputedStyle(el).outlineStyle)).not.toBe('none');
  const wrap=pre.locator('..').getByLabel('Wrap lines');await wrap.focus();await settleControl(wrap);await wrap.check();
  expect(await pre.evaluate(el=>getComputedStyle(el).whiteSpace)).toBe('pre-wrap');
  expect(await code.textContent()).toBe(source);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
 await context.close();
});

test('highlighted HTML stays literal and wrapping works independently without JavaScript',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:375,height:900}});const page=await context.newPage();await page.goto('/components/buttons/');
 const viewer=page.locator('#variants .code-viewer'), pre=viewer.locator('pre'), code=viewer.locator('pre code');
 const source=await code.textContent();expect(source).toContain('<button type="button"');expect(await code.locator('button').count()).toBe(0);
 expect(await code.locator('.line span').count()).toBeGreaterThan(5);
 const colours=await code.locator('.line span').evaluateAll(spans=>[...new Set(spans.map(s=>getComputedStyle(s).color))]);expect(colours.length).toBeGreaterThan(2);
 await pre.focus();expect(await pre.evaluate(el=>getComputedStyle(el).outlineStyle)).not.toBe('none');
 expect(await pre.evaluate(el=>getComputedStyle(el).whiteSpace)).toBe('pre');
 await viewer.getByLabel('Wrap lines').focus();await page.keyboard.press('Space');
 expect(await pre.evaluate(el=>getComputedStyle(el).whiteSpace)).toBe('pre-wrap');expect(await code.textContent()).toBe(source);
 expect(await page.locator('#sizes pre').evaluate(el=>getComputedStyle(el).whiteSpace)).toBe('pre');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.goto('/guide/');expect(await page.locator('#first-page pre code').textContent()).toContain('<!doctype html>');expect(await page.locator('#first-page pre code html').count()).toBe(0);
 await expectOnlyOptionalSettings(page);await context.close();
});

test.describe('script-free navbar code example',()=>{
 test.use({javaScriptEnabled:false});
 // Managed fixtures close the context during teardown, outside the body budget.
for (const width of [320,375]) test(`navbar inheritance example scrolls by keyboard without JavaScript at ${width}px`,async({page})=>{
  // Complete navigation examples and native focus scrolling are slower in Linux WebKit.
  // Keep every keyboard assertion's own bounded wait; allow the whole page sequence time.
  test.setTimeout(120000);
  await page.setViewportSize({width,height:900});await page.goto('/components/top-menu/');
  const pre=page.locator('.docs-content > pre'),previous=page.locator('#navbar-split pre');
  const source=await pre.textContent();
  expect(await pre.evaluate(el=>el.scrollWidth>el.clientWidth)).toBe(true);
  await previous.focus();await page.keyboard.press('Tab');await expect(pre).toBeFocused();
  await expect(pre).toHaveAccessibleName('Navbar inheritance example');
  expect(await pre.evaluate(el=>getComputedStyle(el).outlineStyle)).not.toBe('none');
  await page.keyboard.press('ArrowRight');await expect.poll(()=>pre.evaluate(el=>el.scrollLeft)).toBeGreaterThan(0);
  expect(await pre.textContent()).toBe(source);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.keyboard.press('Shift+Tab');await expect(previous).toBeFocused();
});
});

test('code colours follow device and local themes and print expands the source',async({page})=>{
 await page.emulateMedia({colorScheme:'light'});await page.goto('/components/buttons/');const viewer=page.locator('#variants .code-viewer');const pre=viewer.locator('pre');
 const light=await pre.evaluate(el=>getComputedStyle(el).backgroundColor);
 await page.emulateMedia({colorScheme:'dark'});const dark=await pre.evaluate(el=>getComputedStyle(el).backgroundColor);expect(dark).not.toBe(light);
 await viewer.evaluate(el=>el.dataset.theme='light');expect(await pre.evaluate(el=>getComputedStyle(el).backgroundColor)).toBe(light);
 await page.emulateMedia({media:'print'});expect(await pre.evaluate(el=>getComputedStyle(el).maxHeight)).toBe('none');expect(await pre.evaluate(el=>getComputedStyle(el).whiteSpace)).toBe('pre-wrap');
});

test('dark documentation code remains accessible',async({page})=>{
 await page.emulateMedia({colorScheme:'dark'});await page.goto('/attributes/');await page.addScriptTag({path:require.resolve('axe-core')});
 const violations=await page.evaluate(async()=> (await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})));expect(violations).toEqual([]);
});
