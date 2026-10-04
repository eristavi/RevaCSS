import {blogSource} from '../../../../data/blog-source.js';
import {blogDownloadPages} from '../../../../data/blog-pages.js';
import {defaultDemo} from '../../../../data/demo-configurations.js';
export function getStaticPaths(){return blogDownloadPages.map(({path,...props})=>({params:{page:path},props}));}
export async function GET({props}){return new Response(await blogSource(defaultDemo,props.slug,props.view),{headers:{'Content-Type':'text/html; charset=utf-8'}});}
