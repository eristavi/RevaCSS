import tokens from '../../../dist/reva.tokens.css?raw';
import core from '../../../dist/reva.css?raw';
import motion from '../../../src/css/motion.css?raw';
import glass from '../../../src/css/glass.css?raw';
import veil from '../../../src/css/veil.css?raw';
import {demoOptions} from './demo-configurations.js';
import {transform} from 'lightningcss';

import {advancedOptions} from './demo-settings.js';
export {advancedOptions,optionLabel} from './demo-settings.js';

// Reuse the built framework declarations rather than maintain another token map.
function declaration(source,key,value) {
  const marker=`:where([data-${key}="${value}"], :scope[data-${key}="${value}"])`;
  const start=source.indexOf(marker);
  if(start<0) throw new Error(`Missing demo preset: data-${key}="${value}"`);
  return source.slice(source.indexOf('{',start)+1,source.indexOf('}',start)).trim();
}
const scope=(key,value)=>`.demo-workbench:has(#demo-${key} option[value="${value}"]:checked) .demo-preview`;
let css='';
for(const [key,values] of Object.entries(demoOptions)) for(const value of values) {
  if(key!=='material') css+=`@scope (${scope(key,value)}) { @layer re.tokens { :where(:scope) { ${declaration(tokens,key,value)} } } }\n`;
  css+=`.demo-workbench:has(#demo-${key} option[value="${value}"]:checked) .attribute-${key}-${value} { display:inline; }\n`;
}
// Rebind the existing material scopes to checked controls. Descendant explicit
// data-material boundaries and preference rules remain the extension's own rules.
function liveMaterial(source,names) {
  for(const name of names) {
    const original=`@scope ([data-material="${name}"], :scope[data-material="${name}"])`;
    // Inner scope roots are relative to the outer workbench scope. Repeating
    // .demo-workbench here would look for a second nested workbench.
    const previewRoot=`:scope:has(#demo-material option[value="${name}"]:checked) .demo-preview`;
    source=source.replaceAll(original,`@scope (${previewRoot}, [data-material="${name}"], :scope[data-material="${name}"])`);
  }
  return `@scope (.demo-workbench) { ${source} }\n`;
}
css+=liveMaterial(glass,['glass','solid'])+liveMaterial(veil,['veil']);
for(const option of advancedOptions) for(const value of option.values) {
  const {key}=option;
  let decl=declaration(key==='contrast'?core:tokens,key,value);
  if(key==='motion') decl+=' '+declaration(motion,key,value);
  if(key==='contrast') decl+=' '+declaration(glass,key,value)+' '+declaration(veil,key,value);
  css+=`@scope (${scope(key,value)}) { @layer ${key==='contrast'?'re.utilities':'re.tokens'} { :where(:scope) { ${decl} } } }\n`;
  css+=`.demo-workbench:has(#demo-${key} option[value="${value}"]:checked) .attribute-${key}-${value} { display:inline; }\n`;
}
// Solid/glass paint may set these on descendants; explicit contrast still wins.
css+=`@scope (${scope('contrast','more')}) { @layer re.utilities { :where(*, :scope) { ${declaration(core,'contrast','more')} } } }\n`;
// Preferences retain priority over interactive preview choices, including the root.
css+='@layer re.utilities { @media (prefers-reduced-motion:reduce) { :where(.demo-preview,.demo-preview *) { --re-duration:0ms; --re-press:0px; --re-edge-play:paused; } }\n';
css+=`@media (prefers-contrast:more) { :where(.demo-preview,.demo-preview *) { ${declaration(core,'contrast','more')} } }\n`;
css+='@media (prefers-reduced-transparency:reduce), (prefers-contrast:more), (forced-colors:active), print { :where(.demo-preview,.demo-preview *) { --re-glass-opacity:100%; --re-glass-button-opacity:100%; --re-glass-filter:none; } } }\n';
// Validate generated selectors/material scopes as part of stylesheet compilation.
export const advancedCSS=transform({filename:'demo-customizer.css',code:Buffer.from(css),minify:false}).code.toString();
