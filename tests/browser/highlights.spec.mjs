import {waitForPopover} from './helpers/popover.mjs';
import {test,expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';
test('navigation background stays behind labels and preserves dropdown anchors',async({page})=>{
 await page.goto('/guide/');await page.setViewportSize({width:1280,height:900});
 const menu=page.getByRole('navigation',{name:'Documentation',exact:true});
 const supported=await page.evaluate(()=>CSS.supports('anchor-scope: --re-nav-highlight')&&CSS.supports('left: anchor(left)'));
 for(const name of ['Learn','Themes','Components']){
  const item=menu.getByRole('button',{name,exact:true});await item.hover();
  if(supported){
   await expect.poll(()=>item.evaluate(el=>getComputedStyle(el).position)).toBe('relative');
   expect(await item.evaluate(el=>getComputedStyle(el).zIndex)).toBe('1');
   expect(await menu.locator('.menu-desktop').evaluate(el=>getComputedStyle(el,'::after').zIndex)).toBe('0');
   expect(await item.evaluate(el=>getComputedStyle(el).anchorName)).toContain('--re-nav-highlight');
  }
 }
 const opener=menu.getByRole('button',{name:'Learn',exact:true});await opener.click();
 const id=await opener.getAttribute('popovertarget');const panel=page.locator('#'+id);
 await expect(panel).toBeVisible();await waitForPopover(panel);
 expect(await panel.evaluate(el=>getComputedStyle(el,'::after').content)).toBe('none');
 if(await page.evaluate(()=>CSS.supports('position-area: block-end span-inline-end'))){
  const a=await opener.boundingBox(),b=await panel.boundingBox();expect(Math.abs(b.x-a.x)).toBeLessThan(2);expect(b.y).toBeGreaterThanOrEqual(a.y+a.height);
 }
 await page.mouse.click(2,850);await expect(panel).toBeHidden();
});
test('pagination slides a background with persistent current-page identification',async({page})=>{
 await page.goto('/plain/');await page.setContent('<nav class="pagination" aria-label="Pages"><ol><li><a href="#one" id="one">1</a></li><li><span aria-current="page" id="two">2</span></li><li><a href="#three" id="three">3</a></li><li><span aria-disabled="true" id="disabled">Next</span></li></ol></nav>');await page.addStyleTag({content:await readFile('dist/reva.css','utf8')});
 const supported=await page.evaluate(()=>CSS.supports('anchor-scope: --re-page-highlight')&&CSS.supports('left: anchor(left)'));
 await page.locator('#three').hover();
 if(supported){
  expect(await page.locator('#three').evaluate(el=>getComputedStyle(el).anchorName)).toBe('--re-page-highlight');
  expect(await page.locator('#three').evaluate(el=>getComputedStyle(el).zIndex)).toBe('1');
  expect(await page.locator('#three').evaluate(el=>getComputedStyle(el).textDecorationLine)).toBe('none');
  expect(await page.locator('ol').evaluate(el=>getComputedStyle(el,'::after').zIndex)).toBe('0');
  expect(await page.locator('ol').evaluate(el=>getComputedStyle(el,'::after').backgroundColor)).toBe(await page.locator('#two').evaluate(el=>{const x=document.createElement('span');x.style.color='var(--re-surface-alt)';el.append(x);const c=getComputedStyle(x).color;x.remove();return c;}));
 }
 expect(await page.locator('#two').evaluate(el=>getComputedStyle(el).fontWeight)).toBe('700');
 expect(await page.locator('#disabled').evaluate(el=>getComputedStyle(el).anchorName)).toBe('none');
 await page.emulateMedia({reducedMotion:'reduce'});expect(await page.locator('ol').evaluate(el=>getComputedStyle(el,'::after').transitionDuration)).toBe('0s');
 await page.emulateMedia({media:'print'});expect(await page.locator('ol').evaluate(el=>getComputedStyle(el,'::after').display)).toBe('none');
});
