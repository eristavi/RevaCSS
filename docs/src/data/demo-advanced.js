import options from '../../../tokens/options.json';
import tokens from '../../../dist/reva.tokens.css?raw';
import core from '../../../dist/reva.css?raw';
import motion from '../../../src/css/motion.css?raw';
import glass from '../../../src/css/glass.css?raw';

const labels={motion:'Motion',edge:'Decorative edges',density:'Density',depth:'Shadows',fill:'Fill',type:'Typography',size:'Control size',border:'Borders',width:'Page width',contrast:'Contrast'};
export const advancedOptions=Object.entries(labels).map(([key,label])=>({key,label,...options[key]}));
export const optionLabel=value=>value==='auto'?'System / auto':value[0].toUpperCase()+value.slice(1);

// Reuse the built framework declarations rather than maintain another token map.
function declaration(source,key,value) {
  const marker=`:where([data-${key}="${value}"], :scope[data-${key}="${value}"])`;
  const start=source.indexOf(marker);
  if(start<0) throw new Error(`Missing demo preset: data-${key}="${value}"`);
  return source.slice(source.indexOf('{',start)+1,source.indexOf('}',start)).trim();
}
const scope=(key,value)=>`.demo-workbench:has(#demo-${key}-${value}:checked) .demo-preview`;
let css='';
for(const option of advancedOptions) for(const value of option.values) {
  const {key}=option;
  let decl=declaration(key==='contrast'?core:tokens,key,value);
  if(key==='motion') decl+=' '+declaration(motion,key,value);
  if(key==='contrast') decl+=' '+declaration(glass,key,value);
  css+=`@scope (${scope(key,value)}) { @layer ${key==='contrast'?'re.utilities':'re.tokens'} { :where(:scope) { ${decl} } } }\n`;
  css+=`.demo-workbench:has(#demo-${key}-${value}:checked) .attribute-${key}-${value} { display:inline; }\n`;
}
// Solid/glass paint may set these on descendants; explicit contrast still wins.
css+=`@scope (${scope('contrast','more')}) { @layer re.utilities { :where(*, :scope) { ${declaration(core,'contrast','more')} } } }\n`;
// Preferences retain priority over interactive preview choices, including the root.
css+='@layer re.utilities { @media (prefers-reduced-motion:reduce) { :where(.demo-preview,.demo-preview *) { --re-duration:0ms; --re-press:0px; --re-edge-play:paused; } }\n';
css+=`@media (prefers-contrast:more) { :where(.demo-preview,.demo-preview *) { ${declaration(core,'contrast','more')} } }\n`;
css+='@media (prefers-reduced-transparency:reduce), (prefers-contrast:more), (forced-colors:active), print { :where(.demo-preview,.demo-preview *) { --re-glass-opacity:100%; --re-glass-button-opacity:100%; --re-glass-filter:none; } } }\n';
export const advancedCSS=css;
