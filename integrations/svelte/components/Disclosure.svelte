<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLDetailsAttributes } from 'svelte/elements';
  interface Props extends HTMLDetailsAttributes { children?: Snippet; element?: HTMLDetailsElement | null; summary: string; }
  let { children, element = $bindable(null), summary, ...attributes }: Props = $props();
</script>
<details {...attributes} bind:this={element}><summary>{summary}</summary>{@render children?.()}</details>
