import { test, expect } from '@playwright/test';
import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
const require = createRequire(import.meta.url);
const menu = page => page.getByRole('navigation', { name: 'Main navigation', exact: true });
const summary = (nav, label) => nav.locator('button.menu-toggle:visible').filter({ hasText: new RegExp('^' + label + '$') });

test.describe('native navigation without runtime JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('desktop supports three levels and opening another menu dismisses the previous stack', async ({ page }) => {
    await page.goto('/preview/menu/light/');
    const nav = menu(page);
    await expect(nav.locator('.menu-collapse')).toBeHidden();
    await expect(nav.getByRole('link', { name: 'Home', exact: true })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Top menu', exact: true })).toBeHidden();
    for (const label of ['Products', 'Frameworks', 'Components']) await summary(nav, label).click();
    await expect(nav.getByRole('link', { name: 'Top menu', exact: true })).toBeVisible();
    await page.keyboard.press('Escape');await page.keyboard.press('Escape');await page.keyboard.press('Escape');
    await page.getByRole('navigation', { name: 'Right-to-left example' }).locator('button.menu-toggle:visible').filter({ hasText: /^Products$/ }).click();
    await expect(nav.locator('.menu-desktop [popover]:popover-open')).toHaveCount(0);
    await summary(nav, 'Resources').click();
    await expect(nav.locator('.menu-desktop > li > .menu-panel:popover-open')).toHaveCount(1);
    await expect(nav.getByRole('link', { name: 'Top menu', exact: true })).toBeHidden();
  });

  test('keyboard focus never enters a closed submenu and nested buttons operate with Enter and Space', async ({ page }) => {
    await page.goto('/preview/menu/light/');
    const nav = menu(page);
    await nav.getByRole('link', { name: 'Home', exact: true }).focus();
    await page.keyboard.press('Tab');
    await expect(summary(nav, 'Products')).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(summary(nav, 'Resources')).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Enter');
    await expect(summary(nav,'Back to main menu')).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(nav.getByRole('link', { name: 'All products' })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(summary(nav, 'Frameworks')).toBeFocused();
    await page.keyboard.press('Space');
    await expect(summary(nav,'Back to Products')).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(nav.getByRole('link', { name: 'CSS foundation' })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(summary(nav, 'Components')).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(summary(nav,'Back to Frameworks')).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(nav.getByRole('link', { name: 'Top menu', exact: true })).toBeFocused();
    expect(await nav.getByRole('link', { name: 'Top menu', exact: true }).evaluate(el => getComputedStyle(el).outlineStyle)).not.toBe('none');
  });

  test('mobile toggles, closes descendants and reflows at 320 pixels', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto('/preview/menu/auto/');
    const nav = menu(page);
    await expect(summary(nav, 'Menu')).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Home', exact: true })).toBeHidden();
    const toggleBefore = await summary(nav, 'Menu').boundingBox();
    await summary(nav, 'Menu').click();
    const toggleAfter = await summary(nav, 'Menu').boundingBox();
    expect(Math.abs(toggleBefore.y - toggleAfter.y)).toBeLessThanOrEqual(1);
    for (const label of ['Products', 'Frameworks', 'Components']) await summary(nav, label).click();
    await expect(nav.getByRole('link', { name: 'Top menu', exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    for (const el of await nav.locator('a:visible, button.menu-toggle:visible').all()) expect((await el.boundingBox()).height).toBeGreaterThanOrEqual(44);
    await summary(nav, 'Menu').click();
    await expect(nav.getByRole('link', { name: 'Top menu', exact: true })).toBeHidden();
    await summary(nav, 'Menu').click();
    await expect(nav.getByRole('link', { name: 'Top menu', exact: true })).toBeHidden();
    await expect(nav.getByRole('link', { name: 'Home', exact: true })).toBeVisible();
    await summary(nav, 'Menu').focus();
    await page.keyboard.press('Space');
    await expect(nav.getByRole('link', { name: 'Home', exact: true })).toBeHidden();
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.activeElement.closest('.menu-items') === null)).toBe(true);
  });

  test('resizing exposes only the active layout without runtime scripts', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/preview/menu/light/');
    const nav = menu(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    await expect(nav.getByRole('link', { name: 'Home', exact: true })).toBeVisible();
    await expect(nav.locator('.menu-collapse')).toBeHidden();
    await page.setViewportSize({ width: 375, height: 800 });
    await expect(nav.getByRole('link', { name: 'Home', exact: true })).toBeHidden();
    await expect(nav.locator('.menu-items:visible')).toHaveCount(0);
    await summary(nav, 'Menu').click();
    await expect(nav.locator('.menu-items:visible')).toHaveCount(1);
    await expect(nav.getByRole('link', { name: 'Home', exact: true })).toHaveCount(1);
    await page.setViewportSize({ width: 1280, height: 900 });
    await expect(nav.locator('.menu-items:visible')).toHaveCount(1);
    await expect(nav.getByRole('link', { name: 'Home', exact: true })).toHaveCount(1);
    expect(await page.locator('script').count()).toBe(0);
  });

  test('desktop panels stay inside the viewport in both directions', async ({ page }) => {
    await page.setViewportSize({ width: 800, height: 900 });
    await page.goto('/preview/menu/light/');
    for (const name of ['Main navigation', 'Right-to-left example']) {
      const nav = page.getByRole('navigation', { name, exact: true });
      await nav.evaluate(el => { el.style.maxInlineSize = '22rem'; });
      await summary(nav, 'Products').click();
      for (const label of ['Frameworks', 'Components']) await summary(nav, label).click();
      for(const panel of await nav.locator('[popover]:popover-open:visible').all()) {
        const box=await panel.boundingBox();
        expect(box.x).toBeGreaterThanOrEqual(0);expect(box.x+box.width).toBeLessThanOrEqual(801);
        expect(box.y).toBeGreaterThanOrEqual(0);expect(box.y+box.height).toBeLessThanOrEqual(901);
      }
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });

  test('long labels and deeply nested content stay within a mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto('/preview/menu/light/');
    const nav = menu(page);
    await summary(nav, 'Menu').click();
    for (const label of ['Products', 'Frameworks', 'Components']) await summary(nav, label).click();
    await nav.getByRole('link', { name: 'Top menu', exact: true }).evaluate(el => { el.textContent = 'A-very-long-unbroken-navigation-label-for-testing-layout'; });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });

  test('scoped navigation leaves ordinary outside navigation untouched', async ({ page }) => {
    await page.goto('/preview/menu/light/');
    await page.evaluate(() => {
      const stylesheet = document.querySelector('link[href$="reva.css"]');
      stylesheet.href = stylesheet.href.replace('reva.css', 'reva.scoped.css');
      const inside = document.querySelector('nav[aria-label="Main navigation"]');
      inside.classList.add('reva');
    });
    await expect(summary(menu(page), 'Menu')).toBeHidden();
    await expect(summary(page.getByRole('navigation', { name: 'Right-to-left example' }), 'Menu')).toBeVisible();
    await summary(menu(page),'Products').click();
    await expect(menu(page).locator('[popover]:popover-open')).toHaveCount(1);
  });

  for(const width of [1280,375]) test(`outside click and Escape dismiss nested popovers at ${width}px`,async({page})=>{
    await page.setViewportSize({width,height:900});await page.goto('/preview/menu/light/');
    const nav=menu(page);
    await page.locator('#home').evaluate(el=>{const label=document.createElement('label');label.textContent='Email address';const input=document.createElement('input');input.type='email';label.append(input);el.append(label);});
    if(width<768) await summary(nav,'Menu').click();
    for(const label of ['Products','Frameworks','Components']) await summary(nav,label).click();
    await expect(nav.getByRole('link',{name:'Top menu',exact:true})).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(nav.getByRole('link',{name:'Top menu',exact:true})).toBeHidden();
    await expect(summary(nav,'Components')).toBeVisible();
    await expect(nav.locator('[popover]:popover-open')).toHaveCount(width<768?3:2);
    await summary(nav,'Components').click();
    // A click on a real form field outside the menu both closes the stack
    // and reaches the field: no invisible overlay swallows the interaction.
    const outside=page.getByLabel('Email address');await outside.click();
    await expect(nav.locator('[popover]:popover-open')).toHaveCount(0);
    await expect(outside).toBeFocused();
    if(width<768) {
      await summary(nav,'Menu').click();await summary(nav,'Products').click();
      await summary(nav,'Back to main menu').click();
      await expect(nav.locator('[popover]:popover-open')).toHaveCount(1);
      await summary(nav,'Close menu').click();
      await expect(nav.locator('[popover]:popover-open')).toHaveCount(0);
    }
    expect(await page.locator('script').count()).toBe(0);
  });
  for(const build of ['minified','modular','scoped']) test(`${build} navigation dismisses on outside click in both layouts`,async({page})=>{
    const files=build==='minified'?['reva.min.css']:build==='scoped'?['reva.scoped.css']:['reva.tokens.css','reva.base.css','reva.navigation.css'];
    const stylesheet=(await Promise.all(files.map(name=>readFile('dist/'+name,'utf8')))).join('\n');
    await page.route('**/reva.css',route=>route.fulfill({contentType:'text/css',body:stylesheet}));
    for(const width of [1280,375]) {
      await page.setViewportSize({width,height:900});await page.goto('/preview/menu/light/');
      if(build==='scoped'){await menu(page).evaluate(el=>el.classList.add('reva'));expect(await menu(page).evaluate(el=>getComputedStyle(el).anchorName)).toContain('--preview-navigation');}
      const nav=menu(page);if(width<768)await summary(nav,'Menu').click();
      for(const label of ['Products','Frameworks','Components'])await summary(nav,label).click();
      await expect(nav.getByRole('link',{name:'Top menu',exact:true})).toBeVisible();
      await page.mouse.click(2,800);await expect(nav.locator('[popover]:popover-open')).toHaveCount(0);
    }
  });
  test('popover panels remain usable without CSS anchor positioning',async({page})=>{
    await page.route('**/reva.css',async route=>{const response=await route.fetch();await route.fulfill({response,body:(await response.text()).replace('@supports (position-area: block-end span-inline-start)','@supports (reva-unsupported-anchor: yes)')});});
    await page.goto('/preview/menu/light/');const nav=menu(page);
    for(const label of ['Products','Frameworks','Components']) await summary(nav,label).click();
    const link=nav.getByRole('link',{name:'Top menu',exact:true});await expect(link).toBeVisible();
    const box=await link.boundingBox();expect(box.x).toBeGreaterThanOrEqual(0);expect(box.x+box.width).toBeLessThanOrEqual(1280);
    await page.keyboard.press('Escape');await expect(link).toBeHidden();
  });
});

for (const theme of ['light', 'dark']) test(`${theme} navigation passes automated A/AA checks in closed and expanded states`, async ({ page }) => {
  await page.goto(`/preview/menu/${theme}/`);
  await page.addScriptTag({ path: require.resolve('axe-core') });
  const closed = await page.evaluate(async () => await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] } }));
  expect(closed.violations.map(v => ({ id: v.id, targets: v.nodes.map(n => n.target) }))).toEqual([]);
  for (const width of [1280, 320]) {
    await page.setViewportSize({ width, height: 900 });
    const nav = menu(page);
    if (width < 768) await summary(nav, 'Menu').click();
    for (const label of ['Products', 'Frameworks', 'Components']) {
      const toggle = summary(nav, label);
      if (!(await toggle.evaluate(el => document.getElementById(el.getAttribute('popovertarget')).matches(':popover-open')))) await toggle.click();
    }
    const result = await page.evaluate(async () => await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] } }));
    expect(result.violations.map(v => ({ id: v.id, targets: v.nodes.map(n => n.target) }))).toEqual([]);
  }
});

test('user preferences keep the menu readable and omit it from print', async ({ page }) => {
  await page.goto('/preview/menu/auto/');
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce', forcedColors: 'active' });
  await summary(menu(page), 'Products').click();
  expect(await summary(menu(page), 'Products').evaluate(el => getComputedStyle(el, '::before').borderInlineEndWidth)).toBe('2px');
  expect(await summary(menu(page), 'Products').evaluate(el => getComputedStyle(el).transitionDuration.split(',').every(v=>v.trim()==='0s'))).toBe(true);
  await page.emulateMedia({ media: 'print', forcedColors: 'none' });
  await expect(menu(page)).toBeHidden();
});

