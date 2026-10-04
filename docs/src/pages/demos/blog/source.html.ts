import {blogSource} from '../../../data/blog-source.js';
import {defaultDemo} from '../../../data/demo-configurations.js';
export async function GET(){return new Response(await blogSource(defaultDemo),{headers:{'Content-Type':'text/html; charset=utf-8'}});}
