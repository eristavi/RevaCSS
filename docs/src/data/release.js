// Build-time release metadata; nothing is added to the browser runtime.
import sourceStatus from './source-status.json' with { type: 'json' };
export const unreleasedChanges = sourceStatus.unreleasedChanges;
export const testsDeferred = sourceStatus.testsDeferred;
import metadata from '../../../package.json' with { type: 'json' };
import quality from '../../../quality/blockers.json' with { type: 'json' };
export const version = metadata.version;
export const releaseName = metadata.releaseName;
export const releaseUrl = `https://github.com/eristavi/RevaCSS/releases/tag/v${version}`;
export const releaseArchiveUrl = `https://github.com/eristavi/RevaCSS/releases/download/v${version}/${metadata.name}-${version}-${releaseName.toLowerCase()}.zip`;

export const releaseRecordUrl = `https://github.com/eristavi/RevaCSS/blob/main/quality/releases/v${version}.md`;
export const qualityUrl = 'https://github.com/eristavi/RevaCSS/blob/main/quality/blockers.json';
// Deployment verifies publication against GitHub and npm. Local previews are conservative.
export const development = process.env.REVA_RELEASE_PUBLISHED === 'false' || version.includes('-');
export const npmPublished = process.env.REVA_NPM_PUBLISHED === 'true';
export const npmUrl = `https://www.npmjs.com/package/revacss/v/${version}`;
export const manualChecks = quality.blockers.filter(item => item.kind === 'manual');
export const openChecks = quality.blockers.filter(item => item.status !== 'resolved');
export const acceptanceComplete = openChecks.length === 0;
