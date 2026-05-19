import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter, Cormorant_Garamond } from 'next/font/google';
import { TopBar } from '@/components/TopBar';
import { Footer } from '@/components/Footer';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-sans',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'latin-ext'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SoulProfile — Galaktik Karnen',
  description:
    'Doğum bilgilerinden astroloji, Human Design, numeroloji ve yıldız ırkı kökenini içeren galaktik karneni keşfet. Sen sadece insan değilsin.',
  keywords: [
    'astroloji', 'human design', 'numeroloji', 'doğum haritası',
    'yıldız ırkı', 'kuzey ay düğümü', 'starseed', 'galaktik karne',
  ],
  openGraph: {
    title: 'SoulProfile — Galaktik Karnen',
    description:
      'Yıldız kökenini, astrolojik haritanı, Human Design tipini ve bu yaşamdaki görevlerini içeren bir karne.',
    type: 'website',
    locale: 'tr_TR',
  },
};

export const viewport: Viewport = {
  themeColor: '#05060f',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="bg-bg text-ink min-h-screen flex flex-col">
        <TopBar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
