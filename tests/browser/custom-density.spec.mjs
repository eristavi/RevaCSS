import {test,expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';

for(const scoped of [false,true])test(`${scoped?'scoped':'global'} independent density groups preserve control heights and local resets`,async({page})=>{
  await page.setContent(`<main ${scoped?'class="reva"':''} data-density="custom" style="--re-custom-surface-padding:2rem;--re-custom-control-density:0;--re-custom-content-space:.5rem"><article class="card" id="surface"><p id="copy">Content</p><input id="field" aria-label="Name"><div class="row" id="actions"><button id="action">Save</button><button>Cancel</button></div></article><section data-density="comfortable"><article class="card" id="local"><input id="local-field" aria-label="Local field"></article></section></main>`);
  await page.addStyleTag({content:await readFile(`dist/reva.${scoped?'scoped.':''}css`,'utf8')});
  await expect(page.locator('#surface')).toHaveCSS('padding-top','48px');
  await expect(page.locator('#field')).toHaveCSS('padding-top','0px');
  await expect(page.locator('#action')).toHaveCSS('padding-top','0px');
  for(const id of ['field','action'])expect((await page.locator('#'+id).boundingBox()).height).toBeGreaterThanOrEqual(44);
  await expect(page.locator('#actions')).toHaveCSS('column-gap','8px');
  await expect(page.locator('#copy')).toHaveCSS('margin-bottom','8px');
  await expect(page.locator('#local')).toHaveCSS('padding-top','24px');
  await expect(page.locator('#local-field')).toHaveCSS('padding-top','10.4px');
});

test('density values persist and export without editor scripts',async({page})=>{
  await page.goto('/demos/blog/');
  await page.getByRole('button',{name:'Customize',exact:true}).click();
  await page.getByText('Layout',{exact:true}).click();
  await page.locator('#demo-density').selectOption('custom');
  await expect(page.locator('#custom-density-editor')).toBeVisible();
  await page.locator('#density-surface-number').fill('1.5');
  await page.locator('#density-surface-number').dispatchEvent('change');
  await expect(page.locator('#density-control-number')).toHaveValue('1.5');
  await page.locator('#density-linked').uncheck();
  await page.locator('#density-spacing-number').fill('0.5');
  await page.locator('#density-spacing-number').dispatchEvent('change');
  await page.goto('/demos/shop/');
  await page.getByRole('button',{name:'Customize',exact:true}).click();
  await expect(page.locator('#density-spacing-number')).toHaveValue('0.5');
  await expect(page.locator('#density-control-number')).toHaveValue('1.5');
  const pending=page.waitForEvent('download');
  await page.locator('.demo-customizer a[download]').click();
  const html=await readFile(await (await pending).path(),'utf8');
  expect(html).toContain('data-density="custom"');
  expect(html).toContain('--re-custom-surface-padding: 1.5rem');
  expect(html).toContain('--re-custom-control-density: 1.5;');
  expect(html).toContain('--re-custom-content-space: 0.5rem');
  expect(html).not.toMatch(/<script\b/);
});
