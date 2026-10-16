/* Optional documentation editor. Exported background colours are ordinary CSS. */
(() => {
  'use strict';
  const node=document.getElementById('reva-background-defaults');
  if(!node)return;
  let defaults;
  try{defaults=JSON.parse(node.textContent);}catch{return;}
  if(!Array.isArray(defaults)||!defaults.length||!defaults.every(colour=>/^#[0-9a-f]{6}$/i.test(colour)))return;
  defaults=defaults.map(colour=>colour.toUpperCase());
  const storageKey='revacss:custom-backgrounds:v1';
  const clean=value=>defaults.map((fallback,index)=>/^#[0-9a-f]{6}$/i.test(value?.[index] || '')?value[index].toUpperCase():fallback);
  const read=()=>{try{return clean(JSON.parse(localStorage.getItem(storageKey)));}catch{return [...defaults];}};
  let colours=read();
  const css=()=>`/* Load after reva.backgrounds.css (or its scoped variant).\n   Use data-background="colorful" or "colorful-animated".\n   Both retain the 80% white/light or black/dark treatment. */\n@layer re.tokens {\n  :where(:root, .reva, :scope.reva) {\n${colours.map((colour,index)=>`    --re-background-color-${index+1}: ${colour};`).join('\n')}\n  }\n}\n`;
  const applyTo=doc=>{
    let style=doc.getElementById('reva-custom-backgrounds');
    if(!style){style=doc.createElement('style');style.id='reva-custom-backgrounds';}
    style.textContent=css();doc.head.append(style);
  };
  const change=(index,colour)=>{
    if(!Number.isInteger(index)||index<0||index>=defaults.length||typeof colour!=='string'||!/^#[0-9a-f]{6}$/i.test(colour))return false;
    colours[index]=colour.toUpperCase();return true;
  };
  const save=()=>{try{localStorage.setItem(storageKey,JSON.stringify(colours));return true;}catch{return false;}};
  const restore=()=>{colours=read();applyTo(document);};
  const reset=()=>{colours=[...defaults];try{localStorage.removeItem(storageKey);}catch{}applyTo(document);};
  applyTo(document);
  document.addEventListener('DOMContentLoaded',()=>applyTo(document));
  window.RevaBackgrounds={storageKey,css,applyTo,change,save,restore,reset,values:()=>[...colours]};
})();
