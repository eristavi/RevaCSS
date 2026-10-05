import {advancedCSS} from '../data/demo-advanced.js';

export function GET() {
  return new Response(advancedCSS,{headers:{'Content-Type':'text/css; charset=utf-8'}});
}
