import {test,expect} from '@playwright/test';
test.use({javaScriptEnabled:false});

async function fixture(page,request,{build='global',mode='default',columns=3,merged=false,hidden=false}={}){
  const names=build==='modular'?['reva.tokens.css','reva.base.css','reva.components.css']:[build==='scoped'?'reva.scoped.css':build==='minified'?'reva.min.css':'reva.css'];
  const css=await Promise.all(names.map(async name=>{const r=await request.get('/reva/'+name);expect(r.ok()).toBe(true);return r.text();}));
  const cells=Array.from({length:columns},(_,i)=>`<td${merged&&i===0?' colspan="2"':''}${hidden&&i===2?' hidden':''}>${i===1?'<a href="#review">Review</a>':'Cell '+(i+1)}</td>`).join('');
  await page.setContent(`<!doctype html><html lang="en"><style>${css.join('\n')}</style><body>
    <div ${build==='scoped'?'class="reva"':''}><div data-table-sticky="both" style="max-block-size:18rem;max-inline-size:40rem">
    <table id="table" data-table="striped" ${mode==='default'?'':`data-table-hover="${mode}"`}><thead><tr>${Array.from({length:columns},(_,i)=>`<th scope="col">Column ${i+1}</th>`).join('')}</tr></thead><tbody><tr>${cells}</tr><tr>${cells}</tr></tbody></table>
    </div><p id="review">Review destination</p></div><table id="outside"><tbody><tr><td>Outside</td></tr></tbody></table>
  </body></html>`);
}

for(const build of ['global','minified','modular','scoped'])for(const mode of ['default','row','cell','column','none'])test(`table feedback (${build}, ${mode})`,async({page,request})=>{
  await fixture(page,request,{build,mode});
  const row=page.locator('#table tbody tr').first(),other=page.locator('#table tbody tr').nth(1);
  const cells=row.locator('td'),target=cells.nth(1);
  const shadows=locator=>locator.evaluateAll(els=>els.map(el=>getComputedStyle(el).boxShadow!=='none'));
  if(await page.evaluate(()=>matchMedia('(hover: hover)').matches)){
    await target.hover();
    expect(await shadows(cells)).toEqual(mode==='none'?[false,false,false]:['default','row'].includes(mode)?[true,true,true]:[false,true,false]);
    expect(await shadows(other.locator('td'))).toEqual(mode==='column'?[false,true,false]:[false,false,false]);
    if(mode==='column')expect(await shadows(page.locator('#table thead th'))).toEqual([false,true,false]);
    await page.mouse.move(0,0);
  }
  await target.locator('a').focus();await expect(target.locator('a')).toBeFocused();
  expect(await shadows(cells)).toEqual(mode==='none'?[false,false,false]:['default','row'].includes(mode)?[true,true,true]:[false,true,false]);
  await expect(target.locator('a')).not.toHaveCSS('outline-style','none');
  await page.emulateMedia({forcedColors:'active'});expect(await shadows(cells)).toEqual([false,false,false]);
  await page.emulateMedia({forcedColors:'none',media:'print'});expect(await shadows(cells)).toEqual([false,false,false]);
});

for(const shape of [{columns:33},{columns:3,merged:true},{columns:3,hidden:true}])test(`column mode falls back to one cell (${JSON.stringify(shape)})`,async({page,request})=>{
  await fixture(page,request,{mode:'column',...shape});
  test.skip(!await page.evaluate(()=>matchMedia('(hover: hover)').matches),'Hover-capable pointer required.');
  await page.locator('#table tbody tr').first().locator('td').nth(1).hover();
  const active=await page.locator('#table tbody td').evaluateAll(els=>els.filter(el=>getComputedStyle(el).boxShadow!=='none').length);
  expect(active).toBe(1);
});

test('nested-table interaction does not paint the outer table',async({page,request})=>{
  await fixture(page,request);
  await page.locator('#table tbody tr').first().locator('td').first().evaluate(el=>el.innerHTML='<table id="nested"><tbody><tr><td><a href="#review">Nested review</a></td></tr></tbody></table>');
  await page.getByRole('link',{name:'Nested review'}).focus();
  await expect(page.locator('#nested td')).not.toHaveCSS('box-shadow','none');
  await expect(page.locator('#table > tbody > tr').first().locator(':scope > td').nth(1)).toHaveCSS('box-shadow','none');
});
