<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  interface Props extends HTMLButtonAttributes { children?: Snippet; element?: HTMLButtonElement | null; type?: 'button' | 'submit' | 'reset'; }
  let { children, element = $bindable(null), type = 'button', ...attributes }: Props = $props();
</script>
<button {...attributes} {type} bind:this={element}>{@render children?.()}</button>
