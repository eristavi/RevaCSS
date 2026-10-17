import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {transform} from 'lightningcss';
test('optional colorful backgrounds use every foundation accent and preserve core isolation',async()=>{
  const foundation=JSON.parse(await readFile('tokens/foundation.tokens.json','utf8'));
  const options=JSON.parse(await readFile('tokens/options.json','utf8'));
  const global=await readFile('dist/reva.backgrounds.css','utf8');
  const scoped=await readFile('dist/reva.backgrounds.scoped.css','utf8');
  assert.deepEqual(options.background.values,['default','colorful','colorful-animated']);
  for(const accent of Object.values(foundation.primitive.accent))assert.ok(global.includes(accent.start.$value.hex),accent.start.$value.hex);
  assert.ok(!global.includes('re-background-accent-stops'));
  const order='@layer re.tokens, re.base, re.components, re.buttons, re.utilities;\n';
  assert.ok(global.startsWith(order));
  assert.equal(scoped,order+'@scope (.reva, [data-reva]) {\n'+global.slice(order.length).replaceAll(':root',':scope')+'\n}\n');
  for(const css of [global,scoped])assert.doesNotThrow(()=>transform({code:Buffer.from(css)}));
  assert.ok(!(await readFile('dist/reva.css','utf8')).includes('data-background'));
  assert.equal(await readFile('docs/public/reva/reva.backgrounds.css','utf8'),global);
});
