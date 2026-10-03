import {dashboardSource} from '../../../data/dashboard-source.js';
import {defaultDemo} from '../../../data/demo-configurations.js';
export async function GET() {
  return new Response(await dashboardSource(defaultDemo),{headers:{'Content-Type':'text/html; charset=utf-8'}});
}
