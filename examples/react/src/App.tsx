import { useRef, useState } from 'react';
import { Layout, Card, Alert, Button, Link, Input, Select, Textarea, Disclosure } from '@revacss/react';

export default function App() {
  const emailRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState('example@example.com');
  return <Layout mainId="react-main">
    <Card className="stack" header={<h1>RevaCSS with React</h1>} footer={<Link className="outline" href="https://github.com/eristavi/RevaCSS">Source code</Link>}>
      <Alert data-variant="neutral">Source candidate. This form has no submission endpoint.</Alert>
      <output id="model-email">{email}</output>
      <p id="email-note">We use your email to reply.</p>
      <form onSubmit={event => event.preventDefault()}>
        <Input ref={emailRef} id="react-email" name="email" type="email" label="Email" hint="Use your work address"
          error={'Enter an email address <script>alert(1)</script>'} aria-describedby="email-note" required
          className="email-control" value={email} onChange={event => setEmail(event.target.value)} />
        <Select id="react-topic" name="topic" label="Topic" defaultValue="support" hint="Choose one">
          <option value="support">Support</option><option value="feedback">Feedback</option>
        </Select>
        <Select id="react-tags" name="tags" label="Tags" multiple defaultValue={['feedback']}>
          <option value="support">Support</option><option value="feedback">Feedback</option>
        </Select>
        <Textarea id="react-message" name="message" label="Message" defaultValue="Previous text & more" error="Please add a message" rows={4} />
        <Button type="button" onClick={() => emailRef.current?.focus()}>Focus email</Button>
        <Button className="outline" disabled>Send (demo)</Button>
      </form>
      <Disclosure summary="What does the adapter control?" name="faq">React manages application data. RevaCSS supplies appearance and native HTML supplies disclosure behaviour.</Disclosure>
    </Card>
  </Layout>;
}
