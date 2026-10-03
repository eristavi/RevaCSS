import {experimental_AstroContainer as AstroContainer} from 'astro/container';
import DashboardDocument from '../components/demos/DashboardDocument.astro';
export async function dashboardSource(config) {
  const container=await AstroContainer.create();
  const assetBase=`${(import.meta.env.SITE || 'https://eristavi.github.io').replace(/\/$/, '')}${import.meta.env.BASE_URL}`;
  const html=await container.renderToString(DashboardDocument,{props:{config,assetBase},partial:false});
  return html.replace(/>\s*</g,'>\n<')+'\n';
}
