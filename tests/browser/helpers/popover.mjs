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
