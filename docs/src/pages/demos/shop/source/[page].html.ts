import {shopSource} from '../../../../data/shop-source.js';
import {defaultDemo} from '../../../../data/demo-configurations.js';
import {shopViews,shopViewKey} from '../../../../data/shop-products.js';
export function getStaticPaths(){return shopViews.map(view=>({params:{page:shopViewKey(view)},props:{view}}));}
export async function GET({props}){return new Response(await shopSource(defaultDemo,props.view),{headers:{'Content-Type':'text/html; charset=utf-8'}});}
