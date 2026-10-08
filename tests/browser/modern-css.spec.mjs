import {test,expect} from '@playwright/test';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
test.use({javaScriptEnabled:false});
async function fixture(page,request,html,{scoped=false,extensions=[]}={}) {
  const sheets=await Promise.all([scoped?'reva.scoped.css':'reva.css',...extensions].map(async file=>{
    const response=await request.get('/reva/'+file);expect(response.ok()).toBe(true);return response.text();
  }));
  await page.setContent(`<!doctype html><html lang="en"><head><style>${sheets.join('\n')}</style></head><body>${html}</body></html>`);
}
const regions=(title,text)=>`<article class="card"><header><h2>${title}</h2></header><section><p>${text}</p></section><footer><div><button>Choose plan</button><a href="#plans">Compare plans</a></div></footer></article>`;

test('safe-area tokens protect drawers, app-shell overlays and asymmetric modal bounds',async({page,request})=>{
  await page.setViewportSize({width:390,height:800});
  await fixture(page,request,`<button popovertarget="drawer">Open drawer</button><aside class="drawer" id="drawer" popover="auto" style="--re-safe-top:48px;--re-safe-right:30px;--re-safe-bottom:40px;--re-safe-left:20px"><header><h2>Settings</h2></header><section>Content</section><footer><button>Save</button></footer></aside><div class="app-shell"><aside id="sidebar" popover="auto" style="--re-safe-top:48px;--re-safe-bottom:40px">Sidebar</aside></div><dialog id="modal" style="--re-safe-left:70px;--re-safe-right:10px;--re-safe-top:60px;--re-safe-bottom:20px">Modal content</dialog>`);
  await page.getByRole('button',{name:'Open drawer'}).click();
  const padding=el=>{const s=getComputedStyle(el);return [s.paddingTop,s.paddingRight,s.paddingBottom,s.paddingLeft];};
  expect(await page.locator('#drawer').evaluate(padding)).toEqual(['48px','30px','40px','20px']);
  await page.keyboard.press('Escape');await page.evaluate(()=>document.querySelector('#sidebar').showPopover());
  expect((await page.locator('#sidebar').evaluate(padding))[0]).toBe('48px');
  await page.keyboard.press('Escape');await page.evaluate(()=>document.querySelector('#modal').showModal());
  const bounds=await page.locator('#modal').boundingBox();expect(bounds.x).toBeGreaterThanOrEqual(70);expect(bounds.x+bounds.width).toBeLessThanOrEqual(380);expect(bounds.y).toBeGreaterThanOrEqual(60);expect(bounds.y+bounds.height).toBeLessThanOrEqual(780);
  await page.evaluate(()=>document.querySelector('#modal').close());
  await page.evaluate(()=>{document.documentElement.dir='rtl';document.querySelector('#drawer').showPopover();});
  expect(await page.locator('#drawer').evaluate(padding)).toEqual(['48px','30px','40px','20px']);
  await page.evaluate(()=>{document.querySelector('#drawer').style.cssText='--re-safe-top:0px;--re-safe-right:0px;--re-safe-bottom:0px;--re-safe-left:0px';});
  expect(await page.locator('#drawer').evaluate(padding)).toEqual(['16px','16px','16px','16px']);
});

for(const scoped of [false,true])test(`card grid adapts to its container and aligns regions (${scoped?'scoped':'global'})`,async({page,request})=>{
  await page.setViewportSize({width:1200,height:1000});
  await fixture(page,request,`<div ${scoped?'class="reva"':''}><div id="plans" class="card-grid" style="inline-size:900px">${regions('Personal','Short description')}${regions('Shared workspace with comprehensive reporting','A longer description for several teams working together.')}</div></div><article id="outside">Outside content</article>`,{scoped});
  const footer=page.locator('#plans .card > footer > div').first();await expect(footer).toHaveCSS('flex-direction','row');
  expect(await page.locator('#plans .card > footer').first().evaluate(el=>getComputedStyle(el).containerType)).toBe('inline-size');
  if(await page.evaluate(()=>CSS.supports('grid-template-rows','subgrid'))){
    const top=await page.locator('#plans .card > footer').evaluateAll(els=>els.map(el=>el.getBoundingClientRect().top));expect(Math.abs(top[0]-top[1])).toBeLessThan(1);
  }
  await page.locator('#plans').evaluate(el=>el.style.inlineSize='640px');await expect(footer).toHaveCSS('flex-direction','column');
  if(scoped)await expect(page.locator('#outside')).toHaveCSS('container-type','normal');
  await page.locator('#plans').evaluate(el=>el.style.inlineSize='280px');
  expect(await page.locator('#plans').evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true);
});

test('gallery remains keyboard reachable, fragment navigable, RTL-safe and printable',async({page,request})=>{
  await page.setViewportSize({width:375,height:900});
  await fixture(page,request,'<p id="help">Scroll or follow links.</p><ul class="gallery" tabindex="0" role="list" aria-label="Views" aria-describedby="help"><li id="first"><h2>First</h2><p>One</p></li><li id="second"><h2>Second</h2><p>Two</p></li><li id="last"><h2>Last</h2><p>Three</p></li></ul><a id="last-link" href="#last">View last</a>');
  const gallery=page.getByRole('list',{name:'Views'});await expect(gallery).toHaveCSS('scroll-snap-type',/^inline(?: proximity)?$/);
  await page.keyboard.press('Tab');await expect(gallery).toBeFocused();expect(await gallery.evaluate(el=>getComputedStyle(el).outlineStyle)).not.toBe('none');
  for(const dir of ['ltr','rtl']) {
    await page.evaluate(dir=>document.documentElement.dir=dir,dir);await page.locator('#last-link').click();
    await expect.poll(()=>page.locator('#last').evaluate(el=>{const item=el.getBoundingClientRect(),parent=el.parentElement.getBoundingClientRect();return item.left>=parent.left-1&&item.right<=parent.right+1;})).toBe(true);
  }
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.emulateMedia({media:'print'});await expect(gallery).toHaveCSS('display','block');await expect(gallery).toHaveCSS('overflow-x','visible');
});

test('optional scroll motion respects local opt-out, reduced motion, print and scoped boundaries',async({page,request})=>{
  await fixture(page,request,'<div class="reva" data-motion="expressive"><article id="animated" class="card">Animated</article><article id="static" class="card" data-motion="none">Static</article></div><article id="outside" class="card" data-motion="expressive">Outside</article>',{scoped:true,extensions:['reva.scroll-motion.scoped.css']});
  const supported=await page.evaluate(()=>CSS.supports('animation-timeline','view()')&&CSS.supports('animation-range','entry 0% entry 100%'));
  await expect(page.locator('#animated')).toHaveCSS('animation-name',supported?'re-scroll-enter':'none');
  await expect(page.locator('#static')).toHaveCSS('animation-name','none');await expect(page.locator('#outside')).toHaveCSS('animation-name','none');
  await page.emulateMedia({reducedMotion:'reduce'});await expect(page.locator('#animated')).toHaveCSS('animation-name','none');await expect(page.locator('#animated')).toHaveCSS('opacity','1');
  await page.emulateMedia({reducedMotion:'no-preference',media:'print'});await expect(page.locator('#animated')).toHaveCSS('animation-name','none');
});

test('document transitions keep ordinary navigation usable without JavaScript',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/guide/transitions/one/');
  await page.getByRole('link',{name:'Open document two'}).click();await expect(page).toHaveURL(/\/guide\/transitions\/two\/$/);await expect(page.getByRole('heading',{name:'Document two',exact:true})).toBeVisible();
  await page.emulateMedia({reducedMotion:'no-preference'});await page.getByRole('link',{name:'Open document one'}).click();await expect(page).toHaveURL(/\/guide\/transitions\/one\/$/);
});

test('supported scroll timelines advance with scrolling while static fallback stays visible',async({page,request})=>{
  await page.setViewportSize({width:800,height:600});await page.emulateMedia({reducedMotion:'no-preference'});
  await fixture(page,request,'<section data-motion="expressive"><div style="block-size:650px"></div><article id="enter" class="card" style="block-size:200px">Readable content</article><div style="block-size:1200px"></div></section>',{extensions:['reva.scroll-motion.css']});
  const card=page.locator('#enter');
  const supported=await page.evaluate(()=>CSS.supports('animation-timeline','view()')&&CSS.supports('animation-range','entry 0% entry 100%'));
  if(supported){
    await expect.poll(()=>card.evaluate(el=>Number(getComputedStyle(el).opacity))).toBeCloseTo(.85,2);
    expect(await card.evaluate(el=>el.getAnimations()[0].timeline.constructor.name)).toBe('ViewTimeline');
    await page.evaluate(()=>window.scrollTo(0,650));
    await expect.poll(()=>card.evaluate(el=>Number(getComputedStyle(el).opacity))).toBeCloseTo(1,2);
  }else await expect(card).toHaveCSS('opacity','1');
});

test.describe('example accessibility instrumentation',()=>{
test.use({javaScriptEnabled:true});
test('documented examples fit narrow screens and retain accessible semantics',async({page})=>{
  for(const width of [320,1280]){
    await page.setViewportSize({width,height:900});await page.goto('/guide/modern-css/');
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  }
  await page.addScriptTag({path:require.resolve('axe-core')});
  const violations=await page.evaluate(async()=> (await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}})).violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})));
  expect(violations).toEqual([]);
});
});

test.describe('native cross-document transition instrumentation',()=>{
  test.use({javaScriptEnabled:true});
  test('supporting browsers create snapshots and reduced motion disables them',async({page})=>{
    await page.emulateMedia({reducedMotion:'no-preference'});await page.goto('/guide/transitions/one/');
    test.skip(!await page.evaluate(()=> 'CSSViewTransitionRule' in window),'Cross-document CSS rule is unavailable; ordinary navigation is tested separately.');
    const observe=()=>page.evaluate(()=>window.addEventListener('pageswap',event=>sessionStorage.setItem('reva-test-transition',event.viewTransition?'active':'none'),{once:true}));
    await observe();await page.getByRole('link',{name:'Open document two'}).click();
    await expect(page).toHaveURL(/\/two\/$/);expect(await page.evaluate(()=>sessionStorage.getItem('reva-test-transition'))).toBe('active');
    await page.emulateMedia({reducedMotion:'reduce'});await observe();await page.getByRole('link',{name:'Open document one'}).click();
    await expect(page).toHaveURL(/\/one\/$/);expect(await page.evaluate(()=>sessionStorage.getItem('reva-test-transition'))).toBe('none');
  });
});
