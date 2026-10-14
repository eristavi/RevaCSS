<script setup lang="ts">
import { useHead } from '#imports';
useHead({
  title: 'RevaCSS Nuxt starter',
  htmlAttrs: { lang: 'en', 'data-theme': 'auto', 'data-font': 'system' },
  meta: [{ name: 'description', content: 'RevaCSS native components rendered by Nuxt' }]
});
</script>
<template><NuxtPage /></template>
