'use client';

import { useRouter } from 'next/navigation';
import type { ComponentProps, MouseEvent, ReactNode } from 'react';
import NextLink from 'next/link';
import { toDirUrl } from '@/lib/nav';

/**
 * NextLink drop-in — Capacitor iOS statik export uyumlu navigasyon.
 *
 * SORUN: Next App Router'ın <Link>'i (1) boot'ta `/route.txt` RSC payload
 * prefetch ediyor (capacitor://'da 404), (2) click'i SPA için intercept
 * ediyor ama statik export + capacitor:// origin'de soft-navigation
 * çalışmıyor → "buton tıklanıyor, sayfa açılmıyor".
 *
 * ÇÖZÜM: Her zaman düz <a> render et (SSR ve client AYNI → hydration
 * güvenli, prefetch yok). href DAİMA trailing-slash'lı directory URL
 * (`/compatibility/`) — Capacitor WebView handler bunu kesinlikle
 * `compatibility/index.html`'e çözer (slash'sız hali belirsiz).
 *
 *  - Native: onClick erken çıkar → tarayıcının default <a> navigasyonu
 *    tam-sayfa geçiş yapar (WebView handler index.html servis eder).
 *  - Web: onClick preventDefault + router.push(path) → hızlı SPA korunur.
 *    href yine de doğru (sağ-tık / yeni sekme / no-JS çalışır).
 */

type AnchorRest = Omit<
  ComponentProps<typeof NextLink>,
  'href' | 'prefetch' | 'as' | 'children' | 'onClick'
> & {
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  'aria-label'?: string;
  target?: string;
};

function isNativePlatform(): boolean {
  if (typeof window === 'undefined') return false;
  const w = window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } };
  return Boolean(w.Capacitor?.isNativePlatform?.());
}

export function Link({
  href,
  children,
  onClick,
  ...rest
}: {
  href: string;
  children?: ReactNode;
} & AnchorRest) {
  const router = useRouter();
  const dir = toDirUrl(href);

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    onClick?.(e);
    if (e.defaultPrevented) return;
    // orta-tık / modifier → tarayıcı default davranışı
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    // dış link / yeni sekme → dokunma
    if (rest.target === '_blank' || /^https?:|^mailto:|^tel:/.test(href)) return;
    // native: default <a> tam-sayfa navigasyon (WebView handler çözer)
    if (isNativePlatform()) return;
    // web: hızlı SPA
    e.preventDefault();
    router.push(href);
  }

  return (
    <a href={dir} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}
