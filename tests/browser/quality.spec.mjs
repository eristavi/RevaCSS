import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
const { blockers } = JSON.parse(await readFile('quality/blockers.json', 'utf8'));
const css = await readFile('dist/reva.css', 'utf8');
const fixture = await readFile('tests/fixtures/quality.html', 'utf8');
const noPageOverflow = async page => {
  const geometry = await page.evaluate(() => ({ viewport: innerWidth, content: document.documentElement.scrollWidth }));
  expect(geometry.content, JSON.stringify(geometry)).toBeLessThanOrEqual(geometry.viewport);
};
async function mount(page, content) {
  await page.setContent(`<!doctype html><html lang="en" data-theme="light"><head><meta name="viewport" content="width=device-width, initial-scale=1"><title>Quality fixture</title><style>${css}</style></head><body>${content}</body></html>`);
}
function knownBlocker(id) {
  const blocker = blockers.find(item => item.id === id);
  if (!blocker) throw new Error(`Missing blocker ${id}`);
  test.info().annotations.push({ type: 'release-blocker', description: `${id}: ${blocker.summary}` });
  // Expected failures keep alpha validation usable; they are NOT acceptance passes.
  // An unexpected pass forces review. Resolve the registry entry with evidence.
  test.fail(blocker.status === 'open', blocker.summary);
}
const long = 'A'.repeat(100);
const stressCases = [
  ['Q-BUTTON-LABEL', `<button type="button">${long}</button>`],
  ['Q-GRID-CONTENT', `<div class="grid"><div>${long}</div><div>Second item</div></div>`],
  ['Q-ROW-CONTENT', `<div class="row"><span>${long}</span><button type="button">Save</button></div>`],
  ['Q-SUMMARY-LABEL', `<details><summary>${long}</summary><p>Content</p></details>`],
];
for (const [id, content] of stressCases) test(`${id}: unbroken content remains inside a narrow page`, async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await mount(page, `<main class="container">${content}</main>`);
  knownBlocker(id);
  await noPageOverflow(page);
});
test('Q-BUTTON-TEXT-SCALE: buttons documentation supports enlarged root text', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto('/components/buttons/');
  await page.evaluate(() => document.fonts.ready);
  await page.locator('html').evaluate(el => el.style.fontSize = '200%');
  knownBlocker('Q-BUTTON-TEXT-SCALE');
  await noPageOverflow(page);
});
for (const direction of ['ltr', 'rtl']) test(`mixed native fixture reflows with text spacing in ${direction}`, async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  try {
    for (const width of [320, 768, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      await mount(page, fixture + '<style>* { line-height:1.5 !important; letter-spacing:.12em !important; word-spacing:.16em !important; } p { margin-block-end:2em !important; }</style>');
      await page.locator('html').evaluate((el, direction) => el.dir = direction, direction);
      await noPageOverflow(page);
      await page.locator('summary').click();
      await expect(page.locator('details')).toHaveAttribute('open', '');
      await page.getByLabel('Receive updates').check();
      await expect(page.getByLabel('Receive updates')).toBeChecked();
      await expect(page.getByRole('button', { name: 'Continue' })).toBeVisible();
      expect(await page.locator('script').count()).toBe(0);
    }
  } finally { await context.close(); }
});

for(const direction of ['ltr','rtl']) test(`action variants and nested labels wrap inside narrow parents in ${direction}`,async({page})=>{
 await page.setViewportSize({width:320,height:900});
 await mount(page,`<main class="container" dir="${direction}"><section class="stack" style="width:180px"><button><span>${long}</span></button><a class="button outline" href="#target">${long}</a><input type="submit" value="${long}" aria-label="Submit"><div class="row"><span>${long}</span></div><div class="grid"><div>${long}</div></div><details><summary>${long}</summary><p id="target">Details</p></details></section></main>`);
 await noPageOverflow(page);
 for(const el of await page.locator('button,a.button,input[type=submit],summary').all()) {
  const box=await el.boundingBox();expect(box.width).toBeLessThanOrEqual(180);expect(box.height).toBeGreaterThanOrEqual(44);
 }
 const wrapped=await page.locator('button').evaluate(el=>el.scrollWidth<=el.clientWidth);
 expect(wrapped).toBe(true);
 await page.locator('summary').click();await expect(page.locator('details')).toHaveAttribute('open','');
});
