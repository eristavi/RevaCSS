<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  interface Props extends HTMLAttributes<HTMLDivElement> { children?: Snippet; element?: HTMLDivElement | null;  }
  let { children, element = $bindable(null), class: className, ...attributes }: Props = $props();
</script>
<div {...attributes} class={["alert", className].filter(Boolean).join(" ")} bind:this={element}>{@render children?.()}</div>
