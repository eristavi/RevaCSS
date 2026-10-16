import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
test('gradient text and hero demo content backings retain bundled text contrast across moving solid colours',async()=>{
  const palettes=JSON.parse(await readFile('tokens/palettes.json','utf8'));
  const foundation=JSON.parse(await readFile('tokens/foundation.tokens.json','utf8'));
  const source=await readFile('src/css/gradients.css','utf8');
  const demo=await readFile('docs/src/pages/demos/hero/index.astro','utf8');
  const weight=Number(source.match(/var\(--re-primary\) (\d+)%/)[1])/100;
  const backing=Number(demo.match(/rgb\(255 255 255 \/ (\d+)%\)/)[1])/100;
  const rgb=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)/255);
  const mix=(a,b,t)=>a.map((v,i)=>v*t+b[i]*(1-t));
  const lum=c=>c.reduce((s,v,i)=>s+(v<=.04045?v/12.92:((v+.055)/1.055)**2.4)*[.2126,.7152,.0722][i],0);
  const contrast=(a,b)=>(Math.max(lum(a),lum(b))+.05)/(Math.min(lum(a),lum(b))+.05);
  for(const [pn,modes]of Object.entries(palettes))for(const [mode,p]of Object.entries(modes)){
    const neutral=rgb(mode==='light'?'#ffffff':'#000000');
    const accents={palette:[rgb(p.primary),rgb(p['primary-end'])],...Object.fromEntries(Object.entries(foundation.primitive.accent).map(([name,v])=>[name,[v.start.$value.components,v.end.$value.components]]))};
    const custom=mode==='light'?[rgb('#8a0dc7'),rgb('#006b56')]:[rgb('#ff70d2'),rgb('#46e8ff')];
    for(const [name,[start,end]]of Object.entries(accents))for(let bg=0;bg<=20;bg++){
      const moving=mix(start,neutral,bg/20);
      const background=mix(neutral,moving,backing);
      for(const key of ['text','muted','link'])assert.ok(contrast(rgb(p[key]),background)>=4.5,`${pn}/${mode}/${name}: ${key}`);
      for(let step=0;step<=20;step++){
        const text=mix(mix(start,end,step/20),rgb(p.text),weight);
        assert.ok(contrast(text,background)>=4.5,`${pn}/${mode}/${name}: default gradient text`);
        assert.ok(contrast(mix(custom[0],custom[1],step/20),background)>=4.5,`${pn}/${mode}/${name}: demo test colours`);
      }
    }
  }
  // Full-strength unbacked backgrounds are deliberately outside this claim:
  // a foreground that works on white can fail on a dark accent. Release review
  // must inspect each actual composition, as recorded in Q-HERO-GRADIENTS.
});
