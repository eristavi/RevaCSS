import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {transform} from 'lightningcss';
import {classes} from '../docs/src/data/classes.js';
import options from '../tokens/options.json' with {type:'json'};
import {markupAudit,inheritanceMatrix,nativeMarkupAudit,cascadeLayers} from '../docs/src/data/architecture.js';
import {componentContracts} from '../docs/src/data/documentation.js';

// Check behavior-bearing selector equivalence, rather than matching formatting.
function selectors(css){
 const result=[];
 transform({filename:'audit.css',code:Buffer.from(css),visitor:{Selector(selector){result.push(selector);}}});
 return result;
}
function inspect(node){
 if(!node||typeof node!=='object')return [];
 return [node,...Object.values(node).flatMap(value=>value&&typeof value==='object'?inspect(value):[])];
}
test('every public class, component and option has a generated architectural decision',async()=>{
 assert.deepEqual(markupAudit.map(x=>x.name),classes.map(x=>x.name));
 assert.deepEqual(inheritanceMatrix.map(x=>x.attribute),Object.keys(options).map(x=>'data-'+x));
 assert.deepEqual(nativeMarkupAudit.map(x=>x.name),Object.keys(componentContracts));
 for(const entry of markupAudit)for(const field of ['decision','preferredHook','rationale','wrapperRule'])assert.ok(entry[field],entry.name+' '+field);
 for(const entry of inheritanceMatrix)for(const field of ['scope','targets','inheritance','localOverride','dependencies','limitations'])assert.ok(entry[field],entry.attribute+' '+field);
 const api=JSON.parse(await readFile('docs/public/ai/api.json','utf8'));
 assert.deepEqual(api.architecture,{guide:api.architecture.guide,cascadeLayers,markupAudit,inheritanceMatrix,nativeMarkupAudit});
 const markdown=await readFile('docs/public/ai/architecture.md','utf8');
 for(const entry of markupAudit)assert.ok(markdown.includes('### .'+entry.name+'\n'));
});
test('all emitted component and extension modules establish layer order outside their scope',async()=>{
 const order='@layer '+cascadeLayers.join(', ')+';';
 for(const name of await readdir('dist'))if(/^reva\..*\.css$/.test(name)&&name!=='reva.min.css'){
  const css=await readFile('dist/'+name,'utf8');
  assert.ok(css.startsWith(order),name);
  if(name.endsWith('.scoped.css')||name==='reva.scoped.css')assert.ok(css.includes('@scope (.reva, [data-reva])'),name);
 }
});
test('foundation aliases accompany each legacy selector across components, materials and preferences',async()=>{
 const aliases={card:['surface','card'],container:['layout','container'],grid:['layout','grid'],row:['layout','row'],stack:['layout','stack'],reva:['reva',null]};
 for(const file of await readdir('src/css'))if(file.endsWith('.css')){
  const css=(await readFile('src/css/'+file,'utf8')).replace('/* re-background-accent-stops */','#000, #fff');
  for(const selector of selectors(css)){
   const nodes=inspect(selector);
   for(const [legacy,[attribute,value]] of Object.entries(aliases))if(nodes.some(n=>n.type==='class'&&n.name===legacy)){
    assert.ok(nodes.some(n=>n.type==='attribute'&&n.name==='data-'+attribute&&(value===null||n.operation?.value===value)),file+' '+legacy+' must preserve its attribute equivalent');
   }
  }
 }
});
