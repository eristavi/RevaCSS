<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
defineOptions({ inheritAttrs: false });
interface Props extends /* @vue-ignore */ HTMLAttributes {  }
defineProps<Props>();
</script>
<template><article v-bind="$attrs" class="card"><header v-if="$slots.header"><slot name="header" /></header><slot /><footer v-if="$slots.footer"><slot name="footer" /></footer></article></template>
