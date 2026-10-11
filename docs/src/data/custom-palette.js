import palettes from '../../../tokens/palettes.json';
import roles from '../../../tokens/roles.json';

export const customPaletteDefaults=Object.fromEntries(['light','dark'].map(mode=>[mode,{...palettes.default[mode],...roles[mode]}]));
export const simplePaletteKeys=['primary','secondary','bg','text'];
export const customPaletteCSS=(name='my-brand')=>{
  const surfaces=['bg','surface','surface-alt'],accents=['primary','primary-end','on-primary'];
  const declaration=key=>`    --re-${key}: light-dark(${customPaletteDefaults.light[key]}, ${customPaletteDefaults.dark[key]});`;
  const lines=Object.keys(customPaletteDefaults.light).filter(key=>!surfaces.includes(key) && !accents.includes(key)).map(declaration);
  for(const key of ['muted','link','control-line'])lines.push(`    --re-palette-${key}: light-dark(${customPaletteDefaults.light[key]}, ${customPaletteDefaults.dark[key]});`);
  const block=(selector,declarations)=>'  :where('+selector+') {\n'+declarations.join('\n')+'\n  }\n';
  return '@layer re.tokens {\n'+block(`[data-palette="${name}"], :scope[data-palette="${name}"]`,lines)+block(`[data-palette="${name}"]:not([data-tone]:not([data-tone="default"]))`,surfaces.map(declaration))+block(`[data-palette="${name}"]:not([data-accent]:not([data-accent="default"]))`,accents.map(declaration))+'}';
};
export const paletteLabels={primary:'Primary',secondary:'Secondary',bg:'Background',text:'Text',surface:'Surface','surface-alt':'Alternate surface',line:'Border','control-line':'Control border',muted:'Muted text',link:'Link','primary-end':'Primary gradient end','on-primary':'Text on primary','secondary-end':'Secondary gradient end','on-secondary':'Text on secondary','secondary-link':'Secondary link',success:'Success','success-end':'Success gradient end','on-success':'Text on success',warning:'Warning','warning-end':'Warning gradient end','on-warning':'Text on warning',danger:'Danger','danger-end':'Danger gradient end','on-danger':'Text on danger','danger-link':'Danger link'};
