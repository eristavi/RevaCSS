import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
const require=createRequire(import.meta.url);
const style=(page,selector,property)=>page.locator(selector).evaluate((el,p)=>getComputedStyle(el)[p],property);
async function mount(page,content,build='global') {
 const core=build==='modular'?(await Promise.all(['tokens','base','badges'].map(n=>readFile(`dist/reva.${n}.css`,'utf8')))).join('\n'):await readFile(`dist/reva.${build==='global'?'css':build==='minified'?'min.css':'scoped.css'}`,'utf8');
 const glass=await readFile(`dist/reva.glass${build==='scoped'?'.scoped':''}.css`,'utf8');
 await page.setContent(`<html lang="en"><head><style>${core}\n${glass}\nbody{margin:0;padding:16px}</style><title>Badge fixture</title></head><body>${content}</body></html>`);
}
for(const build of ['global','minified','modular','scoped']) test(`${build} badges inherit settings, allow local resets and preserve native controls`,async({page})=>{
 await mount(page,`<main ${build==='scoped'?'class="reva"':''} data-theme="dark" data-size="large" data-shape="pill" data-depth="flat" data-fill="solid" data-variant="success" data-appearance="solid"><span class="badge" id="one">Approved</span><span class="badge" id="two">Paid</span><button id="button">Save</button><section data-variant="neutral" data-theme="light"><span class="badge" id="neutral">Archived</span><span class="badge" id="local" data-variant="primary" data-accent="rose" data-appearance="outline" data-size="small" data-shape="square">New</span></section><section data-variant="unsupported" data-appearance="unsupported"><span class="badge" id="invalid">Approved</span></section><section data-material="glass"><span class="badge" id="glass">Glass</span><span class="badge" id="solid" data-material="solid">Solid</span><section data-material="solid"><span class="badge" id="reset">Reset</span><span class="badge" id="reentry" data-material="glass">Glass again</span></section></section></main><span class="badge" id="outside">Outside</span>`,build);
 for(const id of ['one','two','invalid']) {
  expect(await style(page,'#'+id,'borderRadius')).toBe('999px');expect(await style(page,'#'+id,'boxShadow')).toBe('none');expect(await style(page,'#'+id,'fontSize')).toBe('14.625px');
  expect(await style(page,'#'+id,'backgroundColor')).toBe(await style(page,'#one','backgroundColor'));
 }
 expect(await style(page,'#local','borderRadius')).toBe('0px');expect(await style(page,'#local','fontSize')).toBe('11.375px');
 expect(await style(page,'#local','backgroundColor')).not.toBe(await style(page,'#one','backgroundColor'));
 expect(await style(page,'#neutral','backgroundColor')).not.toBe(await style(page,'#one','backgroundColor'));
 expect(await style(page,'#button','backgroundColor')).not.toBe(await style(page,'#one','backgroundColor'));
 for(const id of ['glass','reentry']) expect(await style(page,'#'+id,'backdropFilter')).toContain('16px');
 for(const id of ['solid','reset']) expect(await style(page,'#'+id,'backdropFilter')).toBe('none');
 if(build==='scoped')expect(await style(page,'#outside','display')).toBe('inline');
 expect(await page.locator('span.badge[role],span.badge[tabindex]').count()).toBe(0);
});
for(const direction of ['ltr','rtl'])test(`badges reflow with long labels, enlarged text and spacing in ${direction} without scripts`,async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:900}});const page=await context.newPage();
 try {
 await mount(page,`<main dir="${direction}" style="width:160px"><span class="badge">${'A'.repeat(100)}</span><p>Inbox <span class="badge">3 unread messages</span></p></main>`);
 await page.locator('html').evaluate(el=>el.style.fontSize='200%');
 await page.locator('main').evaluate(el=>{el.style.letterSpacing='.12em';el.style.wordSpacing='.16em';el.style.lineHeight='1.5';});
 for(const badge of await page.locator('.badge').all())expect(await badge.evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }finally{await context.close();}
});
test('glass badge preferences, print and unsupported blur retain readable backing',async({page})=>{
 await mount(page,'<main data-material="glass" data-contrast="more"><span class="badge" id="badge">Approved</span></main>');
 expect(await style(page,'#badge','backdropFilter')).toBe('none');
 await page.emulateMedia({forcedColors:'active'});expect(await style(page,'#badge','backdropFilter')).toBe('none');expect(await style(page,'#badge','borderTopWidth')).toBe('1px');
 await page.emulateMedia({forcedColors:'none',media:'print'});expect(await style(page,'#badge','backgroundColor')).toBe('rgb(255, 255, 255)');expect(await style(page,'#badge','color')).toBe('rgb(0, 0, 0)');
 await page.emulateMedia({media:'screen'});
 const css=(await readFile('dist/reva.glass.css','utf8')).replaceAll('@supports ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)))','@supports (reva-unsupported: yes)');
 await mount(page,'<span class="badge" data-material="glass" id="fallback">Fallback</span>');
 // Test the unsupported extension alone, rather than stacking it over supported glass.
 await page.locator('style').first().evaluate((el,css)=>el.textContent=el.textContent.slice(0,el.textContent.indexOf('/* Optional material extension.'))+css,css);
 expect(await style(page,'#fallback','backdropFilter')).toBe('none');
});
test('badge labels maintain contrast on rendered light/dark solid/glass backdrops',async({page})=>{
 const rows=[];let id=0;
 for(const theme of ['light','dark'])for(const material of ['solid','glass'])for(const backdrop of ['black','white'])for(const appearance of ['tinted','solid','outline'])for(const variant of ['primary','success','warning','danger','neutral'])for(const accent of variant==='primary'?['blue','violet','teal','green','orange','rose']:['blue'])rows.push(`<section data-theme="${theme}" data-material="${material}" data-appearance="${appearance}" data-variant="${variant}" data-accent="${accent}" style="background:${backdrop};padding:8px"><span class="badge" id="sample-${id++}">${theme} ${material} ${appearance} ${variant} ${accent}</span></section>`);
 await mount(page,'<main>'+rows.join('')+'</main>');await page.addStyleTag({content:'main{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:4px}.badge{border-radius:0;box-shadow:none}'});
 const boxes=await page.locator('.badge').evaluateAll(els=>els.map(el=>{const r=el.getBoundingClientRect();const c=document.createElement('canvas').getContext('2d');c.fillStyle=getComputedStyle(el).color;c.fillRect(0,0,1,1);return {name:el.textContent,x:Math.floor(r.x+4),y:Math.floor(r.y+r.height/2)+scrollY,color:[...c.getImageData(0,0,1,1).data].slice(0,3)};}));
 const png=await page.screenshot({fullPage:true,scale:'css'});
 const samples=await page.evaluate(async({url,boxes})=>{const img=new Image();img.src=url;await img.decode();const c=document.createElement('canvas');c.width=img.width;c.height=img.height;const ctx=c.getContext('2d');ctx.drawImage(img,0,0);return boxes.map(b=>({...b,bg:[...ctx.getImageData(b.x,b.y,1,1).data].slice(0,3)}));},{url:'data:image/png;base64,'+png.toString('base64'),boxes});
 const lum=c=>c.map(x=>{x/=255;return x<=.04045?x/12.92:((x+.055)/1.055)**2.4;}).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
 for(const s of samples){const a=lum(s.color),b=lum(s.bg);expect((Math.max(a,b)+.05)/(Math.min(a,b)+.05),JSON.stringify(s)).toBeGreaterThanOrEqual(4.5);}
});
for(const width of [320,1280])test(`badge documentation has copyable HTML and accessible labels at ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:900});await page.goto('/components/badges/');
 expect(await page.locator('#basic-badges pre code').textContent()).toContain('<span class="badge">New</span>');
 expect(await page.locator('#badge-parent .example-demo .badge[data-size]').count()).toBe(0);
 await page.addScriptTag({path:require.resolve('axe-core')});const violations=await page.evaluate(async()=> (await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})));expect(violations).toEqual([]);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
