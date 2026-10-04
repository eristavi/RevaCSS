import {blogSource} from '../../../../data/blog-source.js';
import {blogPosts} from '../../../../data/blog-posts.js';
import {defaultDemo} from '../../../../data/demo-configurations.js';
export function getStaticPaths(){return blogPosts.map(post=>({params:{slug:post.slug}}));}
export async function GET({params}){return new Response(await blogSource(defaultDemo,params.slug),{headers:{'Content-Type':'text/html; charset=utf-8'}});}
