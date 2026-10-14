<script setup lang="ts">
import { ref } from 'vue';
import Layout from '@revacss/vue/Layout.vue';
import Card from '@revacss/vue/Card.vue';
import Alert from '@revacss/vue/Alert.vue';
import Button from '@revacss/vue/Button.vue';
import Link from '@revacss/vue/Link.vue';
import Input from '@revacss/vue/Input.vue';
import Select from '@revacss/vue/Select.vue';
import Textarea from '@revacss/vue/Textarea.vue';
import Disclosure from '@revacss/vue/Disclosure.vue';
import Field from '@revacss/vue/Field.vue';
const email = ref('example@example.com');
const topic = ref('support');
const tags = ref(['feedback']);
const message = ref('Previous text & more');
const error = 'Enter an email address <script>alert(1)</' + 'script>';
</script>
<template>
  <Layout main-id="nuxt-main" data-shape="subtle">
    <Card class="stack">
      <template #header><h1>RevaCSS with Nuxt</h1></template>
      <Alert data-variant="neutral">Source candidate. This form has no submission endpoint.</Alert>
      <p id="email-note">We use your email to reply.</p>
      <form @submit.prevent>
        <Input v-model="email" id="nuxt-email" name="email" label="Email" type="email" hint="Use your work address" :error="error" aria-describedby="email-note" class="email-control" required />
        <Select v-model="topic" id="nuxt-topic" name="topic" label="Topic" hint="Choose one">
          <option value="support">Support</option><option value="feedback">Feedback</option>
        </Select>
        <Select v-model="tags" id="nuxt-tags" name="tags" label="Tags" multiple>
          <option value="support">Support</option><option value="feedback">Feedback</option>
        </Select>
        <Textarea v-model="message" id="nuxt-message" name="message" label="Message" error="Please add a message" rows="4" />
        <Field id="nuxt-updates" label="Receive updates">
          <input id="nuxt-updates" name="updates" type="checkbox" aria-describedby="updates-note" />
        </Field>
        <p id="updates-note">Native checkbox, application-owned state.</p>
        <Button disabled class="outline">Send (demo)</Button>
      </form>
      <Disclosure summary="What does the adapter control?" name="faq">Vue manages application data. RevaCSS manages appearance and native HTML provides disclosure behaviour.</Disclosure>
      <p><NuxtLink to="/dark">Server-rendered dark page</NuxtLink></p>
      <template #footer><Link href="https://github.com/eristavi/RevaCSS" class="outline">Source code</Link></template>
    </Card>
  </Layout>
</template>
