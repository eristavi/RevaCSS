import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
const tokens=JSON.parse(await readFile('tokens/foundation.tokens.json','utf8'));
function color(t) { const v=t.$value; return typeof v==='string'?color(v.slice(1,-1).split('.').reduce((a,k)=>a[k],tokens)):v.components; }
function lum(c) { return c.map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0); }
function contrast(a,b) { const x=lum(a),y=lum(b); return (Math.max(x,y)+.05)/(Math.min(x,y)+.05); }
test('token aliases resolve and colour components are bounded',()=>{
 function walk(o) { if(o?.$type) { if(o.$type==='color') for(const c of color(o)) assert.ok(c>=0 && c<=1); return; } for(const [k,v] of Object.entries(o)) if(!k.startsWith('$')) walk(v); } walk(tokens);
});
test('light/dark text, links and control boundaries meet contrast requirements',()=>{
 for(const mode of ['light','dark']) {
  const t=tokens[mode];
  for(const surface of ['bg','surface','surface-alt']) for(const text of ['text','muted','link']) assert.ok(contrast(color(t[text]),color(t[surface]))>=4.5,`${mode} ${text}/${surface}`);
  assert.ok(contrast(color(t['control-line']),color(t.surface))>=3);
 }
});
test('all button preset endpoints meet normal-text contrast',()=>{
 for(const [name,p] of Object.entries(tokens.primitive.accent)) for(const stop of ['start','end']) assert.ok(contrast([1,1,1],color(p[stop]))>=4.5,`${name}/${stop}`);
 for(const stop of ['start','end']) { assert.ok(contrast([1,1,1],color(tokens.primitive.danger[stop]))>=4.5); assert.ok(contrast(color(tokens.primitive.warningText),color(tokens.primitive.warning[stop]))>=4.5); }
});
test('core remains within 17 KiB gzip budget',async()=>assert.ok(gzipSync(await readFile('dist/reva.min.css')).length<17*1024));
test('only explicitly listed optional documentation helpers ship; core remains CSS-only',async()=>{
 const jsonIds=new Set(['reva-settings-schema','reva-palette-defaults','reva-background-defaults']);
 const runtimes=new Map([
  ['reva-classes-search-runtime','classes-search.js'],
    ['reva-settings-runtime','settings.js'],
  ['reva-palette-runtime','custom-palette.js'],
  ['reva-radius-runtime','custom-radius.js'],
  ['reva-density-runtime','custom-density.js'],
  ['reva-background-runtime','custom-backgrounds.js'],
    ['reva-width-runtime','custom-width.js'],
 ]);
 const assets=new Set(runtimes.values());
 async function visit(dir) {
  for(const f of await readdir(dir,{withFileTypes:true})) {
   const path=dir+'/'+f.name;
   if(f.isDirectory())await visit(path);
   else if(f.name.endsWith('.html')){
    const html=await readFile(path,'utf8');
    for(const [,attributes,content] of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
     const id=attributes.match(/\bid="([^"]+)"/)?.[1];
     if(jsonIds.has(id)){
      assert.match(attributes,/\btype="application\/json"/,path);
      assert.doesNotMatch(attributes,/\bsrc=/,path);
      JSON.parse(content);
     }
     else if(runtimes.has(id)){
      const src=attributes.match(/\bsrc="([^"]+)"/)?.[1];
      assert.ok(src,path);
      const url=new URL(src,'https://example.invalid');
      assert.equal(url.origin,'https://example.invalid',path);
      assert.equal(url.pathname.split('/').at(-1),runtimes.get(id),path);
      assert.ok(url.searchParams.get('v'),path);
      assert.equal(content.trim(),'',path);
     }
     else {
      assert.doesNotMatch(attributes,/\bsrc=/,path);
      assert.match(content.trim(),/^window\.RevaSettings\?\.init(?:Customizer|Theme)\(\);$/,path);
     }
    }
   }else if(f.name.endsWith('.js'))assert.ok(assets.has(f.name),path);
  }
 }
 await visit('docs/dist');
 assert.ok(!(await readdir('dist')).some(file=>file.endsWith('.js')));
});
