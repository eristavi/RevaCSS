import options from '../../../tokens/options.json';
export const basicSettingKeys=['theme','palette','material','shape'];
export const advancedSettingLabels={'button-material':'Button material',motion:'Motion',edge:'Decorative edges',density:'Density',depth:'Shadows',fill:'Fill',type:'Typography',size:'Control size',border:'Borders',width:'Page width',navbar:'Navbar layout','navbar-position':'Navbar position','navbar-spacing':'Navbar spacing','navbar-width':'Navbar width',contrast:'Contrast',tone:'Surface tone',gap:'Spacing',controls:'Field styling'};
export const advancedOptions=Object.entries(advancedSettingLabels).map(([key,label])=>({key,label,...options[key],default:options[key].values.includes(options[key].default)?options[key].default:'default',values:options[key].values.includes(options[key].default)?options[key].values:['default',...options[key].values]}));
export const demoSettingsSchema=Object.fromEntries([...basicSettingKeys.map(key=>[key,options[key].values]),...advancedOptions.map(option=>[option.key,option.values])]);
export const optionLabel=value=>value==='default'?'Default':value==='auto'?'System':value==='soft'?'Soft UI':value[0].toUpperCase()+value.slice(1);

export const backgroundOptions=[
 {key:'background',label:'Background',default:'default',values:['default','white','black','theme-gradient','aurora','plasma','eclipse']},
 {key:'background-colours',label:'Artwork colours',default:'original',values:['original','palette']},
 {key:'background-behaviour',label:'Behaviour',default:'fixed',values:['fixed','scroll']},
 {key:'background-overlay',label:'Overlay',default:'none',values:['none','light','dark']},
 {key:'background-strength',label:'Overlay strength',default:'20',values:['20','40','60']}
];
export const backgroundSettingsSchema=Object.fromEntries(backgroundOptions.map(option=>[option.key,option.values]));
export const backgroundLabel=value=>({'default':'Theme default','theme-gradient':'Theme gradient',original:'Original colours',palette:'Follow palette',fixed:'Fixed',scroll:'Scroll with page','20':'20%','40':'40%','60':'60%'}[value] || optionLabel(value));
export const customizerGroups=[
 {title:"Colours",keys:["theme","palette","tone"],open:true},
 {title:"Surfaces",keys:["material","button-material","shape","border","depth","fill"],open:true},
 {title:"Background",keys:backgroundOptions.map(option=>option.key),open:true},
 {title:"Layout",keys:["density","gap","width"]},
 {title:"Navbar",keys:["navbar","navbar-position","navbar-spacing","navbar-width"]},
 {title:"Typography and controls",keys:["type","size","controls"]},
 {title:"Effects and accessibility",keys:["motion","edge","contrast"]}
];
