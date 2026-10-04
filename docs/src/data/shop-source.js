import {experimental_AstroContainer as AstroContainer} from 'astro/container';
import ShopDocument from '../components/demos/ShopDocument.astro';
export async function shopSource(config,view){
 const container=await AstroContainer.create();
 const assetBase=`${(import.meta.env.SITE || 'https://eristavi.github.io').replace(/\/$/,'')}${import.meta.env.BASE_URL}`;
 return (await container.renderToString(ShopDocument,{props:{config,assetBase,view},partial:false})).replace(/>\s*</g,'>\n<')+'\n';
}
