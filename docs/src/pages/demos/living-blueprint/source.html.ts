import {blueprintSource} from '../../../data/blueprint-source.js';
import {defaultDemo} from '../../../data/demo-configurations.js';
export async function GET() {
  return new Response(await blueprintSource(defaultDemo),{headers:{'Content-Type':'text/html; charset=utf-8'}});
}
