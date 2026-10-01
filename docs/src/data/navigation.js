import { topics } from './examples.js';
import { componentGroups, learnLinks, themeLinks, referenceLinks } from './documentation.js';
export const demoNavigation=[
 {key:'home',label:'Home',href:'#home'},
 {key:'products',label:'Products',children:[
  {key:'overview',label:'All products',href:'#overview'},
  {key:'frameworks',label:'Frameworks',children:[
   {key:'css',label:'CSS foundation',href:'#css'},
   {key:'components',label:'Components',children:[{key:'navigation',label:'Top menu',href:'#navigation'},{key:'forms',label:'Forms and controls',href:'#forms'}]}
  ]},
  {key:'templates',label:'Templates',href:'#templates'}
 ]},
 {key:'resources',label:'Resources',children:[{key:'guide',label:'Get started',href:'#guide'},{key:'reference',label:'API reference',href:'#reference'}]},
 {key:'contact',label:'Contact',href:'#contact'}
];
export const documentationNavigation=base=>[
 {key:'learn',label:'Learn',children:learnLinks.map(i=>({key:i.key,label:i.title,href:base+i.path}))},
 {key:'themes',label:'Themes',children:themeLinks.map(i=>({key:i.key,label:i.title,href:base+i.path}))},
 {key:'components',label:'Components',children:componentGroups.map(group=>({
   key:group.key,label:group.title,children:group.slugs.map(slug=>({key:slug,label:slug==='top-menu'?'Top menu':topics.find(t=>t.slug===slug).title,href:base+'components/'+slug+'/'}))
 }))},
 {key:'reference',label:'Reference',children:referenceLinks.map(i=>({key:i.key,label:i.title,href:base+i.path}))}
];
