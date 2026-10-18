import {transform} from 'lightningcss';

// Project the existing CSS onto native HTML without maintaining a second set of
// declarations. Classes and their local layout/surface aliases are unavailable
// in this distribution. Negative class predicates become vacuously true;
// positive class predicates must never be broadened into native selectors.
const patternAttributes=new Set(['data-layout','data-surface']);
function nativeSelector(selector) {
 const result=[];
 for(const component of selector) {
  if(component.type==='class' || (component.type==='attribute' && patternAttributes.has(component.name)))return null;
  if(component.type==='pseudo-class' && Array.isArray(component.selectors)) {
   const selectors=component.selectors.map(nativeSelector).filter(Boolean);
   if(!selectors.length) {
    if(component.kind==='not')continue;
    return null;
   }
   result.push({...component,selectors});
  } else if(component.type==='pseudo-class' && Array.isArray(component.of)) {
   const of=component.of.map(nativeSelector).filter(Boolean);
   if(!of.length)return null;
   result.push({...component,of});
  } else result.push(component);
 }
 // Removing :not(.pattern) may leave an empty compound in a complex selector.
 const normalized=[];
 let compound=[];
 const flush=()=>{normalized.push(...(compound.length?compound:[{type:'universal'}]));compound=[];};
 for(const component of result) {
  if(component.type==='combinator') {if(normalized.length || compound.length)flush();normalized.push(component);}
  else compound.push(component);
 }
 flush();
 return normalized;
}
export function semanticCSS(css) {
 // Opted-in patterns use ordinary rules in each parent layer, preserving
 // class exceptions even when a native rule has closer @scope proximity.
 return transform({filename:'semantic.css',code:Buffer.from(css),minify:false,
  visitor:{
   Rule:{scope(rule){
    const {scopeStart,scopeEnd}=rule.value;
    if(scopeStart && !scopeStart.some(selector=>nativeSelector(selector)))return [];
    if(scopeEnd && !scopeEnd.some(selector=>nativeSelector(selector)))throw new Error('Native scope needs an explicit native lower boundary');
   }},
   Selector(selector){return nativeSelector(selector) || [];}
  }
 }).code.toString().replace(/@layer (re\.(?:base|components|buttons|utilities))\s*\{/g,'@layer $1.native {').replace(/[\t ]+$/gm,'');
}

export const semanticScope=css=>`@scope ([data-reva]) to ([data-reva]) {\n${css.replaceAll(':root',':scope')}\n}\n`;
