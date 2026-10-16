import {test,expect} from '@playwright/test';
test.use({javaScriptEnabled:false});

for(const sheet of ['reva.css','reva.min.css','reva.scoped.css','modular']) {
  test(`native textarea growth, cap, reset and CSS opt-out (${sheet})`,async({page,request})=>{
    const names=sheet==='modular'?['reva.tokens.css','reva.base.css']:[sheet];
    const styles=await Promise.all(names.map(async name=>{
      const response=await request.get('/reva/'+name);
      expect(response.ok()).toBe(true);
      return response.text();
    }));
    await page.setViewportSize({width:375,height:900});
    await page.setContent(`<!doctype html><html lang="en"><style>${styles.join('\n')}</style><body>
      <form class="reva" style="max-inline-size:320px">
        <label for="growing">Notes</label><textarea id="growing" name="notes" rows="4">Initial notes</textarea>
        <label for="ordinary">Ordinary notes</label><textarea id="ordinary" rows="4" style="field-sizing:fixed;max-block-size:none"></textarea>
        <button type="reset">Reset</button>
      </form>
      <label for="outside">Outside</label><textarea id="outside"></textarea>
    </body></html>`);
    const field=page.getByRole('textbox',{name:'Notes',exact:true});
    await expect(field).toHaveCSS('resize','vertical');
    const height=()=>field.evaluate(el=>el.getBoundingClientRect().height);
    const initial=await height();
    const ordinary=await page.locator('#ordinary').evaluate(el=>el.getBoundingClientRect().height);
    const supported=await page.evaluate(()=>CSS.supports('field-sizing','content'));
    await field.fill(Array.from({length:12},(_,i)=>`Line ${i}`).join('\n'));
    if(supported) {
      await expect.poll(height).toBeGreaterThan(initial);
      await expect(field).toHaveCSS('field-sizing','content');
      await expect(page.locator('#ordinary')).toHaveCSS('field-sizing','fixed');
      if(sheet==='reva.scoped.css')await expect(page.locator('#outside')).toHaveCSS('field-sizing','fixed');
      for(const dir of ['ltr','rtl']) {
        await field.evaluate((el,dir)=>el.dir=dir,dir);
        await field.fill('Long notes with wrapping text. '.repeat(300));
        expect(await height()).toBeLessThanOrEqual(384);
        expect(await field.evaluate(el=>el.scrollHeight>el.clientHeight)).toBe(true);
        expect(await field.evaluate(el=>el.scrollWidth<=el.clientWidth+1)).toBe(true);
      }
      await field.evaluate(el=>el.style.maxBlockSize='12rem');
      await expect.poll(height).toBeLessThanOrEqual(192);
      await field.fill('Short');
      await expect.poll(height).toBe(initial);
    } else {
      expect(await height()).toBe(initial);
      expect(await field.evaluate(el=>el.scrollHeight>el.clientHeight)).toBe(true);
    }
    expect(await page.locator('#ordinary').evaluate(el=>el.getBoundingClientRect().height)).toBe(ordinary);
    await page.getByRole('button',{name:'Reset',exact:true}).click();
    await expect(field).toHaveValue('Initial notes');
    await expect.poll(height).toBe(initial);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  });
}
