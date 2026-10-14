import {expect} from '@playwright/test';

// The opening animation can start after the first query in a script-free
// context. Require settled animations and successive stable layout readings.
// Firefox anchor snapshots can expose stale computed opacity/transform values;
// use the live rectangle that the browser also uses for pointer interactions.
export async function waitForPopover(panel) {
  let stable=0,previous;
  await expect.poll(async()=>{
    const current=await panel.evaluate(el=>{
      const rect=el.getBoundingClientRect();
      return {open:el.matches(':popover-open'),running:el.getAnimations().some(a=>a.playState==='running'),bounds:[rect.x,rect.y,rect.width,rect.height]};
    });
    const same=previous && current.bounds.every((value,i)=>Math.abs(value-previous.bounds[i])<.01);
    stable=current.open && !current.running && same?stable+1:0;
    previous=current;
    return stable;
  },{message:'popover animations and layout have settled'}).toBeGreaterThanOrEqual(2);
}

// A native details-content transition can still be revealing its descendants
// after summary activation. Observe native visibility and layout before a
// programmatic focus probe; never disable motion or force an open state.
export async function waitForDisclosure(panel) {
  let stable=0,previous;
  await expect.poll(async()=>{
    const current=await panel.evaluate(el=>{
      const rect=el.getBoundingClientRect();
      return {open:el.open,visible:getComputedStyle(el,'::details-content').contentVisibility!=='hidden',
        running:el.getAnimations({subtree:true}).some(a=>a.playState==='running'),
        bounds:[rect.x,rect.y,rect.width,rect.height]};
    });
    const same=previous && current.bounds.every((value,i)=>Math.abs(value-previous.bounds[i])<.01);
    stable=current.open && current.visible && !current.running && same?stable+1:0;
    previous=current;
    return stable;
  },{message:'native disclosure content is visible and its layout has settled'}).toBeGreaterThanOrEqual(2);
}

// Native focus can scroll a long page after focus() resolves. Poll its actual
// geometry before asking the pointer-action probe to schedule animation frames.
export async function waitForControlLayout(control) {
  let previous,stable=0;
  await expect.poll(async()=>{
    const bounds=await control.boundingBox();
    stable=bounds && previous && ['x','y','width','height'].every(key=>Math.abs(bounds[key]-previous[key])<.01)?stable+1:0;
    previous=bounds;
    return stable;
  },{intervals:[100,100,100,200],message:'native focus scrolling and control layout have settled'}).toBeGreaterThanOrEqual(2);
}
