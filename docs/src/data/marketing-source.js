import {experimental_AstroContainer as AstroContainer} from 'astro/container';
import MarketingDocument from '../components/demos/MarketingDocument.astro';

// The download and code viewer render the same component as the live website.
export async function marketingSource(config) {
  const container = await AstroContainer.create();
  const assetBase = `${(import.meta.env.SITE || 'https://eristavi.github.io').replace(/\/$/, '')}${import.meta.env.BASE_URL}`;
  const html = await container.renderToString(MarketingDocument, {props:{config,assetBase},partial:false});
  // Put adjacent tags on separate lines for readable, copyable source.
  return html.replace(/>\s*</g, '>\n<')+'\n';
}
