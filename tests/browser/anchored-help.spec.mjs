import {test,expect} from '@playwright/test';
import {topics} from '../../docs/src/data/examples.js';
import {fixtureHTML} from '../../docs/src/data/manual-test.js';
test.use({javaScriptEnabled:false});

for(const scoped of [false,true])test(`native anchored help and independent instances (${scoped?'scoped':'global'})`,async({page,request})=>{
  const suffix=scoped?'.scoped':'';
  const names=[scoped?'reva.scoped.css':'reva.css',`reva.motion${suffix}.css`,`reva.glass${suffix}.css`];
  const css=await Promise.all(names.map(async name=>{const r=await request.get('/reva/'+name);expect(r.ok()).toBe(true);return r.text();}));
  const examples=topics.find(t=>t.slug==='disclosures').examples.filter(e=>e.id.startsWith('anchored-help'));
  await page.setViewportSize({width:800,height:700});
  await page.setContent(`<!doctype html><html lang="en"><style>${css.join('\n')}</style><body><main ${scoped?'class="reva"':''}>
    ${examples.map(e=>`<section id="${e.id}">${fixtureHTML(e.html,e.id,'/')}</section>`).join('\n')}
    </main><aside id="unrelated" popover>Unrelated panel</aside></body></html>`);
  test.skip(!await page.evaluate(()=>'popover' in HTMLElement.prototype),'Native popovers unavailable; essential hints remain outside the panels.');
  for(const example of examples){
    const region=page.locator('#'+example.id),panel=region.locator('aside[popover]');
    const opener=region.locator('button[popovertarget]:not([popovertargetaction])');
    await expect(opener).toHaveAccessibleName(example.glass?'Glass password help':'Password help');
    await expect(opener.locator('svg')).toHaveAttribute('aria-hidden','true');
    await expect(opener).toHaveCSS('background-color','rgba(0, 0, 0, 0)');
    await expect(opener).toHaveCSS('border-top-width','0px');
    await expect(opener).toHaveCSS('box-shadow','none');
    await expect(opener).toHaveCSS('backdrop-filter','none');
    const touchTarget=await opener.boundingBox();expect(touchTarget.width).toBeGreaterThanOrEqual(44);expect(touchTarget.height).toBeGreaterThanOrEqual(44);
    await expect(region.getByText('Use at least 12 characters.',{exact:true})).toBeVisible();
    await expect(panel).toBeHidden();
    for(const dir of ['ltr','rtl']){
      await region.evaluate((el,dir)=>el.dir=dir,dir);
      await opener.click();await expect(panel).toBeVisible();
      await expect(panel).toHaveAccessibleName('Choosing a password');
      await expect(panel.getByRole('button')).toBeFocused();
      await expect.poll(()=>panel.evaluate(el=>el.getAnimations().filter(a=>a.playState==='running').length)).toBe(0);
      const size=await panel.boundingBox();
      expect(size.x).toBeGreaterThanOrEqual(0);expect(size.x+size.width).toBeLessThanOrEqual(801);
      expect(size.y).toBeGreaterThanOrEqual(0);expect(size.y+size.height).toBeLessThanOrEqual(701);
      const anchors=await page.evaluate(()=>CSS.supports('position-area','block-end span-inline-end')&&CSS.supports('position-anchor','auto'));
      if(anchors)await expect(panel).not.toHaveCSS('position-area','none');
      else expect(Math.abs(size.x+size.width/2-400)).toBeLessThan(2);
      if(example.glass){
        await expect(panel).toHaveCSS('color-scheme','dark');await expect(panel).toHaveCSS('transition-duration',/0\.24s/);
        await panel.evaluate(el=>{el.dataset.material='solid';el.dataset.motion='none';});
        await expect(panel).toHaveCSS('backdrop-filter','none');await expect(panel).toHaveCSS('transition-duration','0s');
        await panel.evaluate(el=>{delete el.dataset.material;delete el.dataset.motion;});
      }
      await panel.getByRole('button').click();await expect(panel).toBeHidden();await expect(opener).toBeFocused();
      await opener.click();await expect(panel).toBeVisible();await page.keyboard.press('Escape');await expect(panel).toBeHidden();
      await opener.click();await expect(panel).toBeVisible();await region.locator('input').click();await expect(panel).toBeHidden();
    }
    await page.emulateMedia({media:'print'});await expect(panel).toHaveCSS('display','none');await expect(region.getByText('Use at least 12 characters.',{exact:true})).toBeVisible();await page.emulateMedia({media:'screen'});
  }
  // Positioning belongs only to the examples; unrelated popovers keep defaults.
  if(await page.evaluate(()=>CSS.supports('position-area','block-end span-inline-end')))await expect(page.locator('#unrelated')).toHaveCSS('position-area','none');
});
