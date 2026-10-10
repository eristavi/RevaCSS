import {test,expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const paint=locator=>locator.evaluate(el=>{const s=getComputedStyle(el);return Object.fromEntries(['backgroundColor','backgroundImage','boxShadow','backdropFilter','color','borderRadius','borderTopWidth'].map(k=>[k,s[k]]));});
const css=(page,id,key)=>page.locator(id).evaluate((el,key)=>getComputedStyle(el)[key],key);
const alpha=locator=>locator.evaluate(el=>{const c=document.createElement('canvas').getContext('2d');c.fillStyle=getComputedStyle(el).backgroundColor;c.fillRect(0,0,1,1);return c.getImageData(0,0,1,1).data[3];});
async function fixture(page,markup,{scoped=false,minified=false,modular=false,materialSource}={}) {
  let styles=modular?(await Promise.all(['tokens','base','components'].map(name=>readFile(`dist/reva.${name}.css`,'utf8')))).join('\n'):await readFile(`dist/reva.${scoped?'scoped.':minified?'min.':''}css`,'utf8');
  for(const name of ['glass','veil','soft','button-materials'])styles+='\n'+(name==='button-materials'&&materialSource?materialSource:await readFile(`dist/reva.${name}${scoped?'.scoped':''}.css`,'utf8'));
  await page.setContent(`<!doctype html><html lang="en" data-theme="light"><head><title>Button material fixture</title><style>${styles}</style></head><body>${scoped?`<main class="reva" data-theme="light">${markup}</main><button data-button-material="liquid" id="outside">Outside</button>`:`<main>${markup}</main>`}</body></html>`);

}
for(const bundle of ['global','minified','scoped','modular'])test(`${bundle}: inheritance, local reset and action-only paint`,async({page})=>{
  await fixture(page,`<section data-material="soft" data-button-material="liquid" data-motion="none"><article class="card" id="card">Card</article><input id="field" aria-label="Text"><button id="inherited">Liquid</button><input type="button" id="input" value="Input"><input type="submit" id="submit" value="Submit"><input type="reset" id="reset" value="Reset"><a class="button" id="link" href="#card">Link</a><a class="scroll-top" id="top" href="#card">Top</a><button id="solid" data-button-material="solid">Solid</button><button id="default" data-button-material="default">Default</button><section data-material="glass"><button id="across">Across general boundary</button><section data-button-material="default"><button id="follow">Follow glass</button><button id="reentry" data-button-material="liquid">Re-enter</button></section></section></section><section data-material="soft"><article class="card" id="baseline-card">Card</article><input id="baseline-field" aria-label="Text baseline"><button id="baseline-button">Baseline</button></section>`,{scoped:bundle==='scoped',minified:bundle==='minified',modular:bundle==='modular'});
  for(const id of ['inherited','input','submit','reset','link','top','across','reentry'])expect((await paint(page.locator('#'+id))).backdropFilter,id).toContain('14px');
  expect((await paint(page.locator('#solid'))).backdropFilter).toBe('none');
  expect(await alpha(page.locator('#solid'))).toBe(255);
  expect(await paint(page.locator('#default'))).toEqual(await paint(page.locator('#baseline-button')));
  expect((await paint(page.locator('#follow'))).backdropFilter).toContain('12px');
  expect(await paint(page.locator('#card'))).toEqual(await paint(page.locator('#baseline-card')));
  expect(await paint(page.locator('#field'))).toEqual(await paint(page.locator('#baseline-field')));
  if(bundle==='scoped')expect((await paint(page.locator('#outside'))).backdropFilter).toBe('none');
});
test('default and omitted values preserve existing materials exactly',async({page})=>{
  await fixture(page,['solid','glass','veil','soft'].map(material=>`<section data-material="${material}"><button id="${material}">Existing</button><button id="${material}-default" data-button-material="default">Default</button></section>`).join(''));
  const before={};for(const material of ['solid','glass','veil','soft']){before[material]=await paint(page.locator('#'+material));expect(await paint(page.locator('#'+material+'-default'))).toEqual(before[material]);}
  await fixture(page,['solid','glass','veil','soft'].map(material=>`<section data-material="${material}"><button id="${material}">Existing</button></section>`).join(''),{materialSource:'/* no action module */'});
  for(const material of ['solid','glass','veil','soft'])expect(await paint(page.locator('#'+material))).toEqual(before[material]);
});
test('six finishes retain shape, size and depth settings',async({page})=>{
  await fixture(page,['default','solid','glass','veil','soft','liquid'].map(material=>`<section data-button-material="${material}" data-size="large" data-shape="pill" data-border="defined"><button id="${material}">Primary</button><button class="outline" id="${material}-outline">Outline</button></section>`).join(''));
  for(const material of ['default','solid','glass','veil','soft','liquid']){
    expect(await css(page,'#'+material,'fontSize')).toBe('18px');expect(await css(page,'#'+material,'borderRadius')).toBe('999px');expect(await css(page,'#'+material,'borderTopWidth')).toBe('2px');
    expect(await alpha(page.locator('#'+material+'-outline'))).toBe(0);
  }
  expect((await paint(page.locator('#veil'))).backgroundImage).toContain('radial-gradient');
  expect((await paint(page.locator('#soft'))).boxShadow).toContain('4px');
  await page.locator('#soft').evaluate(el=>el.dataset.depth='flat');expect((await paint(page.locator('#soft'))).boxShadow).not.toContain('4px');
});
for(const scoped of [false,true])test(`${scoped?'scoped':'global'} materials preserve navigation normal, hover and pressed paint`,async({page})=>{
  const values=['default','solid','glass','veil','soft','liquid'];
  const markup=values.map(material=>`<section data-material="glass" data-button-material="${material}" data-motion="none"><nav class="top-menu" aria-label="${material}"><button class="menu-toggle" id="menu-${material}">Menu</button><button class="menu-toggle" id="customize-${material}" data-button-material="${material}">Customize</button><ul class="dropdown"><li><button id="dropdown-${material}">More</button></li></ul></nav><button id="action-${material}">Continue</button></section>`).join('');
  const snapshot=()=>page.locator('.top-menu button').evaluateAll(elements=>elements.map(el=>{const s=getComputedStyle(el);return {id:el.id,...Object.fromEntries(['backgroundColor','backgroundImage','color','borderColor','boxShadow','backdropFilter','filter','transform','scale'].map(key=>[key,s[key]]))};}));
  for(const theme of ['light','dark']){
    const load=async materialSource=>{await fixture(page,markup,{scoped,materialSource});await page.locator(scoped?'.reva':'html').evaluate((el,theme)=>el.dataset.theme=theme,theme);await page.mouse.move(0,0);};
    await load('/* no action module */');const normal=await snapshot(),hover={},pressed={};
    for(const material of values){const button=page.locator('#menu-'+material);await button.hover();hover[material]=await paint(button);await page.mouse.down();pressed[material]=await paint(button);await page.mouse.up();}
    await load();await page.mouse.move(0,0);expect(await snapshot()).toEqual(normal);
    for(const material of values){const button=page.locator('#menu-'+material);await button.hover();expect(await paint(button),theme+'/'+material+' hover').toEqual(hover[material]);await page.mouse.down();expect(await paint(button),theme+'/'+material+' press').toEqual(pressed[material]);await page.mouse.up();}
    expect((await paint(page.locator('#action-liquid'))).backdropFilter).toBe('blur(14px)');
  }
});
for(const scoped of [false,true])test(`${scoped?'scoped':'global'} Liquid remains neutral and transparent across palettes and variants`,async({page})=>{
  const variants=['primary','success','warning','danger','neutral'];
  const markup=['light','dark'].flatMap(theme=>['default','mono','sand','ocean','cobalt','citrus','violet','forest'].map(palette=>`<section data-theme="${theme}" data-palette="${palette}" data-button-material="liquid" data-motion="none">${variants.map(variant=>`<button data-variant="${variant}">${variant}</button>`).join('')}<button class="secondary">Secondary</button><button class="outline danger">Outline</button><button class="ghost">Ghost</button></section>`)).join('');
  await fixture(page,markup,{scoped});
  const samples=await page.locator('section button').evaluateAll(elements=>{const c=document.createElement('canvas').getContext('2d');return elements.map(el=>{const s=getComputedStyle(el),section=el.closest('section'),theme=section.dataset.theme;c.clearRect(0,0,1,1);c.fillStyle=s.backgroundColor;c.fillRect(0,0,1,1);return {theme,plain:el.matches('.outline,.ghost'),rgba:[...c.getImageData(0,0,1,1).data],image:s.backgroundImage,filter:s.backdropFilter,color:s.color,text:getComputedStyle(section).color};});});
  for(const sample of samples){
    expect(sample.color).toBe(sample.text);
    if(sample.plain){expect(sample.rgba[3]).toBe(0);expect(sample.filter).toBe('none');continue;}
    expect(Math.max(...sample.rgba.slice(0,3))-Math.min(...sample.rgba.slice(0,3))).toBeLessThanOrEqual(1);
    expect(sample.rgba[3]).toBeGreaterThan(0);expect(sample.rgba[3]).toBeLessThan(40);
    expect(sample.filter).toBe('blur(14px)');expect(sample.image).toContain('radial-gradient');
  }
  for(const theme of ['light','dark'])expect(new Set(samples.filter(s=>s.theme===theme&&!s.plain).map(s=>JSON.stringify([s.rgba,s.image]))).size).toBe(1);
});
for(const motion of ['none','subtle','expressive'])test(`liquid ${motion}: pointer and keyboard press, release and disabled states`,async({page})=>{
  await fixture(page,`<section data-button-material="liquid" data-motion="${motion}"><button id="press">Press</button><button id="disabled" disabled>Disabled</button><button id="aria" aria-disabled="true">Unavailable</button><button id="toggle" aria-pressed="true">Selected</button></section>`);
  const button=page.locator('#press'),expected=motion==='none'?[1,1]:motion==='subtle'?[1.025,1.015]:[1.045,1.02];
  const settled=async()=>{await expect.poll(async()=>{const value=await css(page,'#press','scale');const parts=value==='none'?[1,1]:value.split(' ').map(Number);return parts.length===1?[parts[0],parts[0]]:parts;}).toEqual(expected);};
  await button.hover();await page.mouse.down();await settled();expect(await css(page,'#press','transform')).toBe('none');await page.mouse.up();await expect.poll(()=>css(page,'#press','scale')).toBe('none');
  await button.focus();await page.keyboard.down('Space');
  // Native :active on keyboard press differs by engine/platform. Verify the
  // CSS follows that native state, while Space activation remains available.
  if(await button.evaluate(el=>el.matches(':active')))await settled();
  else expect(await css(page,'#press','scale')).toBe('none');
  await page.keyboard.up('Space');await expect.poll(()=>css(page,'#press','scale')).toBe('none');
  expect(await css(page,'#press','transitionDuration')).toBe(motion==='none'?'0s, 0s, 0s':motion==='subtle'?'0.28s, 0.14s, 0.14s':'0.48s, 0.24s, 0.24s');
  for(const id of ['disabled','aria']){await page.locator('#'+id).hover();await page.mouse.down();expect(await css(page,'#'+id,'scale')).toBe('none');await page.mouse.up();}
  expect(await css(page,'#toggle','scale')).toBe('none');
});
for(const scoped of [false,true])test(`${scoped?'scoped':'global'} preferences remove movement and simplify paint; explicit contrast can reset locally`,async({page})=>{
  await fixture(page,'<section data-button-material="liquid" data-motion="expressive" data-contrast="more"><button id="more">More</button><button id="auto" data-contrast="auto">Auto</button></section>',{scoped});
  expect((await paint(page.locator('#more'))).backdropFilter).toBe('none');expect(await alpha(page.locator('#more'))).toBe(255);expect((await paint(page.locator('#auto'))).backdropFilter).toContain('blur');
  // Firefox can retain stale contrast CSS when both preferences are emulated
  // in one protocol request. Separate updates preserve the same final state.
  await page.emulateMedia({contrast:'more'});await page.emulateMedia({reducedMotion:'reduce'});await expect.poll(()=>page.evaluate(()=>matchMedia('(prefers-contrast: more)').matches)).toBe(true);await expect.poll(async()=>(await paint(page.locator('#auto'))).backdropFilter).toBe('none');await expect.poll(()=>alpha(page.locator('#auto'))).toBe(255);
  await page.locator('#auto').hover();await page.mouse.down();expect(await css(page,'#auto','scale')).toBe('none');expect(await css(page,'#auto','transitionDuration')).toBe('0s');await page.mouse.up();
  await page.emulateMedia({contrast:'no-preference',reducedMotion:'no-preference',forcedColors:'active'});expect((await paint(page.locator('#auto'))).boxShadow).toBe('none');expect((await paint(page.locator('#auto'))).backdropFilter).toBe('none');
  await page.emulateMedia({forcedColors:'none',media:'print'});expect((await paint(page.locator('#auto'))).backgroundColor).toBe('rgb(255, 255, 255)');expect((await paint(page.locator('#auto'))).color).toBe('rgb(0, 0, 0)');
});
for(const scoped of [false,true])test(`${scoped?'scoped':'global'} initial system contrast keeps Liquid variants opaque and neutral`,async({page})=>{
  await page.emulateMedia({contrast:'more'});
  await fixture(page,'<section data-button-material="liquid"><button id="primary">Primary</button><button id="secondary" class="secondary">Secondary</button><button id="danger" data-variant="danger">Delete</button><button id="auto" data-contrast="auto">Local auto</button></section>',{scoped});
  for(const id of ['primary','secondary','danger','auto']){
    const button=page.locator('#'+id);expect(await alpha(button)).toBe(255);const p=await paint(button);
    expect(p.backdropFilter).toBe('none');expect(p.backgroundImage).toBe('none');expect(p.color).toBe('rgb(17, 17, 17)');
    expect(await button.evaluate(el=>{const c=document.createElement('canvas').getContext('2d');c.fillStyle=getComputedStyle(el).backgroundColor;c.fillRect(0,0,1,1);return [...c.getImageData(0,0,1,1).data];})).toEqual([255,255,255,255]);
  }
});
for(const mode of ['unsupported','reduced-transparency'])test(`${mode}: opaque fallback without backdrop effects`,async({page})=>{
  let source=await readFile('dist/reva.button-materials.css','utf8');
  // Exercise feature/preference branches deterministically. This is not a claim
  // that the host OS exposes reduced transparency to every browser engine.
  source=mode==='unsupported'?source.replaceAll('@supports ((backdrop-filter:blur(1px)) or (-webkit-backdrop-filter:blur(1px)))','@supports (reva-unsupported:yes)').replaceAll('@supports (transition-timing-function:linear(0,1))','@supports (reva-unsupported:yes)'):source.replaceAll('(prefers-reduced-transparency:reduce)','(min-width:0px)');
  await fixture(page,'<section data-button-material="liquid"><button id="liquid">Liquid</button></section><button id="glass" data-button-material="glass">Glass</button>',{materialSource:source});
  for(const id of ['liquid','glass']){expect(await alpha(page.locator('#'+id))).toBe(255);expect((await paint(page.locator('#'+id))).backdropFilter).toBe('none');}
  if(mode==='unsupported')expect(await css(page,'#liquid','transitionTimingFunction')).toContain('cubic-bezier');
});
test('all finishes and semantic variants pass automated accessibility in light and dark',async({page})=>{
  test.setTimeout(120000);
  await fixture(page,'<h1>Button material accessibility</h1>');
  await page.evaluate(()=>{for(const theme of ['light','dark'])for(const material of ['default','solid','glass','veil','soft','liquid'])for(const palette of ['default','mono','sand','ocean','cobalt','citrus','violet','forest']){
    const section=document.createElement('section');Object.assign(section.dataset,{theme,buttonMaterial:material,palette});section.style.padding='1rem';section.style.background='var(--re-bg)';section.innerHTML=`<h2>${theme} ${material} ${palette}</h2><button>Primary</button><button class="secondary">Secondary</button><button class="outline">Outline</button><button class="ghost">Ghost</button><button data-variant="danger">Delete</button><button data-variant="warning">Warning</button><button data-variant="success">Success</button>`;document.querySelector('main').append(section);
  }});
  await page.addScriptTag({path:require.resolve('axe-core')});
  const violations=await page.evaluate(async()=>(await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}})).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})));
  expect(violations).toEqual([]);
});
test('customizer applies and restores button materials before hover',async({page})=>{
  await page.goto('/components/buttons/');
  await page.getByRole('button',{name:'Customize',exact:true}).click();
  const toggle=page.getByRole('button',{name:'Customize',exact:true}),menuPaint=await paint(toggle);
  const action=page.locator('#main .example-demo button').first();
  for(const material of ['liquid','soft','glass','veil','solid','default']){
    await page.locator('#demo-button-material').selectOption(material);expect(await paint(toggle),material+' menu').toEqual(menuPaint);const live=await paint(action);await page.reload();await expect.poll(()=>paint(action),{message:material}).toEqual(live);await page.getByRole('button',{name:'Customize',exact:true}).click();
  }
  await page.locator('#demo-button-material').selectOption('liquid');await page.goto('/components/app-shell/');
  await expect(page.locator('html')).toHaveAttribute('data-button-material','liquid');
  await expect.poll(()=>page.locator('iframe.example-isolated').first().evaluate(frame=>frame.contentDocument.documentElement.dataset.buttonMaterial)).toBe('liquid');
});
test('CSS-only customizer changes button finish and links still activate',async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();
  await page.goto('/demos/blog/');await page.getByRole('button',{name:'Customize',exact:true}).click();
  // Compare the same pointer state: WebKit updates :hover after selectOption.
  await page.mouse.move(0,0);
  const toggle=page.getByRole('button',{name:'Customize',exact:true}),menuPaint=await paint(toggle);
  await page.locator('#demo-button-material').selectOption('liquid');await page.mouse.move(0,0);
  await expect.poll(()=>paint(toggle)).toEqual(menuPaint);
  const action=page.locator('#demo-site .button:not(.outline,.ghost)').first();await expect.poll(async()=>(await paint(action)).backdropFilter).toContain('14px');
  await page.locator('#demo-button-material').selectOption('solid');await expect.poll(async()=>(await paint(action)).backdropFilter).toBe('none');
  await page.locator('#demo-customizer-popup').getByRole('button',{name:'Close',exact:true}).click();await expect(page.locator('#demo-customizer-popup')).toBeHidden();await action.click();expect(page.url()).not.toMatch(/\/demos\/blog\/$/);await context.close();
});

test('rendered filled-button label backgrounds retain 4.5:1 contrast',async({page})=>{
  test.setTimeout(120000);await page.setViewportSize({width:1280,height:900});
  await fixture(page,'<main id="swatches"></main>');
  await page.addStyleTag({content:'#swatches{display:grid;grid-template-columns:repeat(8,1fr)}.swatch{padding:12px;background:var(--re-bg)}.swatch button{display:block;width:100%;margin:8px 0}'});
  const samples=await page.evaluate(()=>{
    const ctx=document.createElement('canvas').getContext('2d'),samples=[];
    for(const theme of ['light','dark'])for(const material of ['solid','glass','veil','soft','liquid'])for(const palette of ['default','mono','sand','ocean','cobalt','citrus','violet','forest']){
      const section=document.createElement('section');section.className='swatch';Object.assign(section.dataset,{theme,buttonMaterial:material,palette,motion:'none'});
      for(const variant of ['primary','success','warning','danger','neutral','secondary']){
        const button=document.createElement('button');button.textContent='Label';if(variant==='secondary')button.className='secondary';else button.dataset.variant=variant;section.append(button);
      }
      document.querySelector('#swatches').append(section);
      for(const button of section.querySelectorAll('button')){
        ctx.clearRect(0,0,1,1);ctx.fillStyle=getComputedStyle(button).color;ctx.fillRect(0,0,1,1);const foreground=[...ctx.getImageData(0,0,1,1).data].slice(0,3);
        const r=button.getBoundingClientRect();samples.push({name:[theme,material,palette,button.dataset.variant||'secondary'].join('/'),foreground,points:[.25,.5,.75].flatMap(x=>[.4,.6].map(y=>[Math.round(r.x+r.width*x),Math.round(r.y+r.height*y)]))});
        // Preserve semantic gradient variables while removing glyphs from the
        // screenshot so the actual backing under the label can be measured.
        button.style.color='transparent';
      }
    }
    return samples;
  });
  const png=await page.screenshot({fullPage:true,animations:'disabled',scale:'css'});
  const failures=await page.evaluate(async({url,samples})=>{
    const img=new Image();img.src=url;await img.decode();const canvas=document.createElement('canvas');canvas.width=img.width;canvas.height=img.height;const ctx=canvas.getContext('2d');ctx.drawImage(img,0,0);
    const luminance=rgb=>rgb.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);
    const failures=[];for(const sample of samples){const foreground=luminance(sample.foreground);for(const [x,y] of sample.points){const backing=luminance([...ctx.getImageData(x,y,1,1).data].slice(0,3));const ratio=(Math.max(foreground,backing)+.05)/(Math.min(foreground,backing)+.05);if(ratio<4.5)failures.push({name:sample.name,ratio,point:[x,y]});}}
    return failures;
  },{url:'data:image/png;base64,'+png.toString('base64'),samples});
  expect(failures).toEqual([]);
});

test('button-material guide remains accessible with enlarged text and RTL',async({page})=>{
  await page.goto('/themes/button-materials/');
  await page.addScriptTag({path:require.resolve('axe-core')});
  const violations=await page.evaluate(async()=>(await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}})).violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})));
  expect(violations).toEqual([]);
  await page.setViewportSize({width:320,height:900});
  for(const direction of ['ltr','rtl']){
    await page.locator('html').evaluate((el,direction)=>{el.dir=direction;el.style.fontSize='200%';},direction);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  }
});
