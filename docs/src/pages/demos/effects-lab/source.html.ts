import {effectsLabSource} from '../../../data/effects-lab-source.js';
import {defaultDemo} from '../../../data/demo-configurations.js';
export async function GET() {
  return new Response(await effectsLabSource(defaultDemo),{headers:{'Content-Type':'text/html; charset=utf-8'}});
}
