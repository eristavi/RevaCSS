/* Optional documentation/demo preferences. RevaCSS core has no JS dependency. */
(() => {
  'use strict';
  const schemaNode=document.getElementById('reva-settings-schema');
  if(!schemaNode)return;
  let schema;
  try{schema=JSON.parse(schemaNode.textContent);}catch{return;}
  const root=document.documentElement;
  const palette=window.RevaPalette;
  const radius=window.RevaRadius;
  const density=window.RevaDensity;
  const demoKey='revacss:demo-settings:v1',docsKey='revacss:docs-settings:v1',legacyDocsKey='revacss:docs-theme:v1';
  const storageKey='revacss:settings:v1';
  const pageAttributes=Object.fromEntries(Object.keys(schema.values).map(key=>[key,root.getAttribute('data-'+key)]));
  const initialTheme=root.getAttribute('data-theme') || 'auto';
  const clean=value=>{
    const result={};
    if(value && typeof value==='object' && !Array.isArray(value)){
      for(const [key,allowed] of Object.entries(schema.values)){
        if(typeof value[key]==='string' && allowed.includes(value[key]))result[key]=value[key];
        else if(key==='palette' && typeof value[key]==='string')result[key]='default';
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
    palette?.applyTo(doc);
    radius?.applyTo(doc);
    density?.applyTo(doc);
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
    palette?.applyTo(document);
    radius?.applyTo(document);
    density?.applyTo(document);
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
    const radiusEditor=document.getElementById('custom-radius-editor');
    const radiusFields=[...form.querySelectorAll('input[data-radius]')];
    const radiusLinked=document.getElementById('radius-linked');
    const radiusCode=document.getElementById('custom-radius-css');
    const renderRadius=()=>{
      if(radiusEditor)radiusEditor.hidden=values().shape!=='custom' || !radius;
      if(!radius)return;
      const settings=radius.values();
      for(const field of radiusFields){
        if(field.type==='range')field.max=String(Math.max(4,Math.ceil(settings[field.dataset.radius])));
        if(document.activeElement!==field || field.type==='range')field.value=String(settings[field.dataset.radius]);
      }
      if(radiusLinked)radiusLinked.checked=settings.linked;
      if(radiusCode)radiusCode.textContent=radius.css();
    };
    const densityEditor=document.getElementById('custom-density-editor');
    const densityFields=[...form.querySelectorAll('input[data-density-key]')];
    const densityLinked=document.getElementById('density-linked');
    const densityCode=document.getElementById('custom-density-css');
    const renderDensity=()=>{
      if(densityEditor)densityEditor.hidden=values().density!=='custom' || !density;
      if(!density)return;
      const settings=density.values();
      for(const field of densityFields){
        if(field.type==='range')field.max=String(Math.max(4,Math.ceil(settings[field.dataset.densityKey])));
        if(document.activeElement!==field || field.type==='range')field.value=String(settings[field.dataset.densityKey]);
      }
      if(densityLinked)densityLinked.checked=settings.linked;
      if(densityCode)densityCode.textContent=density.css();
    };
    const editor=document.getElementById('custom-palette-editor');
    const paletteFields=[...form.querySelectorAll('input[type="color"][name^="palette-"]')];
    const paletteCode=document.getElementById('custom-palette-css');
    const contrastFeedback=document.getElementById('custom-palette-contrast');
    const renderPalette=()=>{
      if(editor)editor.hidden=values().palette!=='custom' || !palette;
      if(!palette)return;
      const colours=palette.values();
      for(const field of paletteFields){
        const [,mode,...parts]=field.name.split('-');
        field.value=colours[mode][parts.join('-')];
        const output=field.parentElement.querySelector('output');
        if(output)output.textContent=field.value.toUpperCase();
      }
      if(paletteCode)paletteCode.textContent=palette.css();
      if(contrastFeedback){
        const list=document.createElement('ul');
        for(const {mode,failed} of palette.feedback()){
          const item=document.createElement('li');
          item.textContent=(mode==='light'?'Light':'Dark')+': '+(failed.length?failed.map(check=>`${check.label} ${check.ratio.toFixed(2)}:1 (target ${check.target}:1)`).join('; '):'Checked text and control colours meet their contrast targets.');
          list.append(item);
        }
        contrastFeedback.replaceChildren(list);
      }
    };
    const configuration=()=>'<html lang="en"'+Object.entries(values()).filter(([,value])=>value!=='default').map(([key,value])=>'\n  data-'+key+'="'+value+'"').join('')+'>';
    const update=()=>{apply(values());renderPalette();renderRadius();renderDensity();if(summary)summary.textContent=configuration();};
    const restore=()=>{
      const saved=stored();
      palette?.restore();
      radius?.restore();density?.restore();
      for(const control of controls){const key=control.name.slice(5);control.value=saved[key] || defaults[key];}
      update();
    };
    restore();
    form.addEventListener('input',event=>{
      if(radiusFields.includes(event.target) && radius){
        if(radius.change(event.target.dataset.radius,event.target.value))update();
        return;
      }
      if(densityFields.includes(event.target) && density){
        if(density.change(event.target.dataset.densityKey,event.target.value))update();
        return;
      }
      if(!paletteFields.includes(event.target) || !palette)return;
      const [,mode,...parts]=event.target.name.split('-');
      palette.change(mode,parts.join('-'),event.target.value);
      update();
    });
    form.addEventListener('change',event=>{
      if(event.target===radiusLinked && radius)radius.link(radiusLinked.checked);
      if(radiusFields.includes(event.target) && radius){
        radius.change(event.target.dataset.radius,event.target.value);
        event.target.value=String(radius.values()[event.target.dataset.radius]);
      }
      if(event.target===densityLinked && density)density.link(densityLinked.checked);
      if(densityFields.includes(event.target) && density){
        density.change(event.target.dataset.densityKey,event.target.value);
        event.target.value=String(density.values()[event.target.dataset.densityKey]);
      }
      if(paletteFields.includes(event.target) && palette){
        const [,mode,...parts]=event.target.name.split('-');
        palette.change(mode,parts.join('-'),event.target.value);
      }
      update();
      const coloursSaved=palette?.save() ?? true;
      const radiusesSaved=radius?.save() ?? true;
      const densitySaved=density?.save() ?? true;
      const choicesSaved=save(storageKey,values());
      if(status)status.textContent=coloursSaved && radiusesSaved && densitySaved && choicesSaved?'Saved for documentation and all demo pages.':'Choices apply here; this browser did not allow saving them.';
    });
    form.addEventListener('reset',()=>{
      for(const key of [storageKey,demoKey,docsKey,legacyDocsKey])clear(key);
      palette?.reset();
      radius?.reset();density?.reset();
      setTimeout(()=>{update();if(status)status.textContent='Shared saved choices cleared. This page’s defaults are restored.';},0);
    });
    customizer={restore};
    const downloadText=(text,name,type)=>{
      const url=URL.createObjectURL(new Blob([text],{type}));
      const link=document.createElement('a');link.href=url;link.download=name;
      document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
    };
    document.getElementById('export-custom-radius')?.addEventListener('click',()=>{
      if(!radius)return;
      downloadText(radius.css(),'revacss-custom-radius.css','text/css');
      if(status)status.textContent='Radius CSS exported. Load it after RevaCSS and use data-shape="custom".';
    });
    document.getElementById('copy-custom-radius')?.addEventListener('click',async()=>{
      if(!radius)return;
      try{await navigator.clipboard.writeText(radius.css());if(status)status.textContent='Radius CSS copied.';}
      catch{
        const details=radiusCode?.closest('details');if(details)details.open=true;
        if(radiusCode){const range=document.createRange();range.selectNodeContents(radiusCode);const selection=window.getSelection();selection?.removeAllRanges();selection?.addRange(range);radiusCode.closest('pre')?.focus();}
        if(status)status.textContent='Clipboard unavailable. Select and copy the radius CSS shown above.';
      }
    });
    document.getElementById('export-custom-density')?.addEventListener('click',()=>{
      if(!density)return;
      downloadText(density.css(),'revacss-custom-density.css','text/css');
      if(status)status.textContent='Density CSS exported. Load it after RevaCSS and use data-density="custom".';
    });
    document.getElementById('copy-custom-density')?.addEventListener('click',async()=>{
      if(!density)return;
      try{await navigator.clipboard.writeText(density.css());if(status)status.textContent='Density CSS copied.';}
      catch{
        const details=densityCode?.closest('details');if(details)details.open=true;
        if(densityCode){const range=document.createRange();range.selectNodeContents(densityCode);const selection=window.getSelection();selection?.removeAllRanges();selection?.addRange(range);densityCode.closest('pre')?.focus();}
        if(status)status.textContent='Clipboard unavailable. Select and copy the density CSS shown above.';
      }
    });
    document.getElementById('export-custom-palette')?.addEventListener('click',()=>{
      if(!palette)return;
      downloadText(palette.css(),'revacss-custom-palette.css','text/css');
      if(status)status.textContent='Palette CSS exported. Load it after RevaCSS and use data-palette="custom".';
    });
    document.getElementById('copy-custom-palette')?.addEventListener('click',async()=>{
      if(!palette)return;
      try{await navigator.clipboard.writeText(palette.css());if(status)status.textContent='Palette CSS copied.';}
      catch{
        const details=paletteCode?.closest('details');if(details)details.open=true;
        if(paletteCode){const range=document.createRange();range.selectNodeContents(paletteCode);const selection=window.getSelection();selection?.removeAllRanges();selection?.addRange(range);paletteCode.closest('pre')?.focus();}
        if(status)status.textContent='Clipboard unavailable. Select and copy the palette CSS shown above.';
      }
    });
    const copy=document.getElementById('copy-configuration');
    if(copy){
      copy.disabled=false;
      copy.addEventListener('click',async()=>{
        try{
          await navigator.clipboard.writeText(configuration());
          if(status)status.textContent=values().palette==='custom' || values().shape==='custom' || values().density==='custom'?'HTML configuration copied. Export your custom palette/radius/density CSS and load it after RevaCSS.':'HTML configuration copied.';
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
        documentCopy.getElementById('reva-palette-defaults')?.remove();
        documentCopy.getElementById('reva-palette-runtime')?.remove();
        documentCopy.getElementById('reva-radius-runtime')?.remove();
        documentCopy.getElementById('reva-density-runtime')?.remove();
        if(values().palette==='custom')palette?.applyTo(documentCopy);
        if(values().shape==='custom')radius?.applyTo(documentCopy);
        if(values().density==='custom')density?.applyTo(documentCopy);
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
    if(event.key===storageKey || event.key===palette?.storageKey || event.key===radius?.storageKey || event.key===density?.storageKey || event.key===null){
      if(customizer)customizer.restore();
      else{palette?.restore();radius?.restore();density?.restore();apply(stored());if(themeControl)themeControl.value=stored().theme || initialTheme;}
    }
  });
})();
