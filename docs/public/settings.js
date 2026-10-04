/* Optional documentation/demo preferences. RevaCSS core has no JS dependency. */
(() => {
  'use strict';
  const schemaNode=document.getElementById('reva-settings-schema');
  if(!schemaNode)return;
  let schema;
  try{schema=JSON.parse(schemaNode.textContent);}catch{return;}
  const root=document.documentElement;
  const demoKey='revacss:demo-settings:v1',docsKey='revacss:docs-theme:v1';
  const initialTheme=root.getAttribute('data-theme') || 'auto';
  const clean=value=>{
    const result={};
    if(value && typeof value==='object' && !Array.isArray(value)){
      for(const [key,allowed] of Object.entries(schema.values)){
        if(typeof value[key]==='string' && allowed.includes(value[key]))result[key]=value[key];
      }
    }
    return result;
  };
  const read=key=>{try{return clean(JSON.parse(localStorage.getItem(key)));}catch{return {};}};
  const save=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(clean(value)));return true;}catch{return false;}};
  const clear=key=>{try{localStorage.removeItem(key);}catch{}};
  const applyRoot=()=>{
    if(schema.kind==='demo'){
      for(const [key,value] of Object.entries(read(demoKey)))root.setAttribute('data-'+key,value);
    }else root.setAttribute('data-theme',read(docsKey).theme || initialTheme);
  };
  // The small, blocking head script restores the root before styles are loaded.
  applyRoot();
  let customizer;
  const initCustomizer=()=>{
    const form=document.getElementById('demo-customizer-form');
    if(!form || customizer)return;
    const controls=[...form.querySelectorAll('select[name^="demo-"]')];
    const defaults=Object.fromEntries(controls.map(control=>[control.name.slice(5),control.value]));
    const values=()=>clean(Object.fromEntries(controls.map(control=>[control.name.slice(5),control.value])));
    const status=document.getElementById('demo-settings-status');
    const summary=document.getElementById('demo-configuration');
    const updateSummary=()=>{if(summary)summary.textContent='<html lang="en"'+Object.entries(values()).map(([key,value])=>'\n  data-'+key+'="'+value+'"').join('')+'>';};
    const restore=()=>{
      const stored=read(demoKey);
      for(const control of controls){const key=control.name.slice(5);control.value=stored[key] || defaults[key];}
      updateSummary();
    };
    restore();
    form.addEventListener('change',()=>{
      if(status)status.textContent=save(demoKey,values())?'Saved for all demo pages.':'Choices apply here; this browser did not allow saving them.';
      updateSummary();
    });
    form.addEventListener('reset',()=>{
      clear(demoKey);
      setTimeout(()=>{updateSummary();if(status)status.textContent='Saved demo choices cleared. This page’s defaults are restored.';},0);
    });
    customizer={restore};
    const link=document.querySelector('.demo-customizer a[download]');
    link?.addEventListener('click',async event=>{
      event.preventDefault();
      try{
        const response=await fetch(link.href);
        if(!response.ok)throw new Error('Download failed');
        const documentCopy=new DOMParser().parseFromString(await response.text(),'text/html');
        for(const [key,value] of Object.entries(values()))documentCopy.documentElement.setAttribute('data-'+key,value);
        // Export a portable, explicit configuration; do not override it with saved preferences.
        documentCopy.getElementById('reva-settings-schema')?.remove();
        documentCopy.getElementById('reva-settings-runtime')?.remove();
        const url=URL.createObjectURL(new Blob(['<!doctype html>\n'+documentCopy.documentElement.outerHTML+'\n'],{type:'text/html'}));
        const download=document.createElement('a');download.href=url;download.download=link.download;
        document.body.append(download);download.click();download.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
        if(status)status.textContent='Downloaded HTML with your current settings.';
      }catch{if(status)status.textContent='Could not prepare the download. Please try again when the page is available.';}
    });
  };
  let themeControl;
  const initTheme=()=>{
    const theme=document.getElementById('docs-theme');
    if(!theme || themeControl)return;
    themeControl=theme;
    theme.value=read(docsKey).theme || initialTheme;
    theme.addEventListener('change',()=>{
      root.setAttribute('data-theme',theme.value);save(docsKey,{theme:theme.value});
    });
  };
  window.RevaSettings={initCustomizer,initTheme};
  document.addEventListener('DOMContentLoaded',()=>{initCustomizer();initTheme();});
  window.addEventListener('storage',event=>{
    if(event.key===demoKey || event.key===null)customizer?.restore();
    if(event.key===docsKey || event.key===null){
      if(schema.kind==='docs'){applyRoot();const theme=document.getElementById('docs-theme');if(theme)theme.value=root.getAttribute('data-theme');}
    }
  });
})();
