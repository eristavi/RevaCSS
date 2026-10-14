<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  interface Props extends HTMLAttributes<HTMLElement> { children?: Snippet; element?: HTMLElement | null; header?: Snippet; footer?: Snippet; }
  let { children, element = $bindable(null), header, footer, class: className, ...attributes }: Props = $props();
</script>
<article {...attributes} class={["card", className].filter(Boolean).join(" ")} bind:this={element}>{#if header}<header>{@render header()}</header>{/if}{@render children?.()}{#if footer}<footer>{@render footer()}</footer>{/if}</article>
