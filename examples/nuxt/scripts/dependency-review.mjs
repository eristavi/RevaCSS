import assert from 'node:assert/strict';
import {readdir,readFile,lstat} from 'node:fs/promises';
import {join,relative} from 'node:path';

// Check the emitted deployment artifact, rather than equating Nuxt's installed
// build/dev dependency tree with the production server's dependency inventory.
export async function reviewProductionDependencies(output) {
 const affected=new Set(['braces','node-forge']);
 const tooling=new Set([...affected,'micromatch','fast-glob','globby','listhen']);
 const packages=[],references=[];
 let files=0;
 async function walk(directory) {
  for(const entry of await readdir(directory,{withFileTypes:true})) {
   const path=join(directory,entry.name);
   assert.ok(!(await lstat(path)).isSymbolicLink(),`Deployment artifact contains a symlink: ${relative(output,path)}`);
   if(entry.isDirectory()){await walk(path);continue;}
   files++;
   if(!/\.(?:json|[cm]?js)$/.test(entry.name))continue;
   const source=await readFile(path,'utf8');
   if(entry.name==='package.json') {
    const metadata=JSON.parse(source);
    if(metadata.name)packages.push({name:metadata.name,version:metadata.version||null});
    for(const name of Object.keys(metadata.dependencies||{}))if(tooling.has(name))references.push(`${relative(output,path)} dependency ${name}`);
   }
   // Known package names in import/require specifiers, emitted bundle comments,
   // or package metadata are evidence to review, not an automatic safe waiver.
   if(/\b(?:node-forge|micromatch|fast-glob|globby|listhen)\b|["']braces(?:\/[^"']*)?["']/.test(source))references.push(relative(output,path));
  }
 }
 await walk(output);
 const present=packages.filter(pkg=>tooling.has(pkg.name));
 assert.deepEqual(present,[],`Build/dev tooling found in production: ${JSON.stringify(present)}`);
 assert.deepEqual(references,[],`Review affected/tooling references: ${JSON.stringify(references)}`);
 const result={files,packages:packages.sort((a,b)=>a.name.localeCompare(b.name)),affectedPackagesPresent:[],toolingReferences:[],scope:'Physical production output inventory and named-reference scan; not a proof for arbitrary application changes or untrusted build inputs.'};
 console.log('Nuxt production dependency inventory: '+JSON.stringify(result));
 return result;
}
