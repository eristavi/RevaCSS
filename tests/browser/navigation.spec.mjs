import { test, expect } from '@playwright/test';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const menu = page => page.getByRole('navigation', { name: 'Main navigation', exact: true });
const summary = (nav, label) => nav.locator('summary').filter({ hasText: new RegExp('^' + label + '$') });

test.describe('native navigation without runtime JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('desktop supports three levels, native sibling exclusivity, and independent instances', async ({ page }) => {
    await page.goto('/preview/menu/light/');
    const nav = menu(page);
    await expect(summary(nav, 'Menu')).toBeHidden();
    await expect(nav.getByRole('link', { name: 'Home', exact: true })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Top menu', exact: true })).toBeHidden();
    for (const label of ['Products', 'Frameworks', 'Components']) await summary(nav, label).click();
    await expect(nav.getByRole('link', { name: 'Top menu', exact: true })).toBeVisible();
    await nav.getByRole('link', { name: 'Top menu', exact: true }).click();
    await expect(page).toHaveURL(/#navigation$/);
    await page.getByRole('navigation', { name: 'Right-to-left example' }).locator('summary').filter({ hasText: /^Products$/ }).click();
    await expect(nav.locator('.menu-items > li > details').first()).toHaveAttribute('open', '');
    await summary(nav, 'Resources').click();
    await expect(nav.locator('.menu-items > li > details').first()).not.toHaveAttribute('open');
    await expect(nav.getByRole('link', { name: 'Top menu', exact: true })).toBeHidden();
  });

  test('keyboard focus never enters a closed submenu and nested summaries operate with Enter and Space', async ({ page }) => {
    await page.goto('/preview/menu/light/');
    const nav = menu(page);
    await nav.getByRole('link', { name: 'Home', exact: true }).focus();
    await page.keyboard.press('Tab');
    await expect(summary(nav, 'Products')).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(summary(nav, 'Resources')).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Enter');
    await page.keyboard.press('Tab');
    await expect(nav.getByRole('link', { name: 'All products' })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(summary(nav, 'Frameworks')).toBeFocused();
    await page.keyboard.press('Space');
    await page.keyboard.press('Tab');
    await expect(nav.getByRole('link', { name: 'CSS foundation' })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(summary(nav, 'Components')).toBeFocused();
    await page.keyboard.press('Enter');
    await page.keyboard.press('Tab');
    await expect(nav.getByRole('link', { name: 'Top menu', exact: true })).toBeFocused();
    expect(await nav.getByRole('link', { name: 'Top menu', exact: true }).evaluate(el => getComputedStyle(el).outlineStyle)).not.toBe('none');
  });

  test('mobile toggles, preserves nested state and reflows at 320 pixels', async ({ page }) => {
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
    for (const el of await nav.locator('a:visible, summary:visible').all()) expect((await el.boundingBox()).height).toBeGreaterThanOrEqual(44);
    await summary(nav, 'Menu').click();
    await expect(nav.getByRole('link', { name: 'Top menu', exact: true })).toBeHidden();
    await summary(nav, 'Menu').click();
    await expect(nav.getByRole('link', { name: 'Top menu', exact: true })).toBeVisible();
    await summary(nav, 'Menu').focus();
    await page.keyboard.press('Space');
    await expect(nav.getByRole('link', { name: 'Home', exact: true })).toBeHidden();
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.activeElement.closest('.menu-items') === null)).toBe(true);
  });

  test('resizing restores visible desktop links without duplicate navigation or scripts', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/preview/menu/light/');
    const nav = menu(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    await expect(nav.getByRole('link', { name: 'Home', exact: true })).toBeVisible();
    await expect(summary(nav, 'Menu')).toBeHidden();
    await page.setViewportSize({ width: 375, height: 800 });
    await expect(nav.getByRole('link', { name: 'Home', exact: true })).toBeHidden();
    await expect(nav.locator('.menu-items')).toHaveCount(1);
    expect(await page.locator('script').count()).toBe(0);
  });

  test('desktop panels stay inside a narrow navigation surface in both directions', async ({ page }) => {
    await page.setViewportSize({ width: 800, height: 900 });
    await page.goto('/preview/menu/light/');
    for (const name of ['Main navigation', 'Right-to-left example']) {
      const nav = page.getByRole('navigation', { name, exact: true });
      await nav.evaluate(el => { el.style.maxInlineSize = '22rem'; });
      await summary(nav, 'Products').click();
      for (const label of ['Frameworks', 'Components']) await summary(nav, label).click();
      const panel = await nav.locator('.menu-items > li > details > .menu-panel').first().boundingBox();
      const box = await nav.boundingBox();
      expect(panel.x).toBeGreaterThanOrEqual(box.x - 1);
      expect(panel.x + panel.width).toBeLessThanOrEqual(box.x + box.width + 1);
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
      const inside = document.querySelector('header');
      inside.classList.add('reva');
    });
    await expect(summary(menu(page), 'Menu')).toBeHidden();
    await expect(summary(page.getByRole('navigation', { name: 'Right-to-left example' }), 'Menu')).toBeVisible();
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
      if (!(await toggle.evaluate(el => el.parentElement.open))) await toggle.click();
    }
    const result = await page.evaluate(async () => await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] } }));
    expect(result.violations.map(v => ({ id: v.id, targets: v.nodes.map(n => n.target) }))).toEqual([]);
  }
});

test('user preferences keep the menu readable and omit it from print', async ({ page }) => {
  await page.goto('/preview/menu/auto/');
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce', forcedColors: 'active' });
  await summary(menu(page), 'Products').click();
  expect(await summary(menu(page), 'Products').evaluate(el => getComputedStyle(el, '::after').borderInlineEndWidth)).toBe('2px');
  expect(await summary(menu(page), 'Products').evaluate(el => getComputedStyle(el).transitionDuration)).toBe('0s');
  await page.emulateMedia({ media: 'print', forcedColors: 'none' });
  await expect(menu(page)).toBeHidden();
});
