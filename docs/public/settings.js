/* Optional documentation/demo preferences. RevaCSS core has no JS dependency. */
(() => {
  'use strict';
  const schemaNode=document.getElementById('reva-settings-schema');
  if(!schemaNode)return;
  let schema;
  try{schema=JSON.parse(schemaNode.textContent);}catch{return;}
  const root=document.documentElement;
  const demoKey='revacss:demo-settings:v1',docsKey='revacss:docs-settings:v1',legacyDocsKey='revacss:docs-theme:v1';
  const storageKey='revacss:settings:v1';
  const pageAttributes=Object.fromEntries(Object.keys(schema.values).map(key=>[key,root.getAttribute('data-'+key)]));
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
  const stored=()=>{
    // Migrate once, preferring the page's existing choices when both were saved.
    // All pages then read one shared profile; an empty profile means defaults.
    try{
      const current=localStorage.getItem(storageKey);
      if(current!==null)return clean(JSON.parse(current));
    }catch{return {};}
    const keys=schema.kind==='demo'?[legacyDocsKey,docsKey,demoKey]:[legacyDocsKey,demoKey,docsKey];
    const previous=Object.assign({},...keys.map(read));
    if(Object.keys(previous).length && save(storageKey,previous)){
      for(const key of keys)clear(key);
    }
    return previous;
  };
  const invalidateMaterials=doc=>{
    // Refresh Firefox's material scope matches without fetching or reloading.
    for(const sheet of doc.styleSheets){
      if(!sheet.disabled && /\/reva(?:\.(glass|veil|soft|button-materials))?(\.scoped)?(\.min)?\.css(?:\?|$)/.test(sheet.href || '')){
        sheet.disabled=true;
        sheet.disabled=false;
      }
    }
  };
  const isolatedPreviews=new Set();
  const syncPreview=frame=>{
    const doc=frame.contentDocument;
    const previewRoot=doc?.documentElement;
    if(!previewRoot)return;
    const previousMaterial=previewRoot.getAttribute('data-material');
    const previousButtonMaterial=previewRoot.getAttribute('data-button-material');
    for(const key of Object.keys(schema.values)){
      const attribute='data-'+key;
      const value=root.getAttribute(attribute);
      if(value===null)previewRoot.removeAttribute(attribute);
      else previewRoot.setAttribute(attribute,value);
    }
    if(previewRoot.getAttribute('data-material')!==previousMaterial || previewRoot.getAttribute('data-button-material')!==previousButtonMaterial)invalidateMaterials(doc);
  };
  const syncPreviews=()=>{for(const frame of isolatedPreviews)syncPreview(frame);};
  const initPreviews=()=>{
    for(const frame of document.querySelectorAll('iframe.example-isolated')){
      if(isolatedPreviews.has(frame))continue;
      isolatedPreviews.add(frame);
      frame.addEventListener('load',()=>syncPreview(frame));
      syncPreview(frame);
    }
  };
  const apply=value=>{
    const previousMaterial=root.getAttribute('data-material');
    const previousButtonMaterial=root.getAttribute('data-button-material');
    const choices=clean(value);
    for(const key of Object.keys(schema.values)){
      const choice=choices[key] ?? pageAttributes[key];
      if(choice===null || choice==='default')root.removeAttribute('data-'+key);
      else root.setAttribute('data-'+key,choice);
    }
    if(root.getAttribute('data-material')!==previousMaterial || root.getAttribute('data-button-material')!==previousButtonMaterial){
      // Firefox can retain matches from the previous @scope material until
      // hover. Re-enable the loaded material sheets to invalidate those matches
      // without reloading the page, fetching CSS, or replacing any DOM nodes.
      invalidateMaterials(document);
    }
    syncPreviews();
  };
  // Restore before styles load, reducing flashes of the wrong appearance.
  apply(stored());
  let customizer;
  const initCustomizer=()=>{
    const form=document.getElementById('demo-customizer-form');
    if(!form || customizer)return;
    const controls=[...form.querySelectorAll('select[name^="demo-"]')];
    const defaults=Object.fromEntries(controls.map(control=>[control.name.slice(5),control.value]));
    const values=()=>clean(Object.fromEntries(controls.map(control=>[control.name.slice(5),control.value])));
    const status=document.getElementById('demo-settings-status');
    const summary=document.getElementById('demo-configuration');
    const configuration=()=>'<html lang="en"'+Object.entries(values()).filter(([,value])=>value!=='default').map(([key,value])=>'\n  data-'+key+'="'+value+'"').join('')+'>';
    const update=()=>{apply(values());if(summary)summary.textContent=configuration();};
    const restore=()=>{
      const saved=stored();
      for(const control of controls){const key=control.name.slice(5);control.value=saved[key] || defaults[key];}
      update();
    };
    restore();
    form.addEventListener('change',()=>{
      update();
      if(status)status.textContent=save(storageKey,values())?'Saved for documentation and all demo pages.':'Choices apply here; this browser did not allow saving them.';
    });
    form.addEventListener('reset',()=>{
      for(const key of [storageKey,demoKey,docsKey,legacyDocsKey])clear(key);
      setTimeout(()=>{update();if(status)status.textContent='Shared saved choices cleared. This page’s defaults are restored.';},0);
    });
    customizer={restore};
    const copy=document.getElementById('copy-configuration');
    if(copy){
      copy.disabled=false;
      copy.addEventListener('click',async()=>{
        try{
          await navigator.clipboard.writeText(configuration());
          if(status)status.textContent='HTML configuration copied.';
        }catch{
          const details=summary?.closest('details');if(details)details.open=true;
          if(summary){const range=document.createRange();range.selectNodeContents(summary);const selection=window.getSelection();selection?.removeAllRanges();selection?.addRange(range);summary.closest('pre')?.focus();}
          if(status)status.textContent='Clipboard unavailable. Select and copy the configuration shown above.';
        }
      });
    }
    const link=document.querySelector('.demo-customizer a[download]');
    link?.addEventListener('click',async event=>{
      event.preventDefault();
      try{
        const response=await fetch(link.href);
        if(!response.ok)throw new Error('Download failed');
        const documentCopy=new DOMParser().parseFromString(await response.text(),'text/html');
        for(const [key,value] of Object.entries(values())){
          if(value==='default')documentCopy.documentElement.removeAttribute('data-'+key);
          else documentCopy.documentElement.setAttribute('data-'+key,value);
        }
        documentCopy.getElementById('reva-settings-schema')?.remove();
        documentCopy.getElementById('reva-settings-runtime')?.remove();
        const url=URL.createObjectURL(new Blob(['<!doctype html>\n'+documentCopy.documentElement.outerHTML+'\n'],{type:'text/html'}));
        const download=document.createElement('a');download.href=url;download.download=link.download;
        document.body.append(download);download.click();download.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
        if(status)status.textContent='Downloaded HTML with your current settings.';
      }catch{if(status)status.textContent='Could not prepare the download. Please try again when the page is available.';}
    });
  };

  // Optional demo spacing only: CSS owns sticking, with no scroll listeners.
  // Observe wrapping, font loading and layout changes without fixing header size.
  let navbarObserver;
  const initNavbarSpacing=()=>{
    if(navbarObserver || !('ResizeObserver' in window))return;
    const primary=document.querySelector('.navbar-header, .app-shell > header');
    if(!primary)return;
    const owners=new Map([[primary,new Set([root,document.body])]]);
    for(const preview of document.querySelectorAll('.demo-preview')){
      const header=preview.querySelector('.navbar-header, .app-shell > header');
      if(header){
        const targets=owners.get(header) || new Set();
        targets.add(preview);owners.set(header,targets);
      }
    }
    const updateSize=header=>{
      const targets=owners.get(header);
      if(!targets)return;
      const style=getComputedStyle(header);
      const margin=Math.max(0,parseFloat(style.marginBlockStart)||0)+Math.max(0,parseFloat(style.marginBlockEnd)||0);
      const size=Math.ceil(header.getBoundingClientRect().height+margin)+'px';
      for(const owner of targets)owner.style.setProperty('--re-navbar-height',size);
    };
    navbarObserver=new ResizeObserver(entries=>{for(const entry of entries)updateSize(entry.target);});
    for(const header of owners.keys()){updateSize(header);navbarObserver.observe(header);}
  };

  // Compatibility for standalone previews that still use the older theme panel.
  let themeControl;
  const initTheme=()=>{
    const theme=document.getElementById('docs-theme');
    if(!theme || themeControl)return;
    themeControl=theme;
    theme.value=stored().theme || initialTheme;
    theme.addEventListener('change',()=>{root.setAttribute('data-theme',theme.value);syncPreviews();save(storageKey,{...stored(),theme:theme.value});});
  };
  window.RevaSettings={initCustomizer,initTheme};
  document.addEventListener('DOMContentLoaded',()=>{initPreviews();initCustomizer();initTheme();initNavbarSpacing();});
  window.addEventListener('storage',event=>{
    if(event.key===storageKey || event.key===null){
      if(customizer)customizer.restore();
      else{apply(stored());if(themeControl)themeControl.value=stored().theme || initialTheme;}
    }
  });
})();
