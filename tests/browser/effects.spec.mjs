import {test,expect} from '@playwright/test';
import {waitForPopover} from './helpers/popover.mjs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
async function fixture(page,request,html,{scoped=false,minified=false,motion=false,extensions=[]}={}) {
 const sheets=await Promise.all([scoped?'reva.scoped.css':minified?'reva.min.css':'reva.css',...(motion?[scoped?'reva.motion.scoped.css':'reva.motion.css']:[]),...extensions].map(async file=>(await request.get('/reva/'+file)).text()));
 await page.setContent(`<!doctype html><html lang="en"><head><style>${sheets.join('\n')}</style></head><body id="top">${html}</body></html>`);
}
test.describe('native effects without application JavaScript',()=>{
 test.use({javaScriptEnabled:false});
 for(const minified of [false,true])test(`document motion, target feedback and return link (${minified?'minified':'global'})`,async({page,request})=>{
  await page.setViewportSize({width:800,height:600});
  await fixture(page,request,'<header style="position:fixed;inset:0 0 auto;height:70px;background:white">Header</header><p style="padding-top:90px"><a href="#destination">Find destination</a></p><div style="height:1600px"></div><h2 id="destination">Destination</h2><p><a class="scroll-top" href="#top">Back to top</a></p><div style="height:700px"></div>',{minified});
  await page.locator('html').evaluate(el=>{el.dataset.motion='expressive';el.style.setProperty('--re-anchor-offset','90px');});
  await expect(page.locator('html')).toHaveCSS('scroll-behavior','smooth');
  await page.getByRole('link',{name:'Find destination'}).click();
  await expect(page.locator('#destination')).toHaveCSS('animation-name','re-target-emphasis');
  await expect.poll(()=>page.locator('#destination').evaluate(el=>Math.round(el.getBoundingClientRect().top))).toBe(90);
  await page.locator('#destination').evaluate(el=>el.dataset.motion='none');await expect(page.locator('#destination')).toHaveCSS('animation-name','none');
  await page.locator('html').evaluate(el=>el.dataset.motion='none');await expect(page.locator('html')).toHaveCSS('scroll-behavior','auto');
  await page.getByRole('link',{name:'Back to top'}).focus();await page.keyboard.press('Enter');
  await expect.poll(()=>page.evaluate(()=>scrollY)).toBe(0);
  await expect(page.locator('.scroll-top')).toHaveCSS('min-block-size','44px');
 });
 test('scoped gallery overrides, RTL, preferences and outside boundaries',async({page,request})=>{
  await page.setViewportSize({width:700,height:900});
  await fixture(page,request,'<div class="reva" data-motion="expressive"><ul class="gallery" id="views" role="list" tabindex="0" aria-label="Views" style="width:350px"><li id="one"><h2>One</h2></li><li id="two"><h2>Two</h2></li><li id="three"><h2>Three</h2></li></ul><a href="#three">Last view</a></div><h2 id="outside">Outside</h2>',{scoped:true});
  const gallery=page.locator('#views');await expect(gallery).toHaveCSS('scroll-behavior','smooth');await expect(page.locator('html')).toHaveCSS('scroll-behavior','auto');
  await expect(page.locator('#outside')).toHaveCSS('animation-name','none');
  for(const dir of ['ltr','rtl']) {
   await gallery.evaluate((el,dir)=>el.dir=dir,dir);await page.getByRole('link',{name:'Last view'}).click();
   await expect.poll(()=>gallery.evaluate(el=>Math.abs(el.scrollLeft)>100)).toBe(true);
  }
  await gallery.evaluate(el=>el.dataset.motion='none');await expect(gallery).toHaveCSS('scroll-behavior','auto');await expect(page.locator('#three')).toHaveCSS('animation-name','none');
  await gallery.evaluate(el=>el.dataset.motion='expressive');await page.emulateMedia({reducedMotion:'reduce'});await expect(gallery).toHaveCSS('scroll-behavior','auto');await expect(page.locator('#three')).toHaveCSS('animation-name','none');
  await page.emulateMedia({reducedMotion:'no-preference',forcedColors:'active'});await expect(gallery).toHaveCSS('scroll-behavior','auto');
  await page.emulateMedia({forcedColors:'none',media:'print'});await expect(gallery).toHaveCSS('display','block');
 });
 for(const scoped of [false,true])test(`overlay open/close, RTL and preferences (${scoped?'scoped':'global'})`,async({page,request})=>{
  await fixture(page,request,`<section ${scoped?'class="reva"':''} data-motion="expressive"><button popovertarget="panel">Inspector</button><aside id="panel" class="drawer" popover="auto"><h2>Inspector title</h2><button popovertarget="panel" popovertargetaction="hide" autofocus>Close inspector</button></aside><dialog id="modal"><h2>Modal title</h2><form method="dialog"><button>Close modal</button></form></dialog></section><aside id="outside" popover>Outside</aside>`,{scoped,motion:true});
  const panel=page.locator('#panel');await page.getByRole('button',{name:'Inspector',exact:true}).click();await expect(panel).toBeVisible();
  const entrance=await panel.evaluate(el=>el.getAnimations().filter(a=>a.transitionProperty==='translate').flatMap(a=>a.effect.getKeyframes().map(k=>k.translate)));
  if(await page.evaluate(()=>typeof CSSStartingStyleRule!=='undefined'))expect(entrance.some(v=>parseFloat(v)>0)).toBe(true);
  await waitForPopover(panel);
  await expect(panel).toHaveCSS('transition-duration',/0\.24s/);
  await page.keyboard.press('Escape');await expect(panel).toBeHidden();
  await panel.evaluate(el=>el.dir='rtl');await page.getByRole('button',{name:'Inspector',exact:true}).click();await waitForPopover(panel);await expect(panel).toHaveCSS('translate','none');
  await page.getByRole('button',{name:'Close inspector',exact:true}).click();await expect(panel).toBeHidden();
  await page.evaluate(()=>document.querySelector('#modal').showModal());await expect(page.locator('#modal')).toBeVisible();await expect.poll(()=>page.locator('#modal').evaluate(el=>el.getAnimations().filter(a=>a.playState==='running').length)).toBe(0);
  await page.getByRole('button',{name:'Close modal'}).click();await expect(page.locator('#modal')).toBeHidden();
  await page.emulateMedia({reducedMotion:'reduce'});await page.getByRole('button',{name:'Inspector',exact:true}).click();await expect(panel).toHaveCSS('transition-duration','0s');await expect(panel).toHaveCSS('opacity','1');
  if(scoped)await expect(page.locator('#outside')).toHaveCSS('transition-duration','0s');
 });
 test('closing overlays excludes their controls from keyboard navigation during exit',async({page,request})=>{
  await fixture(page,request,'<section data-motion="subtle" style="--re-duration:2s"><button id="opener" popovertarget="exit-panel">Open panel</button><aside id="exit-panel" popover="auto"><button autofocus>Inside panel</button><a href="#top">Panel link</a></aside><button id="after">After panel</button></section>',{motion:true});
  await page.locator('#opener').click();await waitForPopover(page.locator('#exit-panel'));
  await page.keyboard.press('Escape');await expect(page.locator('#opener')).toBeFocused();
  await page.keyboard.press('Tab');await expect(page.locator('#after')).toBeFocused();
 });
 for(const scoped of [false,true])test(`scroll-top shares action appearance and materials (${scoped?'scoped':'global'})`,async({page,request})=>{
  for(const material of ['glass','soft','veil']) {
   await fixture(page,request,`<section ${scoped?'class="reva"':''} data-theme="dark" data-material="${material}" data-depth="pronounced" data-density="compact" data-shape="pill" data-size="large"><button id="action">Back to top</button><a id="return" class="scroll-top" href="#top">Back to top</a></section>`,{scoped,extensions:[`reva.${material}${scoped?'.scoped':''}.css`]});
   const appearance=el=>{const s=getComputedStyle(el);return ['backgroundColor','backgroundImage','color','boxShadow','backdropFilter','borderRadius','padding','fontSize'].map(p=>s[p]);};
   expect(await page.locator('#return').evaluate(appearance)).toEqual(await page.locator('#action').evaluate(appearance));
   await page.emulateMedia({media:'print'});await expect(page.locator('#return')).toBeHidden();await page.emulateMedia({media:'screen'});
  }
 });
 test('CSS-only customizer supports pointer and keyboard configuration disclosure',async({page})=>{
  await page.goto('/demos/blog/');await page.getByRole('button',{name:'Customize',exact:true}).click();
  await page.locator('#demo-theme').selectOption('dark');await page.locator('#demo-material').selectOption('glass');
  const summary=page.getByText('View HTML configuration',{exact:true});await summary.click();await expect(page.locator('.attribute-theme-dark')).toBeVisible();
  await summary.focus();await page.keyboard.press('Enter');await expect(page.locator('.configuration-summary')).not.toHaveAttribute('open');
 });
});
test('new documentation and demos reflow and pass automated accessibility',async({page})=>{
 for(const width of [320,1280])for(const route of ['/guide/motion/','/guide/effects/','/components/scroll-top/','/demos/shop/products/arc-lamp/','/demos/marketing/']) {
  await page.setViewportSize({width,height:900});await page.goto(route);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),route).toBe(true);
  await page.addScriptTag({path:require.resolve('axe-core')});
  const violations=await page.evaluate(async()=> (await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})));
  expect(violations,route+' '+width).toEqual([]);
 }
});
