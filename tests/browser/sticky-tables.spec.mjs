import {test,expect} from '@playwright/test';
test.use({javaScriptEnabled:false});

const rows=Array.from({length:16},(_,i)=>`<tr><th scope="row">Row ${i+1}</th><td>Description ${i+1}</td><td>Owner ${i+1}</td></tr>`).join('');
const table=`<table data-table="striped" style="min-inline-size:48rem"><caption>Project review</caption><thead><tr><th scope="col">Project</th><th scope="col">Description</th><th scope="col">Owner</th></tr></thead><tbody>${rows}</tbody></table>`;

for(const build of ['global','minified','modular','scoped'])for(const mode of ['none','header','column','both']){
  test(`local native table scrolling (${build}, ${mode})`,async({page,request})=>{
    const scoped=build==='scoped';
    const names=build==='modular'?['reva.tokens.css','reva.base.css','reva.components.css']:[scoped?'reva.scoped.css':build==='minified'?'reva.min.css':'reva.css'];
    const css=await Promise.all(names.map(async name=>{const r=await request.get('/reva/'+name);expect(r.ok()).toBe(true);return r.text();}));
    await page.setViewportSize({width:900,height:900});
    await page.setContent(`<!doctype html><html lang="en"><style>${css.join('\n')}</style><body>
      <div ${scoped?'class="reva"':''} data-motion="none"><div id="wrap" data-table-sticky="${mode}" tabindex="0" role="region" aria-label="Projects" style="max-block-size:16rem;max-inline-size:30rem">${table}</div>
      <div id="legacy" class="table-scroll">${table}</div></div>
      <div id="outside" data-table-sticky="both">${table}</div>
    </body></html>`);
    const wrapper=page.locator('#wrap'),head=wrapper.locator('thead'),first=wrapper.locator('tbody tr:first-child > th');
    const pinsHead=mode==='header'||mode==='both',pinsColumn=mode==='column'||mode==='both';
    await expect(wrapper).toHaveCSS('overflow-x','auto');await expect(wrapper).toHaveCSS('overflow-y','auto');
    await expect(head).toHaveCSS('position',pinsHead?'sticky':'static');await expect(first).toHaveCSS('position',pinsColumn?'sticky':'static');
    await expect(page.locator('#legacy')).toHaveCSS('overflow-x','auto');
    if(scoped)await expect(page.locator('#outside thead')).toHaveCSS('position','static');
    await wrapper.focus();await expect(wrapper).toBeFocused();
    for(const dir of ['ltr','rtl']){
      await wrapper.evaluate((el,dir)=>{el.dir=dir;el.scrollTop=0;el.scrollLeft=0;},dir);
      const headerTop=await head.evaluate(el=>el.getBoundingClientRect().top);
      const inlineEdge=()=>first.evaluate((el,dir)=>{const r=el.getBoundingClientRect();return dir==='rtl'?r.right:r.left;},dir);
      const columnEdge=await inlineEdge();
      await wrapper.evaluate((el,dir)=>{el.scrollTop=120;el.scrollLeft=dir==='rtl'?-120:120;},dir);
      expect(await wrapper.evaluate(el=>el.scrollTop)).toBeGreaterThan(0);
      if(pinsHead){
        const box=await wrapper.boundingBox();expect(await head.evaluate(el=>el.getBoundingClientRect().top)).toBeCloseTo(box.y,0);
      }else expect(await head.evaluate(el=>el.getBoundingClientRect().top)).toBeLessThan(headerTop-50);
      if(pinsColumn)expect(await inlineEdge()).toBeCloseTo(columnEdge,0);
      else expect(Math.abs(await inlineEdge()-columnEdge)).toBeGreaterThan(50);
    }
    if(pinsColumn){
      await wrapper.locator('tbody tr:first-child > th').evaluate(el=>el.colSpan=2);
      await expect(first).toHaveCSS('position','static');
      await expect(head).toHaveCSS('position',pinsHead?'sticky':'static');
    }
    // A local none value disables pinning without removing the scroll container.
    await wrapper.evaluate(el=>el.dataset.tableSticky='none');await expect(head).toHaveCSS('position','static');await expect(first).toHaveCSS('position','static');
    await wrapper.evaluate((el,mode)=>el.dataset.tableSticky=mode,mode);
    await page.emulateMedia({media:'print'});
    await expect(wrapper).toHaveCSS('max-height','none');await expect(wrapper).toHaveCSS('overflow-x','visible');
    await expect(head).toHaveCSS('position','static');await expect(first).toHaveCSS('position','static');
  });
}
