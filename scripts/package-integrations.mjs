import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {releaseMetadata} from './release-metadata.mjs';

const root=fileURLToPath(new URL('../',import.meta.url));
const output=resolve(root,process.argv[2]||'artifacts');
const json=async file=>JSON.parse(await readFile(file,'utf8'));
const metadata=await json(join(root,'package.json'));
releaseMetadata(metadata,await json(join(root,'package-lock.json')));
const version=metadata.version;
const sha256=bytes=>createHash('sha256').update(bytes).digest('hex');
const packages=[];
await mkdir(output,{recursive:true});

for(const adapter of ['astro','vue','react','svelte']) {
 const directory=join(root,'integrations',adapter);
 const manifest=await json(join(directory,'package.json'));
 assert.equal(manifest.name,`@revacss/${adapter}`);
 assert.equal(manifest.version,version,'Adapter must match the stable core version');
 assert.notEqual(manifest.private,true);
 assert.equal(manifest.license,'MIT');
 assert.equal(manifest.repository.directory,`integrations/${adapter}`);
 assert.equal(manifest.publishConfig.access,'public');
 assert.equal(manifest.peerDependencies.revacss,'^2.0.0');
 assert.deepEqual(Object.keys(manifest.dependencies||{}),[]);
 assert.deepEqual(Object.keys(manifest.optionalDependencies||{}),[]);
 if(adapter==='react')execFileSync('npm',['run','build'],{cwd:directory,stdio:'inherit'});
 const [pack]=JSON.parse(execFileSync('npm',['pack','--ignore-scripts','--json','--pack-destination',output],{cwd:directory,encoding:'utf8'}));
 const filename=`revacss-${adapter}-${version}.tgz`;
 assert.equal(pack.filename,filename);
 const file=join(output,filename);
 const archived=JSON.parse(execFileSync('tar',['-xOf',file,'package/package.json'],{encoding:'utf8'}));
 assert.equal(archived.version,version);
 assert.equal(archived.name,manifest.name);
 const files=pack.files.map(entry=>entry.path);
 const prefix=adapter==='react'?'dist/':'components/';
 assert.ok(files.includes('README.md')&&files.includes('LICENSE')&&files.includes('package.json'));
 assert.ok(files.filter(path=>path.startsWith(prefix)).length>0);
 assert.ok(files.every(path=>path.startsWith(prefix)||['README.md','LICENSE','package.json'].includes(path)),'Package must not ship tests, tools, dependencies or core CSS');
 assert.ok(!files.some(path=>/\.(?:css|tgz|zip)$/.test(path)));
 const targets=value=>typeof value==='string'?[value]:Object.values(value).flatMap(targets);
 for(const target of targets(archived.exports)) {
  const path=target.replace(/^\.\//,'');
  if(path.includes('*')) {
   const [before,after]=path.split('*');
   assert.ok(files.some(file=>file.startsWith(before)&&file.endsWith(after)),`Unresolved export ${target}`);
  } else assert.ok(files.includes(path),`Unresolved export ${target}`);
 }
 if(adapter!=='react')assert.equal(files.filter(path=>path.startsWith('components/')).length,10);
 packages.push({name:manifest.name,version,filename,sha256:sha256(await readFile(file)),files:files.length});
}

execFileSync('python3',[join(root,'integrations/laravel/scripts/package.py'),'--output-dir',output],{cwd:root,stdio:'inherit'});
const filename=`revacss-laravel-${version}.zip`;
// Read actual ZIP entries and compare every published CSS/font/icon byte with
// its core source. PHP/Composer installation is checked by the packaging CI job.
const php=JSON.parse(execFileSync('python3',['-c',`
import json,sys,zipfile,hashlib,pathlib
archive=pathlib.Path(sys.argv[1]);root=pathlib.Path(sys.argv[2]);version=sys.argv[3]
with zipfile.ZipFile(archive) as z:
 names=z.namelist();composer=json.loads(z.read('composer.json'))
 assert composer['name']=='revacss/laravel' and composer['version']==version
 assert all(not name.startswith('/') and '..' not in pathlib.PurePosixPath(name).parts for name in names)
 assert not any(part in ['vendor','tests','artifacts','.phpunit.cache'] for name in names for part in pathlib.PurePosixPath(name).parts)
 assert 'composer.lock' not in names and 'src/RevaServiceProvider.php' in names
 manifest=json.loads(z.read('resources/assets/manifest.json'));assert manifest['version']==version
 for name,digest in manifest['files'].items():
  data=z.read('resources/assets/'+name)
  assert hashlib.sha256(data).hexdigest()==digest
  assert data==(root/'dist'/name).read_bytes()
 assert json.loads(z.read('resources/contracts.json'))=={key:value['values'] for key,value in json.loads((root/'tokens/options.json').read_text()).items()}
 print(json.dumps({'name':composer['name'],'version':version,'files':len(names),'assets':len(manifest['files'])}))
`,join(output,filename),root,version],{encoding:'utf8'}));
packages.push({...php,filename,sha256:sha256(await readFile(join(output,filename)))});

const names=new Set(packages.map(pkg=>pkg.filename));
let existing='';
try{existing=await readFile(join(output,'SHA256SUMS.txt'),'utf8');}catch(error){if(error.code!=='ENOENT')throw error;}
const lines=existing.trim().split('\n').filter(line=>line&&!names.has(line.trim().split(/\s+/).at(-1)));
lines.push(...packages.map(pkg=>`${pkg.sha256}  ${pkg.filename}`));
await writeFile(join(output,'SHA256SUMS.txt'),lines.join('\n')+'\n');
await writeFile(join(output,'integration-packages.json'),JSON.stringify({version,packages},null,2)+'\n');
console.log('Verified stable integration archives: '+JSON.stringify(packages));
