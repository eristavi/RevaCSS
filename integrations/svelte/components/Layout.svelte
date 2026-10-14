<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  interface Props extends HTMLAttributes<HTMLDivElement> { mainId: string; skipLabel?: string; header?: Snippet; footer?: Snippet; children?: Snippet; element?: HTMLDivElement | null; }
  let { mainId, skipLabel = 'Skip to content', header, footer, children, element = $bindable(null), ...attributes }: Props = $props();
  function target() { if (!mainId?.trim() || /\s/.test(mainId)) throw new Error('Layout requires a unique nonempty mainId without whitespace.'); return mainId; }
</script>
<div {...attributes} bind:this={element}>
  <a class="skip-link" href={`#${target()}`}>{skipLabel}</a>
  {#if header}{@render header()}{/if}
  <main id={mainId} class="container" tabindex="-1">{@render children?.()}</main>
  {#if footer}{@render footer()}{/if}
</div>
