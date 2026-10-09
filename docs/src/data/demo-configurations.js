// Static routes initialize the live customizer and its starting HTML download.
import options from '../../../tokens/options.json';
import {basicSettingKeys} from './demo-settings.js';
export const demoOptions=Object.fromEntries(basicSettingKeys.map(key=>[key,options[key].values]));
export const defaultDemo={...Object.fromEntries(basicSettingKeys.map(key=>[key,options[key].default])),'navbar-position':'sticky'};
export const configurationKey = config => Object.keys(demoOptions).map(key => config[key]).join('/');
export const demoConfigurations = demoOptions.theme.flatMap(theme =>
  demoOptions.palette.flatMap(palette => demoOptions.material.flatMap(material =>
    demoOptions.shape.map(shape => ({ ...defaultDemo, theme, palette, material, shape })))));
export const demoHref = (base, config) => `${base}demos/marketing/${configurationKey(config)}/`;
export const sourceHref = (base, config) => `${base}demos/marketing/source/${configurationKey(config)}.html`;
export const configurationHTML = config => `<html lang="en"\n  data-theme="${config.theme}"\n  data-palette="${config.palette}"\n  data-material="${config.material}"\n  data-shape="${config.shape}"\n  data-navbar-position="${config['navbar-position'] || options['navbar-position'].default}">`;
