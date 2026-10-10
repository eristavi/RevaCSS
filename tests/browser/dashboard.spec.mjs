import {test,expect} from '@playwright/test';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const route='/demos/dashboard/';
const settle=async panel=>{
 await expect(panel).toBeVisible();
 await expect.poll(()=>panel.evaluate(el=>el.getAnimations().filter(a=>a.playState==='running').length)).toBe(0);
};
test.describe('dashboard native operation',()=>{
 test.use({javaScriptEnabled:false});
 for(const width of [320,390,1440]) test(`dashboard reflows and customises without JavaScript at ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:900});await page.goto(route);
  await expect(page.locator('#reva-settings-runtime')).toHaveCount(1);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await expect(page.locator('.dash-metrics > .card')).toHaveCount(4);
  const header=page.locator('.dash-site > .app-shell > header');
  expect((await header.boundingBox()).height).toBeLessThan(85);
  await expect(header.getByRole('link',{name:'View report',exact:true})).toBeVisible();
  if(width<960){
   const trigger=header.getByRole('button',{name:'Open sidebar',exact:true});
   await expect(trigger).toBeVisible();
   await expect(header.getByRole('button')).toHaveCount(2);
   await expect(header.getByRole('button',{name:'Customize',exact:true})).toBeVisible();
   await trigger.click();await expect(page.locator('#dashboard-sidebar')).toBeVisible();
   await expect(page.locator('#dashboard-sidebar').getByRole('link',{name:'Projects',exact:true})).toBeVisible();
   await page.keyboard.press('Escape');await expect(page.locator('#dashboard-sidebar')).toBeHidden();
  }else await expect(header.getByRole('button',{name:'Open sidebar',exact:true})).toBeHidden();
  await expect(page.getByRole('img',{name:'Monthly revenue, April to September 2026'})).toBeVisible();
  await expect(page.getByRole('img',{name:'Revenue share by channel'})).toBeVisible();
  await page.getByRole('button',{name:'Customize',exact:true}).click();await settle(page.locator('#demo-customizer-popup'));
  await page.locator('#demo-theme').selectOption('dark');await page.locator('#demo-palette').selectOption('ocean');
  await page.locator('#demo-material').selectOption('glass');
  await page.locator('#demo-customizer-popup').getByRole('button',{name:'Close',exact:true}).click();
  await expect(page.locator('#demo-customizer-popup')).toBeHidden();
  expect(await page.locator('.demo-preview').evaluate(el=>getComputedStyle(el).colorScheme)).toBe('dark');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.locator('#dashboard-report > summary').click();
  await expect(page.getByRole('cell',{name:'€42,500',exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Customize',exact:true}).click();await settle(page.locator('#demo-customizer-popup'));
  await page.locator('#demo-material').selectOption('veil');await page.locator('#demo-theme').selectOption('light');
  await page.locator('#demo-customizer-popup').getByRole('button',{name:'Close',exact:true}).click();
  expect(await page.locator('.demo-preview').evaluate(el=>getComputedStyle(el).colorScheme)).toBe('light');
 });
 test('starting HTML contains a complete standalone dashboard',async({request})=>{
  const response=await request.get('/demos/dashboard/source.html');expect(response.ok()).toBe(true);
  const html=await response.text();expect(html.toLowerCase()).toContain('<!doctype html>');expect(html).toContain('Revenue by channel');expect(html).toContain('dashboard.css');expect(html).toContain('reva-settings-runtime');
 });
});
test('dashboard accessibility and reduced motion',async({page})=>{
 await page.goto(route);await page.addScriptTag({path:require.resolve('axe-core')});
 const violations=await page.evaluate(async()=> (await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})));
 expect(violations).toEqual([]);
 await page.emulateMedia({reducedMotion:'reduce'});expect(await page.locator('.chart > svg > polyline').evaluate(el=>getComputedStyle(el).animationName)).toBe('none');
});
