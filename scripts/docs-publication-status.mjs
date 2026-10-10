import {readFile, appendFile} from 'node:fs/promises';

const {name, version} = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
async function get(url, headers={}) {
  const response = await fetch(url, {headers, signal:AbortSignal.timeout(30_000)});
  if (response.status === 404) return null;
  if (!response.ok) throw new Error('Publication status request failed: HTTP ' + response.status);
  return response.json();
}
const [registry, release] = await Promise.all([
  get('https://registry.npmjs.org/' + encodeURIComponent(name)),
  get('https://api.github.com/repos/eristavi/RevaCSS/releases/tags/v' + version, {
    Accept:'application/vnd.github+json',
    ...(process.env.GH_TOKEN ? {Authorization:'Bearer ' + process.env.GH_TOKEN} : {})
  })
]);
const status = {
  REVA_NPM_PUBLISHED:String(Boolean(registry?.versions?.[version])),
  REVA_RELEASE_PUBLISHED:String(Boolean(release && !release.draft && !release.prerelease && release.tag_name === 'v' + version))
};
if (process.env.GITHUB_ENV) await appendFile(process.env.GITHUB_ENV, Object.entries(status).map(([key,value])=>key+'='+value).join('\n')+'\n');
console.log('Publication status for ' + name + '@' + version + ': ' + JSON.stringify(status));
