import { expect } from '@playwright/test';

// Documentation may include its optional settings helper. Native interaction
// tests still disable JavaScript; reject any additional browser runtime here.
export async function expectOnlyOptionalSettings(page) {
  const scripts = await page.locator('script').evaluateAll(elements => elements.map(element => ({
    id: element.id, type: element.type, src: element.getAttribute('src'), content: element.textContent.trim(),
  })));
  expect(scripts.filter(script => script.id === 'reva-settings-schema')).toHaveLength(1);
  expect(scripts.filter(script => script.id === 'reva-settings-runtime')).toHaveLength(1);
  for (const script of scripts) {
    if (script.id === 'reva-settings-schema') {
      expect(script.type).toBe('application/json');
      expect(script.src).toBeNull();
      expect(JSON.parse(script.content)).toHaveProperty('values');
    } else if (script.id === 'reva-settings-runtime') {
      expect(script.src).toMatch(/(?:^|\/)settings\.js\?v=[^?]+$/);
      expect(script.content).toBe('');
    } else {
      expect(script.src).toBeNull();
      expect(script.content).toMatch(/^window\.RevaSettings\?\.init(?:Customizer|Theme)\(\);$/);
    }
  }
}
