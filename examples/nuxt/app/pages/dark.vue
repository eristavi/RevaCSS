<script setup lang="ts">
import { useHead } from '#imports';
import Layout from '@revacss/vue/Layout.vue';
import Card from '@revacss/vue/Card.vue';
import Disclosure from '@revacss/vue/Disclosure.vue';
useHead({ title: 'RevaCSS Nuxt dark page', htmlAttrs: { 'data-theme': 'dark' } });
</script>
<template>
  <Layout main-id="nuxt-dark-main">
    <Card><h1>Server-rendered dark page</h1>
      <Disclosure summary="Where is the theme set?">Nuxt useHead sets data-theme on the document root.</Disclosure>
      <NuxtLink to="/">Return to the default page</NuxtLink>
    </Card>
  </Layout>
</template>
