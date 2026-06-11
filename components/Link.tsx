'use client';

import NextLink from 'next/link';
import { useEffect, useState } from 'react';
import type { ComponentProps, ReactNode } from 'react';

/**
 * NextLink drop-in wrapper.
 *
 * SORUN: Next App Router'ın <Link>'i statik export'ta SPA navigation
 * için `/route.txt` RSC payload'ını fetch ediyor. iOS Capacitor'da
 * `capacitor://localhost/compatibility.txt` 404 (dosya `compatibility/index.txt`),
 * Next.js "browser navigation'a düşüyorum" diyor ama gerçek navigasyon
 * her zaman tetiklenmiyor → buton tıklanıyor, sayfa açılmıyor.
 *
 * ÇÖZÜM:
 *  - Web'de: NextLink (SPA hızı korunur), ama prefetch={false} —
 *    boot'taki ".txt prefetch" hataları kaybolur.
 *  - Native'de (mount sonrası): düz <a> tag → WebView native nav yapar,
 *    Capacitor scheme handler `/compatibility` path'ini gördüğünde
 *    `/compatibility/index.html`'i servis eder.
 *
 * SSR/hydration: ilk render'da SSR ve client aynı (NextLink). useEffect
 * mount sonrası native algıladıysa state'i değiştirir → re-render plain
 * `<a>` ile. Hydration mismatch yok.
 */

type NextLinkProps = ComponentProps<typeof NextLink>;
type LinkProps = Omit<NextLinkProps, 'prefetch'> & {
  children?: ReactNode;
};

export function Link({ href, children, ...rest }: LinkProps) {
  const [native, setNative] = useState(false);

  useEffect(() => {
    const w = window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } };
    if (w.Capacitor?.isNativePlatform?.()) setNative(true);
  }, []);

  const path = typeof href === 'string' ? href : href.pathname ?? '/';

  if (native) {
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    return (
      <a href={path} {...(rest as Record<string, unknown>)}>
        {children}
      </a>
    );
  }

  return (
    <NextLink href={href} prefetch={false} {...rest}>
      {children}
    </NextLink>
  );
}
