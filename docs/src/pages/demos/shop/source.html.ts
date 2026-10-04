import {shopSource} from '../../../data/shop-source.js';
import {defaultDemo} from '../../../data/demo-configurations.js';
export async function GET(){return new Response(await shopSource(defaultDemo),{headers:{'Content-Type':'text/html; charset=utf-8'}});}
