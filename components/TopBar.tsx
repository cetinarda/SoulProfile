'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import clsx from 'clsx';

const NAV_LINKS = [
  { href: '/', label: 'Ana Sayfa' },
  { href: '/birth', label: 'Karne Oluştur' },
  { href: '/glossary', label: 'Kavramlar' },
  { href: '/about', label: 'Hakkımızda' },
  { href: '/premium', label: 'Premium' },
];

export function TopBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-panelBorder bg-bg/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-4 md:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl text-gold">✦</span>
          <div className="leading-tight">
            <div className="text-[13px] font-bold tracking-[0.3em] text-ink">SOULPROFILE</div>
            <div className="text-[10px] tracking-[0.2em] text-muted">Galaktik Karnen</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((l) => (
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

        <div className="flex items-center gap-3">
          <Link
            href="/birth"
            className="rounded-full bg-gold px-4 py-2 text-xs font-bold tracking-wide text-[#1a0a40] transition-transform hover:scale-105"
          >
            Karnemi Aç
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="text-ink md:hidden"
            aria-label="Menüyü Aç"
          >
            <span className="text-2xl">{open ? '×' : '☰'}</span>
          </button>
        </div>
      </div>

      {open ? (
        <nav className="border-t border-panelBorder bg-bg/95 px-6 py-4 md:hidden">
          <ul className="flex flex-col gap-3">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={clsx(
                    'block text-sm',
                    pathname === l.href ? 'font-bold text-gold' : 'text-muted',
                  )}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
