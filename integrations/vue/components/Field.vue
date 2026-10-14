<script setup lang="ts">
interface Props { id: string; label: string; hint?: string; error?: string; }
defineProps<Props>();
</script>
<template>
  <div class="form-group">
    <label :for="id">{{ label }}</label><slot />
    <small v-if="hint" :id="`${id}-hint`">{{ hint }}</small>
    <small v-if="error" :id="`${id}-error`" class="field-error">{{ error }}</small>
  </div>
</template>
