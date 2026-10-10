import {test,expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';
import {waitForPopover} from './helpers/popover.mjs';

for(const build of ['global','minified','modular','scoped']) {
 const scoped=build==='scoped';
 const names=build==='modular'?['reva.tokens.css','reva.base.css','reva.navigation.css','reva.app-shell.css']
  :[build==='global'?'reva.css':build==='minified'?'reva.min.css':'reva.scoped.css'];
 const styles=async()=> (await Promise.all(names.map(name=>readFile('dist/'+name,'utf8')))).join('\n');
 test(build+': navbar corner and flush finish policy agrees across materials',async({page})=>{
  await page.setContent('<div id="outside">Outside</div><div id="root" class="'+(scoped?'reva':'')+'" data-theme="light" data-shape="rounded"><header class="navbar-header"><nav id="nav" class="top-menu" aria-label="Fixture"><a class="menu-brand" href="#root">Brand</a><div class="menu-panel" id="panel" popover>Detached panel</div></nav></header><section class="app-shell"><header id="shell">Workspace</header><main>Content</main></section></div>');
  await page.addStyleTag({content:await styles()});
  for(const material of ['glass','veil','soft'])await page.addStyleTag({content:await readFile('dist/reva.'+material+(scoped?'.scoped':'')+'.css','utf8')});
  const root=scoped?'#root':'html';
  for(const material of ['solid','glass','veil','soft'])for(const width of [375,1280])for(const spacing of ['flush','spaced'])for(const mode of ['contained','full']){
   await page.setViewportSize({width,height:900});
   await page.locator(root).evaluate((el,data)=>{el.dataset.material=data.material;el.dataset.navbarSpacing=data.spacing;el.dataset.navbarWidth=data.mode;},{material,spacing,mode});
   for(const selector of ['#nav','#shell']){
    const css=await page.locator(selector).evaluate(el=>{const s=getComputedStyle(el);return {corners:[s.borderTopLeftRadius,s.borderTopRightRadius,s.borderBottomLeftRadius,s.borderBottomRightRadius],top:s.borderTopWidth,shadow:s.boxShadow,image:s.backgroundImage};});
    const allSquare=width<768?spacing==='flush':mode==='full';
    const topSquare=allSquare||spacing==='flush';
    for(let i=0;i<4;i++)if(i<2?topSquare:allSquare)expect(css.corners[i],[build,material,width,spacing,mode,selector,i].join('/')).toBe('0px');
    else expect(parseFloat(css.corners[i])).toBeGreaterThan(0);
    if(spacing==='flush'){expect(css.top).toBe('0px');expect(css.shadow).toBe('none');expect(css.image).toBe('none');}
    else expect(parseFloat(css.top)).toBeGreaterThan(0);
   }
   expect(parseFloat(await page.locator('#panel').evaluate(el=>getComputedStyle(el).borderTopLeftRadius))).toBeGreaterThan(0);
  }
  if(scoped)await expect(page.locator('#outside')).toHaveCSS('border-top-width','0px');
  await page.emulateMedia({forcedColors:'active'});
  await page.locator(root).evaluate(el=>{el.dataset.navbarSpacing='flush';});
  await expect(page.locator('#nav')).toHaveCSS('border-top-width','0px');
  await expect(page.locator('#shell')).toHaveCSS('border-top-width','0px');
 });
 test(build+': native sticky wrapper keeps its anchor target clear and static restores flow',async({page})=>{
  await page.setViewportSize({width:375,height:900});
  await page.setContent('<main id="root" class="'+(scoped?'reva':'')+'" data-navbar-position="sticky" data-navbar-spacing="flush" data-navbar-width="full" data-motion="none"><header id="header" class="navbar-header"><nav class="top-menu" aria-label="Fixture"><a class="menu-brand" id="jump" href="#destination">Destination</a></nav></header><div style="height:1800px"></div><h2 id="destination" tabindex="-1">Destination</h2><div style="height:1000px"></div></main>');
  await page.addStyleTag({content:await styles()});
  const root='#root';
  await page.evaluate(()=>scrollTo(0,400));
  await expect.poll(async()=>Math.abs((await page.locator('#header').boundingBox()).y)).toBeLessThanOrEqual(1);
  await expect(page.locator('#header .top-menu')).toHaveCSS('position','relative');
  await page.locator('#jump').click();
  await expect.poll(async()=>{const header=await page.locator('#header').boundingBox(),target=await page.locator('#destination').boundingBox();return target.y-header.y-header.height;}).toBeGreaterThanOrEqual(0);
  await page.locator(root).evaluate(el=>{el.dataset.navbarPosition='static';});
  await expect(page.locator('#header')).toHaveCSS('position','relative');
  expect((await page.locator('#header').boundingBox()).y).toBeLessThan(0);
 });
}

test.describe('compact mobile demo header without runtime JavaScript',()=>{
 test.use({javaScriptEnabled:false});
 for(const width of [320,375])test('mobile controls and documentation access at '+width+'px',async({page})=>{
  await page.setViewportSize({width,height:900});
  for(const route of ['/demos/marketing/','/demos/blog/','/demos/shop/']){
   await page.goto(route);
   const nav=page.locator('.navbar-header > .top-menu');
   await expect(nav).toHaveCount(1);
   await expect(page.locator('.demo-customizer')).toHaveCount(1);
   await expect(nav.locator('.demo-docs-link')).toBeHidden();
   const brand=nav.locator('.menu-brand'),customize=nav.getByRole('button',{name:'Customize',exact:true}),menu=nav.getByRole('button',{name:'Menu',exact:true});
   const boxes=await Promise.all([brand,customize,menu].map(el=>el.boundingBox()));
   const centers=boxes.map(box=>box.y+box.height/2);
   expect(Math.max(...centers)-Math.min(...centers)).toBeLessThanOrEqual(1);
   for(const box of boxes.slice(1)){expect(box.width).toBeGreaterThanOrEqual(44);expect(box.height).toBeGreaterThanOrEqual(44);}
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
   await expect(nav).toHaveCSS('border-bottom-left-radius','0px');
   await brand.focus();await page.keyboard.press('Tab');await expect(customize).toBeFocused();
   await page.keyboard.press('Tab');await expect(menu).toBeFocused();
   await customize.click();await waitForPopover(page.locator('#demo-customizer-popup'));
   await expect(page.locator('.customizer-docs-link a')).toBeVisible();
   await expect(page.locator('.customizer-docs-link a')).toHaveAttribute('href','/');
   await page.locator('#demo-customizer-popup').getByRole('button',{name:'Close',exact:true}).click();
   await expect(page.locator('#demo-customizer-popup')).toBeHidden();
   await menu.click();
   await expect(nav.locator('.menu-mobile')).toBeVisible();
   if(route.includes('marketing'))await expect(nav.locator('.menu-mobile').getByRole('link',{name:'Contact',exact:true})).toBeVisible();
  }
 });
});
