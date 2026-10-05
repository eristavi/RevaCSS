// Build-time URL versioning; this module adds no browser JavaScript.
const revision = encodeURIComponent(process.env.GITHUB_SHA || 'local');
export const asset = file => `${import.meta.env.BASE_URL}${file}?v=${revision}`;
export const stylesheet = file => asset('reva/'+file);
