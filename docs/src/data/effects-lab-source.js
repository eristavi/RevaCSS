import {experimental_AstroContainer as AstroContainer} from 'astro/container';
import EffectsLabDocument from '../components/demos/EffectsLabDocument.astro';
export async function effectsLabSource(config) {
  const container=await AstroContainer.create();
  const assetBase=`${(import.meta.env.SITE || 'https://eristavi.github.io').replace(/\/$/, '')}${import.meta.env.BASE_URL}`;
  const html=await container.renderToString(EffectsLabDocument,{props:{config,assetBase},partial:false});
  return html.replace(/>\s*</g,'>\n<')+'\n';
}
