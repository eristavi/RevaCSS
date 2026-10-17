import {classes} from './classes.js';
import options from '../../../tokens/options.json' with {type:'json'};
import {componentContracts} from './documentation.js';

// Derived from the actual public catalogs, so additions cannot disappear from the audit.
const alternatives={container:'data-layout="container"',grid:'data-layout="grid"',row:'data-layout="row"',stack:'data-layout="stack"',card:'data-surface="card"',reva:'data-reva',danger:'data-variant="danger"',warning:'data-variant="warning"','table-scroll':'data-table-sticky="none"'};
const nativeNotes={button:'Native button needs no hook; a navigation link keeps href and can opt into action presentation.',switch:'The native checkbox owns state and keyboard behaviour; this hook selects its visual treatment.',accordion:'Native details/summary works alone; the hook supplies grouping and chevron presentation.',calendar:'Native table supplies relationships; calendar selects a date-oriented presentation.',chart:'Native figure/SVG supplies content; the hook selects chart presentation and does not calculate data.',tabs:'Native radio choices own selection; this is not an ARIA tabs widget.',drawer:'Native popover owns opening/dismissal; the hook selects viewport-side geometry.',breadcrumbs:'Native nav/list/link structure supplies meaning; the hook selects separators and arrangement.',pagination:'Native nav/list/link structure supplies meaning; the hook selects page-link presentation.'};
export const markupAudit=classes.map(entry=>({
 name:entry.name,markup:entry.markup,stylesheet:entry.stylesheet,
 decision:alternatives[entry.name]?'Compatible alternative available':entry.status==='compatibility'?'Retain compatibility':entry.group==='utilities'||['outline','ghost','cols-2','cols-3','align-start','align-center','justify-between','prose'].includes(entry.name)?'Retain presentation utility':'Retain explicit pattern hook',
 preferredHook:alternatives[entry.name]||entry.selector,
 rationale:nativeNotes[entry.name]||entry.description+' Native markup alone does not select this optional presentation.',
 wrapperRule:entry.markup+' Reuse an existing suitable element; add a wrapper only for the documented grouping, scrolling, containment or component-part relationship.',
 guide:entry.guide,
}));
export const inheritanceMatrix=Object.entries(options).map(([name,option])=>({attribute:'data-'+name,values:option.values,default:option.default,scope:option.scope,...option.usage}));
export const nativeMarkupAudit=Object.entries(componentContracts).map(([name,[markup,states,stylesheet,behaviour]])=>({name,markup,states,stylesheet,behaviour}));
export const cascadeLayers=['re.tokens','re.base','re.components','re.buttons','re.utilities'];
