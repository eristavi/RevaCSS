import {test,expect} from '@playwright/test';
test.use({javaScriptEnabled:false});

for(const build of ['global','minified','modular','scoped'])test(`scrollbar allocation stays inside supported panels (${build})`,async({page,request})=>{
  const scoped=build==='scoped';
  const names=build==='modular'?['reva.tokens.css','reva.base.css','reva.app-shell.css']:[scoped?'reva.scoped.css':build==='minified'?'reva.min.css':'reva.css'];
  const css=await Promise.all(names.map(async name=>{const r=await request.get('/reva/'+name);expect(r.ok()).toBe(true);return r.text();}));
  await page.setViewportSize({width:1200,height:900});
  await page.setContent(`<!doctype html><html lang="en"><style>${css.join('\n')}</style><body>
    <div ${scoped?'class="reva"':''} data-motion="none">
      <dialog open id="panel" aria-label="Scrollable information" style="position:static; margin:0; inline-size:22rem; block-size:12rem">
        <p id="marker">Short content</p><details><summary>More content</summary><p style="block-size:30rem">Long content</p></details>
      </dialog>
      <aside id="popover" popover>Popover</aside>
      <div class="app-shell"><aside id="sidebar">Sidebar</aside><header>Header</header><main>Content</main></div>
    </div><dialog id="outside">Outside boundary</dialog>
  </body></html>`);
  const supported=await page.evaluate(()=>CSS.supports('scrollbar-gutter','stable'));
  const panel=page.locator('#panel');
  if(supported){
    for(const id of ['panel','popover','sidebar'])await expect(page.locator('#'+id)).toHaveCSS('scrollbar-gutter','stable');
    await expect(page.locator('html')).toHaveCSS('scrollbar-gutter','auto');
    if(scoped)await expect(page.locator('#outside')).toHaveCSS('scrollbar-gutter','auto');
  }
  for(const dir of ['ltr','rtl']){
    await panel.evaluate((el,dir)=>el.dir=dir,dir);
    const width=()=>page.locator('#marker').evaluate(el=>el.getBoundingClientRect().width);
    const before=await width();
    await panel.locator('summary').click();
    expect(await panel.evaluate(el=>el.scrollHeight>el.clientHeight)).toBe(true);
    if(supported)expect(await width()).toBeCloseTo(before,1);
    await panel.locator('summary').click();
  }
  if(supported){
    await panel.evaluate(el=>el.style.scrollbarGutter='auto');await expect(panel).toHaveCSS('scrollbar-gutter','auto');
    await panel.evaluate(el=>el.style.removeProperty('scrollbar-gutter'));
    await page.emulateMedia({media:'print'});await expect(panel).toHaveCSS('scrollbar-gutter','auto');
  }
});
