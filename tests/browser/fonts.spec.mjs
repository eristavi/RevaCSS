import {test,expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';
import {waitForPopover,waitForDisclosure} from './helpers/popover.mjs';

const family=(page,selector)=>page.locator(selector).evaluate(el=>getComputedStyle(el).fontFamily);
const normalize=value=>value.replaceAll('"','').replaceAll("'",'').replaceAll(' ','');
const system='system-ui,sans-serif',manrope='Manrope,system-ui,sans-serif';
const fontChoices=async(page,selector,expected)=>expect(normalize(await family(page,selector))).toBe(expected);

for(const build of ['global','minified','modular','scoped'])test(`${build}: script-free font inheritance, local resets and native controls`,async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false});
 const page=await context.newPage();
 const css=build==='modular'?(await Promise.all(['tokens','base'].map(name=>readFile(`dist/reva.${name}.css`,'utf8')))).join('\n'):await readFile(`dist/reva${build==='minified'?'.min':build==='scoped'?'.scoped':''}.css`,'utf8');
 await page.setContent(`<!doctype html><html><head><style>${css}</style></head><body style="font-family:serif"><p id="outside">Outside</p><main ${build==='scoped'?'class="reva"':''}>
 <p id="default">Default</p><section data-font="system" id="system"><h2 id="heading">System heading</h2><p id="text">System text</p>
 <button id="button">Button</button><input id="input" aria-label="Input"><select id="select" aria-label="Select"><option>One</option></select><textarea id="textarea" aria-label="Notes"></textarea>
 <code id="code">Monospace</code><pre data-font="system" id="pre">Code stays monospace</pre>
 <section data-font="manrope"><p id="reset">Local default</p><h3 id="reset-heading">Default heading</h3><section data-font="system"><p id="reentry">System again</p></section></section>
 <button data-font="manrope" id="direct-reset">Direct reset</button>
 <section style="--re-font-heading:serif"><h3 id="custom-heading">Heading override</h3><h3 id="direct-custom-heading" data-font="manrope">Heading override with a local font</h3></section></section></main></body></html>`);

 for(const selector of ['#system','#heading','#text','#button','#input','#select','#textarea','#reentry'])await fontChoices(page,selector,system);
 for(const selector of ['#reset','#reset-heading','#direct-reset'])await fontChoices(page,selector,manrope);
 expect(await family(page,'#code')).toContain('monospace');expect(await family(page,'#pre')).toContain('monospace');
 expect(await family(page,'#custom-heading')).toBe('serif');
 expect(await family(page,'#direct-custom-heading')).toBe('serif');
 if(build==='scoped'){await fontChoices(page,'#default',manrope);expect(await family(page,'#outside')).toBe('serif');}
 await context.close();
});

test('System does not download Manrope even when the optional face is declared',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();
 const requests=[];page.on('request',request=>requests.push(request.url()));
 await page.route('**/font-fixture.html',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><html data-font="system"><head><link rel="stylesheet" href="/reva/reva.css"><link rel="stylesheet" href="/reva/reva-fonts.css"></head><body><h1>System heading</h1><p>System text</p><button>System action</button><input aria-label="Name"><code>Code</code></body></html>'}));
 await page.goto('/font-fixture.html');
 await page.evaluate(()=>document.fonts.ready);
 await fontChoices(page,'body',system);await fontChoices(page,'h1',system);await fontChoices(page,'button',system);
 expect(requests.filter(url=>/\/fonts\/.*\.(woff2?|ttf)(?:\?|$)/.test(url))).toEqual([]);
 await page.locator('html').evaluate(el=>el.setAttribute('data-font','manrope'));
 await fontChoices(page,'body',manrope);
 await page.evaluate(()=>document.fonts.ready);
 expect(requests.some(url=>/\/fonts\/Manrope\.woff2(?:\?|$)/.test(url))).toBe(true);
 expect(await page.evaluate(()=>document.fonts.check('16px Manrope'))).toBe(true);
 await context.close();
});

test('font choice persists between documentation and demos and exports without scripts',async({page})=>{
 await page.goto('/guide/');await page.getByRole('button',{name:'Customize',exact:true}).click();
 await page.getByText('Typography and controls',{exact:true}).click();
 expect(await page.locator('#demo-font option').evaluateAll(options=>options.map(option=>[option.value,option.textContent]))).toEqual([['manrope','Default (Manrope)'],['system','System']]);
 await page.locator('#demo-font').selectOption('system');await expect(page.locator('html')).toHaveAttribute('data-font','system');
 await fontChoices(page,'#main',system);
 await page.goto('/demos/blog/');await page.getByRole('button',{name:'Customize',exact:true}).click();
 await expect(page.locator('#demo-font')).toHaveValue('system');await fontChoices(page,'#demo-site',system);
 const pending=page.waitForEvent('download');await page.locator('.demo-customizer a[download]').click();
 const html=await readFile(await (await pending).path(),'utf8');expect(html).toContain('data-font="system"');expect(html).not.toMatch(/<script\b/);
 await page.reload();await expect(page.locator('#demo-font')).toHaveValue('system');
 await page.getByRole('button',{name:'Customize',exact:true}).click();await page.getByText('Typography and controls',{exact:true}).click();
 await page.locator('#demo-font').selectOption('manrope');await expect(page.locator('html')).toHaveAttribute('data-font','manrope');
 await fontChoices(page,'#demo-site',manrope);
 await page.getByRole('button',{name:'Reset to defaults',exact:true}).click();
 expect(await page.evaluate(()=>localStorage.getItem('revacss:settings:v1'))).toBeNull();
 await page.goto('/guide/');await expect(page.locator('#demo-font')).toHaveValue('manrope');await fontChoices(page,'#main',manrope);
});

test('CSS-only font selector changes text and the exported configuration preview',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();
 await page.goto('/demos/blog/');await page.getByRole('button',{name:'Customize',exact:true}).click();
 await waitForPopover(page.locator('#demo-customizer-popup'));
 const typography=page.locator('.customizer-group').filter({has:page.locator('#demo-font')});
 await typography.locator('summary').click();await waitForDisclosure(typography);await page.locator('#demo-font').selectOption('system');
 await fontChoices(page,'#demo-site',system);
 await page.getByText('View HTML configuration',{exact:true}).click();await expect(page.locator('.attribute-font-system')).toBeVisible();await expect(page.locator('.attribute-font-manrope')).toBeHidden();
 await page.locator('#demo-font').selectOption('manrope');await fontChoices(page,'#demo-site',manrope);
 await page.setViewportSize({width:320,height:800});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await context.close();
});
