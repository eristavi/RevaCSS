import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';

// Run from the repository after npm ci and npm run build:css.
// PLAYWRIGHT_BROWSERS_PATH may point to an existing Playwright installation.
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 1160 }, deviceScaleFactor: 1 });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('requestfailed', request => errors.push(`${request.url()}: ${request.failure()?.errorText}`));
  await page.goto(new URL('./preview.html', import.meta.url).href);
  await page.evaluate(() => document.fonts.ready);
  for (const [name, height, mode] of [['preview', 1160, 'readme'], ['social', 630, 'social']]) {
    await page.setViewportSize({ width: 1200, height });
    await page.locator('body').evaluate((element, mode) => element.dataset.export = mode, mode);
    const bounds = await page.locator('main').boundingBox();
    if (bounds.height > height) throw new Error(`${mode} preview exceeds the export height: ${bounds.height}`);
    if (errors.length) throw new Error(errors.join('\n'));
    await page.screenshot({ path: fileURLToPath(new URL(`./revacss-${name}.png`, import.meta.url)) });
    console.log(`Rendered revacss-${name}.png (1200 × ${height})`);
  }
} finally {
  await browser.close();
}
