<script setup lang="ts">
import { cloneVNode, isVNode, useAttrs, useSlots } from 'vue';
import type { VNode } from 'vue';
import type { SelectHTMLAttributes } from 'vue';
import Field from './Field.vue';
defineOptions({ inheritAttrs: false });
interface Props extends /* @vue-ignore */ SelectHTMLAttributes {
  id: string; label: string; hint?: string; error?: string; 
}
const props = defineProps<Props>();
const model = defineModel<string | number | (string | number)[]>({ required: true });
const attrs = useAttrs();
const slots = useSlots();
// Options rendered through slots need explicit selected state in SSR HTML.
function options(nodes: VNode[]): VNode[] {
  return nodes.map(node => {
    if (!isVNode(node)) return node;
    if (node.type === 'option') {
      const value = node.props?.value ?? (typeof node.children === 'string' ? node.children : '');
      const multiple = attrs.multiple !== undefined && attrs.multiple !== false;
      const selected = multiple && Array.isArray(model.value) ? model.value.some(item => String(item) === String(value)) : String(model.value) === String(value);
      return cloneVNode(node, { selected });
    }
    if (Array.isArray(node.children)) {
      const copy = cloneVNode(node);
      copy.children = options(node.children as VNode[]);
      return copy;
    }
    return node;
  });
}
const Options = () => options(slots.default?.() ?? []);
function invalid(): true | false | 'true' | 'false' | 'grammar' | 'spelling' | undefined {
  if (props.error) return true;
  const value = attrs['aria-invalid'];
  return value === true || value === false || value === 'true' || value === 'false' || value === 'grammar' || value === 'spelling' ? value : undefined;
}
function describedBy() {
  if (!props.id?.trim() || !props.label?.trim()) throw new Error('Select requires a unique nonempty id and label.');
  return [attrs['aria-describedby'], props.hint && `${props.id}-hint`, props.error && `${props.id}-error`].filter(Boolean).join(' ') || undefined;
}
</script>
<template>
  <Field :id="props.id" :label="props.label" :hint="props.hint" :error="props.error">
    <select v-bind="$attrs" v-model="model" :id="props.id" :aria-describedby="describedBy()" :aria-invalid="invalid()"><Options /></select>
  </Field>
</template>
