/* Optional editor only. Exported density configuration is ordinary CSS. */
(() => {
  'use strict';
  const keys=['surface','control','spacing'];
  const storageKey='revacss:custom-density:v1';
  const defaults={surface:1,control:1,spacing:1,linked:true};
  const clean=value=>Object.fromEntries([...keys.map(key=>[key,typeof value?.[key]==='number' && Number.isFinite(value[key]) && value[key]>=0 && value[key]<=10?value[key]:defaults[key]]),['linked',typeof value?.linked==='boolean'?value.linked:true]]);
  const read=()=>{try{return clean(JSON.parse(localStorage.getItem(storageKey)));}catch{return {...defaults};}};
  let density=read();
  const tokens={surface:'--re-custom-surface-padding',control:'--re-custom-control-density',spacing:'--re-custom-content-space'};
  const css=()=>`/* Load after RevaCSS. Use data-density="custom" on html or a parent. */\n@layer re.tokens {\n  :where([data-density="custom"], :scope[data-density="custom"]) {\n${keys.map(key=>`    ${tokens[key]}: ${density[key]}${key==='control'?'':'rem'};`).join('\n')}\n  }\n}\n`;
  const applyTo=doc=>{
    let style=doc.getElementById('reva-custom-density');
    if(!style){style=doc.createElement('style');style.id='reva-custom-density';}
    style.textContent=css();doc.head.append(style);
  };
  const change=(key,value)=>{
    if(!keys.includes(key) || value==='')return false;
    const number=Number(value);
    if(!Number.isFinite(number) || number<0 || number>10)return false;
    for(const target of density.linked?keys:[key])density[target]=number;
    return true;
  };
  const link=value=>{density.linked=Boolean(value);if(density.linked)for(const key of keys)density[key]=density.surface;};
  const save=()=>{try{localStorage.setItem(storageKey,JSON.stringify(density));return true;}catch{return false;}};
  const restore=()=>{density=read();applyTo(document);};
  const reset=()=>{density={...defaults};try{localStorage.removeItem(storageKey);}catch{}applyTo(document);};
  applyTo(document);
  document.addEventListener('DOMContentLoaded',()=>applyTo(document));
  window.RevaDensity={storageKey,css,applyTo,change,link,save,restore,reset,values:()=>({...density})};
})();
