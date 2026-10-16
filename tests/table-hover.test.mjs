import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

test('default feedback tint preserves built-in text/link contrast on table surfaces',async()=>{
  const palettes=JSON.parse(await readFile('tokens/palettes.json','utf8'));
  const source=await readFile('src/css/table-hover.css','utf8');
  const alpha=Number(source.match(/var\(--re-link\) (\d+)%/)[1])/100;
  const rgb=hex=>[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255);
  const lum=colour=>colour.reduce((sum,v,i)=>sum+(v<=.04045?v/12.92:((v+.055)/1.055)**2.4)*[.2126,.7152,.0722][i],0);
  const contrast=(a,b)=>(Math.max(lum(a),lum(b))+.05)/(Math.min(lum(a),lum(b))+.05);
  const tones={light:['#f5f8ff','#ffffff','#eaf0fc','#faf8f3','#fffdf8','#f0ece3'],dark:['#0e1424','#182239','#24314b','#1a1714','#28231e','#352e26']};
  for(const [name,modes]of Object.entries(palettes))for(const [mode,p]of Object.entries(modes)){
    for(const background of [p.bg,p.surface,p['surface-alt'],...tones[mode]]){
      const tint=rgb(background).map((v,i)=>v*(1-alpha)+rgb(p.link)[i]*alpha);
      for(const key of ['text','muted','link'])assert.ok(contrast(rgb(p[key]),tint)>=4.5,`${name}/${mode}/${background}/${key}`);
    }
  }
});
