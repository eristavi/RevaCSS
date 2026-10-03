import {test,expect} from '@playwright/test';
test.describe('native drawer / inspector',()=>{
 test.use({javaScriptEnabled:false});
 for(const width of [320,390,1440]) test(`project details open and dismiss without JavaScript at ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:700});await page.goto('/demos/dashboard/');
  const trigger=page.getByRole('button',{name:'Autumn campaign',exact:true});
  const panel=page.locator('#project-inspector-0');
  const settle=async()=>{await expect(panel).toBeVisible();await expect.poll(()=>panel.evaluate(el=>el.getAnimations().filter(a=>a.playState==='running').length)).toBe(0);};
  await expect(panel).toBeHidden();await trigger.click();await settle();
  await expect(panel.getByRole('heading',{name:'Autumn campaign'})).toBeVisible();
  await expect(panel.getByRole('button',{name:'Close',exact:true})).toBeFocused();
  const bounds=await panel.boundingBox();expect(bounds.width).toBeLessThanOrEqual(width);expect(bounds.x).toBeGreaterThanOrEqual(-1);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.keyboard.press('Escape');await expect(panel).toBeHidden();await expect(trigger).toBeFocused();
  await trigger.click();await settle();await panel.getByRole('button',{name:'Back to dashboard'}).click();await expect(panel).toBeHidden();
  if(width===1440){await trigger.click();await settle();await page.mouse.click(30,100);await expect(panel).toBeHidden();}
  await expect(page.locator('script')).toHaveCount(0);
 });
 test('inherited placement, local reset, RTL and scoped build',async({page})=>{
  await page.goto('/components/drawers/');
  await page.getByRole('button',{name:'Open filter drawer'}).click();
  const panel=page.locator('#drawer-start');await expect(panel).toBeVisible();await expect.poll(()=>panel.evaluate(el=>el.getAnimations().filter(a=>a.playState==='running').length)).toBe(0);let b=await panel.boundingBox();expect(b.x).toBe(0);expect(b.width).toBe(320);
  await page.keyboard.press('Escape');
  // Test fixtures alter configuration only, while component operation remains native.
  await page.evaluate(()=>{document.documentElement.dir='rtl';document.querySelector('#drawer-start').setAttribute('data-drawer-size','large');});
  await page.getByRole('button',{name:'Open filter drawer'}).click();await expect.poll(()=>panel.evaluate(el=>el.getAnimations().filter(a=>a.playState==='running').length)).toBe(0);b=await panel.boundingBox();expect(Math.round(b.x+b.width)).toBe(await page.evaluate(()=>innerWidth));expect(b.width).toBe(640);
  await page.keyboard.press('Escape');
  const scopedCSS=await (await page.request.get('/reva/reva.scoped.css')).text();
  await page.evaluate(css=>{document.querySelector('#drawer-start').parentElement.classList.add('reva');document.querySelectorAll('link[href*="reva.css"]').forEach(el=>el.remove());const style=document.createElement('style');style.textContent=css;document.head.append(style);},scopedCSS);
  await page.getByRole('button',{name:'Open filter drawer'}).click();await expect(panel).toBeVisible();
 });
 test('print hides details and forced colours preserve boundaries',async({page})=>{
  await page.goto('/demos/dashboard/');await page.getByRole('button',{name:'Autumn campaign',exact:true}).click();
  await page.emulateMedia({forcedColors:'active',reducedMotion:'reduce'});
  await expect(page.locator('#project-inspector-0')).toHaveCSS('border-top-width','1px');
  await page.emulateMedia({media:'print'});await expect(page.locator('#project-inspector-0')).toBeHidden();
 });
});
