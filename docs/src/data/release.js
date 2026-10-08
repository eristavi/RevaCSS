// Build-time release metadata; nothing is added to the browser runtime.
import metadata from '../../../package.json' with { type: 'json' };
export const version = metadata.version;
export const releaseName = metadata.releaseName;
export const releaseUrl = `https://github.com/eristavi/RevaCSS/releases/tag/v${version}`;

export const plannedVersion = '1.1.0';
export const development = version !== plannedVersion;
