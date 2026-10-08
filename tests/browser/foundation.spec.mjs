import { test, expect } from '@playwright/test';
import { createRequire } from 'node:module';
const require=createRequire(import.meta.url);
for(const theme of ['light','dark']) test(`${theme} reference has no automated A/AA violations`,async({page})=>{
 await page.goto(`/preview/${theme}/`);
 await page.addScriptTag({path:require.resolve('axe-core')});
 const results=await page.evaluate(async()=>await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}}));
 expect(results.violations.map(v=>({id:v.id,description:v.description,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
});
test('nested themes and local resets preserve independent settings',async({page})=>{
 await page.goto('/preview/light/');
 const states=await page.evaluate(()=>{
 const card=document.querySelector('.card[data-theme=dark]');const input=document.createElement('input');card.append(input);
 const grid=document.querySelector('.grid');grid.dataset.gap='large';const stack=document.createElement('div');stack.className='stack';stack.dataset.gap='medium';card.append(stack);
 const density=document.createElement('section');density.dataset.density='spacious';density.className='card';document.body.append(density);
 return {card:getComputedStyle(card).backgroundColor,input:(()=>{const c=document.createElement('canvas').getContext('2d');c.fillStyle=getComputedStyle(input).backgroundColor;c.fillRect(0,0,1,1);return [...c.getImageData(0,0,1,1).data].slice(0,3)})(),grid:getComputedStyle(grid).gap,stack:getComputedStyle(stack).gap,padding:getComputedStyle(density).padding,solid:getComputedStyle(document.querySelector('[data-fill=solid] button')).backgroundImage,gradient:getComputedStyle(document.querySelector('#variants > button')).backgroundImage}; });
 expect(states.card).toBe('rgb(25, 25, 25)');expect(states.input).toEqual([25,25,25]);expect(states.grid).toBe('32px');expect(states.stack).toBe('16px');expect(states.padding).toBe('30px');expect(states.gradient).not.toBe('none');expect(states.solid).not.toBe(states.gradient);
});
test('keyboard disclosure, focus and native form validation',async({page})=>{
 await page.goto('/preview/light/');const disclosure=page.locator('#main details').filter({hasText:'What is this preview?'});await disclosure.locator('summary').focus();await page.keyboard.press('Enter');await expect(disclosure).toHaveAttribute('open','');
 await page.locator('#email').fill('invalid');await page.locator('#subject').focus();expect(await page.locator('#email').evaluate(el=>el.matches(':user-invalid'))).toBe(true);
 expect(await page.locator('#subject').evaluate(el=>getComputedStyle(el).outlineStyle)).not.toBe('none');
});
test('mobile reflow and user preferences',async({page})=>{
 await page.setViewportSize({width:320,height:800});await page.emulateMedia({colorScheme:'dark',reducedMotion:'reduce'});await page.goto('/preview/auto/');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 expect(await page.locator('body').evaluate(el=>getComputedStyle(el).backgroundColor)).toBe('rgb(16, 16, 16)');
 expect(await page.locator('button').first().evaluate(el=>getComputedStyle(el).transitionDuration.split(',').every(v=>v.trim()==='0s'))).toBe(true);
 await page.emulateMedia({forcedColors:'active'});expect(await page.locator('button').first().evaluate(el=>getComputedStyle(el).backgroundImage)).toBe('none');
});
test('ordinary custom CSS overrides framework without important',async({page})=>{
 await page.goto('/preview/light/');await page.addStyleTag({content:'.card { padding: 37px; } :root { --re-primary: #7041cf; }'});
 expect(await page.locator('.card').first().evaluate(el=>getComputedStyle(el).padding)).toBe('37px');
});
test('scoped build leaves outside HTML untouched',async({page})=>{
 await page.goto('/plain/');await page.evaluate(()=>document.querySelector('link').remove());
 await page.addStyleTag({url:'/reva/reva.scoped.css'});
 await page.evaluate(()=>{document.body.innerHTML='<button id="outside">Outside</button><section class="reva"><button id="inside">Inside</button></section>';});
 expect(await page.locator('#inside').evaluate(el=>getComputedStyle(el).backgroundImage)).not.toBe('none');
 expect(await page.locator('#outside').evaluate(el=>getComputedStyle(el).backgroundImage)).toBe('none');
});

test('tone and theme are independent through nested sections',async({page})=>{
 await page.goto('/preview/dark/');
 const colors=await page.evaluate(()=>{
  const outer=document.createElement('section');outer.dataset.theme='light';outer.dataset.tone='warm';
  outer.innerHTML='<article class="card" data-tone="cool"><div data-theme="dark"><article class="card" data-tone="warm" id="nested">Nested</article></div></article>';
  document.body.append(outer);
  return {outer:getComputedStyle(outer).backgroundColor,nested:getComputedStyle(document.getElementById('nested')).backgroundColor};
 });
 expect(colors.outer).toBe('rgb(250, 248, 243)');expect(colors.nested).toBe('rgb(40, 35, 30)');
});

test('accent presets retain readable buttons in both themes',async({page})=>{
 for(const theme of ['light','dark']) {
  await page.goto(`/preview/${theme}/`);
  await page.evaluate(()=>{for(const accent of ['blue','violet','teal','green','orange','rose']){const section=document.createElement('section');section.dataset.accent=accent;section.innerHTML='<button>Primary action</button><button class="danger">Delete</button><button class="warning">Review</button>';document.querySelector('main').append(section);}});
  await page.addScriptTag({path:require.resolve('axe-core')});
  const result=await page.evaluate(async()=>await axe.run(document,{runOnly:{type:'rule',values:['color-contrast']}}));
  expect(result.violations).toEqual([]);
 }
});
