<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAnchorAttributes } from 'svelte/elements';
  interface Props extends HTMLAnchorAttributes { children?: Snippet; element?: HTMLAnchorElement | null; href: string; }
  let { children, element = $bindable(null), href, class: className, ...attributes }: Props = $props();
</script>
<a {...attributes} {href} class={["button", className].filter(Boolean).join(" ")} bind:this={element}>{@render children?.()}</a>
