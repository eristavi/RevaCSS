import test from 'node:test';
import assert from 'node:assert/strict';
import { documentationOnly, validationScope } from '../scripts/validation-scope.mjs';

test('only documentation content selects lightweight validation', () => {
  assert.equal(documentationOnly(['README.md','docs/src/pages/components/top-menu.astro','docs/public/images/example-landscape.svg']), true);
  for(const path of ['src/css/base.css','tokens/default.json','docs/src/components/TopMenu.astro','docs/src/components/CodeViewer.astro','docs/src/layouts/DocsLayout.astro','docs/src/styles/docs.css','docs/src/data/navigation.js','docs/astro.config.mjs','package-lock.json','tests/browser/navigation.spec.mjs','.github/workflows/validate-and-pages.yml','docs/public/reva/reva.css','unknown.txt']) {
    assert.equal(documentationOnly(['README.md',path]),false,path);
  }
  assert.equal(documentationOnly([]),false);
  // Disabling rename detection includes an old framework path and its new docs path.
  assert.equal(documentationOnly(['src/css/old.css','docs/src/pages/old.md']),false);
});

test('diff ranges cover all pushed commits and use the PR merge base', () => {
  const base='a'.repeat(40),head='b'.repeat(40);
  for(const [event,range]of [['push',`${base}..${head}`],['pull_request',`${base}...${head}`]]) {
    assert.equal(validationScope({event,base,head},(...args)=>{if(args.includes('--name-only')) {assert.deepEqual(args,['diff','--no-renames','--name-only','-z',range]);return 'README.md\0docs/src/pages/guide.astro\0';} if(args[0]==='show') return '<p>Updated guide</p>';assert.ok(args.includes('--unified=0'));return '-<p>Old guide</p>\n+<p>Updated guide</p>';}),true);
    assert.equal(validationScope({event,base,head},()=> 'README.md\0src/css/edges.css\0'),false);
  }
});

test('manual, initial and indeterminate changes cannot skip browsers', () => {
  const base='a'.repeat(40),head='b'.repeat(40);
  const unexpected=()=>{throw new Error('Should not inspect history');};
  for(const input of [{event:'workflow_dispatch',base,head},{event:'push',base:'0'.repeat(40),head},{event:'push',head},{event:'push',base,head:'invalid'}]) assert.equal(validationScope(input,unexpected),false);
  assert.equal(validationScope({event:'push',base,head},()=>''),false);
  assert.throws(()=>validationScope({event:'push',base,head},()=>{throw new Error('Missing history');}),/Missing history/);
});

test('styles and native interaction changes inside documentation retain browsers', () => {
  for(const line of ['+<style>','-  color: red;','+<nav class="top-menu">','+<button popovertarget="menu">Menu</button>','+<div style="display:grid">','+import TopMenu from "../components/TopMenu.astro";']) {
    assert.equal(validationScope({event:'push',base:'a'.repeat(40),head:'b'.repeat(40)},(...args)=>args.includes('--name-only')?'docs/src/pages/guide.astro\0':line),false,line);
  }
});

test('pages containing embedded styles keep browser checks for any edit', () => {
  assert.equal(validationScope({event:'push',base:'a'.repeat(40),head:'b'.repeat(40)},(...args)=>args.includes('--name-only')?'docs/src/pages/styled.astro\0':args[0]==='show'?'<style>p { color:red }</style>':'-old\n+new'),false);
});
