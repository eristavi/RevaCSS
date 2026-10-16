import {test,expect} from '@playwright/test';
test.use({javaScriptEnabled:false});
for(const scoped of [false,true])test(`hero gradients retain native content, motion controls and material boundaries (${scoped?'scoped':'global'})`,async({page,request})=>{
  const names=scoped?['reva.scoped.css','reva.glass.scoped.css','reva.hero.scoped.css','reva.gradients.scoped.css']:['reva.css','reva.glass.css','reva.hero.css','reva.gradients.css'];
  const sheets=await Promise.all(names.map(async file=>{const response=await request.get('/reva/'+file);expect(response.ok()).toBe(true);return response.text();}));
  await page.emulateMedia({reducedMotion:'no-preference',forcedColors:'none'});await page.setViewportSize({width:320,height:800});
  await page.setContent(`<!doctype html><html lang="en"><head><style>${sheets.join('\n')}#fixture:has(#pause:checked) .gradient-text,#fixture:has(#pause:checked) .gradient-background,#fixture:has(#pause:checked) .gradient-background::before{animation-play-state:paused}</style></head><body><div id="fixture" ${scoped?'class="reva"':''}><label><input id="pause" type="checkbox">Pause gradient animations</label><section class="hero gradient-background" id="hero" data-material="glass" data-theme="dark" data-motion="subtle" aria-labelledby="title"><header><h1 id="title">Build <span class="gradient-text" id="text">something remarkable.</span></h1><p>Native content remains visible and operable.</p><a id="action" class="button" href="#end">Continue</a></header><figure><img width="640" height="360" alt="Landscape" src="/images/example-landscape.svg"></figure></section><section data-material="solid"><section class="hero gradient-background" id="solid" data-theme="light"><span id="accent-probe" style="color:var(--re-primary)"></span><h2>Solid reset</h2></section></section><p id="end">Destination</p></div><span id="outside" class="gradient-text">Outside</span></body></html>`);
  await expect(page.locator('#text')).toHaveText('something remarkable.');
  await expect(page.locator('#text')).toHaveCSS('animation-duration','12s');
  await expect(page.locator('#hero')).toHaveCSS('position','relative');
  expect(await page.locator('#hero').evaluate(el=>getComputedStyle(el,'::before').pointerEvents)).toBe('none');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  if(await page.evaluate(()=>CSS.supports('backdrop-filter','blur(1px)')))expect(await page.locator('#hero').evaluate(el=>getComputedStyle(el).backdropFilter)).not.toBe('none');
  if(await page.evaluate(()=>CSS.supports('backdrop-filter','blur(1px)')||CSS.supports('-webkit-backdrop-filter','blur(1px)'))){
    const hero=page.locator('#hero');
    const original=await hero.evaluate(el=>{el.classList.remove('gradient-background');const image=getComputedStyle(el).backgroundImage;el.classList.add('gradient-background');return image;});
    await expect(hero).toHaveCSS('background-image',original);
    await expect(hero).toHaveCSS('animation-name','re-gradient-drift');
    expect(await hero.evaluate(el=>getComputedStyle(el,'::before').display)).toBe('none');
    const frames=await hero.evaluate(el=>{const animation=el.getAnimations().find(a=>a.animationName==='re-gradient-drift'&&a.effect.target===el);animation.pause();animation.currentTime=0;const start=getComputedStyle(el).backgroundPosition;animation.currentTime=12000;const middle=getComputedStyle(el).backgroundPosition;animation.play();return [start,middle];});
    expect(frames[0]).not.toBe(frames[1]);
  }
  await expect(page.locator('#solid')).toHaveCSS('backdrop-filter','none');
  const solid=page.locator('#solid');
  const before=()=>solid.evaluate(el=>getComputedStyle(el,'::before').backgroundImage);
  expect(await before()).toContain('255, 255, 255');
  expect(await before()).toContain(await page.locator('#accent-probe').evaluate(el=>getComputedStyle(el).color));
  expect(await solid.evaluate(el=>getComputedStyle(el,'::before').opacity)).toBe('1');
  expect(await solid.evaluate(el=>getComputedStyle(el,'::before').animationDuration)).toBe('12s');
  await solid.evaluate(el=>el.setAttribute('data-theme','dark'));
  expect(await before()).toContain('0, 0, 0');
  const old=await before();await solid.evaluate(el=>el.setAttribute('data-accent','orange'));expect(await before()).not.toBe(old);

  if(scoped)await expect(page.locator('#outside')).toHaveCSS('animation-name','none');
  await page.getByLabel('Pause gradient animations').check();
  await expect(page.locator('#text')).toHaveCSS('animation-play-state','paused');
  await expect(page.locator('#hero')).toHaveCSS('animation-play-state','paused');
  expect(await page.locator('#hero').evaluate(el=>getComputedStyle(el,'::before').animationPlayState)).toBe('paused');
  await page.getByLabel('Pause gradient animations').uncheck();
  await page.locator('#hero').evaluate(el=>el.setAttribute('data-motion','expressive'));await expect(page.locator('#text')).toHaveCSS('animation-duration','6s');
  await page.locator('#hero').evaluate(el=>el.setAttribute('data-motion','none'));await expect(page.locator('#text')).toHaveCSS('animation-name','none');await expect(page.locator('#hero')).toHaveCSS('animation-name','none');
  await page.locator('#text').evaluate(el=>el.setAttribute('data-motion','subtle'));await expect(page.locator('#text')).toHaveCSS('animation-name','re-gradient-drift');
  await page.emulateMedia({reducedMotion:'reduce'});await expect(page.locator('#text')).toHaveCSS('animation-name','none');await expect(page.locator('#hero')).toHaveCSS('animation-name','none');
  await page.emulateMedia({reducedMotion:'no-preference',forcedColors:'active'});await expect(page.locator('#text')).toHaveCSS('background-image','none');
  expect(await page.locator('#hero').evaluate(el=>getComputedStyle(el,'::before').display)).toBe('none');
  await page.emulateMedia({forcedColors:'none',media:'print'});await expect(page.locator('#text')).toHaveCSS('background-image','none');await expect(page.locator('#text')).toHaveCSS('color','rgb(0, 0, 0)');
});
