import test from 'node:test';
import assert from 'node:assert/strict';
import {readdir,readFile,stat} from 'node:fs/promises';
import {transform} from 'lightningcss';
import {classes,classGroups} from '../docs/src/data/classes.js';
test('Classes API covers every framework class with valid modules and shared generated records',async()=>{
  const actual=new Set();
  const walk=node=>{
    if(!node||typeof node!=='object')return;
    if(node.type==='class')actual.add(node.name);
    for(const value of Object.values(node))if(value&&typeof value==='object')walk(value);
  };
  for(const file of await readdir('src/css'))if(file.endsWith('.css')){
    const code=(await readFile('src/css/'+file,'utf8')).replace('/* re-background-accent-stops */','#000, #fff');
    transform({filename:file,code:Buffer.from(code),visitor:{Selector(selector){walk(selector);}}});
  }
  assert.equal(new Set(classes.map(entry=>entry.name)).size,classes.length);
  assert.deepEqual([...actual].sort(),classes.map(entry=>entry.name).sort());
  const groups=new Set(classGroups.map(group=>group.id));
  for(const entry of classes){
    assert.ok(groups.has(entry.group),entry.name);
    for(const key of ['description','markup','guide','stylesheet'])assert.ok(entry[key],`${entry.name}: ${key}`);
    assert.equal(entry.selector,'.'+entry.name);
    assert.ok(['supported','compatibility'].includes(entry.status));
    assert.equal(typeof entry.includedInCore,'boolean');
    assert.ok((await stat('dist/'+entry.stylesheet)).isFile());
  }
  const api=JSON.parse(await readFile('docs/public/ai/api.json','utf8'));
  const markdown=await readFile('docs/public/ai/classes.md','utf8');
  assert.deepEqual(api.classes.map(entry=>entry.name),classes.map(entry=>entry.name));
  for(const entry of classes){
    assert.ok(markdown.includes('### '+entry.selector+'\n'),entry.name);
    assert.equal(api.classes.find(item=>item.name===entry.name).markup,entry.markup);
  }
});
