import {test,expect} from '@playwright/test';
import {topics} from '../../docs/src/data/examples.js';
test.use({javaScriptEnabled:false});

for(const build of ['global','minified','scoped']) {
  test(`native image lightbox composition without application scripts (${build})`,async({page,request})=>{
    const scoped=build==='scoped',suffix=scoped?'.scoped':'';
    const names=[scoped?'reva.scoped.css':build==='minified'?'reva.min.css':'reva.css',`reva.motion${suffix}.css`,`reva.glass${suffix}.css`];
    let origin;
    const css=await Promise.all(names.map(async name=>{
      const r=await request.get('/reva/'+name);expect(r.ok()).toBe(true);
      origin=new URL('/',r.url()).href;return r.text();
    }));
    const examples=topics.find(t=>t.slug==='media').examples.filter(e=>e.id.startsWith('image-lightbox'));
    expect(examples).toHaveLength(2);
    await page.setViewportSize({width:375,height:850});
    await page.setContent(`<!doctype html><html lang="en"><style>${css.join('\n')}</style><body>
      <main ${scoped?'class="reva"':''} data-ratio="square" data-fit="cover">
        ${examples.map(e=>`<section id="${e.id}">${e.html.replaceAll('__BASE__',origin)}</section>`).join('\n')}
      </main>
    </body></html>`);
    // A real file link and a visible thumbnail remain usable without commands.
    for(const example of examples){
      const region=page.locator('#'+example.id);
      await expect(region.locator('button[command="show-modal"] img')).toBeVisible();
      const href=await region.getByRole('link').getAttribute('href');
      const file=await request.get(href);expect(file.ok()).toBe(true);
    }
    test.skip(!await page.evaluate(()=>'commandForElement' in HTMLButtonElement.prototype),'Native invoker commands unavailable; direct image links remain the alternative.');
    for(const example of examples){
      const region=page.locator('#'+example.id),opener=region.locator('button[command="show-modal"]');
      const dialog=region.locator('dialog'),image=dialog.locator('img');
      for(const dir of ['ltr','rtl']){
        await page.locator('main').evaluate((el,dir)=>el.dir=dir,dir);
        await opener.click();await expect(dialog).toBeVisible();
        await expect(dialog).toHaveAccessibleName('Illustrated hills — full image view');
        await expect(dialog.getByRole('button',{name:'Close image',exact:true})).toBeFocused();
        const close=dialog.getByRole('button',{name:'Close image',exact:true});
        await expect(close.locator('svg')).toHaveAttribute('aria-hidden','true');
        await expect(close).toHaveCSS('background-color','rgba(0, 0, 0, 0)');
        await expect(close).toHaveCSS('border-top-width','0px');
        await expect(close).toHaveCSS('box-shadow','none');
        await expect(close).toHaveCSS('backdrop-filter','none');
        const target=await close.boundingBox();expect(target.width).toBeGreaterThanOrEqual(44);expect(target.height).toBeGreaterThanOrEqual(44);
        await expect.poll(()=>dialog.evaluate(el=>el.getAnimations().filter(a=>a.playState==='running').length)).toBe(0);
        await expect(image).toHaveCSS('aspect-ratio','auto');await expect(image).toHaveCSS('object-fit','contain');
        await expect.poll(()=>image.evaluate(el=>el.complete && el.naturalWidth>0)).toBe(true);
        const size=await image.boundingBox();expect(size.height).toBeLessThanOrEqual(850*.6+1);
        expect(await dialog.evaluate(el=>el.scrollWidth<=el.clientWidth+1)).toBe(true);
        if(example.glass){
          await expect(dialog).toHaveCSS('color-scheme','dark');
          await expect(dialog).toHaveCSS('transition-duration',/0\.24s/);
          await dialog.evaluate(el=>{el.dataset.material='solid';el.dataset.motion='none';});
          await expect(dialog).toHaveCSS('backdrop-filter','none');await expect(dialog).toHaveCSS('transition-duration','0s');
          await dialog.evaluate(el=>{delete el.dataset.material;delete el.dataset.motion;});
        }
        await dialog.getByRole('button').click();await expect(dialog).toBeHidden();await expect(opener).toBeFocused();
        await opener.click();await expect(dialog).toBeVisible();await page.keyboard.press('Escape');await expect(dialog).toBeHidden();
      }
    }
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.locator('#image-lightbox-effects button[command="show-modal"]').click();
    await expect(page.locator('#glass-photo-dialog')).toHaveCSS('transition-duration','0s');
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  });
}
