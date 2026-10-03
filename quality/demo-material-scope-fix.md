# Demo material scope correction

The live customiser wraps material CSS in @scope(.demo-workbench). Its generated inner scope repeated .demo-workbench, so it was relative to the outer scope and looked for an additional descendant workbench. The fixed colourful backdrop selector still matched independently, explaining a gradient behind opaque core cards.

Use :scope:has(the checked material radio) .demo-preview as the live material scope root. This repairs Glass, Veil and Solid preview selection in both marketing and dashboard without JavaScript, new classes or attributes. Existing explicit descendant material boundaries remain unchanged.

The marketing hero figure now has transparent backing for Glass, allowing the inner card to reveal the page backdrop. Preferences retain plain backing.

Reference: https://drafts.csswg.org/css-cascade-6/#scope-nesting

Validation: documentation/CSS compilation only. Tests and browser/device checks remain deferred per user instruction. Prior compilation success did not establish correct material rendering; visual review remains required.
