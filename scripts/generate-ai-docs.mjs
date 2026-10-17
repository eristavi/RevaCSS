import {readFile, writeFile, mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {topics} from '../docs/src/data/examples.js';
import {componentGroups, componentContracts, learnLinks, themeLinks, referenceLinks} from '../docs/src/data/documentation.js';
import {demoPages} from '../docs/src/data/demos.js';
import {classes as classCatalog,classGroups} from '../docs/src/data/classes.js';
import {markupAudit,inheritanceMatrix,nativeMarkupAudit,cascadeLayers} from '../docs/src/data/architecture.js';
import {publicTokens} from '../docs/src/data/public-tokens.js';
import {stylesheets} from '../docs/src/data/stylesheets.js';
import options from '../tokens/options.json' with {type:'json'};
import sourceStatus from '../docs/src/data/source-status.json' with {type:'json'};
import pkg from '../package.json' with {type:'json'};

// Generate documentation assets only. This script does not run tests or add browser JS.
const root=new URL('../',import.meta.url);
const output=new URL('docs/public/',root);
const base=(process.env.REVA_BASE || '/').replace(/\/?$/,'/');
const site=new URL(base,(process.env.REVA_SITE || 'https://revacss.eristavi.org').replace(/\/$/,'')+'/');
const url=path=>new URL(path,site).href;
const guide=(await readFile(new URL('AI.md',root),'utf8')).trim();
const evaluationGuide=(await readFile(new URL('quality/ai-guidance/2026-10-16.md',root),'utf8')).trim();
const contributorGuide=(await readFile(new URL('CONTRIBUTING.md',root),'utf8')).trim();
const troubleshootingGuide=(await readFile(new URL('AI_TROUBLESHOOTING.md',root),'utf8')).trim();
const mistakesGuide=(await readFile(new URL('AI_MISTAKES.md',root),'utf8')).trim();
const applicationGuide=(await readFile(new URL('examples/ai-application/README.md',root),'utf8')).trim();
const applicationPython=await readFile(new URL('examples/ai-application/app.py',root),'utf8');
const applicationCSS=await readFile(new URL('examples/ai-application/app.css',root),'utf8');
const extensionGuide=(await readFile(new URL('CUSTOM_COMPONENTS.md',root),'utf8')).trim();
const extensionHTML=(await readFile(new URL('examples/custom-components.html',root),'utf8')).replaceAll('../dist/','dist/').trim();
const extensionCSS=(await readFile(new URL('examples/custom-components.css',root),'utf8')).trim();
const banner=`RevaCSS ${pkg.version} · ${pkg.releaseName}\n\nGenerated from the same source manifests and examples as the documentation. Use this version's API; check the getting-started guide for publication availability.\n${sourceStatus.unreleasedChanges ? `\nSource preview: ${sourceStatus.summary}${sourceStatus.testsDeferred ? ' Final automated release validation for the latest source changes remains pending.' : ''}\n` : ''}`;
const documents=[];
const add=(path,title,body)=>documents.push({path,title,text:`# ${title}\n\n${banner}\n${body.trim()}\n`});
const fence=(language,source)=>{
  const runs=source.match(/`+/g) || [];
  const marker='`'.repeat(Math.max(3,...runs.map(run=>run.length+1)));
  return `${marker}${language}\n${source}\n${marker}`;
};
const componentData=componentGroups.flatMap(group=>group.slugs.map(slug=>{
  const topic=topics.find(item=>item.slug===slug);
  const contract=componentContracts[slug];
  return {slug,title:topic?.title || 'Top menu',group:group.title,url:url(`components/${slug}/`),markdown:url(`ai/components/${slug}.md`),markup:contract[0],states:contract[1],stylesheet:contract[2],behaviour:contract[3],intro:topic?.intro || 'Native, responsive navigation. Use the full documented HTML structure.',notes:topic?.notes || [],examples:topic?.examples || []};
}));
add('ai/guide.md','Using RevaCSS with AI',guide.replace(/^# .+\n/,'').replaceAll('(CUSTOM_COMPONENTS.md)',`(${url('ai/custom-components.md')})`));
add('ai/evaluation.md','AI guidance evaluation',evaluationGuide.replace(/^# .+\n/,''));
add('ai/contributing.md','Contributor workflow',contributorGuide.replace(/^# .+\n/,''));
add('ai/troubleshooting.md','Troubleshooting RevaCSS interfaces',troubleshootingGuide.replace(/^# .+\n/,''));
add('ai/mistakes.md','Common AI mistakes and corrected patterns',mistakesGuide.replace(/^# .+\n/,''));
add('ai/application.md','Complete project workspace application',`${applicationGuide.replace(/^# .+\n/,'')}\n\n## Complete app.py source\n\n${fence('python',applicationPython.trim())}\n\n## Complete app.css source\n\n${fence('css',applicationCSS.trim())}`);
add('ai/custom-components.md','Building custom components',`${extensionGuide.replace(/^# .+\n/,'')}\n\n## Complete starter HTML\n\nSave this document and its application stylesheet beside your matching \`dist/\` directory.\n\n${fence('html',extensionHTML)}\n\n## Application stylesheet\n\nSave as \`custom-components.css\` beside the HTML.\n\n${fence('css',extensionCSS)}`);
const usageLabels={targets:'Supported targets',inheritance:'Inheritance',localOverride:'Local overrides and resets',dependencies:'Dependencies',limitations:'Limits and combinations with no effect'};
const attributeRules='HTML data attributes do not inherit by themselves. RevaCSS uses CSS custom properties and scoped selectors to apply settings to documented targets. A local choice changes that setting subject to its component rules and accessibility preferences. Local settings such as data-table-sticky apply only to their documented wrapper and do not inherit. For inherited settings, omission preserves the inherited setting within the current boundary, or uses the initialized default when none applies. Each scoped .reva boundary (or source-preview data-reva boundary) initializes defaults. There is no universal reset value: use only the listed values and read the per-setting exceptions below. Unsupported values are not a reliable reset; material boundaries can stop a parent scope even without selecting another finish. Defaults describe the unconfigured build, not a command to repeat on every element.';
add('ai/attributes.md','Attribute reference',`${attributeRules}\n\n${Object.entries(options).map(([key,option])=>`## data-${key}\n\nSupported values: ${option.values.map(value=>`\`${value}\``).join(', ')}.\n\n${option.deprecatedValues ? `Deprecated values: ${Object.keys(option.deprecatedValues).map(value=>`\`${value}\``).join(", ")}. Retained for compatibility; avoid in new interfaces.\n\n` : ""}Unconfigured default: ${option.default}. A default description is not necessarily a valid literal value.\n\nScope: ${option.scope}\n\n${option.affects}\n\n${Object.entries(usageLabels).map(([field,label])=>`### ${label}\n\n${option.usage?.[field] || 'Consult this version\'s component reference.'}`).join('\n\n')}`).join('\n\n')}`);
const adapterData=[];
for(const framework of ['astro','react','vue','svelte','laravel']){
  const directory='integrations/'+framework+'/';
  const manifest=JSON.parse(await readFile(new URL(directory+(framework==='laravel'?'composer.json':'package.json'),root),'utf8'));
  const source='https://github.com/eristavi/RevaCSS/blob/main/'+directory+'README.md';
  const absoluteLinks=(text,baseURL)=>text.replace(/\]\(([^)\s]+)\)/g,(match,target)=>/^(?:[a-z][a-z0-9+.-]*:|#|\/)/i.test(target)?match:']('+new URL(target,baseURL).href+')');
  const readme=absoluteLinks(await readFile(new URL(directory+'README.md',root),'utf8'),source);
  const laravelGuide=framework==='laravel'?'\n\n---\n\n'+absoluteLinks(await readFile(new URL(directory+'docs/ai.md',root),'utf8'),'https://github.com/eristavi/RevaCSS/blob/main/'+directory+'docs/ai.md'):'';
  const markdown=url('ai/adapters/'+framework+'.md');
  adapterData.push({framework,package:manifest.name,version:manifest.version??null,coreReferenceVersion:pkg.version,requirements:manifest.peerDependencies??manifest.require,source,markdown,documentation:url('guide/'+framework+'/')});
  add('ai/adapters/'+framework+'.md',framework[0].toUpperCase()+framework.slice(1)+' adapter AI reference',readme.replace(/^# .+\n/,'')+laravelGuide);
}
add('ai/adapters.md','Framework adapter reference index',`Read the shared AI guide for version selection and attribute rules, then the matching adapter page. Each adapter README follows the same seven decisions: version/reference, assets, native attributes, field values/errors, server/client state, application responsibilities and evidence. The following package metadata comes from this source checkout; it does not establish registry publication. A null version in the structured API means the source manifest omits it; inspect the installed Composer/artifact metadata.\n\n${adapterData.map(adapter=>`## ${adapter.framework}\n\nPackage: \`${adapter.package}\`. Source manifest version: ${adapter.version??'omitted (use installed VCS/artifact metadata)'}.\n\nRequirements: ${Object.entries(adapter.requirements).map(([name,range])=>name+' '+range).join(', ')}.\n\n- [Focused AI reference](${adapter.markdown})\n- [Human guide](${adapter.documentation})\n- [Source README](${adapter.source})`).join('\n\n')}\n\nNext.js uses the React adapter; Nuxt uses Vue; SvelteKit uses Svelte. The Laravel page also includes Boost and AI SDK boundaries. Preserve the consuming framework's native state and server/client rules.`);
const architectureGuide=(await readFile(new URL('ARCHITECTURE.md',root),'utf8')).trim();
add('ai/architecture.md','Architecture, markup audit and inheritance matrix',architectureGuide.replace(/^# .+\n/,'')+'\n\n## Public class audit\n\n'+markupAudit.map(item=>`### .${item.name}\n\nDecision: ${item.decision}. Preferred hook: ${item.preferredHook}.\n\n${item.rationale}\n\n${item.wrapperRule}\n\nStylesheet: ${item.stylesheet}. Guide: ${url(item.guide)}`).join('\n\n')+'\n\n## Inheritance matrix\n\n'+inheritanceMatrix.map(item=>`### ${item.attribute}\n\nDefault: ${item.default}. Scope: ${item.scope}.\n\nTargets: ${item.targets}\n\nOmission/inheritance: ${item.inheritance}\n\nLocal override/reset: ${item.localOverride}\n\nDependencies: ${item.dependencies}\n\nLimits: ${item.limitations}`).join('\n\n')+'\n\n## Component structure inventory\n\n'+nativeMarkupAudit.map(item=>`### ${item.name}\n\nMarkup: ${item.markup}\n\nStates: ${item.states}\n\n${item.behaviour}\n\nStylesheet: ${item.stylesheet}`).join('\n\n'));
const classData=classCatalog.map(entry=>({...entry,guide:url(entry.guide)}));
add('ai/classes.md','Classes API',`Every public framework class, including contextual component parts, layout helpers and supported compatibility names. Native elements and data attributes need no invented classes. Demo-only classes are excluded. For modular builds load shared tokens/base and the listed module; complete-core availability is explicit. Use matching scoped modules within .reva.

Human reference: ${url('reference/classes/')}

${classGroups.map(group=>`## ${group.title}

${classData.filter(entry=>entry.group===group.id).map(entry=>`### ${entry.selector}

${entry.description}

- Markup: ${entry.markup}
- Stylesheet: ${entry.stylesheet}
- In complete core: ${entry.includedInCore?'yes':'no (separate distribution/optional module)'}
- Status: ${entry.status}
${entry.notes?'- Notes: '+entry.notes+'\n':''}- Guide: ${entry.guide}`).join('\n\n')}`).join('\n\n')}`);
add('ai/tokens.md','Public CSS tokens',publicTokens.map(([group,name,type,description])=>`## ${name}\n\nGroup: ${group}. Value: ${type}.\n\n${description}`).join('\n\n'));
add('ai/files.md','Stylesheet entry points',`Start with \`dist/reva.css\` or its minified equivalent. For an existing site that needs a local boundary, use \`dist/reva.scoped.css\` inside \`.reva\`. Do not combine the global and scoped complete builds.\n\nLoad matching optional extensions after the core: \`reva.glass.css\`, \`reva.veil.css\`, \`reva.soft.css\`, \`reva.button-materials.css\`, \`reva.motion.css\` and \`reva.selects.css\` as needed; scoped equivalents are listed below. Veil surface and button finishes are deprecated; their files and values remain for compatibility. Prefer Solid, Glass or Soft UI for new work. Fonts are optional; \`reva-fonts.css\` requires its adjacent fonts directory.\n\n${stylesheets.map(file=>`- \`${file}\``).join('\n')}\n\nComponent module names identify styling dependencies. Prefer a complete build when you do not need a custom subset. Consult the [stylesheet reference](${url('reference/')}) for complete file descriptions.`);
for(const component of componentData){
  add(`ai/components/${component.slug}.md`,component.title,`${component.intro}\n\nHTML documentation: ${component.url}\n\n## Component contract\n\n- Markup: ${component.markup}\n- Options and states: ${component.states}\n- Styling module: ${component.stylesheet}\n- Behaviour: ${component.behaviour}\n\n${component.notes.map(note=>`- ${note}`).join('\n')}\n\n## HTML examples\n\nExamples are snippets from the documentation, not independent applications. Make IDs and radio names unique, replace demonstration URLs and supply the application's data and handlers.\n\n${component.examples.length ? component.examples.map(example=>`### ${example.title}\n\n${example.description || ''}\n\n${fence('html',example.html)}`).join('\n\n') : `Read the [full HTML documentation](${component.url}) and complete demo sources for this component's nested structure.`}`);
}
add('ai/demos.md','Complete website starters',`These are full demonstration websites. Open a demo, use its customizer and download the HTML. Download linked stylesheets and update their paths for your own hosting. Replace fictional content and connect product behaviour to your application.\n\n${demoPages.map(demo=>`## ${demo.title}\n\n${demo.description}\n\n${url(demo.path)}`).join('\n\n')}`);
await mkdir(new URL('ai/components/',output),{recursive:true});
await mkdir(new URL('ai/adapters/',output),{recursive:true});
await mkdir(new URL('ai/application/',output),{recursive:true});
await writeFile(new URL('ai/application/app.py',output),applicationPython);
await writeFile(new URL('ai/application/app.css',output),applicationCSS);
for(const document of documents)await writeFile(new URL(document.path,output),document.text);
const api={schemaVersion:1,framework:'RevaCSS',sourceStatus,version:pkg.version,releaseName:pkg.releaseName,documentation:url(''),guide:url('ai/guide.md'),installation:url('guide/'),npmPublished:process.env.REVA_NPM_PUBLISHED==='true',releasePublished:process.env.REVA_RELEASE_PUBLISHED==='true',attributes:options,stylesheets,publicTokens:publicTokens.map(([group,name,valueType,description])=>({group,name,valueType,description})),components:componentData,classGroups,classes:classData,architecture:{guide:url('ai/architecture.md'),cascadeLayers,markupAudit,inheritanceMatrix,nativeMarkupAudit},adapters:adapterData,demos:demoPages.map(demo=>({...demo,url:url(demo.path)}))};
await writeFile(new URL('ai/api.json',output),JSON.stringify(api,null,2)+'\n');
const customData={version:1.1,globalAttributes:Object.entries(options).map(([key,option])=>({name:`data-${key}`,description:`${option.affects} Unconfigured default: ${option.default}. ${option.scope}. ${Object.entries(usageLabels).map(([field,label])=>option.usage?.[field] ? `${label}: ${option.usage[field]}` : '').filter(Boolean).join(' ')}`,values:option.values.map(name=>({name})),references:[{name:'RevaCSS attribute reference',url:url('ai/attributes.md#data-'+key)}]}))};
await writeFile(new URL('ai/html-custom-data.json',output),JSON.stringify(customData,null,2)+'\n');
const links=items=>items.map(item=>`- [${item.title}](${url(item.path)}): ${item.title} documentation.`).join('\n');
const index=`# RevaCSS\n\n> HTML/CSS-first framework with a zero-JavaScript core, native elements and shared data-attribute defaults.\n\nVersion: ${pkg.version} (${pkg.releaseName}). ${sourceStatus.unreleasedChanges ? `Source preview: ${sourceStatus.summary}${sourceStatus.testsDeferred ? ' Final automated release validation for the latest source changes remains pending.' : ''} ` : ''}This is a documentation index, not a crawler permission file. Use the current reference rather than guessing attributes or importing another framework's markup.\n\n## Start here\n\n- [Using RevaCSS with AI](${url('ai/guide.md')}): Agent guidance, complete starter HTML, constraints and example prompts.\n- [Getting started](${url('guide/')}): Current download and publication availability.\n- [Structured API](${url('ai/api.json')}): Supported values, contracts and examples from source manifests.\n- [HTML editor custom data](${url('ai/html-custom-data.json')}): Attribute descriptions and completion values.\n\n## Generated Markdown reference\n\n${documents.filter(document=>document.path!=='ai/guide.md').map(document=>`- [${document.title}](${url(document.path)}): Version-matched reference and examples.`).join('\n')}\n\n## Human guides\n\n${links(learnLinks)}\n\n## Themes\n\n${links(themeLinks)}\n\n## Reference\n\n${links(referenceLinks)}\n\n## Optional\n\n- [Full generated text reference](${url('llms-full.txt')}): Large combined guide, contracts, values and HTML examples; prefer individual pages for focused tasks.\n- [Source repository](https://github.com/eristavi/RevaCSS): Implementation and AI.md agent guide.\n`;
await writeFile(new URL('llms.txt',output),index);
await writeFile(new URL('llms-full.txt',output),`# RevaCSS ${pkg.version}: AI reference\n\n${documents.map(document=>`Source: ${url(document.path)}\n\n${document.text}`).join('\n\n---\n\n')}`);
console.log(`Generated ${documents.length} Markdown references, structured API, HTML custom data and LLM indexes in ${fileURLToPath(output)}.`);
