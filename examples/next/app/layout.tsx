import type { ReactNode } from 'react';
import 'revacss';
export const metadata = { title: 'RevaCSS Next.js starter', description: 'Native server-rendered RevaCSS components' };
export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en" data-theme="auto" data-font="system"><body>{children}</body></html>;
}
