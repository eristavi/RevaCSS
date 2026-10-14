<script setup lang="ts">
import type { ButtonHTMLAttributes } from 'vue';
defineOptions({ inheritAttrs: false });
interface Props extends /* @vue-ignore */ ButtonHTMLAttributes { type?: 'button' | 'submit' | 'reset'; }
defineProps<Props>();
</script>
<template><button v-bind="$attrs" :type="type ?? 'button'"><slot /></button></template>
