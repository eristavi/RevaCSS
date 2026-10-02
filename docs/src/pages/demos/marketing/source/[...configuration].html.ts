import {demoConfigurations,configurationKey} from '../../../../data/demo-configurations.js';
import {marketingSource} from '../../../../data/marketing-source.js';
export function getStaticPaths() {
  return demoConfigurations.map(config=>({params:{configuration:configurationKey(config)},props:{config}}));
}
export async function GET({props}) {
  return new Response(await marketingSource(props.config), {headers:{'Content-Type':'text/html; charset=utf-8'}});
}
