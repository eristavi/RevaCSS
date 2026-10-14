<script setup lang="ts">
import type { AnchorHTMLAttributes } from 'vue';
defineOptions({ inheritAttrs: false });
interface Props extends /* @vue-ignore */ AnchorHTMLAttributes { href: string; }
defineProps<Props>();
</script>
<template><a v-bind="$attrs" class="button" :href="href"><slot /></a></template>
