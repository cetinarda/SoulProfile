'use client';

import { Link } from '@/components/Link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useT } from '@/lib/i18n';
import { hasPremium } from '@/lib/entitlements';
import { LanguageToggle } from './LanguageToggle';
import { ThemeToggle } from './ThemeToggle';
import { BrandMark } from './BrandMark';

export function TopBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [premium, setPremium] = useState(true); // SSR'da gizle, mount'ta karar ver
  const { t, locale } = useT();

  useEffect(() => {
    setPremium(hasPremium());
    // Boot senkronundan (RevenueCat/Supabase) sonra da güncelle
    const id = window.setInterval(() => setPremium(hasPremium()), 2000);
    return () => window.clearInterval(id);
  }, []);

  const buyLabel = locale === 'tr' ? 'Satın Al' : 'Buy';
  const navLinks = [
    { href: '/birth', label: t('nav.birth') },
    { href: '/compatibility', label: t('nav.compatibility') },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-panelBorder/60 bg-bg/55 backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <BrandMark size={20} className="text-gold" />
          <span className="text-[13px] font-bold tracking-[0.3em] text-ink">SOULPROFILE</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={clsx(
                'text-sm transition-colors',
                pathname === l.href ? 'font-bold text-gold' : 'text-muted hover:text-ink',
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageToggle />
          {!premium ? (
            <Link
              href="/premium"
              className="hidden rounded-full bg-gold px-4 py-2 text-xs font-bold tracking-wide text-[#1a0a40] transition-transform hover:scale-105 sm:inline-flex sm:items-center sm:gap-1.5"
            >
              <span>✦</span> {buyLabel}
            </Link>
          ) : (
            <Link
              href="/birth"
              className="hidden rounded-full bg-gold px-4 py-2 text-xs font-bold tracking-wide text-[#1a0a40] transition-transform hover:scale-105 sm:inline-block"
            >
              {t('cta.openCard')}
            </Link>
          )}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="text-2xl text-ink md:hidden"
            aria-label="Menu"
          >
            {open ? '×' : '☰'}
          </button>
        </div>
      </div>

      {open ? (
        <nav className="border-t border-panelBorder bg-bg/95 px-5 py-4 md:hidden">
          <ul className="flex flex-col gap-3">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={clsx('block text-sm', pathname === l.href ? 'font-bold text-gold' : 'text-muted')}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/history" onClick={() => setOpen(false)} className="block text-sm text-muted">
                {t('nav.history')}
              </Link>
            </li>
            {!premium ? (
              <li>
                <Link
                  href="/premium"
                  onClick={() => setOpen(false)}
                  className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-gold px-4 py-2 text-xs font-bold text-[#1a0a40]"
                >
                  <span>✦</span> {buyLabel} · $4.99
                </Link>
              </li>
            ) : null}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
