import { expectOnlyOptionalSettings } from './helpers/settings.mjs';
import {test,expect} from '@playwright/test';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const route='/guide/device-checks/';
// Flush entrance animations before native pointer operations. Locator clicks
// still perform Playwright's visibility and pointer-stability checks; visible
// device placement/focus and scroll performance remain manual gates.
const settle=async panel=>{
 await expect(panel).toBeVisible();let stable=0;
 await expect.poll(async()=>{const running=await panel.evaluate(el=>el.getAnimations().some(a=>a.playState==='running'));stable=running?0:stable+1;return stable;},{message:'popover entrance animation has finished'}).toBeGreaterThanOrEqual(2);
};

// These validate the fixture, not a physical-device or assistive-technology pass.
for(const width of [320,390,1280])test(`device fixture reflows and has accessible markup at ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:900});await page.goto(route);
 await expect(page.locator('h1')).toHaveCount(1);await expectOnlyOptionalSettings(page);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 const invalid=await page.evaluate(()=>{const ids=[...document.querySelectorAll('[id]')].map(el=>el.id);return{duplicates:ids.filter((id,i)=>ids.indexOf(id)!==i),targets:[...document.querySelectorAll('[popovertarget]')].filter(el=>!document.getElementById(el.getAttribute('popovertarget'))).map(el=>el.outerHTML)};});
 expect(invalid).toEqual({duplicates:[],targets:[]});
 await page.addScriptTag({path:require.resolve('axe-core')});
 const violations=await page.evaluate(async()=> (await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})));
 expect(violations).toEqual([]);
});
test.describe('device fixture native operation',()=>{
 test.use({javaScriptEnabled:false});
 test('all fixture menu instances open three nested levels and dismiss without scripts',async({page})=>{
  test.setTimeout(60000);
  for(const width of [390,1280]){
   await page.setViewportSize({width,height:900});await page.goto(route);
   for(const mode of ['light','dark','glass']){
    const nav=page.getByRole('navigation',{name:`${mode} device navigation`,exact:true});await nav.scrollIntoViewIfNeeded();
    for(const name of [...(width<768?['Menu']:[]),'Explore','Materials','Surfaces']){
     const button=nav.getByRole('button',{name,exact:true});const id=await button.getAttribute('popovertarget');await button.click();await settle(page.locator('#'+id));
    }
    await expect(nav.getByRole('link',{name:'Glass guide',exact:true})).toBeVisible();
    await nav.getByRole('button',{name:'Back to Materials',exact:true}).click();await expect(nav.getByRole('button',{name:'Surfaces',exact:true})).toBeVisible();
    await page.mouse.click(2,850);await expect(nav.locator('[popover]:popover-open')).toHaveCount(0);
   }
   await expectOnlyOptionalSettings(page);
  }
 });
 test('glass and edge response controls work while disabled controls remain disabled',async({page})=>{
   // Ten animated response panels need additional time in software-rendered WebKit.
   // Keep their native motion and every interaction assertion enabled.
   test.setTimeout(120000);
  await page.goto(route);
  for(const theme of ['light','dark']){
   const opener=page.getByRole('button',{name:'Open glass response',exact:true}).nth(theme==='light'?0:1);await opener.click();const panel=page.locator(`#device-glass-response-${theme}`);await settle(panel);await panel.getByRole('button',{name:'Close response',exact:true}).click();await expect(panel).toBeHidden();
  }
  for(const theme of ['light','dark'])for(const material of ['solid','glass']){
   const fixture=page.locator(`#device-edge-${theme}-${material}`);await expect(fixture.getByRole('button',{name:'Disabled',exact:true})).toBeDisabled();const animated=await fixture.getByRole('button',{name:'Animated',exact:true}).boundingBox(),plain=await fixture.getByRole('button',{name:'Plain',exact:true}).boundingBox();expect(animated.width).toBeCloseTo(plain.width,2);expect(animated.height).toBeCloseTo(plain.height,2);
   for(const name of ['Animated','Plain']){await fixture.getByRole('button',{name,exact:true}).click();const panel=page.locator('#device-edge-response');await settle(panel);await panel.getByRole('button',{name:'Close edge response',exact:true}).click();await expect(panel).toBeHidden();}
   await fixture.getByRole('button',{name:'Disabled',exact:true}).scrollIntoViewIfNeeded();const disabled=await fixture.getByRole('button',{name:'Disabled',exact:true}).boundingBox();await page.mouse.click(disabled.x+disabled.width/2,disabled.y+disabled.height/2);await expect(page.locator('#device-edge-response')).toBeHidden();
  }
 });
});
test('CSS indicators distinguish requested preferences and available features',async({page})=>{
 await page.goto(route);
 const supports=await page.evaluate(()=>({blur:CSS.supports('backdrop-filter:blur(1px)')||CSS.supports('-webkit-backdrop-filter:blur(1px)'),mask:CSS.supports('mask-composite:exclude')}));
 await expect(page.locator(supports.blur?'.blur-available':'.blur-unavailable')).toBeVisible();await expect(page.locator(supports.mask?'.mask-available':'.mask-unavailable')).toBeVisible();
 await page.emulateMedia({reducedMotion:'reduce',contrast:'more'});await page.reload();await expect(page.locator('.motion-reduced')).toBeVisible();await expect(page.locator('.motion-allowed')).toBeHidden();await expect(page.locator('.contrast-more')).toBeVisible();
 expect(await page.locator('#device-edge-dark-glass-action').evaluate(el=>getComputedStyle(el,'::after').display)).toBe('none');
 await page.emulateMedia({reducedMotion:'no-preference',contrast:'no-preference'});await page.reload();await expect(page.locator('.motion-allowed')).toBeVisible();await expect(page.locator('.contrast-normal')).toBeVisible();
});
