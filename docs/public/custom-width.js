/* Optional page-width editor. Exported configuration is ordinary CSS. */
(() => {
  'use strict';
  const storageKey='revacss:custom-width:v1';
  const defaults={max:75,padding:1};
  const limits={max:[1,1000],padding:[0,20]};
  const valid=(key,value)=>typeof value==='number' && Number.isFinite(value) && value>=limits[key][0] && value<=limits[key][1];
  const clean=value=>Object.fromEntries(Object.keys(defaults).map(key=>[key,valid(key,value?.[key])?value[key]:defaults[key]]));
  const read=()=>{try{return clean(JSON.parse(localStorage.getItem(storageKey)));}catch{return {...defaults};}};
  let width=read();
  const css=()=>`/* Load after RevaCSS. Use data-width="custom" on html or a parent. */\n@layer re.tokens {\n  :where([data-width="custom"], :scope[data-width="custom"]) {\n    --re-custom-max-width: ${width.max}rem;\n    --re-custom-side-padding: ${width.padding}rem;\n  }\n}\n`;
  const applyTo=doc=>{
    let style=doc.getElementById('reva-custom-width');
    if(!style){style=doc.createElement('style');style.id='reva-custom-width';}
    style.textContent=css();doc.head.append(style);
  };
  const change=(key,value)=>{
    if(!(key in defaults) || value==='')return false;
    const number=Number(value);
    if(!valid(key,number))return false;
    width[key]=number;return true;
  };
  const save=()=>{try{localStorage.setItem(storageKey,JSON.stringify(width));return true;}catch{return false;}};
  const restore=()=>{width=read();applyTo(document);};
  const reset=()=>{width={...defaults};try{localStorage.removeItem(storageKey);}catch{}applyTo(document);};
  applyTo(document);
  document.addEventListener('DOMContentLoaded',()=>applyTo(document));
  window.RevaWidth={storageKey,css,applyTo,change,save,restore,reset,values:()=>({...width})};
})();
