
import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { transform } from 'lightningcss';
const data=JSON.parse(await readFile('tokens/foundation.tokens.json','utf8'));
const options=JSON.parse(await readFile('tokens/options.json','utf8'));
function resolve(path) { let t=path.split('.').reduce((a,k)=>a[k],data); if(!t?.$type) throw Error(`Invalid token ${path}`); let v=t.$value; if(typeof v==='string' && v.startsWith('{')) return resolve(v.slice(1,-1)); return {type:t.$type,value:v}; }
function css(t) { if(t.type==='color') return t.value.hex; if(t.type==='dimension') return `${t.value.value}${t.value.unit}`; if(t.type==='fontFamily') return t.value.map(x=>x.includes(' ')?JSON.stringify(x):x).join(', '); throw Error(`Unknown type ${t.type}`); }
function declarations(group) { return Object.keys(data[group]).filter(k=>k!=='font-heading').map(k=>`--re-${k}: ${css(resolve(`${group}.${k}`))};`).join('\n'); }
const tones={neutral:{light:{},dark:{}},cool:{light:{bg:'#f5f8ff',surface:'#ffffff','surface-alt':'#eaf0fc'},dark:{bg:'#0e1424',surface:'#182239','surface-alt':'#24314b'}},warm:{light:{bg:'#faf8f3',surface:'#fffdf8','surface-alt':'#f0ece3'},dark:{bg:'#1a1714',surface:'#28231e','surface-alt':'#352e26'}}};
const rule=(sel,decl)=>`${sel} { ${decl} }\n`;
const scope=(sel,decl)=>`@scope (${sel}) { ${rule(':where(:scope)',decl)} }\n`;
const adaptive=Object.keys(data.light).map(k=>`--re-${k}: light-dark(${css(resolve(`light.${k}`))},${css(resolve(`dark.${k}`))});`).join(' ');
let tokens='@layer re.tokens, re.base, re.components, re.utilities;\n@layer re.tokens {\n';
tokens+=rule(':where(:root)',`${declarations('semantic')} ${adaptive}
--re-density: 1; --re-space: 1rem; --re-type: 1rem;
--re-button-radius: var(--re-radius); --re-surface-border: 1px;
--re-shadow: 0 2px 8px rgb(0 0 0 / 8%); --re-duration: 140ms; --re-press: 1px;
--re-gradient: 1; --re-input-opacity: 1; --re-input-shadow: inset 0 1px 2px rgb(0 0 0 / 3%);
--re-danger: ${css(resolve('primitive.danger.start'))}; --re-danger-end: ${css(resolve('primitive.danger.end'))};
--re-danger-link: light-dark(#a61e31,#ffabb5); --re-warning: ${css(resolve('primitive.warning.start'))}; --re-warning-end: ${css(resolve('primitive.warning.end'))}; --re-on-warning: ${css(resolve('primitive.warningText'))}; color-scheme: light dark;`);
for(const mode of ['light','dark','auto']) tokens+=rule(`:where([data-theme="${mode}"])`,`color-scheme: ${mode==='auto'?'light dark':mode};`);
for(const [tone,v] of Object.entries(tones)) {
 const colors=Object.keys(data.light).map(k=>`--re-${k}: light-dark(${v.light[k]||css(resolve(`light.${k}`))},${v.dark[k]||css(resolve(`dark.${k}`))});`).join(' ');
 tokens+=rule(`:where([data-tone="${tone}"])`,colors);
}
for(const a of Object.keys(data.primitive.accent)) tokens+=rule(`:where([data-accent="${a}"])`,`--re-primary: ${css(resolve(`primitive.accent.${a}.start`))}; --re-primary-end: ${css(resolve(`primitive.accent.${a}.end`))};`);
const presets={shape:{square:'--re-radius: 0rem; --re-button-radius: 0rem;',subtle:'--re-radius: .3rem; --re-button-radius: .3rem;',rounded:'--re-radius: .75rem; --re-button-radius: .75rem;',pill:'--re-radius: 1.5rem; --re-button-radius: 999px;'},fill:{solid:'--re-gradient: 0;',gradient:'--re-gradient: 1;'},density:{compact:'--re-density: .8; --re-space: .8rem; --re-gap: .8rem;',comfortable:'--re-density: 1; --re-space: 1rem; --re-gap: 1rem;',spacious:'--re-density: 1.25; --re-space: 1.25rem; --re-gap: 1.25rem;'},depth:{flat:'--re-shadow: none;',subtle:'--re-shadow: 0 2px 8px rgb(0 0 0 / 8%);',pronounced:'--re-shadow: 0 8px 24px rgb(0 0 0 / 18%);'},motion:{none:'--re-duration: 0ms; --re-press: 0px;',subtle:'--re-duration: 140ms; --re-press: 1px;',expressive:'--re-duration: 240ms; --re-press: 2px;'},type:{compact:'--re-type: .9375rem;',standard:'--re-type: 1rem;',large:'--re-type: 1.125rem;'},border:{subtle:'--re-surface-border: 1px;',defined:'--re-surface-border: 2px;',none:'--re-surface-border: 0px;'},controls:{styled:'--re-input-opacity: 1; --re-input-shadow: inset 0 1px 2px rgb(0 0 0 / 3%);',minimal:'--re-input-opacity: 0; --re-input-shadow: none;'}};
for(const [key,vals] of Object.entries(presets)) for(const [val,decl] of Object.entries(vals)) tokens+=rule(`:where([data-${key}="${val}"])`,decl);
tokens+='}\n';
let contrast='@layer re.utilities {\n';
const contrastDecl='--re-control-line: var(--re-text); --re-line: var(--re-text); --re-muted: var(--re-text); --re-input-shadow: none;';
contrast+=rule(':where([data-contrast="more"])',contrastDecl);
contrast+=`@media (prefers-contrast: more) { ${rule(':where(:root,[data-theme],[data-tone],[data-contrast])',contrastDecl)} }\n}\n`;
await mkdir('dist',{recursive:true}); await mkdir('docs/public/reva',{recursive:true});
const base=await readFile('src/css/base.css','utf8'), comp=await readFile('src/css/components.css','utf8');
const navigation=await readFile('src/css/navigation.css','utf8');
const glass=await readFile('src/css/glass.css','utf8');
const full=tokens+base+comp+navigation+contrast;
for(const [name,content] of [['reva.css',full],['reva.tokens.css',tokens],['reva.base.css',base],['reva.components.css',comp+navigation+contrast],['reva.navigation.css',navigation],['reva.glass.css',glass],['reva.glass.scoped.css',`@scope (.reva) {\n${glass}\n}\n`],['reva.scoped.css',`@scope (.reva) {\n${full.replaceAll(':root',':scope')}\n}`]]) {
 transform({filename:name,code:Buffer.from(content),minify:false});
 await writeFile('dist/'+name,content); await copyFile('dist/'+name,'docs/public/reva/'+name);
}
const min=transform({filename:'reva.css',code:Buffer.from(full),minify:true}).code;
await writeFile('dist/reva.min.css',min); await copyFile('dist/reva.min.css','docs/public/reva/reva.min.css');
await writeFile('docs/src/pages/generated-reference.json',JSON.stringify({options,tokens:data},null,2));
console.log(`Built CSS: ${Buffer.byteLength(full)} bytes; minified ${min.length} bytes.`);

await mkdir('dist/fonts',{recursive:true});
await mkdir('docs/public/reva/fonts',{recursive:true});
for(const name of ['Manrope.ttf','OFL.txt']) { await copyFile('assets/fonts/'+name,'dist/fonts/'+name); await copyFile('assets/fonts/'+name,'docs/public/reva/fonts/'+name); }
await copyFile('assets/reva-fonts.css','dist/reva-fonts.css');
await copyFile('assets/reva-fonts.css','docs/public/reva/reva-fonts.css');
