import {readFile, writeFile, mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {topics} from '../docs/src/data/examples.js';
import {componentGroups, componentContracts, learnLinks, themeLinks, referenceLinks} from '../docs/src/data/documentation.js';
import {demoPages} from '../docs/src/data/demos.js';
import {publicTokens} from '../docs/src/data/public-tokens.js';
import {stylesheets} from '../docs/src/data/stylesheets.js';
import options from '../tokens/options.json' with {type:'json'};
import sourceStatus from '../docs/src/data/source-status.json' with {type:'json'};
import pkg from '../package.json' with {type:'json'};

// Generate documentation assets only. This script does not run tests or add browser JS.
const root=new URL('../',import.meta.url);
const output=new URL('docs/public/',root);
const base=(process.env.REVA_BASE || '/').replace(/\/?$/,'/');
const site=new URL(base,(process.env.REVA_SITE || 'https://eristavi.github.io').replace(/\/$/,'')+'/');
const url=path=>new URL(path,site).href;
const guide=(await readFile(new URL('AI.md',root),'utf8')).trim();
const banner=`RevaCSS ${pkg.version} · ${pkg.releaseName}\n\nGenerated from the same source manifests and examples as the documentation. Use this version's API; check the getting-started guide for publication availability.\n${sourceStatus.unreleasedChanges ? `\nSource preview: ${sourceStatus.summary} Tests for these additions are deferred.\n` : ''}`;
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
add('ai/guide.md','Using RevaCSS with AI',guide.replace(/^# .+\n/,''));
add('ai/attributes.md','Attribute reference',Object.entries(options).map(([key,option])=>`## data-${key}\n\nSupported values: ${option.values.map(value=>`\`${value}\``).join(', ')}.\n\nDefault: ${option.default}. Omit the attribute to retain the default; a default description is not necessarily a valid literal value.\n\nScope: ${option.scope}\n\n${option.affects}`).join('\n\n'));
add('ai/tokens.md','Public CSS tokens',publicTokens.map(([group,name,type,description])=>`## ${name}\n\nGroup: ${group}. Value: ${type}.\n\n${description}`).join('\n\n'));
add('ai/files.md','Stylesheet entry points',`Start with \`dist/reva.css\` or its minified equivalent. For an existing site that needs a local boundary, use \`dist/reva.scoped.css\` inside \`.reva\`. Do not combine the global and scoped complete builds.\n\nLoad matching optional extensions after the core: \`reva.glass.css\`, \`reva.veil.css\`, \`reva.soft.css\`, \`reva.button-materials.css\`, \`reva.motion.css\` and \`reva.selects.css\` as needed; scoped equivalents are listed below. Fonts are optional; \`reva-fonts.css\` requires its adjacent fonts directory.\n\n${stylesheets.map(file=>`- \`${file}\``).join('\n')}\n\nComponent module names identify styling dependencies. Prefer a complete build when you do not need a custom subset. Consult the [stylesheet reference](${url('reference/')}) for complete file descriptions.`);
for(const component of componentData){
  add(`ai/components/${component.slug}.md`,component.title,`${component.intro}\n\nHTML documentation: ${component.url}\n\n## Component contract\n\n- Markup: ${component.markup}\n- Options and states: ${component.states}\n- Styling module: ${component.stylesheet}\n- Behaviour: ${component.behaviour}\n\n${component.notes.map(note=>`- ${note}`).join('\n')}\n\n## HTML examples\n\nExamples are snippets from the documentation, not independent applications. Make IDs and radio names unique, replace demonstration URLs and supply the application's data and handlers.\n\n${component.examples.length ? component.examples.map(example=>`### ${example.title}\n\n${example.description || ''}\n\n${fence('html',example.html)}`).join('\n\n') : `Read the [full HTML documentation](${component.url}) and complete demo sources for this component's nested structure.`}`);
}
add('ai/demos.md','Complete website starters',`These are full demonstration websites. Open a demo, use its customizer and download the HTML. Download linked stylesheets and update their paths for your own hosting. Replace fictional content and connect product behaviour to your application.\n\n${demoPages.map(demo=>`## ${demo.title}\n\n${demo.description}\n\n${url(demo.path)}`).join('\n\n')}`);
await mkdir(new URL('ai/components/',output),{recursive:true});
for(const document of documents)await writeFile(new URL(document.path,output),document.text);
const api={schemaVersion:1,framework:'RevaCSS',sourceStatus,version:pkg.version,releaseName:pkg.releaseName,documentation:url(''),guide:url('ai/guide.md'),installation:url('guide/'),npmPublished:process.env.REVA_NPM_PUBLISHED==='true',releasePublished:process.env.REVA_RELEASE_PUBLISHED==='true',attributes:options,stylesheets,publicTokens:publicTokens.map(([group,name,valueType,description])=>({group,name,valueType,description})),components:componentData,demos:demoPages.map(demo=>({...demo,url:url(demo.path)}))};
await writeFile(new URL('ai/api.json',output),JSON.stringify(api,null,2)+'\n');
const customData={version:1.1,globalAttributes:Object.entries(options).map(([key,option])=>({name:`data-${key}`,description:`${option.affects} Default: ${option.default}. ${option.scope}.`,values:option.values.map(name=>({name})),references:[{name:'RevaCSS attribute reference',url:url('ai/attributes.md')}]}))};
await writeFile(new URL('ai/html-custom-data.json',output),JSON.stringify(customData,null,2)+'\n');
const links=items=>items.map(item=>`- [${item.title}](${url(item.path)}): ${item.title} documentation.`).join('\n');
const index=`# RevaCSS\n\n> HTML/CSS-first framework with a zero-JavaScript core, native elements and shared data-attribute defaults.\n\nVersion: ${pkg.version} (${pkg.releaseName}). ${sourceStatus.unreleasedChanges ? `Source preview: ${sourceStatus.summary} Tests for these additions are deferred. ` : ''}This is a documentation index, not a crawler permission file. Use the current reference rather than guessing attributes or importing another framework's markup.\n\n## Start here\n\n- [Using RevaCSS with AI](${url('ai/guide.md')}): Agent guidance, complete starter HTML, constraints and example prompts.\n- [Getting started](${url('guide/')}): Current download and publication availability.\n- [Structured API](${url('ai/api.json')}): Supported values, contracts and examples from source manifests.\n- [HTML editor custom data](${url('ai/html-custom-data.json')}): Attribute descriptions and completion values.\n\n## Generated Markdown reference\n\n${documents.filter(document=>document.path!=='ai/guide.md').map(document=>`- [${document.title}](${url(document.path)}): Version-matched reference and examples.`).join('\n')}\n\n## Human guides\n\n${links(learnLinks)}\n\n## Themes\n\n${links(themeLinks)}\n\n## Reference\n\n${links(referenceLinks)}\n\n## Optional\n\n- [Full generated text reference](${url('llms-full.txt')}): Large combined guide, contracts, values and HTML examples; prefer individual pages for focused tasks.\n- [Source repository](https://github.com/eristavi/RevaCSS): Implementation and AI.md agent guide.\n`;
await writeFile(new URL('llms.txt',output),index);
await writeFile(new URL('llms-full.txt',output),`# RevaCSS ${pkg.version}: AI reference\n\n${documents.map(document=>`Source: ${url(document.path)}\n\n${document.text}`).join('\n\n---\n\n')}`);
console.log(`Generated ${documents.length} Markdown references, structured API, HTML custom data and LLM indexes in ${fileURLToPath(output)}.`);
