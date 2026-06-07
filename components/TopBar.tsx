'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import clsx from 'clsx';
import { useT } from '@/lib/i18n';
import { LanguageToggle } from './LanguageToggle';
import { ThemeToggle } from './ThemeToggle';

export function TopBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { t } = useT();

  const navLinks = [
    { href: '/birth', label: t('nav.birth') },
    { href: '/compatibility', label: t('nav.compatibility') },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-panelBorder/60 bg-bg/55 backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl text-gold">✦</span>
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
          <Link
            href="/birth"
            className="hidden rounded-full bg-gold px-4 py-2 text-xs font-bold tracking-wide text-[#1a0a40] transition-transform hover:scale-105 sm:inline-block"
          >
            {t('cta.openCard')}
          </Link>
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
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
