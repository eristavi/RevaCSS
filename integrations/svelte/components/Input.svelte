<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLInputAttributes } from 'svelte/elements';
  import Field from './Field.svelte';
  interface Props extends Omit<HTMLInputAttributes, 'id' | 'type' | 'value' | 'children' | 'multiple'> { id: string; label: string; hint?: string; error?: string; value?: string | number | undefined; children?: never; element?: HTMLInputElement | null; type?: 'text' | 'email' | 'password' | 'search' | 'tel' | 'url' | 'number' | 'date' | 'datetime-local' | 'month' | 'week' | 'time'; }
  let { id, label, hint, error, value = $bindable(), element = $bindable(null), children, type = 'text', 'aria-describedby': description, 'aria-invalid': invalid, ...attributes }: Props = $props();
  function describedBy() {
    if (!['text', 'email', 'password', 'search', 'tel', 'url', 'number', 'date', 'datetime-local', 'month', 'week', 'time'].includes(type)) throw new Error('Input supports text-like controls only.');
    if (!id?.trim() || /\s/.test(id) || !label?.trim()) throw new Error('Input requires a unique nonempty ID without whitespace and a label.');
    return [...new Set([...(description?.split(/\s+/).filter(Boolean) ?? []), ...(hint ? [`${id}-hint`] : []), ...(error ? [`${id}-error`] : [])])].join(' ') || undefined;
  }
</script>
<Field {id} {label} {hint} {error}>
  <input {...attributes} {id} aria-describedby={describedBy()} aria-invalid={error ? true : invalid} bind:value bind:this={element} {type} />
</Field>
