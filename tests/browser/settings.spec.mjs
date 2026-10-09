import {test,expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';
const open=page=>page.getByRole('button',{name:'Customize',exact:true}).click();
test('material surfaces update before hover and match a fresh page',async({page})=>{
 await page.goto('/components/metrics/');
 const card=page.locator('#main .example-demo .card').first();
 const appearance=()=>card.evaluate(el=>{
  const css=getComputedStyle(el);
  return {background:css.backgroundColor,image:css.backgroundImage,shadow:css.boxShadow,filter:css.backdropFilter};
 });
 const solid=await appearance();
 for(const theme of ['light','dark'])for(const material of ['glass','soft','veil','solid']){
  await open(page);
  await page.locator('#demo-theme').selectOption(theme);
  await page.locator('#demo-material').selectOption(material);
  await expect(page.locator('html')).toHaveAttribute('data-material',material);
  // Read the surface while the pointer remains over the customizer, never
  // triggering the hover that used to repair Firefox's stale scope matches.
  const live=await appearance();
  if(material==='glass')expect(live.filter).toContain('blur(');
  else expect(live.filter).toBe('none');
  if(material==='soft')expect(live.shadow.split(', rgba(').length).toBeGreaterThan(1);
  await page.reload();
  expect(await appearance(),`${theme}/${material} live matches reload`).toEqual(live);
 }
 await open(page);await page.getByRole('button',{name:'Reset to defaults',exact:true}).click();
 await expect.poll(appearance).toEqual(solid);
});
test('documentation backdrop follows palette and contrast settings',async({page})=>{
 await page.goto('/guide/');
 const backdrop=()=>page.locator('body').evaluate(el=>getComputedStyle(el).backgroundImage);
 const initial=await backdrop();expect(initial).toContain('radial-gradient');
 await open(page);await page.locator('#demo-palette').selectOption('forest');
 await expect.poll(backdrop).not.toBe(initial);
 await page.getByText('Effects and accessibility',{exact:true}).click();
 await page.locator('#demo-contrast').selectOption('more');await expect.poll(backdrop).toBe('none');
});
test('demo choices persist across different pages, reloads and standalone examples',async({page})=>{
 await page.goto('/demos/marketing/');await open(page);
 for(const [key,value] of Object.entries({theme:'dark',palette:'ocean',material:'glass',shape:'pill'}))await page.locator('#demo-'+key).selectOption(value);
 await page.getByText('Layout',{exact:true}).click();await page.locator('#demo-density').selectOption('compact');
 await page.goto('/demos/blog/archive/');
 for(const [key,value] of Object.entries({theme:'dark',palette:'ocean',material:'glass',shape:'pill',density:'compact'}))await expect(page.locator('#demo-'+key)).toHaveValue(value);
 expect(await page.locator('#demo-site').evaluate(el=>getComputedStyle(el).colorScheme)).toBe('dark');
 await page.reload();await expect(page.locator('#demo-density')).toHaveValue('compact');
 await page.goto('/demos/dashboard/');await expect(page.locator('#demo-material')).toHaveValue('glass');
 await page.goto('/demos/blog/source/archive.html');await expect(page.locator('html')).toHaveAttribute('data-palette','ocean');await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
});
test('documentation mode persists independently and demo reset clears all saved choices',async({page})=>{
 await page.goto('/guide/');await page.getByRole('button',{name:'Customize',exact:true}).click();await page.locator('#demo-theme').selectOption('dark');
 await page.goto('/components/forms/');await expect(page.locator('#demo-theme')).toHaveValue('dark');await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
 await page.goto('/demos/blog/');await open(page);await page.locator('#demo-theme').selectOption('light');await page.locator('#demo-palette').selectOption('mono');
 await page.getByRole('button',{name:'Reset to defaults',exact:true}).click();await expect(page.locator('#demo-palette')).toHaveValue('default');
 expect(await page.evaluate(()=>localStorage.getItem('revacss:demo-settings:v1'))).toBeNull();
 await page.goto('/demos/dashboard/');await expect(page.locator('#demo-palette')).toHaveValue('default');await page.goto('/guide/');await expect(page.locator('#demo-theme')).toHaveValue('dark');
});
test('downloads contain selected settings without the optional preference scripts',async({page})=>{
 await page.goto('/demos/blog/');await open(page);await page.locator('#demo-theme').selectOption('dark');await page.locator('#demo-palette').selectOption('forest');
 await page.locator('#demo-button-material').selectOption('liquid');
 await page.locator('#demo-border').selectOption('defined');
 const pending=page.waitForEvent('download');await page.locator('.demo-customizer a[download]').click();const download=await pending;
 const html=await readFile(await download.path(),'utf8');expect(html).toContain('data-palette="forest"');expect(html).toContain('data-theme="dark"');expect(html).toContain('data-border="defined"');expect(html).toContain('data-button-material="liquid"');expect(html).toContain('reva.button-materials.css');expect(html).not.toMatch(/<script\b/);
});
test('invalid preferences and unavailable storage do not break the dropdown preview',async({page,context})=>{
 await page.goto('/');await page.evaluate(()=>localStorage.setItem('revacss:demo-settings:v1',JSON.stringify({theme:'invalid',palette:'not-a-palette',material:'solid',injected:'bad'})));
 await page.goto('/demos/blog/');await expect(page.locator('#demo-theme')).toHaveValue('auto');await expect(page.locator('#demo-palette')).toHaveValue('default');
 await context.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw new Error('Storage blocked');}}));
 await page.reload();await open(page);await page.locator('#demo-theme').selectOption('dark');await expect(page.locator('#demo-settings-status')).toContainText('did not allow saving');
 expect(await page.locator('#demo-site').evaluate(el=>getComputedStyle(el).colorScheme)).toBe('dark');
});
test.describe('CSS-only fallback',()=>{
 test.use({javaScriptEnabled:false});
 test('dropdowns update theme, material and the selected attribute snippet',async({page})=>{
  await page.goto('/demos/blog/');await open(page);await page.locator('#demo-theme').selectOption('dark');await page.locator('#demo-material').selectOption('glass');
  expect(await page.locator('#demo-site').evaluate(el=>getComputedStyle(el).colorScheme)).toBe('dark');
  await page.getByText('View HTML configuration',{exact:true}).click();
  await expect(page.locator('.attribute-theme-dark')).toBeVisible();await expect(page.locator('.attribute-theme-light')).toBeHidden();
  await page.setViewportSize({width:390,height:844});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 });
});
