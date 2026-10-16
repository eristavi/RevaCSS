import {test,expect} from '@playwright/test';
test.use({javaScriptEnabled:false});

const settle=dialog=>expect.poll(()=>dialog.evaluate(el=>el.getAnimations().filter(a=>a.playState==='running').length)).toBe(0);
for(const build of ['global','minified','scoped'])for(const material of ['glass','soft']) {
  test(`declarative modals retain native behaviour and appearance (${build}, ${material})`,async({page,request})=>{
    const scoped=build==='scoped',suffix=scoped?'.scoped':'';
    const names=[scoped?'reva.scoped.css':build==='minified'?'reva.min.css':'reva.css',`reva.motion${suffix}.css`,`reva.${material}${suffix}.css`];
    const css=await Promise.all(names.map(async name=>{const r=await request.get('/reva/'+name);expect(r.ok()).toBe(true);return r.text();}));
    await page.setContent(`<!doctype html><html lang="en"><style>${css.join('\n')}</style><body>
      <section ${scoped?'class="reva"':''} data-theme="dark" data-palette="mono" data-shape="rounded" data-depth="pronounced" data-material="${material}" data-motion="expressive">
        <button id="open" type="button" commandfor="inherited" command="show-modal">Open inherited</button>
        <button id="open-local" type="button" commandfor="local" command="show-modal">Open local</button>
        <dialog id="inherited" aria-labelledby="title" closedby="closerequest"><h2 id="title">Inherited dialog</h2><button type="button" commandfor="inherited" command="close" autofocus>Close inherited</button></dialog>
        <dialog id="local" aria-labelledby="local-title" closedby="any" data-theme="light" data-shape="square" data-depth="flat" data-material="solid" data-motion="none"><h2 id="local-title">Local dialog</h2><form method="dialog"><button value="dismiss" autofocus>Close local</button></form></dialog>
      </section>
      <button id="outside">Outside action</button><dialog id="outside-dialog">Outside boundary</dialog>
    </body></html>`);
    test.skip(!await page.evaluate(()=>'commandForElement' in HTMLButtonElement.prototype),'Native invoker commands unavailable; no JavaScript fallback is supplied.');
    const inherited=page.locator('#inherited'),local=page.locator('#local');
    await page.locator('#open').click();
    await expect(inherited).toBeVisible();
    expect(await inherited.evaluate(el=>el.matches(':modal'))).toBe(true);
    await expect(page.getByRole('button',{name:'Close inherited',exact:true})).toBeFocused();
    await page.locator('#outside').evaluate(el=>el.focus());
    await expect(page.locator('#outside')).not.toBeFocused();
    await settle(inherited);
    await expect(inherited).toHaveCSS('color-scheme','dark');
    await expect(inherited).toHaveCSS('border-top-left-radius','12px');
    await expect(inherited).not.toHaveCSS('box-shadow','none');
    await expect(inherited).toHaveCSS('transition-duration',/0\.24s/);
    if(material==='glass' && await page.evaluate(()=>CSS.supports('backdrop-filter','blur(1px)')))await expect(inherited).not.toHaveCSS('backdrop-filter','none');
    await page.getByRole('button',{name:'Close inherited',exact:true}).click();
    await expect(inherited).not.toHaveAttribute('open');
    await expect(page.locator('#open')).toBeFocused();
    await expect(inherited).toBeHidden();
    await page.locator('#open').click();await settle(inherited);await page.keyboard.press('Escape');
    await expect(inherited).toBeHidden();await expect(page.locator('#open')).toBeFocused();
    await page.locator('#open-local').click();await expect(local).toBeVisible();
    await expect(local).toHaveCSS('color-scheme','light');await expect(local).toHaveCSS('border-top-left-radius','0px');
    await expect(local).toHaveCSS('box-shadow','none');await expect(local).toHaveCSS('backdrop-filter','none');
    await expect(local).toHaveCSS('transition-duration','0s');
    await page.getByRole('button',{name:'Close local',exact:true}).click();await expect(local).toBeHidden();
    expect(await local.evaluate(el=>el.returnValue)).toBe('dismiss');
    if(await page.evaluate(()=>'closedBy' in HTMLDialogElement.prototype)){
      await page.locator('#open-local').click();await expect(local).toBeVisible();
      await page.mouse.click(1,1);await expect(local).toBeHidden();
    }
    await page.emulateMedia({reducedMotion:'reduce'});await page.locator('#open').click();
    await expect(inherited).toHaveCSS('transition-duration','0s');await expect(inherited).toHaveCSS('opacity','1');
    await page.keyboard.press('Escape');
    await page.emulateMedia({reducedMotion:'no-preference',forcedColors:'active'});await page.locator('#open').click();
    await expect(inherited).toHaveCSS('transition-duration','0s');await expect(inherited).toHaveCSS('backdrop-filter','none');
    if(scoped)await expect(page.locator('#outside-dialog')).toHaveCSS('transition-duration','0s');
  });
}
