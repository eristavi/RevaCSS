import {blogPosts} from './blog-posts.js';
export const blogCategories=[...new Set(blogPosts.map(post=>post.category))].map(name=>({name,slug:name.toLowerCase()}));
export const archivePageSize=3;
export const archivePageCount=Math.ceil(blogPosts.length/archivePageSize);
export const blogViewPath=view=>view.kind==='author'?'author/alex-morgan/':view.category?'category/'+view.category+'/':view.page>1?'archive/page/'+view.page+'/':'archive/';
export const blogSourceKey=view=>blogViewPath(view).replace(/\/$/,'');
export const blogViewHref=(base,view,standalone=false)=>base+'demos/blog/'+(standalone?'source/'+blogSourceKey(view)+'.html':blogViewPath(view));
export const blogDownloadPages=[
 ...blogPosts.map(post=>({path:post.slug,slug:post.slug})),
 ...Array.from({length:archivePageCount},(_,i)=>({path:blogSourceKey({kind:'archive',page:i+1}),view:{kind:'archive',page:i+1}})),
 ...blogCategories.map(category=>({path:'category/'+category.slug,view:{kind:'archive',category:category.slug}})),
 {path:'author/alex-morgan',view:{kind:'author'}}
];
