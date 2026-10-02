// Build-time URL versioning; this module adds no browser JavaScript.
const revision = encodeURIComponent(process.env.GITHUB_SHA || 'local');
export const stylesheet = file => `${import.meta.env.BASE_URL}reva/${file}?v=${revision}`;
