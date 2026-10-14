<script setup lang="ts">
import { useAttrs } from 'vue';
import type { TextareaHTMLAttributes } from 'vue';
import Field from './Field.vue';
defineOptions({ inheritAttrs: false });
interface Props extends /* @vue-ignore */ TextareaHTMLAttributes {
  id: string; label: string; hint?: string; error?: string; 
}
const props = defineProps<Props>();
const model = defineModel<string>({ required: true });
const attrs = useAttrs();
function invalid(): true | false | 'true' | 'false' | 'grammar' | 'spelling' | undefined {
  if (props.error) return true;
  const value = attrs['aria-invalid'];
  return value === true || value === false || value === 'true' || value === 'false' || value === 'grammar' || value === 'spelling' ? value : undefined;
}
function describedBy() {
  if (!props.id?.trim() || !props.label?.trim()) throw new Error('Textarea requires a unique nonempty id and label.');
  return [attrs['aria-describedby'], props.hint && `${props.id}-hint`, props.error && `${props.id}-error`].filter(Boolean).join(' ') || undefined;
}
</script>
<template>
  <Field :id="props.id" :label="props.label" :hint="props.hint" :error="props.error">
    <textarea v-bind="$attrs" v-model="model" :id="props.id" :aria-describedby="describedBy()" :aria-invalid="invalid()"><slot /></textarea>
  </Field>
</template>
