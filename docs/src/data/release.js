// Build-time release metadata; nothing is added to the browser runtime.
import metadata from '../../../package.json' with { type: 'json' };
export const version = metadata.version;
export const releaseName = metadata.releaseName;
export const releaseUrl = `https://github.com/eristavi/RevaCSS/releases/tag/v${version}`;
