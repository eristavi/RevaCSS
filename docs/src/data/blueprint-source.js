import {experimental_AstroContainer as AstroContainer} from 'astro/container';
import LivingBlueprintDocument from '../components/demos/LivingBlueprintDocument.astro';
export async function blueprintSource(config) {
  const container=await AstroContainer.create();
  const assetBase=`${(import.meta.env.SITE || 'https://eristavi.github.io').replace(/\/$/, '')}${import.meta.env.BASE_URL}`;
  const html=await container.renderToString(LivingBlueprintDocument,{props:{config,assetBase},partial:false});
  return html.replace(/>\s*</g,'>\n<')+'\n';
}
