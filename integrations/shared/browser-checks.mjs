import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { chromium, firefox, webkit } from '@playwright/test';

export async function browserChecks({ url, prefix, reactive = true, focusButton = false, multiple = true }) {
  const engines = process.env.REVA_TEST_ENGINE ? [process.env.REVA_TEST_ENGINE] : ['chromium', 'firefox', 'webkit'];
  for (const engine of engines) {
    const browser = await ({ chromium, firefox, webkit })[engine].launch();
    try {
      const page = await browser.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(url);
      const email = page.locator(`#${prefix}-email`);
      await email.fill('checked@example.com');
      if (reactive) await page.locator('#model-email').filter({ hasText: 'checked@example.com' }).waitFor();
      await page.locator(`#${prefix}-topic`).selectOption('feedback');
      if (reactive && prefix !== 'react') await page.locator('#model-topic').filter({ hasText: 'feedback' }).waitFor();
      if (multiple) await page.locator(`#${prefix}-tags`).selectOption(['support', 'feedback']);
      if (reactive && prefix !== 'react') {
        await page.locator('#model-tags').filter({ hasText: 'support,feedback' }).waitFor();
      }
      await page.locator(`#${prefix}-message`).fill('Updated message');
      if (reactive && prefix !== 'react') await page.locator('#model-message').filter({ hasText: 'Updated message' }).waitFor();
      if (focusButton) {
        await page.getByRole('button', { name: 'Focus email' }).click();
        assert.equal(await email.evaluate(node => node === document.activeElement), true, 'Native ref/element focus');
      }
      const disclosure = page.locator('details[name="faq"]');
      await disclosure.locator('summary').click();
      assert.equal(await disclosure.evaluate(node => node.open), true);
      await disclosure.locator('summary').click();
      assert.equal(await disclosure.evaluate(node => node.open), false);
      assert.equal(await page.getByRole('button', { name: 'Send (demo)' }).isDisabled(), true);
      assert.equal(await email.getAttribute('aria-invalid'), 'true');
      await page.addScriptTag({ path: fileURLToPath(new URL('../../node_modules/axe-core/axe.min.js', import.meta.url)) });
      const violations = await page.evaluate(async () => (await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] } })).violations.map(v => ({ id: v.id, targets: v.nodes.map(n => n.target) })));
      assert.deepEqual(violations, [], `${engine} axe violations`);
      for (const width of [320, 375, 768, 1280]) {
        await page.setViewportSize({ width, height: 900 });
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${engine} overflow at ${width}`);
      }
      assert.deepEqual(errors, [], `${engine} client errors`);
      console.log(`Adapter browser checks passed: ${prefix}, ${engine}`);
    } finally {
      await browser.close();
    }
  }
}
