<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLTextareaAttributes } from 'svelte/elements';
  import Field from './Field.svelte';
  interface Props extends Omit<HTMLTextareaAttributes, 'id' | 'type' | 'value' | 'children' | 'multiple'> { id: string; label: string; hint?: string; error?: string; value?: string; children?: never; element?: HTMLTextAreaElement | null;  }
  let { id, label, hint, error, value = $bindable(''), element = $bindable(null), children,  'aria-describedby': description, 'aria-invalid': invalid, ...attributes }: Props = $props();
  function describedBy() {
    if (!id?.trim() || /\s/.test(id) || !label?.trim()) throw new Error('Textarea requires a unique nonempty ID without whitespace and a label.');
    return [...new Set([...(description?.split(/\s+/).filter(Boolean) ?? []), ...(hint ? [`${id}-hint`] : []), ...(error ? [`${id}-error`] : [])])].join(' ') || undefined;
  }
</script>
<Field {id} {label} {hint} {error}>
  <textarea {...attributes} {id} aria-describedby={describedBy()} aria-invalid={error ? true : invalid} bind:value bind:this={element}></textarea>
</Field>
