# Veil material — implementation and pending validation

Veil is an optional inherited material (`data-material="veil"`) in `reva.veil.css` and `reva.veil.scoped.css`. Its perimeter diffusion and two inset contours use existing palette, action, semantic and shape tokens. Surface backing defaults to 94%; actions/text controls keep opaque readable backing. No backdrop blur, image texture, JavaScript or new decorative pseudo-element is introduced.

Material scopes now stop at any different explicit material, so Glass and Solid do not paint through Veil boundaries. Veil uses the same boundary rule. Local re-entry remains supported; no palette reset is added.

Core/component API remains unchanged apart from the new material value and optional entry points. Shared fill, borders, depth, density, size, controls and motion apply. Borders set to none remove contours; solid fill removes colour-gradient sheen; More Contrast disables Veil tint/contours and uses opaque backing. System preferences simplify paint; forced colours and print use plain colours. Animated edges remain a separate opt-in decoration.

Documentation includes light/dark previews, navigation, native popovers, form groups, semantic feedback, nested material overrides and scoped installation. The marketing demo offers Veil for all palette/theme/shape combinations and its source download loads the extension. Advanced contrast previews reuse the extension's actual declarations.

## Deferred checks

Only compilation/build is authorized in this phase. No unit/browser tests or visual inspection are claimed. Existing iPhone Glass/edge test results do not establish a Veil pass, and release gates remain open.

CSS compilation and the GitHub Pages-prefix documentation build completed successfully: 311 pages plus 252 complete HTML source endpoints. This is build evidence only.

When tests are requested: check all palettes and themes, local material roots/re-entry in global and scoped builds, card/action contours at every shape/border, outline/ghost semantics, semantic badge/alert variants, invalid/disabled controls, popover entrance motion and tap-through, animated-edge composition, reduced motion/transparency, increased contrast, forced colours, print, and the live customizer's contrast settings. Compare physical iPhone and desktop rendering with the generated concept as design guidance, not a pixel-exact reference.

Next PC session still needs the deferred keyboard focus/restoration, screen-reader, zoom/print and baseline reviews from the device checklist.
