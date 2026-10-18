import {test,expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';

const sheet=name=>readFile('dist/'+name,'utf8');
for(const profile of ['global','minified','scoped'])test(`${profile}: native defaults, shared settings and local exceptions without classes`,async({page})=>{
 await page.goto('/starters/semantic.html');
 await page.setContent('<!doctype html><html><head><title>Native defaults</title></head><body><div data-reva data-shape="square" data-density="compact" data-size="large" data-table="striped"><fieldset id="shared"><legend>Shared</legend><input aria-label="Name"><button>Save</button></fieldset><section data-shape="rounded" data-density="comfortable" data-size="medium"><fieldset id="reset"><legend>Reset</legend><input aria-label="Name"></fieldset></section><article id="neutral" class="card"><p>Native article</p></article><a id="link" class="button" href="#shared">Native link</a></div></body></html>');
 await page.addStyleTag({content:await sheet(profile==='scoped'?'reva.semantic.scoped.css':profile==='minified'?'reva.semantic.min.css':'reva.semantic.css')});
 const style=selector=>page.locator(selector).evaluate(el=>{const s=getComputedStyle(el);return {radius:s.borderRadius,padding:s.paddingTop,font:s.fontSize,background:s.backgroundColor,display:s.display};});
 expect((await style('#shared')).radius).toBe('0px');
 expect((await style('#shared input')).font).toBe('18px');
 expect((await style('#reset')).radius).toBe('12px');
 expect((await style('#reset input')).font).toBe('16px');
 expect((await style('#neutral')).background).toBe('rgba(0, 0, 0, 0)');
 expect((await style('#link')).display).toBe('inline');
});

test('optional patterns enable framework classes while ordinary application CSS wins',async({page})=>{
 await page.goto('/starters/semantic.html');
 await page.setContent('<!doctype html><html><head><title>Optional patterns</title></head><body><main class="container"><div class="grid"><article id="card" class="card"><a id="action" class="button" href="#card">Open</a></article></div></main></body></html>');
 await page.addStyleTag({content:await sheet('reva.semantic.css')});
 expect(await page.locator('#action').evaluate(el=>getComputedStyle(el).display)).toBe('inline');
 await page.addStyleTag({content:await sheet('reva.patterns.css')});
 expect(await page.locator('#action').evaluate(el=>getComputedStyle(el).display)).toBe('inline-flex');
 expect(await page.locator('.grid').evaluate(el=>getComputedStyle(el).display)).toBe('grid');
 await page.addStyleTag({content:'.card { padding:37px; }'});
 expect(await page.locator('#card').evaluate(el=>getComputedStyle(el).paddingTop)).toBe('37px');
 await page.locator('#card').evaluate(el=>{el.dataset.variant='success';el.insertAdjacentHTML('beforeend','<button id="danger" class="danger">Danger</button><button id="success">Success</button><button id="outline" class="outline">Outline</button>');});
 expect(await page.locator('#danger').evaluate(el=>getComputedStyle(el).backgroundColor)).toBe('rgb(166, 61, 79)');
 expect(await page.locator('#success').evaluate(el=>getComputedStyle(el).backgroundColor)).toBe('rgb(37, 107, 78)');
 expect(await page.locator('#outline').evaluate(el=>getComputedStyle(el).backgroundColor)).toBe('rgba(0, 0, 0, 0)');
});

test('new scoped foundation and native materials stop before fresh islands',async({page})=>{
 await page.goto('/starters/semantic.html');
 await page.setContent('<!doctype html><html><head><title>Scoped material</title></head><body><section data-reva data-material="glass" data-button-material="soft" data-shape="square"><fieldset id="outer"><legend>Outer</legend></fieldset><section data-reva><fieldset id="inner"><legend>Inner</legend><button id="inner-button">Save</button></fieldset></section></section><section data-reva><fieldset id="baseline"><legend>Baseline</legend><button id="baseline-button">Save</button></fieldset></section></body></html>');
 for(const file of ['reva.semantic.scoped.css','reva.semantic.glass.scoped.css','reva.semantic.button-materials.scoped.css'])await page.addStyleTag({content:await sheet(file)});
 const read=selector=>page.locator(selector).evaluate(el=>{const s=getComputedStyle(el);return {filter:s.backdropFilter,shadow:s.boxShadow,radius:s.borderRadius};});
 expect((await read('#outer')).filter).not.toBe('none');
 expect(await read('#inner')).toEqual(await read('#baseline'));
 expect(await read('#inner-button')).toEqual(await read('#baseline-button'));
});

for(const profile of ['semantic','patterns'])test(`customizer exports ${profile} with selected presets and custom CSS, without its scripts`,async({page})=>{
 await page.goto('/guide/foundation/');
 await page.getByRole('button',{name:'Customize',exact:true}).click();
 await page.locator('details.customizer-group').evaluateAll(nodes=>nodes.forEach(el=>el.open=true));
 for(const [key,value] of Object.entries({palette:'custom',shape:'custom',density:'custom',width:'custom',background:'colorful',table:'striped',ratio:'square',fit:'contain',font:'system',material:'glass'}))await page.locator('#demo-'+key).selectOption(value);
 await page.locator('#palette-light-primary').fill('#123456');
 await page.locator('#palette-light-primary').dispatchEvent('change');
 await page.locator('#radius-surface-number').fill('1.25');
 await page.locator('#radius-surface-number').dispatchEvent('change');
 await page.locator('#density-surface-number').fill('1.1');
 await page.locator('#density-surface-number').dispatchEvent('change');
 await page.locator('#width-max-number').fill('88');
 await page.locator('#width-max-number').dispatchEvent('change');
 await page.locator('#background-colour-0').fill('#123abc');
 await page.locator('#background-colour-0').dispatchEvent('change');
 await page.locator('#starter-profile').selectOption(profile);
 const pending=page.waitForEvent('download');
 await page.locator('#download-project-starter').click();
 const download=await pending;
 const html=await readFile(await download.path(),'utf8');
 expect(html).not.toMatch(/<script\b/);
 expect(html).toContain('data-table="striped"');expect(html).toContain('data-ratio="square"');
 expect(html).toContain('dist/reva.semantic.css');
 for(const value of ['#123456','1.25rem','1.1rem','88rem','#123ABC'])expect(html.toUpperCase()).toContain(value.toUpperCase());
 if(profile==='semantic'){expect(html).not.toMatch(/\bclass=/);expect(html).not.toContain('dist/reva.patterns.css');}
 else expect(html).toContain('dist/reva.patterns.css');
 // Resolve the exported local distribution links exactly as an extracted
 // project would, then verify the downloaded settings actually render.
 await page.route('**/dist/*.css',async route=>route.fulfill({contentType:'text/css',body:await sheet(new URL(route.request().url()).pathname.split('/').at(-1))}));
 await page.setContent(html,{waitUntil:'networkidle'});
 expect(await page.locator('#project-name').evaluate(el=>getComputedStyle(el).borderRadius)).toBe('20px');
 expect(await page.locator('html').getAttribute('data-material')).toBe('glass');
 expect(await page.locator('button[type=submit]').evaluate(el=>getComputedStyle(el).backgroundColor)).not.toBe('rgb(31, 110, 140)');
});

test('default semantic starter download works without authoring JavaScript',async({request})=>{
 const response=await request.get('/guide/foundation/starter.html');
 expect(response.ok()).toBe(true);
 const html=await response.text();
 expect(html).toContain('dist/reva.semantic.css');
 expect(html).not.toMatch(/<script\b|\bclass=/);
});
