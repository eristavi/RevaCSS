<script setup lang="ts">
import type { DetailsHTMLAttributes } from 'vue';
defineOptions({ inheritAttrs: false });
interface Props extends /* @vue-ignore */ DetailsHTMLAttributes { summary: string; }
defineProps<Props>();
</script>
<template><details v-bind="$attrs"><summary>{{ summary }}</summary><slot /></details></template>
