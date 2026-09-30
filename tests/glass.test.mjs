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
test('default glass text and control boundaries withstand worst-case black/white backdrops',()=>{
  const tones={neutral:{light:null,dark:null},cool:{light:[1,1,1],dark:[24/255,34/255,57/255]},warm:{light:[1,253/255,248/255],dark:[40/255,35/255,30/255]}};
  for(const mode of ['light','dark']) for(const [tone,surfaces] of Object.entries(tones)) {
    const surface=surfaces[mode] || color(tokens[mode].surface);
    for(const backdrop of [0,1]) {
      const backing=surface.map(v=>.9*v+.1*backdrop);
      for(const role of ['text','muted','link']) assert.ok(contrast(color(tokens[mode][role]),backing)>=4.5,mode+' '+tone+' '+role+' on '+backdrop);
      // Styled fields remain opaque; this stricter check also bounds bare control edges on the glass backing.
      assert.ok(contrast(color(tokens[mode]['control-line']),backing)>=3,mode+' '+tone+' control boundary');
    }
  }
});
test('glass global and scoped distributions match their source and remain opt-in',async()=>{
  const source=await readFile('src/css/glass.css','utf8');
  assert.equal(await readFile('dist/reva.glass.css','utf8'),source);
  assert.equal(await readFile('dist/reva.glass.scoped.css','utf8'),'@scope (.reva) {\n'+source+'\n}\n');
  assert.ok(!(await readFile('dist/reva.css','utf8')).includes('--re-glass-opacity'));
});
