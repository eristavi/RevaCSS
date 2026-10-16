import {test,expect} from '@playwright/test';
test.use({javaScriptEnabled:false});
for(const mode of ['global','scoped','modular'])test(`native scrollbar modes, nested colours and preference fallbacks (${mode})`,async({page,request})=>{
  const files=mode==='scoped'?['reva.scoped.css']:mode==='modular'?['reva.tokens.css','reva.base.css']:['reva.css'];
  const css=await Promise.all(files.map(async file=>{const response=await request.get('/reva/'+file);expect(response.ok()).toBe(true);return response.text();}));
  await page.setContent(`<!doctype html><html lang="en" data-theme="light"><head><style>${css.join('\n')}</style></head><body><div id="boundary" ${mode==='scoped'?'class="reva"':''}><div id="default" tabindex="0" role="region" aria-label="Default scrollbar" style="height:100px;overflow:auto"><p style="height:500px">Scrollable content</p></div><section id="parent" data-scrollbar="thin"><textarea id="field" aria-label="Notes" rows="3" style="field-sizing:fixed;block-size:8rem">${'Long notes\n'.repeat(30)}</textarea><div id="native" data-scrollbar="native"><div id="inherited">Native descendant</div><div id="auto" data-scrollbar="auto">Themed reset</div></div><div id="dark" data-theme="dark" data-accent="violet"><span id="probe" style="color:var(--re-primary);background:var(--re-surface)">Colour reference</span></div></section></div></body></html>`);
  if(await page.evaluate(()=>CSS.supports('scrollbar-width','thin'))){
    await expect(page.locator('#default')).toHaveCSS('scrollbar-width','auto');
    await expect(page.locator('#field')).toHaveCSS('scrollbar-width','thin');
    await expect(page.locator('#inherited')).toHaveCSS('scrollbar-width','auto');
    await expect(page.locator('#auto')).toHaveCSS('scrollbar-width','auto');
    if(mode==='scoped'){
      await page.evaluate(()=>document.body.setAttribute('data-scrollbar','thin'));
      await expect(page.locator('#default')).toHaveCSS('scrollbar-width','auto');
    }
  }
  if(await page.evaluate(()=>CSS.supports('scrollbar-color','red white'))){
    await expect(page.locator('#inherited')).toHaveCSS('scrollbar-color','auto');
    expect(await page.locator('#auto').evaluate(el=>getComputedStyle(el).scrollbarColor)).not.toBe('auto');
    const colours=await page.locator('#probe').evaluate(el=>{const s=getComputedStyle(el);return `${s.color} ${s.backgroundColor}`;});
    await expect(page.locator('#dark')).toHaveCSS('scrollbar-color',colours);
    await page.locator('#dark').evaluate(el=>el.setAttribute('data-accent','orange'));
    const changed=await page.locator('#probe').evaluate(el=>{const s=getComputedStyle(el);return `${s.color} ${s.backgroundColor}`;});
    expect(changed).not.toBe(colours);await expect(page.locator('#dark')).toHaveCSS('scrollbar-color',changed);
  }
  await page.locator('#default').focus();await page.keyboard.press('PageDown');
  await expect.poll(()=>page.locator('#default').evaluate(el=>el.scrollTop)).toBeGreaterThan(0);
  await page.emulateMedia({forcedColors:'active'});
  if(await page.evaluate(()=>CSS.supports('scrollbar-color','red white')))await expect(page.locator('#dark')).toHaveCSS('scrollbar-color','auto');
  if(await page.evaluate(()=>CSS.supports('scrollbar-width','thin')))await expect(page.locator('#field')).toHaveCSS('scrollbar-width','auto');
  await page.emulateMedia({forcedColors:'none',media:'print'});
  if(await page.evaluate(()=>CSS.supports('scrollbar-color','red white')))await expect(page.locator('#dark')).toHaveCSS('scrollbar-color','auto');
  if(await page.evaluate(()=>CSS.supports('scrollbar-width','thin')))await expect(page.locator('#field')).toHaveCSS('scrollbar-width','auto');
});
