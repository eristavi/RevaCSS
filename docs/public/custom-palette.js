/* Optional palette editor for the documentation. Exported palettes are CSS only. */
(() => {
  'use strict';
  const node=document.getElementById('reva-palette-defaults');
  if(!node)return;
  let defaults;
  try{defaults=JSON.parse(node.textContent);}catch{return;}
  const modes=['light','dark'],keys=Object.keys(defaults.light);
  const storageKey='revacss:custom-palette:v1';
  const clone=value=>JSON.parse(JSON.stringify(value));
  const clean=value=>Object.fromEntries(modes.map(mode=>[mode,Object.fromEntries(keys.map(key=>[key,/^#[0-9a-f]{6}$/i.test(value?.[mode]?.[key] || '')?value[mode][key].toUpperCase():defaults[mode][key]]))]));
  const read=()=>{try{return clean(JSON.parse(localStorage.getItem(storageKey)));}catch{return clone(defaults);}};
  let palette=read();
  const rgb=hex=>[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16));
  const mix=(a,b,amount)=>'#'+rgb(a).map((v,i)=>Math.round(v*(1-amount)+rgb(b)[i]*amount).toString(16).padStart(2,'0')).join('').toUpperCase();
  const luminance=hex=>rgb(hex).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);
  const contrast=(a,b)=>{const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
  const foreground=backgrounds=>['#FFFFFF','#000000'].sort((a,b)=>Math.min(...backgrounds.map(bg=>contrast(b,bg)))-Math.min(...backgrounds.map(bg=>contrast(a,bg))))[0];
  const readable=(colour,backgrounds,target=4.5)=>{
    const end=foreground(backgrounds);
    for(let step=0;step<=100;step++){
      const candidate=mix(colour,end,step/100);
      if(backgrounds.every(bg=>contrast(candidate,bg)>=target))return candidate;
    }
    return end;
  };
  const derive=values=>{
    const p={...values};
    p.surface=mix(p.bg,foreground([p.bg]),.035);
    p['surface-alt']=mix(p.bg,foreground([p.bg]),.075);
    const surfaces=[p.bg,p.surface,p['surface-alt']];
    p.line=mix(p.bg,p.text,.22);
    p['control-line']=readable(mix(p.bg,p.text,.5),surfaces,3);
    p.muted=readable(mix(p.bg,p.text,.7),surfaces);
    p.link=readable(p.primary,surfaces);
    for(const role of ['primary','secondary','success','warning','danger']){
      p[role+'-end']=mix(p[role],foreground([p.bg]),.16);
      p['on-'+role]=foreground([p[role],p[role+'-end']]);
    }
    p['secondary-link']=readable(p.secondary,surfaces);
    p['danger-link']=readable(p.danger,surfaces);
    return p;
  };
  const css=()=>{
    const surfaces=['bg','surface','surface-alt'],accents=['primary','primary-end','on-primary'];
    const declaration=key=>`    --re-${key}: light-dark(${palette.light[key]}, ${palette.dark[key]});`;
    const declarations=keys.filter(key=>!surfaces.includes(key) && !accents.includes(key)).map(declaration);
    for(const key of ['muted','link','control-line'])declarations.push(`    --re-palette-${key}: light-dark(${palette.light[key]}, ${palette.dark[key]});`);
    const block=(selector,lines)=>'  :where('+selector+') {\n'+lines.join('\n')+'\n  }\n';
    return '/* Load after RevaCSS. Use data-palette="custom" on html or a parent. */\n@layer re.tokens {\n'+block('[data-palette="custom"], :scope[data-palette="custom"]',declarations)+block('[data-palette="custom"]:not([data-tone]:not([data-tone="default"]))',surfaces.map(declaration))+block('[data-palette="custom"]:not([data-accent]:not([data-accent="default"]))',accents.map(declaration))+'}\n';
  };
  const applyTo=doc=>{
    let style=doc.getElementById('reva-custom-palette');
    if(!style){style=doc.createElement('style');style.id='reva-custom-palette';doc.head.append(style);}
    style.textContent=css();
    doc.head.append(style);
  };
  const save=()=>{try{localStorage.setItem(storageKey,JSON.stringify(palette));return true;}catch{return false;}};
  const reset=()=>{palette=clone(defaults);try{localStorage.removeItem(storageKey);}catch{}applyTo(document);};
  const restore=()=>{palette=read();applyTo(document);};
  const change=(mode,key,value)=>{
    if(!modes.includes(mode) || !keys.includes(key) || !/^#[0-9a-f]{6}$/i.test(value))return;
    palette[mode][key]=value.toUpperCase();
    if(['primary','secondary','bg','text'].includes(key))palette[mode]=derive(palette[mode]);
    applyTo(document);
  };
  const feedback=()=>modes.map(mode=>{
    const p=palette[mode];
    const checks=[['Body text',p.text,[p.bg,p.surface,p['surface-alt']],4.5],['Muted text',p.muted,[p.bg,p.surface,p['surface-alt']],4.5],['Links',p.link,[p.bg,p.surface,p['surface-alt']],4.5],['Control borders',p['control-line'],[p.surface,p['surface-alt']],3],...['primary','secondary','success','warning','danger'].map(role=>[role[0].toUpperCase()+role.slice(1)+' button text',p['on-'+role],[p[role],p[role+'-end']],4.5])];
    const failed=checks.map(([label,fg,bgs,target])=>({label,ratio:Math.min(...bgs.map(bg=>contrast(fg,bg))),target})).filter(check=>check.ratio<check.target);
    return {mode,failed};
  });
  // Move the sheet after parsed framework links once the head is complete.
  // Keep it in the token layer so material rules still take priority.
  applyTo(document);
  document.addEventListener('DOMContentLoaded',()=>applyTo(document));
  window.RevaPalette={storageKey,keys,modes,css,applyTo,save,reset,restore,change,feedback,values:()=>clone(palette)};
})();
