import { test, expect } from '@playwright/test';
import { createRequire } from 'node:module';
const require=createRequire(import.meta.url);
const summary=(nav,label)=>nav.locator('summary:visible').filter({hasText:new RegExp('^'+label+'$')});
const rgba=async locator=>locator.evaluate(el=>{
  const ctx=document.createElement('canvas').getContext('2d');
  ctx.fillStyle=getComputedStyle(el).backgroundColor;ctx.fillRect(0,0,1,1);
  return [...ctx.getImageData(0,0,1,1).data];
});
const filter=async locator=>locator.evaluate(el=>getComputedStyle(el).backdropFilter || getComputedStyle(el).webkitBackdropFilter);

for(const theme of ['light','dark']) {
  test.describe(theme+' native glass navigation',()=>{
  test.use({javaScriptEnabled:false});
  test(theme+' glass retains native navigation, reflow and overlay stacking without JavaScript',async({page,browserName})=>{
    // This context disables scripts; native details and links provide the interaction.
    await page.goto('/preview/glass/'+theme+'/');
    const nav=page.getByRole('navigation',{name:'Glass navigation'});
    for(const label of ['Products','Frameworks','Components']) await summary(nav,label).click();
    const link=nav.getByRole('link',{name:'Top menu',exact:true});
    await expect(link).toBeVisible();
    expect(await link.evaluate(el=>{const r=el.getBoundingClientRect();return el.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2));})).toBe(true);
    await link.focus();await page.keyboard.press('Shift+Tab');await page.keyboard.press('Tab');expect(await link.evaluate(el=>getComputedStyle(el).outlineStyle)).not.toBe('none');
    await link.click();await expect(page).toHaveURL(/#navigation$/);
    await page.setViewportSize({width:320,height:800});
    await summary(nav,'Menu').click();
    for(const label of ['Products','Frameworks','Components']) await summary(nav,label).click();
    await expect(nav.getByRole('link',{name:'Top menu',exact:true})).toBeVisible();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    for(const el of await nav.locator('a:visible,summary:visible').all()) expect((await el.boundingBox()).height).toBeGreaterThanOrEqual(44);
    await summary(nav,'Menu').click();
    await expect(nav.getByRole('link',{name:'Top menu',exact:true})).toBeHidden();
    expect(await page.locator('script').count()).toBe(0);
  });
  });
  test(theme+' glass examples pass automated accessibility checks closed and expanded',async({page})=>{
    await page.goto('/preview/glass/'+theme+'/');
    await page.addScriptTag({path:require.resolve('axe-core')});
    for(const width of [1280,320]) {
      await page.setViewportSize({width,height:900});
      const nav=page.getByRole('navigation',{name:'Glass navigation'});
      if(width<768) await summary(nav,'Menu').click();
      for(const label of ['Products','Frameworks','Components']) await summary(nav,label).click();
      const result=await page.evaluate(async()=>await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}}));
      expect(result.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)}))).toEqual([]);
    }
  });
}
test.describe('glass native interactions',()=>{
  test.use({javaScriptEnabled:false});
  test('native standalone disclosures and mobile menu work without scripts',async({page})=>{
    await page.setViewportSize({width:320,height:800});
    await page.goto('/preview/glass/light/');
    const nav=page.getByRole('navigation',{name:'Glass navigation'});
    await summary(nav,'Menu').focus();await page.keyboard.press('Enter');
    await expect(nav.getByRole('link',{name:'Home',exact:true})).toBeVisible();
    await page.locator('#glass-disclosure summary').focus();await page.keyboard.press('Space');
    await expect(page.locator('#glass-disclosure')).toHaveAttribute('open','');
    expect(await page.locator('script').count()).toBe(0);
  });
});
test('material resets and local colour modes stay inside their own scopes',async({page})=>{
  await page.goto('/preview/glass/light/');
  expect((await rgba(page.locator('#glass-primary')))[3]).toBeLessThan(255);
  expect(await filter(page.locator('#glass-primary'))).toContain('blur');
  expect((await rgba(page.locator('#glass-solid')))[3]).toBe(255);
  expect(await filter(page.locator('#glass-solid'))).toBe('none');
  expect((await rgba(page.locator('#glass-reentry')))[3]).toBeLessThan(255);
  expect((await rgba(page.locator('#glass-outside')))[3]).toBe(255);
  expect(await filter(page.locator('#glass-outside'))).toBe('none');
  expect((await rgba(page.locator('#glass-local-theme')))[0]).toBeLessThan(100);
  await page.locator('.glass-stage').evaluate(el=>el.dataset.theme='dark');
  expect((await rgba(page.locator('#glass-primary')))[0]).toBeLessThan(100);
  expect((await rgba(page.locator('#glass-outside')))[0]).toBe(255);
});
test('shared spacing, shape, depth, fill, border, type and control settings apply',async({page})=>{
  await page.goto('/preview/glass/light/');
  const states=await page.evaluate(()=>{
    const css=id=>getComputedStyle(document.getElementById(id));
    return {compactPadding:css('glass-compact').padding,spaciousPadding:css('glass-spacious').padding,compactRadius:css('glass-compact').borderRadius,spaciousRadius:css('glass-spacious').borderRadius,flat:css('glass-compact').boxShadow,depth:css('glass-spacious').boxShadow,border:css('glass-compact').borderTopWidth,type:css('glass-spacious').fontSize,solid:css('glass-compact').backgroundImage,gradient:css('glass-primary').backgroundImage,accent:css('glass-action').getPropertyValue('--re-primary').trim()};
  });
  expect(parseFloat(states.compactPadding)).toBeCloseTo(19.2,4);expect(states.spaciousPadding).toBe('30px');
  expect(states.compactRadius).toBe('0px');expect(states.spaciousRadius).toBe('24px');
  expect(states.flat).toBe('none');expect(states.depth).not.toBe('none');expect(states.border).toBe('2px');expect(states.type).toBe('18px');
  expect(states.solid).not.toBe(states.gradient);expect(states.accent).toBe('#7041cf');
  const input=page.getByLabel('Email address');
  expect((await rgba(input))[3]).toBe(255);
  await input.evaluate(el=>el.dataset.controls='minimal');
  expect((await rgba(input))[3]).toBe(0);
  await page.locator('#glass-primary').evaluate(el=>el.dataset.border='none');
  expect(await page.locator('#glass-primary').evaluate(el=>getComputedStyle(el).borderTopWidth)).toBe('0px');
});
test('loading the extension without material activation preserves core appearance',async({page})=>{
  await page.goto('/preview/light/');
  const before=await page.locator('.card').first().evaluate(el=>({bg:getComputedStyle(el).backgroundColor,shadow:getComputedStyle(el).boxShadow,border:getComputedStyle(el).borderTopWidth}));
  await page.addStyleTag({url:'/reva/reva.glass.css'});
  expect(await page.locator('.card').first().evaluate(el=>({bg:getComputedStyle(el).backgroundColor,shadow:getComputedStyle(el).boxShadow,border:getComputedStyle(el).borderTopWidth}))).toEqual(before);
});
test('scoped glass isolates HTML outside a reva boundary',async({page})=>{
  await page.goto('/preview/glass/light/');
  await page.evaluate(()=>{
    for(const link of document.querySelectorAll('link[rel=stylesheet]')) link.remove();
    document.body.innerHTML='<article class="card" data-material="glass" id="outside">Outside</article><section class="reva" data-material="glass"><article class="card" id="inside">Inside</article></section>';
  });
  await page.addStyleTag({url:'/reva/reva.scoped.css'});
  await page.addStyleTag({url:'/reva/reva.glass.scoped.css'});
  expect((await rgba(page.locator('#outside')))[3]).toBe(0);expect(await filter(page.locator('#outside'))).toBe('none');
  expect((await rgba(page.locator('#inside')))[3]).toBeLessThan(255);expect((await rgba(page.locator('#inside')))[3]).toBeGreaterThan(0);
  expect(await filter(page.locator('#inside'))).toContain('blur');
});
test('contrast overrides reset locally and system preferences force opaque surfaces',async({page})=>{
  await page.goto('/preview/glass/light/');
  await page.locator('.glass-stage').evaluate(el=>el.dataset.contrast='more');
  expect((await rgba(page.locator('#glass-primary')))[3]).toBe(255);expect(await filter(page.locator('#glass-primary'))).toBe('none');
  await page.locator('#glass-primary').evaluate(el=>el.dataset.contrast='auto');
  expect((await rgba(page.locator('#glass-primary')))[3]).toBeLessThan(255);
  await page.emulateMedia({contrast:'more',reducedMotion:'reduce'});
  await expect.poll(()=>page.evaluate(()=>matchMedia('(prefers-contrast: more)').matches)).toBe(true);
  await expect.poll(async()=>(await rgba(page.locator('#glass-primary')))[3]).toBe(255);
  await expect.poll(()=>filter(page.locator('#glass-primary'))).toBe('none');
  expect(await page.locator('#glass-action').evaluate(el=>getComputedStyle(el).transitionDuration.split(',').every(v=>v.trim()==='0s'))).toBe(true);
  await page.emulateMedia({contrast:'no-preference',forcedColors:'active'});
  await expect.poll(()=>page.evaluate(()=>matchMedia('(forced-colors: active)').matches)).toBe(true);
  expect(await filter(page.locator('#glass-primary'))).toBe('none');expect(await page.locator('#glass-primary').evaluate(el=>getComputedStyle(el).backgroundImage)).toBe('none');
  await page.emulateMedia({forcedColors:'none',media:'print'});
  expect((await rgba(page.locator('#glass-primary')))[3]).toBe(255);expect(await filter(page.locator('#glass-primary'))).toBe('none');
  await expect(page.getByRole('navigation',{name:'Glass navigation'})).toBeHidden();
});
test('unsupported backdrop filtering falls back to opaque core surfaces',async({page})=>{
  await page.route('**/reva.glass.css',async route=>{
    const response=await route.fetch();
    const body=(await response.text()).replace('@supports ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)))','@supports (reva-test-unsupported: yes)');
    await route.fulfill({response,body});
  });
  await page.goto('/preview/glass/light/');
  expect((await rgba(page.locator('#glass-primary')))[3]).toBe(255);expect(await filter(page.locator('#glass-primary'))).toBe('none');
  await page.locator('#glass-disclosure summary').click();await expect(page.locator('#glass-disclosure')).toHaveAttribute('open','');
});
test('reduced-transparency fallback rule produces opaque surfaces',async({page})=>{
  // Playwright does not emulate this preference across all engines; exercise the rule through a media-condition substitution.
  await page.route('**/reva.glass.css',async route=>{
    const response=await route.fetch();
    const body=(await response.text()).replace('(prefers-reduced-transparency: reduce)','(min-width: 0px)');
    await route.fulfill({response,body});
  });
  await page.goto('/preview/glass/light/');
  expect((await rgba(page.locator('#glass-primary')))[3]).toBe(255);expect(await filter(page.locator('#glass-primary'))).toBe('none');
});
