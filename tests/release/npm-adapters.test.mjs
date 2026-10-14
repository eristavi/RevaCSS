import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile,mkdir,readFile,chmod,rm} from 'node:fs/promises';
import {execFileSync,spawnSync} from 'node:child_process';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const publisher=fileURLToPath(new URL('../../scripts/prepare-npm-release.mjs',import.meta.url));
const names=['revacss','@revacss/astro','@revacss/vue','@revacss/react','@revacss/svelte'];

async function fixture(name,options={}) {
 const directory=await mkdtemp(join(tmpdir(),'reva-publication-fixture-'));
 const filename=name.replace(/^@/,'').replace('/','-')+'-2.0.0.tgz';
 await mkdir(join(directory,'package'));
 await mkdir(join(directory,'bin'));
 const manifest={name,version:'2.0.0',license:'MIT',repository:{url:'https://github.com/eristavi/RevaCSS',...(name!=='revacss'?{directory:'integrations/'+name.split('/')[1]}:{})},...(name!=='revacss'?{peerDependencies:{revacss:'^2.0.0'}}:{}),...options.manifest};
 await writeFile(join(directory,'package/package.json'),JSON.stringify(manifest));
 execFileSync('tar',['-czf',filename,'package'],{cwd:directory});
 const bytes=await readFile(join(directory,filename));
 const digest='sha256:'+createHash('sha256').update(bytes).digest('hex');
 const integrity='sha512-'+createHash('sha512').update(bytes).digest('base64');
 const metadata=options.registry==='collision'?{versions:{'2.0.0':{dist:{integrity:'sha512-other'}}}}:options.registry==='existing'?{versions:{'2.0.0':{dist:{integrity}}},'dist-tags':{latest:'2.0.0'}}:options.registry==='legacy'?{versions:{},'dist-tags':{latest:'2.1.0'}}:{versions:{},'dist-tags':{}};
 const data={name,filename,directory,commit:'a'.repeat(40),integrity,metadata,release:{tag_name:'v2.0.0',draft:false,prerelease:false,assets:[{name:filename,state:'uploaded',size:bytes.length,digest:options.tamper?'sha256:'+'0'.repeat(64):digest}]}};
 await writeFile(join(directory,'fixture.json'),JSON.stringify(data));
 const gh=join(directory,'bin/gh');
 await writeFile(gh,`#!/usr/bin/env python3\nimport os,sys,json,shutil,pathlib\nf=json.loads(pathlib.Path(os.environ['FIXTURE']).read_text());a=sys.argv[1:]\nif a[0]=='api':\n print(json.dumps(f['release'] if '/releases/' in a[1] else {'sha':f['commit']}))\nelif a[:2]==['release','download']:\n destination=pathlib.Path(a[a.index('--dir')+1]);shutil.copyfile(pathlib.Path(f['directory'])/f['filename'],destination/f['filename'])\nelse:sys.exit(90)\n`);await chmod(gh,0o755);
 const mock=join(directory,'registry.mjs');
 await writeFile(mock,`import fs from 'node:fs';\nconst f=JSON.parse(fs.readFileSync(process.env.FIXTURE));\nglobalThis.fetch=async url=>{const u=new URL(url);if(u.origin!=='https://registry.npmjs.org'||decodeURIComponent(u.pathname.slice(1))!==f.name)throw Error('Unexpected registry request');return {status:${options.registry?'200':'404'},ok:${options.registry?'true':'false'},json:async()=>f.metadata};};\n`);
 return {directory,integrity,run:()=>spawnSync(process.execPath,['--import',mock,publisher],{cwd:directory,encoding:'utf8',env:{...process.env,PATH:join(directory,'bin')+':'+process.env.PATH,FIXTURE:join(directory,'fixture.json'),GITHUB_REPOSITORY:'eristavi/RevaCSS',RELEASE_TAG:'v2.0.0',PACKAGE_NAME:name,GITHUB_OUTPUT:join(directory,'outputs')}})};
}

for(const name of names)test(`verified ${name} archive selection supports an unpublished registry package`,async()=>{
 const f=await fixture(name);try{const r=f.run();assert.equal(r.status,0,r.stderr);const outputs=await readFile(join(f.directory,'outputs'),'utf8');assert.match(outputs,/already_published=false/);assert.match(outputs,/publish_tag=latest/);const record=JSON.parse(await readFile(join(f.directory,'artifacts/release.json'),'utf8'));assert.equal(record.package,name);assert.equal(record.integrity,f.integrity);}finally{await rm(f.directory,{recursive:true,force:true});}
});
for(const [label,options,pattern]of [
 ['immutable registry collision',{registry:'collision'},/already exists with different bytes/],
 ['tampered GitHub archive digest',{tamper:true},/does not match its GitHub release digest/],
 ['wrong adapter subdirectory',{manifest:{repository:{url:'https://github.com/eristavi/RevaCSS',directory:'integrations/react'}}},/Adapter directory/],
 ['private archive',{manifest:{private:true}},/Package identity/],
 ['runtime dependency injection',{manifest:{dependencies:{unexpected:'1.0.0'}}},/must not introduce bundled runtime dependencies/],
])test(`publication rejects ${label}`,async()=>{
 const f=await fixture('@revacss/vue',options);try{const r=f.run();assert.notEqual(r.status,0);assert.match(r.stderr,pattern);}finally{await rm(f.directory,{recursive:true,force:true});}
});
for(const [registry,tag,published]of [['existing','latest','true'],['legacy','legacy','false']])test(`registry ${registry} preserves immutable bytes and dist-tag intent`,async()=>{
 const f=await fixture('@revacss/svelte',{registry});try{const r=f.run();assert.equal(r.status,0,r.stderr);const outputs=await readFile(join(f.directory,'outputs'),'utf8');assert.match(outputs,new RegExp('publish_tag='+tag));assert.match(outputs,new RegExp('already_published='+published));}finally{await rm(f.directory,{recursive:true,force:true});}
});
