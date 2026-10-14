import {topics} from './examples.js';
import {componentGroups} from './documentation.js';

// These are trusted, documentation-owned HTML strings. Keep each specimen's
// label, radio, disclosure and popover relationships independent on one page.
export function fixtureHTML(html, prefix, base) {
 const ids=new Map([...html.matchAll(/\sid=(['"])(.*?)\1/g)].map(match=>[match[2],`${prefix}-${match[2]}`]));
 const destination=`${prefix}-destination`;
 let fallback=false;
 html=html.replaceAll('__BASE__',base).replace(/\s(id|for|aria-labelledby|aria-describedby|aria-controls|aria-details|aria-owns|popovertarget|commandfor|list|name)=(['"])(.*?)\2/g, (match,attribute,quote,value)=>{
  const replacement=attribute==='name'?`${prefix}-${value}`:value.split(/\s+/).map(token=>ids.get(token)||token).join(' ');
  return ` ${attribute}=${quote}${replacement}${quote}`;
 });
 html=html.replace(/\s(href|xlink:href)=(['"])#(.*?)\2/g,(match,attribute,quote,value)=>{
  if(value==='page-top')return match;
  const target=ids.get(value);
  if(!target)fallback=true;
  return ` ${attribute}=${quote}#${target||destination}${quote}`;
 }).replace(/url\(#([^)]+)\)/g,(match,id)=>`url(#${ids.get(id)||id})`);
 // Anchor names are local to their fixture; framework token names are shared.
 html=html.replace(/--(?!re-)([\w-]+)/g,(_,name)=>`--${prefix}-${name}`);
 // No application backend: submitting a specimen runs native validation then
 // navigates back here. Native dialog forms keep their close behaviour.
 html=html.replace(/<form\b([^>]*)>/g,(match,attributes)=>{
  if(/\bmethod=(['"])dialog\1/.test(attributes))return match;
  const rest=attributes.replace(/\s(?:action|method)=(['"])[\s\S]*?\1/g,'');
  return `<form${rest} method="get" action="${base}guide/manual-test/#${prefix}">`;
 });
 if(fallback)html+=`<p id="${destination}" class="manual-destination"><small>Example link destination. Use the documentation link above for implementation guidance.</small></p>`;
 return html;
}

export const manualTopics=componentGroups.flatMap(group=>group.slugs.map(slug=>topics.find(topic=>topic.slug===slug)).filter(Boolean));
export const exampleCount=manualTopics.reduce((count,topic)=>count+topic.examples.filter(example=>example.render!==false).length,0);
export const longText='A component must remain readable when the content grows beyond the short labels used in a typical demonstration. This paragraph includes several sentences so you can inspect wrapping, spacing, rhythm, selection, line height and the relationship between neighbouring controls. Resize the window, zoom the page and read this with your preferred font and contrast settings.';
export const longWord='VeryLongUnbrokenIdentifier'.repeat(8);
