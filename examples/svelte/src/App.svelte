<script lang="ts">
  import Layout from '@revacss/svelte/Layout.svelte';
  import Card from '@revacss/svelte/Card.svelte';
  import Alert from '@revacss/svelte/Alert.svelte';
  import Button from '@revacss/svelte/Button.svelte';
  import Link from '@revacss/svelte/Link.svelte';
  import Input from '@revacss/svelte/Input.svelte';
  import Select from '@revacss/svelte/Select.svelte';
  import Textarea from '@revacss/svelte/Textarea.svelte';
  import Disclosure from '@revacss/svelte/Disclosure.svelte';
  import Field from '@revacss/svelte/Field.svelte';
  let email = $state('example@example.com');
  let topic = $state('support');
  let tags = $state(['feedback']);
  let message = $state('Previous text & more');
  let emailElement = $state<HTMLInputElement | null>(null);
  const error = 'Enter an email address <script>alert(1)</' + 'script>';
</script>
<Layout mainId="svelte-main">
  <Card class="stack">
    {#snippet header()}<h1>RevaCSS with Svelte</h1>{/snippet}
    <Alert data-variant="neutral">Source candidate. This form has no submission endpoint.</Alert>
    <output id="model-email">{email}</output>
    <output id="model-topic">{topic}</output>
    <output id="model-tags">{tags.join(',')}</output>
    <output id="model-message">{message}</output>
    <p id="email-note">We use your email to reply.</p>
    <form onsubmit={(event) => event.preventDefault()}>
      <Input bind:value={email} bind:element={emailElement} id="svelte-email" name="email" label="Email" type="email" hint="Use your work address" {error} aria-describedby="email-note" required class="email-control" />
      <Select bind:value={topic} id="svelte-topic" name="topic" label="Topic" hint="Choose one">
        <option value="support">Support</option><option value="feedback">Feedback</option>
      </Select>
      <Select bind:value={tags} id="svelte-tags" name="tags" label="Tags" multiple>
        <option value="support">Support</option><option value="feedback">Feedback</option>
      </Select>
      <Textarea bind:value={message} id="svelte-message" name="message" label="Message" error="Please add a message" rows={4} />
      <Field id="svelte-updates" label="Receive updates"><input id="svelte-updates" type="checkbox" /></Field>
      <Button onclick={() => emailElement?.focus()}>Focus email</Button>
      <Button disabled class="outline">Send (demo)</Button>
    </form>
    <Disclosure summary="What does the adapter control?" name="faq">Svelte manages application state. RevaCSS supplies appearance and native HTML supplies disclosure behaviour.</Disclosure>
    {#snippet footer()}<Link class="outline" href="https://github.com/eristavi/RevaCSS">Source code</Link>{/snippet}
  </Card>
</Layout>
