import {test,expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';

for(const scoped of [false,true])for(const viewport of [320,1600])test(`${scoped?'scoped':'global'} Full/Custom widths at ${viewport}px`,async({page})=>{
  await page.setViewportSize({width:viewport,height:900});
  await page.setContent(`<body style="margin:0"><main ${scoped?'class="reva"':''} data-width="full"><div class="container" id="full">Full</div><section data-width="custom" style="--re-custom-max-width:40rem;--re-custom-side-padding:2rem"><div class="container" id="custom">Custom</div><section data-width="standard"><div class="container" id="reset">Standard</div></section></section><section data-width="custom" style="--re-custom-max-width:1rem;--re-custom-side-padding:20rem"><div class="container" id="narrow">Narrow</div></section></main></body>`);
  await page.addStyleTag({content:await readFile(`dist/reva.${scoped?'scoped.':''}css`,'utf8')});
  expect((await page.locator('#full').boundingBox()).width).toBe(viewport);
  await expect(page.locator('#full')).toHaveCSS('padding-left','16px');
  expect((await page.locator('#custom').boundingBox()).width).toBe(Math.min(viewport,640));
  await expect(page.locator('#custom')).toHaveCSS('padding-left','32px');
  expect((await page.locator('#reset').boundingBox()).width).toBe(Math.min(viewport-32,1200));
  await expect(page.locator('#reset')).toHaveCSS('padding-left','0px');
  await expect(page.locator('#narrow')).toHaveCSS('padding-left','4px');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(viewport);
});

test('Full navbar stays full under a custom page width',async({page})=>{
  await page.setViewportSize({width:1600,height:900});
  await page.setContent('<main data-width="custom" data-navbar-width="full" style="--re-custom-max-width:40rem;--re-custom-side-padding:2rem"><header class="navbar-header container"><nav class="top-menu"><a class="menu-brand" href="#main">Brand</a></nav></header><div class="container" id="content">Page</div></main>');
  await page.addStyleTag({content:await readFile('dist/reva.css','utf8')});
  expect((await page.locator('.navbar-header').boundingBox()).width).toBe(1600);
  expect((await page.locator('#content').boundingBox()).width).toBe(640);
  await expect(page.locator('.navbar-header')).toHaveCSS('padding-left','0px');
  await expect(page.locator('.top-menu')).toHaveCSS('padding-left','512px');
});

test('custom page width persists and is embedded in script-free downloads',async({page})=>{
  await page.goto('/demos/blog/');
  await page.getByRole('button',{name:'Customize',exact:true}).click();
  await page.getByText('Layout',{exact:true}).click();
  await page.locator('#demo-width').selectOption('custom');
  await expect(page.locator('#custom-width-editor')).toBeVisible();
  for(const [key,value] of [['max','80'],['padding','2']]){
    await page.locator(`#width-${key}-number`).fill(value);
    await page.locator(`#width-${key}-number`).dispatchEvent('change');
  }
  await page.goto('/demos/shop/');
  await page.getByRole('button',{name:'Customize',exact:true}).click();
  await expect(page.locator('#demo-width')).toHaveValue('custom');
  await expect(page.locator('#width-padding-number')).toHaveValue('2');
  const pending=page.waitForEvent('download');
  await page.locator('.demo-customizer a[download]').click();
  const html=await readFile(await (await pending).path(),'utf8');
  expect(html).toContain('data-width="custom"');
  expect(html).toContain('--re-custom-max-width: 80rem');
  expect(html).toContain('--re-custom-side-padding: 2rem');
  expect(html).not.toMatch(/<script\b/);
});
