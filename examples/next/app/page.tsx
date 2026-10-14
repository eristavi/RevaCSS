import { Layout, Card, Input, Button, Disclosure } from '@revacss/react';
// Server Component: the adapter needs no use-client boundary for static markup.
export default function Page() {
  return <Layout mainId="next-main">
    <Card header={<h1>RevaCSS in a Server Component</h1>}>
      <Input id="next-email" name="email" label="Email" type="email" defaultValue="example@example.com" hint="Server-rendered native input" readOnly />
      <Button disabled>Demo only</Button>
      <Disclosure summary="Native disclosure">This component uses details and summary without application event handlers.</Disclosure>
    </Card>
  </Layout>;
}
