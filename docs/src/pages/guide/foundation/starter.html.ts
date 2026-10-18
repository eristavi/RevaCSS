import source from '../../../../../examples/semantic.html?raw';
export const GET=()=>new Response(source.replaceAll('../dist/','dist/'),{
 headers:{'Content-Type':'text/html; charset=utf-8','Content-Disposition':'attachment; filename="revacss-semantic-starter.html"'}
});
