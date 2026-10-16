import test from 'node:test';
import assert from 'node:assert/strict';
import {fixtureHTML} from '../docs/src/data/manual-test.js';
import {topics} from '../docs/src/data/examples.js';

test('manual fixtures namespace CSS ID selectors without rewriting colour declarations',()=>{
  const html=fixtureHTML('<style>#abc123 { color: #abc123; } @supports (position-anchor: auto) { #abc123:hover { margin: auto; } } @media print { #abc123 { display: none; } }</style><aside id="abc123"></aside>','sample','/');
  assert.match(html,/#sample-abc123 \{ color: #abc123;/);
  assert.match(html,/#sample-abc123:hover/);
  assert.match(html,/@media print \{ #sample-abc123/);
  assert.match(html,/id="sample-abc123"/);
});

test('help specimens keep independent styling, native targets and visible hints after namespacing',()=>{
  const examples=topics.find(t=>t.slug==='disclosures').examples.filter(e=>e.id.startsWith('anchored-help'));
  assert.equal(examples.length,2);
  for(const example of examples){
    const prefix='fixture-'+example.id;
    const html=fixtureHTML(example.html,prefix,'/RevaCSS/');
    const targets=[...html.matchAll(/popovertarget="([^"]+)"/g)].map(m=>m[1]);
    assert.equal(targets.length,2);
    assert.equal(targets[0],targets[1]);
    assert.ok(targets[0].startsWith(prefix+'-'));
    assert.ok(html.includes('#'+targets[0]+' {'));
    assert.ok(html.includes('id="'+targets[0]+'" popover="auto"'));
    assert.match(html,/<small id="fixture-[^"]+">Use at least 12 characters\.<\/small>/);
  }
});
