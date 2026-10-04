import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const tokens=JSON.parse(await readFile('tokens/foundation.tokens.json','utf8'));
function color(token) {
  const value=token.$value;
  return typeof value==='string' ? color(value.slice(1,-1).split('.').reduce((a,k)=>a[k],tokens)) : value.components;
}
const lum=rgb=>rgb.map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);
const contrast=(a,b)=>(Math.max(lum(a),lum(b))+.05)/(Math.min(lum(a),lum(b))+.05);
test('default glass text and control boundaries remain readable on theme-matched backdrops',()=>{
  const tones={neutral:{light:null,dark:null},cool:{light:[1,1,1],dark:[24/255,34/255,57/255]},warm:{light:[1,253/255,248/255],dark:[40/255,35/255,30/255]}};
  for(const mode of ['light','dark']) for(const [tone,surfaces] of Object.entries(tones)) {
    const surface=surfaces[mode] || color(tokens[mode].surface);
    for(const backdrop of [color(tokens[mode].bg),color(tokens[mode]['surface-alt'])]) {
      const backing=surface.map((v,i)=>.32*v+.68*backdrop[i]);
      const readable={text:color(tokens[mode].text),muted:color(tokens[mode].text),link:color(tokens[mode].text)};
      for(const [role,foreground] of Object.entries(readable)) assert.ok(contrast(foreground,backing)>=4.5,mode+' '+tone+' '+role+' on '+backdrop);
      // Styled fields remain opaque; this stricter check also bounds bare control edges on the glass backing.
      assert.ok(contrast(color(tokens[mode].text),backing)>=3,mode+' '+tone+' control boundary');
    }
  }
});
test('glass global and scoped distributions match their source and remain opt-in',async()=>{
  const source=await readFile('src/css/glass.css','utf8');
  assert.equal(await readFile('dist/reva.glass.css','utf8'),source);
  assert.equal(await readFile('dist/reva.glass.scoped.css','utf8'),'@scope (.reva) {\n'+source+'\n}\n');
  assert.ok(!(await readFile('dist/reva.css','utf8')).includes('--re-glass-opacity'));
});

test('glass action labels withstand black and white backdrops in every theme and accent',()=>{
 const mix=(a,b,f)=>a.map((v,i)=>v*f+b[i]*(1-f));
 for(const theme of ['light','dark']) for(const [accent,palette] of Object.entries(tokens.primitive.accent)) {
  const primary=color(palette.start),end=color(palette.end),surface=color(tokens[theme].surface);
  const cases=[['primary',primary,end,[1,1,1]],['secondary',mix(primary,surface,.1),mix(primary,surface,.18),color(tokens[theme].link)],['danger',color(tokens.primitive.danger.start),color(tokens.primitive.danger.end),[1,1,1]],['warning',color(tokens.primitive.warning.start),color(tokens.primitive.warning.end),color(tokens.primitive.warningText)]];
  for(const [role,start,finish,text] of cases) for(const backdrop of [0,1]) for(const sheen of [0,.28]) {
   const base=mix(mix(start,finish,.65),[backdrop,backdrop,backdrop],.9);
   const painted=mix(finish,base,sheen);
   assert.ok(contrast(text,painted)>=4.5,`${theme} ${accent} ${role} backing ${backdrop} sheen ${sheen}`);
  }
 }
});
