import { topics } from './examples.js';
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
 {key:'guide',label:'Guide',href:base+'guide/'},
 {key:'attributes',label:'Data attributes',href:base+'attributes/'},
 {key:'reference',label:'API reference',href:base+'reference/'},
 {key:'components',label:'Components',children:[...topics.map(t=>({key:t.slug,label:t.title,href:base+`components/${t.slug}/`})),{key:'top-menu',label:'Top menu',href:base+'components/top-menu/'}]},
 {key:'glass',label:'Glass material',href:base+'themes/glass/'},
 {key:'previews',label:'Previews',children:[
  {key:'plain',label:'Plain HTML',href:base+'plain/'},
  ...[['foundation','Foundation','preview/'],['menu','Top menu','preview/menu/'],['glass','Glass','preview/glass/'],['defaults','Page defaults','preview/defaults/']].map(([key,label,path])=>({key,label,children:['light','dark','auto'].map(theme=>({key:theme,label:theme==='auto'?'System':theme[0].toUpperCase()+theme.slice(1),href:base+path+theme+'/'}))}))
 ]}
];
