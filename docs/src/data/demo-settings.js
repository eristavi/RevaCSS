import options from '../../../tokens/options.json';
export const basicSettingKeys=['theme','palette','material','shape'];
export const advancedSettingLabels={motion:'Motion',edge:'Decorative edges',density:'Density',depth:'Shadows',fill:'Fill',type:'Typography',size:'Control size',border:'Borders',width:'Page width',navbar:'Navbar layout',contrast:'Contrast'};
export const advancedOptions=Object.entries(advancedSettingLabels).map(([key,label])=>({key,label,...options[key]}));
export const demoSettingsSchema=Object.fromEntries([...basicSettingKeys,...Object.keys(advancedSettingLabels)].map(key=>[key,options[key].values]));
export const optionLabel=value=>value==='auto'?'System':value==='soft'?'Soft UI':value[0].toUpperCase()+value.slice(1);
