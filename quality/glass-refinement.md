# Glass surface refinement — development record

First phase: supported cards, navigation/panels, fieldsets, disclosures, dialogs and popovers use 32% surface tint, blur(12px) saturate(145%), directional surface lighting and inherited depth-aware outer/inset shadows.

The existing data-material=glass API and component markup are unchanged. Shared shape, borders, fill, depth, theme/palette and local material boundaries retain their roles. Core depth tokens carry an additional glass shadow value; flat uses none. No new pseudo-elements are consumed by the material, preserving animated-edge decoration.

Buttons, badges and supporting small surfaces retain 90% backing. Text fields and switches retain existing backing. Controls are a later visual refinement.

Unsupported backdrop filters retain opaque core surfaces. Reduced transparency and increased contrast use opaque paint; forced colours and print remove decorative lighting.

CSS and documentation compilation only. Automated tests, browser and device checks remain deferred per user instruction. Existing iPhone results do not cover this change. When requested, validate light/dark backgrounds, text contrast, nested surfaces, popovers, depth/border/fill overrides, solid/Veil boundaries and re-entry, animated edges, preference modes and fallback/performance.
