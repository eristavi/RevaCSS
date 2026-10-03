import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const palettes=JSON.parse(await readFile('tokens/palettes.json','utf8'));
const rgb=hex=>[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255);
const mix=(a,b,f)=>a.map((v,i)=>v*f+b[i]*(1-f));
const lum=c=>c.map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);
const contrast=(a,b)=>(Math.max(lum(a),lum(b))+.05)/(Math.min(lum(a),lum(b))+.05);
for(const [name,palette] of Object.entries(palettes)) for(const mode of ['light','dark']) {
  test(`${name} ${mode}: text, links, controls and primary gradient contrast`,()=>{
    const t=Object.fromEntries(Object.entries(palette[mode]).map(([k,v])=>[k,rgb(v)]));
    for(const surface of ['bg','surface','surface-alt']) for(const ink of ['text','muted','link']) {
      const ratio=contrast(t[ink],t[surface]);assert.ok(ratio>=4.5,`${ink}/${surface}: ${ratio.toFixed(2)}`);
    }
    assert.ok(contrast(t['control-line'],t.surface)>=3,'control boundary');
    for(const endpoint of ['primary','primary-end']) assert.ok(contrast(t['on-primary'],t[endpoint])>=4.5,`primary foreground/${endpoint}`);
  });
  test(`${name} ${mode}: glass foregrounds on black and white backdrops`,()=>{
    const t=Object.fromEntries(Object.entries(palette[mode]).map(([k,v])=>[k,rgb(v)]));
    for(const backdrop of [[0,0,0],[1,1,1]]) {
      assert.ok(contrast(t.text,mix(t.surface,backdrop,.7))>=4.5,'glass text');
      for(const sheen of [0,.28]) {
        const backing=mix(mix(t.primary,t['primary-end'],.65),backdrop,.9);
        assert.ok(contrast(t['on-primary'],mix(t['primary-end'],backing,sheen))>=4.5,'glass primary');
      }
    }
  });
}

// Semantic status fills share adaptive foregrounds across every palette.
const roles=JSON.parse(await readFile('tokens/roles.json','utf8'));
for(const mode of ['light','dark']) for(const role of ['secondary','success','warning','danger']) {
  test(`${role} ${mode}: solid, gradient and glass label contrast`,()=>{
    const t=roles[mode], start=rgb(t[role]), end=rgb(t[`${role}-end`]), ink=rgb(t[`on-${role}`]);
    for(const fill of [start,end]) assert.ok(contrast(ink,fill)>=4.5,'solid/endpoint foreground');
    for(const backdrop of [[0,0,0],[1,1,1]]) for(const sheen of [0,.06,.28]) {
      const backing=mix(mix(start,end,.65),backdrop,.9);
      assert.ok(contrast(ink,mix(end,backing,sheen))>=4.5,'glass foreground');
    }
  });
}
