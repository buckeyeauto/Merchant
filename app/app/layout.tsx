import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import ViewportScale from '@/components/ViewportScale';
import './globals.css';

const outfit = Outfit({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700', '800'] });

export const metadata: Metadata = {
  title: 'Desking Tool',
  description: 'Buckeye Auto Desking Tool',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={outfit.className}><ViewportScale />{children}</body>
    </html>
  );
}
