import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {transform} from 'lightningcss';
import {semanticCSS} from '../scripts/semantic-css.mjs';
import {distributionFiles} from '../docs/src/data/distributions.js';

test('semantic projection preserves native alternatives without broadening pattern selectors',()=>{
 const css=semanticCSS(':where(button,.button):not(.outline){color:red}.card input{margin:37px}@scope (.sidebar){button{padding:99px}} :where([data-layout="grid"],.grid){display:grid}');
 assert.match(css,/:where\(button\)/);
 assert.doesNotMatch(css,/37px|99px|display:\s*grid|\.button|\.sidebar|\.card/);
 // A class nested in :has is a requirement, not a removable exclusion.
 assert.doesNotMatch(semanticCSS('section:has(>.card){padding:97px}'),/97px/);
 assert.match(semanticCSS('section:not(.card)>button{color:red}'),/section\s*>\s*button/);
});

test('every semantic output excludes class selectors and local layout/surface aliases',async()=>{
 const inspect=value=>{
  if(!value || typeof value!=='object')return;
  assert.notEqual(value.type,'class');
  if(value.type==='attribute')assert.ok(!['data-layout','data-surface'].includes(value.name));
  for(const child of Object.values(value))if(child && typeof child==='object')inspect(child);
 };
 for(const name of distributionFiles.filter(name=>name.startsWith('reva.semantic.'))){
  transform({filename:name,code:await readFile('dist/'+name),visitor:{Selector(selector){inspect(selector);}}});
 }
});

test('split distributions and examples are available without browser runtime',async()=>{
 const names=await readdir('dist');
 for(const name of distributionFiles)assert.ok(names.includes(name),name);
 const semantic=await readFile('examples/semantic.html','utf8');
 assert.doesNotMatch(semantic,/\bclass=|<script\b/);
 assert.doesNotMatch(semantic,/data-layout=|data-surface=/);
 const patterns=await readFile('examples/patterns.html','utf8');
 assert.match(patterns,/reva\.semantic\.css/);assert.match(patterns,/reva\.patterns\.css/);
 assert.match(patterns,/class="card"/);
 const metadata=JSON.parse(await readFile('package.json','utf8'));
 assert.equal(metadata.exports['./semantic'].default,'./dist/reva.semantic.css');
 assert.equal(metadata.exports['./patterns'].default,'./dist/reva.patterns.css');
});
