import {test,expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';
const palettes=JSON.parse(await readFile('tokens/palettes.json','utf8'));
const rgba=async(page,selector,property)=>page.locator(selector).evaluate((el,p)=>{const c=document.createElement('canvas').getContext('2d');c.fillStyle=getComputedStyle(el)[p];c.fillRect(0,0,1,1);return [...c.getImageData(0,0,1,1).data];},property);
const hex=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)).concat(255);
for(const build of ['global','minified','modular','scoped']) test(`${build} palettes inherit across modes and local settings`,async({page})=>{
 const css=build==='modular'?(await Promise.all(['tokens','base','components'].map(n=>readFile(`dist/reva.${n}.css`,'utf8')))).join('\n'):await readFile(`dist/reva.${build==='global'?'css':build==='minified'?'min.css':'scoped.css'}`,'utf8');
 await page.setContent(`<main id="root" ${build==='scoped'?'class="reva"':''} data-size="large"><article class="card" id="card"><p id="text">Content</p><a id="link" href="#card">Link</a><button id="primary">Save</button><button id="success" data-variant="success">Success</button><span class="badge" data-appearance="solid" id="badge">New</span><section data-theme="dark"><article class="card" id="nested"><button id="nested-action">Nested</button></article></section><section data-palette="mono"><button id="local">Local Mono</button></section></article></main>`);
 await page.addStyleTag({content:css});
 const root=build==='scoped'?'#root':'html';
 for(const [name,palette] of Object.entries(palettes))for(const mode of ['light','dark']){
  await page.locator(root).evaluate((el,{name,mode})=>{el.dataset.palette=name;el.dataset.theme=mode;},{name,mode});
  const t=palette[mode];
  expect(await rgba(page,'#card','backgroundColor'),`${name}/${mode} surface`).toEqual(hex(t.surface));
  expect(await rgba(page,'#text','color')).toEqual(hex(t.text));expect(await rgba(page,'#link','color')).toEqual(hex(t.link));
  expect(await rgba(page,'#primary','color')).toEqual(hex(t['on-primary']));expect(await rgba(page,'#primary','backgroundColor')).toEqual(hex(t.primary));
  expect(await rgba(page,'#badge','color')).toEqual(hex(t['on-primary']));
  expect(await rgba(page,'#nested','backgroundColor')).toEqual(hex(palette.dark.surface));expect(await rgba(page,'#nested-action','color')).toEqual(hex(palette.dark['on-primary']));
  expect(await rgba(page,'#local','backgroundColor')).toEqual(hex(palettes.mono[mode].primary));
  expect(await rgba(page,'#success','color')).toEqual([255,255,255,255]);
 }
 await page.locator(root).evaluate(el=>{el.dataset.palette='citrus';el.dataset.accent='violet';el.dataset.tone='warm';});
 expect(await rgba(page,'#primary','color')).toEqual([255,255,255,255]);
 expect(await rgba(page,'#primary','backgroundColor')).toEqual([112,65,207,255]);
 expect(await rgba(page,'#link','color')).toEqual(hex(palettes.citrus.dark.link));
 expect(await rgba(page,'#local','backgroundColor')).toEqual(hex(palettes.mono.dark.primary));
 expect(await page.locator('#local').evaluate(el=>getComputedStyle(el).fontSize)).toBe('18px');
});
for(const scoped of [false,true])test(`${scoped?'scoped':'global'} glass-to-solid resets retain every palette`,async({page})=>{
 await page.setContent(`<main id="root" ${scoped?'class="reva"':''} data-material="glass"><article class="card"><a id="glass-link" href="#root">Glass</a><section data-material="solid"><a id="solid-link" href="#root">Solid</a><figure><figcaption id="solid-muted">Supporting text</figcaption></figure><input id="solid-field" aria-label="Name"><section data-material="glass"><a id="resume" href="#root">Glass again</a></section></section></article></main>`);
 await page.addStyleTag({content:(await readFile(`dist/reva.${scoped?'scoped.':''}css`,'utf8'))+(await readFile(`dist/reva.glass${scoped?'.scoped':''}.css`,'utf8'))});
 for(const [name,palette] of Object.entries(palettes))for(const mode of ['light','dark']){
  await page.locator('#root').evaluate((el,{name,mode})=>{el.dataset.palette=name;el.dataset.theme=mode;},{name,mode});
  expect(await rgba(page,'#glass-link','color')).toEqual(hex(palette[mode].text));
  expect(await rgba(page,'#solid-link','color')).toEqual(hex(palette[mode].link));
  expect(await rgba(page,'#solid-muted','color')).toEqual(hex(palette[mode].muted));
  expect(await rgba(page,'#solid-field','borderTopColor')).toEqual(hex(palette[mode]['control-line']));
  expect(await rgba(page,'#resume','color')).toEqual(hex(palette[mode].text));
 }
});
