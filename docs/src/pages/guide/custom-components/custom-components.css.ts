import source from '../../../../../examples/custom-components.css?raw';

export const GET=()=>new Response(source,{
  headers:{'Content-Type':'text/css; charset=utf-8'}
});
