export const demoPages = [
  {key:'marketing-demo', title:'Marketing website', name:'Forma', path:'demos/marketing/', kind:'marketing', description:'A complete landing page with product sections, pricing, FAQ and a contact-form preview.'},
  {key:'dashboard-demo', title:'Workspace dashboard', name:'Workspace', path:'demos/dashboard/', kind:'dashboard', description:'Metrics, project progress, SVG charts and activity in a responsive app shell.'},
  {key:'shop-demo', title:'Shop', name:'Still', path:'demos/shop/', kind:'shop', description:'A catalogue, category pages, product details and a sample shopping bag.'},
  {key:'blog-demo', title:'Blog and journal', name:'Fieldnotes', path:'demos/blog/', kind:'blog', description:'Stories, full articles, reading navigation, category archives and an author profile.'}
];

export const demoLinks = [
  {key:'demos', title:'All demos', path:'demos/'},
  ...demoPages.slice(0,3),
  {key:'blog-examples', title:'Blog examples', children:[
    demoPages[3],
    {key:'blog-article-demo', title:'Full article', path:'demos/blog/room-for-better-work/'},
    {key:'blog-archive-demo', title:'Archive', path:'demos/blog/archive/'},
    {key:'blog-author-demo', title:'Author profile', path:'demos/blog/author/alex-morgan/'}
  ]}
];
