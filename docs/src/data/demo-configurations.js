// Static routes initialize the live customizer and its starting HTML download.
export const demoOptions = {
  theme: ['auto', 'light', 'dark'],
  palette: ['default', 'mono', 'sand', 'ocean', 'cobalt', 'citrus', 'violet', 'forest'],
  material: ['solid', 'glass', 'veil'],
  shape: ['square', 'subtle', 'rounded', 'pill']
};
export const defaultDemo = { theme: 'auto', palette: 'default', material: 'solid', shape: 'rounded' };
export const configurationKey = config => Object.keys(demoOptions).map(key => config[key]).join('/');
export const demoConfigurations = demoOptions.theme.flatMap(theme =>
  demoOptions.palette.flatMap(palette => demoOptions.material.flatMap(material =>
    demoOptions.shape.map(shape => ({ theme, palette, material, shape })))));
export const demoHref = (base, config) => `${base}demos/marketing/${configurationKey(config)}/`;
export const sourceHref = (base, config) => `${base}demos/marketing/source/${configurationKey(config)}.html`;
export const configurationHTML = config => `<html lang="en"\n  data-theme="${config.theme}"\n  data-palette="${config.palette}"\n  data-material="${config.material}"\n  data-shape="${config.shape}">`;
