import {test,expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';

for(const scoped of [false,true])test(`${scoped?'scoped':'global'} custom shape groups and local preset resets`,async({page})=>{
  await page.setContent(`<main ${scoped?'class="reva"':''} data-shape="custom" style="--re-custom-surface-radius:1rem;--re-custom-field-radius:.25rem;--re-custom-action-radius:2rem"><article class="card" id="surface"><input id="field" aria-label="Name"><select id="select" aria-label="Choice"><option>One</option></select><textarea id="textarea" aria-label="Message"></textarea><button id="action">Save</button><span class="badge" id="badge">New</span></article><section data-shape="square"><article class="card" id="square"><input id="square-field" aria-label="Square field"><button id="square-action">Square action</button></article></section></main>`);
  await page.addStyleTag({content:await readFile(`dist/reva.${scoped?'scoped.':''}css`,'utf8')});
  await expect(page.locator('#surface')).toHaveCSS('border-top-left-radius','16px');
  for(const id of ['field','select','textarea'])await expect(page.locator('#'+id)).toHaveCSS('border-top-left-radius','4px');
  for(const id of ['action','badge'])await expect(page.locator('#'+id)).toHaveCSS('border-top-left-radius','32px');
  for(const id of ['square','square-field','square-action'])await expect(page.locator('#'+id)).toHaveCSS('border-top-left-radius','0px');
});

test('custom radiuses persist and export into script-free starting HTML',async({page})=>{
  await page.goto('/demos/blog/');
  await page.getByRole('button',{name:'Customize',exact:true}).click();
  await page.locator('#demo-shape').selectOption('custom');
  await expect(page.locator('#custom-radius-editor')).toBeVisible();
  await page.locator('#radius-surface-number').fill('1.25');
  await page.locator('#radius-surface-number').dispatchEvent('change');
  await expect(page.locator('#radius-action-number')).toHaveValue('1.25');
  await page.locator('#radius-linked').uncheck();
  await page.locator('#radius-field-number').fill('0.3');
  await page.locator('#radius-field-number').dispatchEvent('change');
  await page.goto('/demos/shop/');
  await page.getByRole('button',{name:'Customize',exact:true}).click();
  await expect(page.locator('#demo-shape')).toHaveValue('custom');
  await expect(page.locator('#radius-field-number')).toHaveValue('0.3');
  await expect(page.locator('#radius-action-number')).toHaveValue('1.25');
  const pending=page.waitForEvent('download');
  await page.locator('.demo-customizer a[download]').click();
  const download=await pending;
  const html=await readFile(await download.path(),'utf8');
  expect(html).toContain('data-shape="custom"');
  expect(html).toContain('--re-custom-field-radius: 0.3rem');
  expect(html).not.toMatch(/<script\b/);
  await page.setContent(html);
  await page.addStyleTag({content:await readFile('dist/reva.css','utf8')});
  const card=page.locator('.card').first();
  await expect(card).toHaveCSS('border-top-left-radius','20px');
});
