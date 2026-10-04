import {test,expect} from '@playwright/test';
import {createRequire} from 'node:module';
import {waitForPopover} from './helpers/popover.mjs';
const require=createRequire(import.meta.url);
test.describe('shop without JavaScript',()=>{
 test.use({javaScriptEnabled:false});
 for(const width of [320,390,1440])test(`catalogue, product and bag reflow at ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:900});
  for(const route of ['/demos/shop/','/demos/shop/products/arc-lamp/','/demos/shop/bag/']){
   await page.goto(route);await expect(page.locator('#shop-title')).toBeVisible();
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
   await page.getByRole('button',{name:'Customize this demo',exact:true}).click();
   await waitForPopover(page.locator('#demo-customizer-popup'));
   await page.locator('#demo-theme').selectOption('dark');await page.locator('#demo-material').selectOption('glass');
   await page.getByRole('button',{name:'View the website',exact:true}).click();
   expect(await page.locator('#demo-site').evaluate(el=>getComputedStyle(el).colorScheme)).toBe('dark');
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  }
  await expect(page.locator('#demo-site').getByText('€139.00',{exact:true})).toBeVisible();
 });
 test('category and product links open complete pages',async({page})=>{
  await page.goto('/demos/shop/');await expect(page.locator('#shop-products > article')).toHaveCount(6);
  await page.getByRole('navigation',{name:'Shop categories'}).getByRole('link',{name:'Lighting',exact:true}).click();
  await expect(page.locator('#shop-products > article')).toHaveCount(1);
  await page.locator('#shop-products').getByRole('link',{name:'Arc table lamp',exact:true}).click();
  await expect(page.locator('#shop-title')).toHaveText('Arc table lamp');
  await page.locator('#demo-site').getByRole('link',{name:'View bag',exact:true}).click();
  await expect(page.locator('#shop-title')).toHaveText('Your bag.');
  await expect(page.locator('.shop-bag > section > article')).toHaveCount(2);
 });
});
test('shop restores the shared appearance and passes accessibility checks',async({page})=>{
 await page.goto('/demos/shop/');await page.getByRole('button',{name:'Customize this demo',exact:true}).click();
 await waitForPopover(page.locator('#demo-customizer-popup'));
 await page.locator('#demo-palette').selectOption('forest');await page.locator('#demo-theme').selectOption('dark');
 await page.goto('/demos/shop/products/pebble-vase/');await expect(page.locator('#demo-palette')).toHaveValue('forest');
 await page.goto('/demos/shop/source/product-pebble-vase.html');await expect(page.locator('html')).toHaveAttribute('data-palette','forest');
 for(const route of ['/demos/shop/','/demos/shop/products/arc-lamp/','/demos/shop/bag/']){
  await page.goto(route);await page.addScriptTag({path:require.resolve('axe-core')});
  const violations=await page.evaluate(async()=> (await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})));
  expect(violations).toEqual([]);
 }
});
