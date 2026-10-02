import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
const require=createRequire(import.meta.url);
const filter=locator=>locator.evaluate(el=>getComputedStyle(el).backdropFilter||getComputedStyle(el).webkitBackdropFilter);
const alpha=locator=>locator.evaluate(el=>{const c=document.createElement('canvas').getContext('2d');c.fillStyle=getComputedStyle(el).backgroundColor;c.fillRect(0,0,1,1);return c.getImageData(0,0,1,1).data[3];});
const style=(page,selector,property)=>page.locator(selector).evaluate((el,p)=>getComputedStyle(el)[p],property);
for(const scoped of [false,true]) test(`${scoped?'scoped':'global'} glass actions support local activation, solid resets and shared attributes`,async({page})=>{
 await page.goto('/plain/');await page.locator('link[rel=stylesheet]').evaluateAll(els=>els.forEach(el=>el.remove()));
 await page.addStyleTag({content:await readFile(`dist/reva.${scoped?'scoped.':''}css`,'utf8')});await page.addStyleTag({content:await readFile(`dist/reva.glass${scoped?'.scoped':''}.css`,'utf8')});
 await page.evaluate(scoped=>{document.body.innerHTML=`<main ${scoped?'class="reva"':''}><section data-material="glass" data-accent="violet" data-size="large" data-shape="pill" data-fill="solid" data-depth="flat" data-border="defined" data-motion="none"><button id="glass">Glass</button><input type="button" id="native" value="Native"><a href="#glass" class="button secondary" id="link">Link</a><button data-material="solid" id="solid">Solid</button><section data-material="solid"><button data-material="glass" id="reentry">Glass again</button><button id="plain">Plain</button></section></section><button data-material="glass" id="local">Local glass</button></main><button data-material="glass" id="outside">Outside</button>`;},scoped);
 for(const id of ['glass','native','link','reentry','local']) {expect(await filter(page.locator('#'+id))).toContain('blur');expect(await alpha(page.locator('#'+id))).toBeGreaterThan(0);expect(await alpha(page.locator('#'+id))).toBeLessThan(255);}
 for(const id of ['solid','plain']) {expect(await filter(page.locator('#'+id)),id).toBe('none');expect(await alpha(page.locator('#'+id)),id).toBe(255);}
 for(const id of ['glass','native','link','solid']) {expect(await style(page,'#'+id,'fontSize')).toBe('18px');expect(await style(page,'#'+id,'borderRadius')).toBe('999px');expect(await style(page,'#'+id,'borderTopWidth')).toBe('2px');expect(await style(page,'#'+id,'boxShadow')).toBe('none');}
 expect(await style(page,'#glass','transitionDuration')).toBe('0s, 0s');
 await page.locator('#glass').focus();expect(await style(page,'#glass','outlineStyle')).toBe('solid');
 if(scoped) {expect(await filter(page.locator('#outside'))).toBe('none');expect(await style(page,'#outside','backgroundImage')).toBe('none');}
});
test('glass actions respect contrast resets, system preferences and print',async({page})=>{
 await page.goto('/preview/glass/light/');await page.locator('#glass-solid').evaluate(el=>{const button=document.createElement('button');button.className='outline';button.id='solid-outline-preference';button.textContent='Solid outline';el.append(button);});const action=page.locator('#glass-action');expect(await alpha(action)).toBeLessThan(255);
 await action.evaluate(el=>el.dataset.contrast='more');expect(await alpha(action)).toBe(255);expect(await filter(action)).toBe('none');
 await action.evaluate(el=>{el.dataset.contrast='auto';el.style.setProperty('--re-glass-button-opacity','40%');});expect(await alpha(action)).toBeLessThan(150);
 await page.emulateMedia({contrast:'more',reducedMotion:'reduce'});await expect.poll(()=>page.evaluate(()=>matchMedia('(prefers-contrast: more)').matches)).toBe(true);await expect.poll(()=>alpha(action)).toBe(255);await expect.poll(()=>filter(action)).toBe('none');expect(await style(page,'#glass-action','backgroundImage')).toBe('none');expect(await style(page,'#solid-outline-preference','backgroundColor')).toBe('rgba(0, 0, 0, 0)');
 // Solid outline buttons retain their native outline style; glass opacity resets apply to glass actions.
 expect(await style(page,'#solid-outline-preference','borderTopWidth')).toBe('1px');
 await page.emulateMedia({contrast:'no-preference',forcedColors:'active'});await expect.poll(()=>page.evaluate(()=>matchMedia('(forced-colors: active)').matches)).toBe(true);await expect.poll(()=>filter(action)).toBe('none');expect(await style(page,'#glass-action','boxShadow')).toBe('none');expect(await style(page,'#glass-action','borderTopWidth')).toBe('1px');
 await page.emulateMedia({forcedColors:'none',media:'print'});await expect.poll(()=>page.evaluate(()=>matchMedia('print').matches)).toBe(true);await expect.poll(()=>alpha(action)).toBe(255);await expect.poll(()=>filter(action)).toBe('none');expect(await style(page,'#glass-action','color')).toBe('rgb(0, 0, 0)');expect(await style(page,'#glass-action','backgroundColor')).toBe('rgb(255, 255, 255)');
});
for(const fallback of ['unsupported','reduced-transparency']) test(`${fallback} glass actions have opaque backing`,async({page})=>{
 await page.route('**/reva.glass.css*',async route=>{const response=await route.fetch();let body=await response.text();body=fallback==='unsupported'?body.replaceAll('@supports ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)))','@supports (reva-unsupported: yes)'):body.replaceAll('(prefers-reduced-transparency: reduce)','(min-width: 0px)');await route.fulfill({response,body});});
 await page.goto('/preview/glass/light/');for(const id of ['glass-action','glass-secondary','glass-outline']) {expect(await alpha(page.locator('#'+id))).toBe(fallback==='unsupported'&&id==='glass-outline'?0:255);expect(await filter(page.locator('#'+id))).toBe('none');}
});
test('all glass button variants and accent palettes have readable light/dark examples',async({page})=>{
 await page.goto('/plain/');await page.addStyleTag({url:'/reva/reva.glass.css'});
 await page.evaluate(()=>{document.body.innerHTML='<main><h1>Glass button palettes</h1></main>';for(const theme of ['light','dark']) for(const accent of ['blue','violet','teal','green','orange','rose']) {const section=document.createElement('section');section.className='card';section.dataset.theme=theme;section.dataset.accent=accent;section.dataset.material='glass';section.innerHTML=`<h2>${theme} ${accent}</h2><div class="row"><button>Primary</button><button class="secondary">Secondary</button><button class="outline">Outline</button><button class="ghost">Ghost</button><button class="danger">Delete</button><button class="warning">Warning</button><input type="button" class="secondary" value="Native"></div>`;document.querySelector('main').append(section);}});
 await page.addScriptTag({path:require.resolve('axe-core')});const violations=await page.evaluate(async()=> (await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}})).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})));expect(violations).toEqual([]);
});
test('glass action links work without browser JavaScript',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:375,height:900}});const page=await context.newPage();await page.goto('/preview/glass/light/');await page.getByRole('link',{name:'Explore the controls'}).click();await expect(page).toHaveURL(/#forms$/);expect(await page.locator('script').count()).toBe(0);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await context.close();
});
