import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter, Cormorant_Garamond } from 'next/font/google';
import { TopBar } from '@/components/TopBar';
import { Footer } from '@/components/Footer';
import { PromoBanner } from '@/components/PromoBanner';

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
  title: 'SoulProfile — Doğduğunda yıldızlar sana ne söylüyordu?',
  description:
    'Batı astrolojisi, Vedik harita, Çin yıldız çarkı, Maya Tzolkin, Kelt ağacı, Human Design, numeroloji ve yıldız ırkı sentezi. Sen sadece insan değilsin.',
  keywords: [
    'astroloji', 'vedik astroloji', 'çin astrolojisi', 'maya takvimi',
    'human design', 'numeroloji', 'doğum haritası', 'yıldız ırkı',
    'kuzey ay düğümü', 'starseed', 'galaktik karne', 'kozmik kimlik',
  ],
  openGraph: {
    title: 'Doğduğunda yıldızlar sana ne söylüyordu?',
    description:
      'Çok-sistem astrolojiden sentezlenen tek bir kozmik kimliğin. Batı + Vedik + Çin + Maya + Kelt + Human Design + Numeroloji + Yıldız Irkı.',
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
        <PromoBanner />
        <TopBar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
