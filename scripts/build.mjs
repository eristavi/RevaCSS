
import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { transform } from 'lightningcss';
const data=JSON.parse(await readFile('tokens/foundation.tokens.json','utf8'));
const options=JSON.parse(await readFile('tokens/options.json','utf8'));
const palettes=JSON.parse(await readFile('tokens/palettes.json','utf8'));
const paletteDeclarations = p => Object.keys(p.light).map(k=>`--re-${k}: light-dark(${p.light[k]},${p.dark[k]});`).join(' ')
  + ' ' + ['muted','link','control-line'].map(k=>`--re-palette-${k}: light-dark(${p.light[k]},${p.dark[k]});`).join(' ');
function resolve(path) { let t=path.split('.').reduce((a,k)=>a[k],data); if(!t?.$type) throw Error(`Invalid token ${path}`); let v=t.$value; if(typeof v==='string' && v.startsWith('{')) return resolve(v.slice(1,-1)); return {type:t.$type,value:v}; }
function css(t) { if(t.type==='color') return t.value.hex; if(t.type==='dimension') return `${t.value.value}${t.value.unit}`; if(t.type==='fontFamily') return t.value.map(x=>x.includes(' ')?JSON.stringify(x):x).join(', '); throw Error(`Unknown type ${t.type}`); }
function declarations(group) { return Object.keys(data[group]).filter(k=>k!=='font-heading').map(k=>`--re-${k}: ${css(resolve(`${group}.${k}`))};`).join('\n'); }
const tones={neutral:{light:{},dark:{}},cool:{light:{bg:'#f5f8ff',surface:'#ffffff','surface-alt':'#eaf0fc'},dark:{bg:'#0e1424',surface:'#182239','surface-alt':'#24314b'}},warm:{light:{bg:'#faf8f3',surface:'#fffdf8','surface-alt':'#f0ece3'},dark:{bg:'#1a1714',surface:'#28231e','surface-alt':'#352e26'}}};
const rule=(sel,decl)=>`${sel} { ${decl} }\n`;
const adaptive=paletteDeclarations(palettes.mono);
let tokens='@layer re.tokens, re.base, re.components, re.utilities;\n@layer re.tokens {\n';
tokens+=rule(':where(:root)',`${declarations('semantic')} ${adaptive}
--re-density: 1; --re-space: 1rem; --re-type: 1rem;
--re-container: 75rem; --re-control-scale: 1; --re-gap-factor: 1;
--re-table-stripe: 0%; --re-table-lines: 0; --re-image-ratio: auto; --re-image-fit: cover;
--re-button-radius: var(--re-radius); --re-surface-border: 1px;
--re-shadow: 0 2px 8px rgb(0 0 0 / 8%); --re-duration: 140ms; --re-press: 1px;
--re-edge-content: none; --re-edge-position: static; --re-edge-animation: none; --re-edge-interaction: none; --re-edge-time: 8s; --re-edge-count: infinite; --re-edge-play: running; --re-edge-display: block;
--re-gradient: 1; --re-input-opacity: 1; --re-input-shadow: inset 0 1px 2px rgb(0 0 0 / 3%);
--re-success: ${css(resolve('primitive.accent.green.start'))}; --re-success-end: ${css(resolve('primitive.accent.green.end'))};
--re-danger: ${css(resolve('primitive.danger.start'))}; --re-danger-end: ${css(resolve('primitive.danger.end'))};
--re-danger-link: light-dark(#a61e31,#ffabb5); --re-warning: ${css(resolve('primitive.warning.start'))}; --re-warning-end: ${css(resolve('primitive.warning.end'))}; --re-on-warning: ${css(resolve('primitive.warningText'))}; color-scheme: light dark;`);
for(const mode of ['light','dark','auto']) tokens+=rule(`:where([data-theme="${mode}"], :scope[data-theme="${mode}"])`,`color-scheme: ${mode==='auto'?'light dark':mode};`);
for(const [name,palette] of Object.entries(palettes)) tokens+=rule(`:where([data-palette="${name}"], :scope[data-palette="${name}"])`,paletteDeclarations(palette));
// Explicit temperature overrides change surfaces only; palette foregrounds remain inherited.
for(const [tone,v] of Object.entries(tones)) {
 const colors=['bg','surface','surface-alt'].map(k=>`--re-${k}: light-dark(${v.light[k]||css(resolve(`light.${k}`))},${v.dark[k]||css(resolve(`dark.${k}`))});`).join(' ');
 tokens+=rule(`:where([data-tone="${tone}"], :scope[data-tone="${tone}"])`,colors);
}
for(const a of Object.keys(data.primitive.accent)) tokens+=rule(`:where([data-accent="${a}"], :scope[data-accent="${a}"])`,`--re-primary: ${css(resolve(`primitive.accent.${a}.start`))}; --re-primary-end: ${css(resolve(`primitive.accent.${a}.end`))}; --re-on-primary: #fff;`);
const presets={width:{narrow:'--re-container: 48rem;',standard:'--re-container: 75rem;',wide:'--re-container: 90rem;'},table:{plain:'--re-table-stripe: 0%; --re-table-lines: 0;',striped:'--re-table-stripe: 100%; --re-table-lines: 0;',bordered:'--re-table-stripe: 0%; --re-table-lines: 1;'},size:{small:'--re-control-scale: .875;',medium:'--re-control-scale: 1;',large:'--re-control-scale: 1.125;'},ratio:{auto:'--re-image-ratio: auto;',square:'--re-image-ratio: 1;',landscape:'--re-image-ratio: 4 / 3;',portrait:'--re-image-ratio: 3 / 4;',wide:'--re-image-ratio: 16 / 9;'},fit:{cover:'--re-image-fit: cover;',contain:'--re-image-fit: contain;'},gap:{none:'--re-gap-factor: 0;',small:'--re-gap-factor: .5;',medium:'--re-gap-factor: 1;',large:'--re-gap-factor: 2;'},shape:{square:'--re-radius: 0rem; --re-button-radius: 0rem;',subtle:'--re-radius: .3rem; --re-button-radius: .3rem;',rounded:'--re-radius: .75rem; --re-button-radius: .75rem;',pill:'--re-radius: 1.5rem; --re-button-radius: 999px;'},fill:{solid:'--re-gradient: 0;',gradient:'--re-gradient: 1;'},density:{compact:'--re-density: .8; --re-space: .8rem; --re-gap: .8rem;',comfortable:'--re-density: 1; --re-space: 1rem; --re-gap: 1rem;',spacious:'--re-density: 1.25; --re-space: 1.25rem; --re-gap: 1.25rem;'},depth:{flat:'--re-shadow: none;',subtle:'--re-shadow: 0 2px 8px rgb(0 0 0 / 8%);',pronounced:'--re-shadow: 0 8px 24px rgb(0 0 0 / 18%);'},motion:{none:'--re-duration: 0ms; --re-press: 0px; --re-edge-play: paused;',subtle:'--re-duration: 140ms; --re-press: 1px; --re-edge-play: running;',expressive:'--re-duration: 240ms; --re-press: 2px; --re-edge-play: running;'},type:{compact:'--re-type: .9375rem;',standard:'--re-type: 1rem;',large:'--re-type: 1.125rem;'},border:{subtle:'--re-surface-border: 1px;',defined:'--re-surface-border: 2px;',none:'--re-surface-border: 0px;'},controls:{styled:'--re-input-opacity: 1; --re-input-shadow: inset 0 1px 2px rgb(0 0 0 / 3%);',minimal:'--re-input-opacity: 0; --re-input-shadow: none;'}};
presets.edge={
 plain:'--re-edge-content: none; --re-edge-position: static; --re-edge-animation: none; --re-edge-interaction: none; --re-edge-time: 8s; --re-edge-count: infinite;',
 gradient:'--re-edge-content: ""; --re-edge-position: relative; --re-edge-animation: none; --re-edge-interaction: none; --re-edge-time: 8s; --re-edge-count: infinite;',
 shine:'--re-edge-content: ""; --re-edge-position: relative; --re-edge-animation: none; --re-edge-interaction: re-edge-turn; --re-edge-time: 800ms; --re-edge-count: 1;',
 animated:'--re-edge-content: ""; --re-edge-position: relative; --re-edge-animation: re-edge-turn; --re-edge-interaction: re-edge-turn; --re-edge-time: 8s; --re-edge-count: infinite;'
};
for(const [key,vals] of Object.entries(presets)) for(const [val,decl] of Object.entries(vals)) tokens+=rule(`:where([data-${key}="${val}"], :scope[data-${key}="${val}"])`,decl);
tokens+='}\n';
let contrast='@layer re.utilities {\n';
const contrastDecl='--re-control-line: var(--re-text); --re-line: var(--re-text); --re-muted: var(--re-text); --re-input-shadow: none; --re-edge-display: none;';
contrast+=rule(':where([data-contrast="auto"], :scope[data-contrast="auto"])','--re-edge-display: block;');
contrast+=rule(':where([data-contrast="more"], :scope[data-contrast="more"])',contrastDecl);
contrast+=`@media (prefers-contrast: more) { ${rule(':where(:root,[data-theme],[data-tone],[data-palette],[data-contrast])',contrastDecl)} }\n}\n`;
await mkdir('dist',{recursive:true}); await mkdir('docs/public/reva',{recursive:true});
const base=await readFile('src/css/base.css','utf8'), comp=await readFile('src/css/components.css','utf8');
const badges=await readFile('src/css/badges.css','utf8');
const alerts=await readFile('src/css/alerts.css','utf8');
const accordions=await readFile('src/css/accordions.css','utf8');
const breadcrumbs=await readFile('src/css/breadcrumbs.css','utf8');
const pagination=await readFile('src/css/pagination.css','utf8');
const formGroups=await readFile('src/css/form-groups.css','utf8');
const loading=await readFile('src/css/loading.css','utf8');
const tabs=await readFile('src/css/tabs.css','utf8');
const lists=await readFile('src/css/lists.css','utf8');
const emptyStates=await readFile('src/css/empty-states.css','utf8');
const avatars=await readFile('src/css/avatars.css','utf8');
const icons=await readFile('src/css/icons.css','utf8');
const switches=await readFile('src/css/switches.css','utf8');
const inputGroups=await readFile('src/css/input-groups.css','utf8');
const skeletons=await readFile('src/css/skeletons.css','utf8');
const toolbars=await readFile('src/css/toolbars.css','utf8');
const descriptionLists=await readFile('src/css/description-lists.css','utf8');
const cardPatterns=await readFile('src/css/card-patterns.css','utf8');
const dropdowns=await readFile('src/css/dropdowns.css','utf8');
const navigation=await readFile('src/css/navigation.css','utf8');
const motion=await readFile('src/css/motion.css','utf8');
const glass=await readFile('src/css/glass.css','utf8');
const edgeSource=await readFile('src/css/edges.css','utf8');
const edgeSplit=edgeSource.indexOf('@layer re.components');
const edgeRegistration=edgeSource.slice(0,edgeSplit), edges=edgeSource.slice(edgeSplit);
const full=edgeRegistration+tokens+base+comp+badges+alerts+accordions+breadcrumbs+pagination+formGroups+loading+tabs+lists+emptyStates+avatars+icons+switches+inputGroups+skeletons+toolbars+descriptionLists+cardPatterns+dropdowns+navigation+edges+contrast;
for(const [name,content] of [['reva.css',full],['reva.tokens.css',tokens],['reva.base.css',base],['reva.components.css',edgeRegistration+comp+badges+alerts+accordions+breadcrumbs+pagination+formGroups+loading+tabs+lists+emptyStates+avatars+icons+switches+inputGroups+skeletons+toolbars+descriptionLists+cardPatterns+dropdowns+navigation+edges+contrast],['reva.badges.css',badges],['reva.alerts.css',alerts],['reva.accordions.css',accordions],['reva.breadcrumbs.css',breadcrumbs],['reva.pagination.css',pagination],['reva.form-groups.css',formGroups],['reva.loading.css',loading],['reva.tabs.css',tabs],['reva.lists.css',lists],['reva.empty-states.css',emptyStates],['reva.avatars.css',avatars],['reva.icons.css',icons],['reva.switches.css',switches],['reva.input-groups.css',inputGroups],['reva.skeletons.css',skeletons],['reva.toolbars.css',toolbars],['reva.description-lists.css',descriptionLists],['reva.card-patterns.css',cardPatterns],['reva.dropdowns.css',dropdowns],['reva.navigation.css',navigation],['reva.motion.css',motion],['reva.motion.scoped.css',`@scope (.reva) {\n${motion.replaceAll(':root', ':scope')}\n}\n`],['reva.glass.css',glass],['reva.glass.scoped.css',`@scope (.reva) {\n${glass}\n}\n`],['reva.scoped.css',`${edgeRegistration}@scope (.reva) {\n${(tokens+base+comp+badges+alerts+accordions+breadcrumbs+pagination+formGroups+loading+tabs+lists+emptyStates+avatars+icons+switches+inputGroups+skeletons+toolbars+descriptionLists+cardPatterns+dropdowns+navigation+edges+contrast).replaceAll(':root',':scope')}\n}`]]) {
 transform({filename:name,code:Buffer.from(content),minify:false});
 await writeFile('dist/'+name,content); await copyFile('dist/'+name,'docs/public/reva/'+name);
}
const min=transform({filename:'reva.css',code:Buffer.from(full),minify:true}).code;
await writeFile('dist/reva.min.css',min); await copyFile('dist/reva.min.css','docs/public/reva/reva.min.css');
await writeFile('docs/src/pages/generated-reference.json',JSON.stringify({options,tokens:data,palettes},null,2));
console.log(`Built CSS: ${Buffer.byteLength(full)} bytes; minified ${min.length} bytes.`);

await mkdir('dist/fonts',{recursive:true});
await mkdir('docs/public/reva/fonts',{recursive:true});
for(const name of ['Manrope.ttf','OFL.txt']) { await copyFile('assets/fonts/'+name,'dist/fonts/'+name); await copyFile('assets/fonts/'+name,'docs/public/reva/fonts/'+name); }
await copyFile('assets/reva-fonts.css','dist/reva-fonts.css');
await copyFile('assets/reva-fonts.css','docs/public/reva/reva-fonts.css');


/* One source catalog generates the sprite and standalone vector assets. */
const iconCatalog=JSON.parse(await readFile('src/icons/catalog.json','utf8'));
const iconAttributes='viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"';
for (const folder of ['dist/icons','docs/public/reva/icons']) {
  await mkdir(folder,{recursive:true});
  await writeFile(folder+'/reva.svg','<svg xmlns="http://www.w3.org/2000/svg">'+iconCatalog.map(icon=>'<symbol id="rv-'+icon.name+'" viewBox="0 0 24 24">'+icon.body+'</symbol>').join('')+'</svg>\n');
  for (const icon of iconCatalog) {
    await writeFile(folder+'/'+icon.name+'.svg','<svg xmlns="http://www.w3.org/2000/svg" '+iconAttributes+'>'+icon.body+'</svg>\n');
  }
}
