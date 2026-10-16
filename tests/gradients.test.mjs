import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
test('gradient text retains contrast on bundled neutral surfaces across palettes, accents and tones',async()=>{
  const palettes=JSON.parse(await readFile('tokens/palettes.json','utf8'));
  const foundation=JSON.parse(await readFile('tokens/foundation.tokens.json','utf8'));
  const source=await readFile('src/css/gradients.css','utf8');
  const weight=Number(source.match(/var\(--re-primary\) (\d+)%/)[1])/100;
  const rgb=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)/255);
  const mix=(a,b,t)=>a.map((v,i)=>v*t+b[i]*(1-t));
  const lum=c=>c.reduce((s,v,i)=>s+(v<=.04045?v/12.92:((v+.055)/1.055)**2.4)*[.2126,.7152,.0722][i],0);
  const contrast=(a,b)=>(Math.max(lum(a),lum(b))+.05)/(Math.min(lum(a),lum(b))+.05);
  const tones={light:['#ffffff','#fffdf8'],dark:['#182239','#28231e']};
  for(const [pn,modes]of Object.entries(palettes))for(const [mode,p]of Object.entries(modes)){
    const accents={palette:[rgb(p.primary),rgb(p['primary-end'])],...Object.fromEntries(Object.entries(foundation.primitive.accent).map(([name,v])=>[name,[v.start.$value.components,v.end.$value.components]]))};
    for(const [name,[start,end]]of Object.entries(accents))for(const surface of [p.bg,p.surface,...tones[mode]])for(let step=0;step<=20;step++){
      const text=mix(mix(start,end,step/20),rgb(p.text),weight);
      assert.ok(contrast(text,rgb(surface))>=4.5,`${pn}/${mode}/${name}/${surface}: gradient text`);
    }
  }
  // This tests gradient-text independently, not text over the full-strength
  // animated background. Combined foreground/background contrast remains
  // an explicit release-review item in Q-HERO-GRADIENTS.
});
