<script lang="ts">
  import type { Snippet } from 'svelte';
  interface Props { id: string; label: string; hint?: string; error?: string; children?: Snippet; }
  let { id, label, hint, error, children }: Props = $props();
</script>
<div class="form-group">
  <label for={id}>{label}</label>{@render children?.()}
  {#if hint}<small id={`${id}-hint`}>{hint}</small>{/if}
  {#if error}<small id={`${id}-error`} class="field-error">{error}</small>{/if}
</div>
