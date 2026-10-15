# SvelteKit reference

Install the local core/adapter tarballs described in the
[adapter guide](https://github.com/eristavi/RevaCSS/tree/main/integrations/svelte),
then npm install and npm run dev here. Uses SvelteKit 3's Vite-based configuration,
adapter-node and the same Svelte components. CSS loads in the root layout.

The server hook sets auto/dark document theme by path. Theme links use full document
reloads; no client theme script is introduced. The demo form has no submission
endpoint. Production/server rendering and the three-engine reference browser/model/element checks passed. This does not establish acceptance for every hydration combination, physical device or assistive technology.

Release scope and evidence: [2.0.0 validation record](https://github.com/eristavi/RevaCSS/blob/main/quality/releases/v2.0.0.md).
