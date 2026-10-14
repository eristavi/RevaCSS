<script setup lang="ts">
import { useId } from 'vue';
import type { HTMLAttributes } from 'vue';
defineOptions({ inheritAttrs: false });
interface Props extends /* @vue-ignore */ HTMLAttributes { mainId?: string; skipLabel?: string; }
const props = defineProps<Props>();
const generatedId = `reva-main-${useId()}`;
</script>
<template>
  <div v-bind="$attrs">
    <a class="skip-link" :href="`#${props.mainId ?? generatedId}`">{{ props.skipLabel ?? 'Skip to content' }}</a>
    <slot name="header" />
    <main :id="props.mainId ?? generatedId" class="container" tabindex="-1"><slot /></main>
    <slot name="footer" />
  </div>
</template>
