import {test,expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';

const sample=(attribute)=>attribute
 ? '<div data-layout="container"><div data-layout="grid"><article data-surface="card"><header><h2>Project</h2></header><p>Summary</p><footer data-layout="row"><button>Open</button><a href="/projects">Projects</a></footer></article></div></div>'
 : '<div class="container"><div class="grid"><article class="card"><header><h2>Project</h2></header><p>Summary</p><footer class="row"><button>Open</button><a href="/projects">Projects</a></footer></article></div></div>';
const properties=['display','width','padding','margin','borderRadius','borderTopWidth','backgroundColor','boxShadow','gap','gridTemplateColumns','fontSize','color'];
for(const build of ['global','minified','modular','scoped'])test(`${build}: native structure, class/attribute equivalence and nested resets`,async({page})=>{
 await page.goto('/plain/');
 await page.setContent('<!doctype html><html lang="en"><head><title>Architecture contract</title></head><body><main id="neutral"><h1>Projects</h1></main><section id="legacy" class="reva" data-theme="dark" data-shape="rounded" data-density="spacious" data-width="narrow">'+sample(false)+'</section><section id="attributes" data-reva data-theme="dark" data-shape="rounded" data-density="spacious" data-width="narrow">'+sample(true)+'</section><footer id="page-footer"><p>Service</p></footer></body></html>');
 const files=build==='modular'?['reva.tokens.css','reva.base.css','reva.components.css']: [build==='scoped'?'reva.scoped.css':build==='minified'?'reva.min.css':'reva.css'];
 for(const file of files)await page.addStyleTag({content:await readFile('dist/'+file,'utf8')});
 const compare=async()=>page.evaluate((properties)=>{
  const read=root=>[root,...root.querySelectorAll('*')].map(el=>Object.fromEntries(properties.map(p=>[p,getComputedStyle(el)[p]])));
  return [read(document.querySelector('#legacy')),read(document.querySelector('#attributes'))];
 },properties);
 const [legacy,attributes]=await compare();expect(attributes).toEqual(legacy);
 // Each setting changes only its concern. The native page-level footer/main stay neutral.
 expect(await page.locator('#neutral').evaluate(el=>getComputedStyle(el).maxWidth)).toBe('none');
 expect(await page.locator('#page-footer').evaluate(el=>getComputedStyle(el).display)).toBe('block');
 await page.locator('#attributes [data-surface]').evaluate(el=>{el.dataset.shape='square';el.dataset.density='compact';});
 await page.locator('#legacy .card').evaluate(el=>{el.dataset.shape='square';el.dataset.density='compact';});
 const [resetLegacy,resetAttributes]=await compare();expect(resetAttributes).toEqual(resetLegacy);
 expect(await page.locator('#attributes [data-surface]').evaluate(el=>getComputedStyle(el).borderRadius)).toBe('0px');
 await page.addStyleTag({content:'[data-surface="card"] { padding:37px; }'});
 expect(await page.locator('#attributes [data-surface]').evaluate(el=>getComputedStyle(el).padding)).toBe('37px');
});
for(const scoped of [false,true])test(`${scoped?'scoped':'global'}: material inheritance, solid reset and glass re-entry`,async({page})=>{
 await page.goto('/plain/');
 const card=(id,attrs='')=>`<div id="${id}" data-surface="card" ${attrs}><p>Panel</p></div>`;
 await page.setContent('<!doctype html><html><head><title>Materials</title></head><body><div data-reva data-theme="light" data-material="glass">'+card('glass')+card('solid','data-material="solid"')+'<div data-material="solid">'+card('reentry','data-material="glass"')+'</div></div></body></html>');
 for(const file of scoped?['reva.scoped.css','reva.glass.scoped.css']:['reva.css','reva.glass.css'])await page.addStyleTag({content:await readFile('dist/'+file,'utf8')});
 const filter=id=>page.locator('#'+id).evaluate(el=>getComputedStyle(el).backdropFilter);
 expect(await filter('glass')).not.toBe('none');expect(await filter('solid')).toBe('none');expect(await filter('reentry')).not.toBe('none');
 await page.emulateMedia({forcedColors:'active'});
 expect(await filter('glass')).toBe('none');expect(await filter('reentry')).toBe('none');
});
