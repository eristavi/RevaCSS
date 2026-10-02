import { test, expect } from '@playwright/test';
import { createRequire } from 'node:module';
const require=createRequire(import.meta.url);

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
 expect(await page.locator('script').count()).toBe(0);await context.close();
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
