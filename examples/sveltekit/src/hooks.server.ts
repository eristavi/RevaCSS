import type { Handle } from '@sveltejs/kit/hooks';
export const handle: Handle = async ({ event, resolve }) => {
  const theme = event.url.pathname === '/dark' ? 'dark' : 'auto';
  return resolve(event, { transformPageChunk: ({ html }) => html.replaceAll('%reva.theme%', theme) });
};
