import { expectOnlyOptionalSettings } from './helpers/settings.mjs';
import {waitForPopover} from './helpers/popover.mjs';
import { test, expect } from '@playwright/test';
import axeSource from 'axe-core';
import {topics} from '../../docs/src/data/examples.js';

const routes = ['/', '/guide/', '/guide/styling/', '/guide/accessibility/', '/guide/motion/', '/attributes/', ...topics.map(t=>`/components/${t.slug}/`), '/components/top-menu/', '/themes/', '/themes/light/', '/themes/dark/', '/themes/auto/', '/themes/palettes/', '/themes/glass/', '/themes/button-materials/', '/icons/', '/reference/', '/reference/components/', '/reference/tokens/'];

test.describe('script-free documentation inventory',()=>{
 test.use({javaScriptEnabled:false});
 // Give each styled route an isolated context and its own bounded layout budget.
 for(const route of routes)test(`documentation markup without JavaScript: ${route}`,async({page})=>{
  test.setTimeout(120000);
   await page.goto(route,{waitUntil:'domcontentloaded'});await expect(page.locator('h1')).toHaveCount(1);
   const mismatch=await page.locator('.example-frame').evaluateAll(frames=>frames.flatMap(frame=>{
    const demo=frame.querySelector('.example-demo');if(!demo)return [];
    const template=document.createElement('template');template.innerHTML=frame.querySelector('.example-code pre code').textContent;
    return demo.innerHTML.trim()===template.innerHTML.trim()?[]:[frame.closest('section').id];
   }));
   expect(mismatch,route).toEqual([]);await expectOnlyOptionalSettings(page);
 });
});
test('documentation disclosures and popovers work without JavaScript',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();
 await page.goto('/components/disclosures/');await page.locator('#details summary').click();
 await expect(page.locator('#details details')).toHaveAttribute('open','');
 await page.locator('[popovertarget="demo-popover"]').first().click();await expect(page.locator('#demo-popover')).toBeVisible();
 await waitForPopover(page.locator('#demo-popover'));await page.locator('#demo-popover button').click();await expect(page.locator('#demo-popover')).toBeHidden();await context.close();
});

// Each route gets its own timeout and failure report as the documentation grows.
for (const width of [320,375,1280]) for (const route of routes) {
  test(`${route} documentation reflows and passes accessibility checks at ${width}px`, async ({ page }) => {
    await page.setViewportSize({width,height:900});
    await page.goto(route);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),route).toBe(true);
    await page.addScriptTag({content:axeSource.source});
    const violations=await page.evaluate(async()=> (await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})));
    expect(violations,route).toEqual([]);
  });
}
