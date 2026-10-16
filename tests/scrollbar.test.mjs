import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
test('light-theme primary scrollbar thumbs retain contrast across bundled palettes, accents and tones',async()=>{
  const palettes=JSON.parse(await readFile('tokens/palettes.json','utf8'));
  const foundation=JSON.parse(await readFile('tokens/foundation.tokens.json','utf8'));
  // Dark mode deliberately uses the exact button primary, per maintainer choice.
  // Its thumb/track contrast remains an explicit manual release-review item.
  const tones={light:['#ffffff','#fffdf8'],dark:['#182239','#28231e']};
  const rgb=hex=>[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255);
  const luminance=hex=>rgb(hex).reduce((sum,v,i)=>sum+(v<=.04045?v/12.92:((v+.055)/1.055)**2.4)*[.2126,.7152,.0722][i],0);
  for(const [name,modes]of Object.entries(palettes))for(const [mode,palette]of Object.entries(modes).filter(([mode])=>mode==='light')){
    for(const surface of [palette.surface,...tones[mode]]){
      const colours=[palette.primary,...Object.values(foundation.primitive.accent).map(value=>value.start.$value.hex)];
      for(const colour of colours){
        const thumb=luminance(colour),track=luminance(surface);
        assert.ok((Math.max(thumb,track)+.05)/(Math.min(thumb,track)+.05)>=3,`${name}/${mode}/${colour}/${surface}`);
      }
    }
  }
});
