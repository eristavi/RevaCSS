import { expect } from '@playwright/test';

// Documentation may include its optional settings helper. Native interaction
// tests still disable JavaScript; reject any additional browser runtime here.
export async function expectOnlyOptionalSettings(page) {
  const scripts = await page.locator('script').evaluateAll(elements => elements.map(element => ({
    id: element.id, type: element.type, src: element.getAttribute('src'), content: element.textContent.trim(),
  })));
  expect(scripts.filter(script => script.id === 'reva-settings-schema')).toHaveLength(1);
  expect(scripts.filter(script => script.id === 'reva-settings-runtime')).toHaveLength(1);
  const jsonIds = new Set(['reva-settings-schema', 'reva-palette-defaults','reva-background-defaults']);
  const runtimes = new Map([
    ['reva-classes-search-runtime','classes-search.js'],
    ['reva-settings-runtime', 'settings.js'],
    ['reva-palette-runtime', 'custom-palette.js'],
    ['reva-radius-runtime', 'custom-radius.js'],
    ['reva-density-runtime', 'custom-density.js'],
    ['reva-background-runtime','custom-backgrounds.js'],
    ['reva-width-runtime', 'custom-width.js'],
  ]);
  for (const script of scripts) {
    if (jsonIds.has(script.id)) {
      expect(script.type).toBe('application/json');
      expect(script.src).toBeNull();
      const data = JSON.parse(script.content);
      if(script.id==='reva-background-defaults'){
        expect(Array.isArray(data)).toBe(true);expect(data).toHaveLength(6);
        for(const colour of data)expect(colour).toMatch(/^#[0-9a-f]{6}$/i);
      }else expect(data).toHaveProperty(script.id === 'reva-settings-schema' ? 'values' : 'light');
    } else if (runtimes.has(script.id)) {
      const url = new URL(script.src, page.url());
      expect(url.origin).toBe(new URL(page.url()).origin);
      expect(url.pathname.split('/').at(-1)).toBe(runtimes.get(script.id));
      expect(url.searchParams.get('v')).toBeTruthy();
      expect(script.content).toBe('');
    } else {
      expect(script.src).toBeNull();
      expect(script.content).toMatch(/^window\.RevaSettings\?\.init(?:Customizer|Theme)\(\);$/);
    }
  }
}
