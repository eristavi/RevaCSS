/* Optional editor only. Exported shape configuration is ordinary CSS. */
(() => {
  'use strict';
  const keys=['surface','field','action'];
  const storageKey='revacss:custom-radius:v1';
  const defaults={surface:.75,field:.75,action:.75,linked:true};
  const clean=value=>Object.fromEntries([...keys.map(key=>[key,typeof value?.[key]==='number' && Number.isFinite(value[key]) && value[key]>=0 && value[key]<=1000?value[key]:defaults[key]]),['linked',typeof value?.linked==='boolean'?value.linked:true]]);
  const read=()=>{try{return clean(JSON.parse(localStorage.getItem(storageKey)));}catch{return {...defaults};}};
  let radiuses=read();
  const css=()=>`/* Load after RevaCSS. Use data-shape="custom" on html or a parent. */\n@layer re.tokens {\n  :where([data-shape="custom"], :scope[data-shape="custom"]) {\n${keys.map(key=>`    --re-custom-${key}-radius: ${radiuses[key]}rem;`).join('\n')}\n  }\n}\n`;
  const applyTo=doc=>{
    let style=doc.getElementById('reva-custom-radius');
    if(!style){style=doc.createElement('style');style.id='reva-custom-radius';}
    style.textContent=css();doc.head.append(style);
  };
  const change=(key,value)=>{
    if(!keys.includes(key) || value==='')return false;
    const number=Number(value);
    if(!Number.isFinite(number) || number<0 || number>1000)return false;
    for(const target of radiuses.linked?keys:[key])radiuses[target]=number;
    return true;
  };
  const link=value=>{radiuses.linked=Boolean(value);if(radiuses.linked)for(const key of keys)radiuses[key]=radiuses.surface;};
  const save=()=>{try{localStorage.setItem(storageKey,JSON.stringify(radiuses));return true;}catch{return false;}};
  const restore=()=>{radiuses=read();applyTo(document);};
  const reset=()=>{radiuses={...defaults};try{localStorage.removeItem(storageKey);}catch{}applyTo(document);};
  applyTo(document);
  document.addEventListener('DOMContentLoaded',()=>applyTo(document));
  window.RevaRadius={storageKey,css,applyTo,change,link,save,restore,reset,values:()=>({...radiuses})};
})();
