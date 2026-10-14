<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
defineOptions({ inheritAttrs: false });
interface Props extends /* @vue-ignore */ HTMLAttributes {  }
defineProps<Props>();
</script>
<template><div v-bind="$attrs" class="alert"><slot /></div></template>
