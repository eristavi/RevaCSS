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
test('core remains within 15 KiB gzip budget',async()=>assert.ok(gzipSync(await readFile('dist/reva.min.css')).length<15*1024));
test('only optional settings scripts ship in the documentation; core remains CSS-only',async()=>{
 async function visit(dir) {
  for(const f of await readdir(dir,{withFileTypes:true})) {
   const path=dir+'/'+f.name;
   if(f.isDirectory())await visit(path);
   else if(f.name.endsWith('.html')){
    const html=await readFile(path,'utf8');
    for(const [,attributes,content] of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
     if(attributes.includes('id="reva-settings-schema"')){assert.ok(attributes.includes('application/json'),path);JSON.parse(content);}
     else if(attributes.includes('id="reva-settings-runtime"')){assert.match(attributes,/src="[^"]*settings\.js\?v=[^"]+"/);assert.equal(content.trim(),'');}
     else assert.match(content.trim(),/^window\.RevaSettings\?\.init(?:Customizer|Theme)\(\);$/,path);
    }
   }else if(f.name.endsWith('.js'))assert.equal(f.name,'settings.js',path);
  }
 }
 await visit('docs/dist');
 assert.ok(!(await readdir('dist')).some(file=>file.endsWith('.js')));
});
