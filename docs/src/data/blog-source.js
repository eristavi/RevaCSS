import {experimental_AstroContainer as AstroContainer} from 'astro/container';
import BlogDocument from '../components/demos/BlogDocument.astro';
export async function blogSource(config,slug) {
  const container=await AstroContainer.create();
  const assetBase=`${(import.meta.env.SITE || 'https://eristavi.github.io').replace(/\/$/,'')}${import.meta.env.BASE_URL}`;
  const html=await container.renderToString(BlogDocument,{props:{config,assetBase,slug},partial:false});
  return html.replace(/>\s*</g,'>\n<')+'\n';
}
