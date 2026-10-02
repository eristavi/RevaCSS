# Validation — 2 October 2026

Reviewed the implementation based on main `9078b67fa958283d0e7fe4937ae8d6739cf682b3`, including the seven colour palettes and recent navigation, pagination, tabs and motion changes. This report records automated evidence and remaining manual gates; it does not certify a release.

## Results

| Check | Result |
| --- | --- |
| CSS and documentation build | Passed; 56 static pages |
| Unit checks | 43 passed; no failures or skips |
| Full Chromium suite | 247 passed |
| Full Firefox suite | 247 passed |
| Full WebKit suite | 244 passed; 3 popover test-timing timeouts |
| Rechecks after correcting the timing helper | 54 passed: six affected scenarios, three repetitions in each engine; no failures, skips or flaky results |
| Final browser coverage | All 247 unique cases per engine have passing evidence from the full suite and affected-case rechecks |
| GitHub Pages project-path build and unit checks | Passed at `/RevaCSS/`; 56 pages and 43 unit checks |
| Dependency audit | No known vulnerabilities reported by `npm audit` |
| Core minified gzip size | 11,219 bytes; below the 15 KiB budget |
| Release-quality registry | Blocked: six manual items remain open |

Environment: Node 24.19.0, Playwright 1.63.0; headless Chromium 153.0.8010.0, Firefox 155.0 and WebKit 26.6. These are test builds, not proof of current stable Chrome/Edge, desktop Safari or iOS Safari behaviour. WebKit used locally extracted Ubuntu libraries; Firefox needed the container's content-sandbox workaround. No tests were skipped to accommodate the environment.

Coverage includes all 43 documentation routes at 320/375/1280 CSS pixels with automated accessibility checks; documentation examples matching their displayed HTML; script-free native interactions; seven palettes in light/dark across global, minified, modular and scoped builds; nested themes, palette overrides and solid/glass re-entry; preferences, narrow content and enlarged root-font probes; raster checks for animated edges; navigation highlight stacking and dropdown placement; and pagination state/fallback behaviour.

## Corrections

- Solid exceptions inside a glass scope restored old hard-coded blue colours. Palette declarations now preserve muted text, link and control-border defaults, and solid resets restore the selected palette. New tests cover all seven palettes in both themes, including glass re-entry.
- Mono's dark animated edge used several nearly identical light stops, making movement difficult to see. The gradient now uses the action foreground to retain contrast between stops, with neutral black mixing in light mode. Existing edge raster assertions pass in all three engines.
- Documentation example wrappers used `aria-label` on generic divs. They now have the appropriate group role; the icon examples and expanded documentation accessibility checks pass.
- Existing fixtures referenced the previous default palette, old documentation IDs/menu entries and unversioned asset URLs. Expectations now follow the agreed Mono default and current API, and CSS interception includes asset-version queries. Shared success variants apply to buttons as well as badges; solid outline controls retain their outline style inside a solid material exception.

Popover tests now wait for finished animations and successive stable live rectangles before interacting. The optional motion module is absent from some previews, so the helper also works without entrance animation. This corrects test timing without disabling motion, forcing clicks or adding browser JavaScript to RevaCSS.

Firefox's anchor-positioned computed-style snapshot can retain old/start paint values while the screenshot and live layout show the current state. The theme accessibility check reopens the panel in the chosen theme before running axe. Contrast rules remain enabled. Current-theme screenshots were inspected, but dynamic theme switching still needs real-browser/device review; these snapshots are not approved visual baselines.

## Remaining release gates

Keep `Q-NAV-FOCUS`, `Q-EDGE-DEVICE`, `Q-REAL-DEVICES`, `Q-SCREEN-READERS`, `Q-ZOOM-PRINT` and `Q-VISUAL-BASELINES` open. They require nested focus/assistive-technology review, reproduction on the originally affected edge device, real Safari/iOS/Edge/native-control and glass-performance checks, VoiceOver/NVDA, actual browser zoom and print review, and approved component-state images.

Viewport/font-size probes do not replace actual zoom; axe does not replace screen readers; headless WebKit does not replace an iPhone. Reduced-transparency/unsupported-blur rule substitution tests exercise CSS fallbacks rather than proving operating-system preference integration.

Reproduce in a normal supported development environment:

```sh
npm ci
npm run build
npm test
npx playwright install --with-deps
npm run test:browser
npm audit
REVA_SITE=https://eristavi.github.io REVA_BASE=/RevaCSS/ npm run build:docs
REVA_BASE=/RevaCSS/ npm test
npm run check:release-quality
```

The final command deliberately exits nonzero while the six manual gates remain open. GitHub testing remains manual-only. Package publication stays on hold and `private: true` is preserved.
