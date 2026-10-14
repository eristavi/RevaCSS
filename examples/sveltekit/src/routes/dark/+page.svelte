<script lang="ts">
  import Layout from '@revacss/svelte/Layout.svelte';
  import Card from '@revacss/svelte/Card.svelte';
  import Disclosure from '@revacss/svelte/Disclosure.svelte';
</script>
<svelte:head><title>RevaCSS SvelteKit dark page</title></svelte:head>
<Layout mainId="svelte-dark-main">
  <Card><h1>Server-rendered dark page</h1>
    <Disclosure summary="Where is the theme set?">The application server hook sets the document theme during SSR.</Disclosure>
    <a href="/" data-sveltekit-reload>Return to the default page</a>
  </Card>
</Layout>
