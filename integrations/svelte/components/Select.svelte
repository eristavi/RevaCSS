<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLSelectAttributes } from 'svelte/elements';
  import Field from './Field.svelte';
  interface Props extends Omit<HTMLSelectAttributes, 'id' | 'type' | 'value' | 'children' | 'multiple'> { id: string; label: string; hint?: string; error?: string; value: string | number | (string | number)[] | undefined; children?: Snippet; element?: HTMLSelectElement | null; multiple?: boolean; }
  let { id, label, hint, error, value = $bindable(), element = $bindable(null), children, multiple = false, 'aria-describedby': description, 'aria-invalid': invalid, ...attributes }: Props = $props();
  function describedBy() {
    if (multiple && !Array.isArray(value)) throw new Error('Multiple Select requires an array value.');
    if (!multiple && Array.isArray(value)) throw new Error('Single Select requires a scalar value.');
    if (!id?.trim() || /\s/.test(id) || !label?.trim()) throw new Error('Select requires a unique nonempty ID without whitespace and a label.');
    return [...new Set([...(description?.split(/\s+/).filter(Boolean) ?? []), ...(hint ? [`${id}-hint`] : []), ...(error ? [`${id}-error`] : [])])].join(' ') || undefined;
  }
</script>
<Field {id} {label} {hint} {error}>
  {#if multiple}<select {...attributes} {id} aria-describedby={describedBy()} aria-invalid={error ? true : invalid} bind:value bind:this={element} multiple>{@render children?.()}</select>{:else}<select {...attributes} {id} aria-describedby={describedBy()} aria-invalid={error ? true : invalid} bind:value bind:this={element}>{@render children?.()}</select>{/if}
</Field>
