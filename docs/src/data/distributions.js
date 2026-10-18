export const distributions=[
 {id:'semantic',stylesheet:'reva.semantic.css',scoped:'reva.semantic.scoped.css',description:'Native HTML and shared presets. No framework class selectors or layout/surface aliases.'},
 {id:'patterns',stylesheet:'reva.patterns.css',scoped:'reva.patterns.scoped.css',description:'Optional RevaCSS classes. Load after the semantic foundation; shares its tokens and presets.'},
 {id:'complete',stylesheet:'reva.css',scoped:'reva.scoped.css',description:'Compatible complete bundle for existing sites, adapters and full demonstrations.'}
];
export const semanticExtensions=['glass','soft','veil','button-materials','backgrounds','motion','selects'];
export const distributionFiles=[
 'reva.semantic.css','reva.semantic.min.css','reva.semantic.scoped.css',
 'reva.patterns.css','reva.patterns.min.css','reva.patterns.scoped.css',
 ...semanticExtensions.flatMap(name=>[`reva.semantic.${name}.css`,`reva.semantic.${name}.scoped.css`])
];
