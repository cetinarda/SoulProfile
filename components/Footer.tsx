import Link from 'next/link';

const LINKS = [
  { href: '/premium', label: 'Premium' },
  { href: '/glossary', label: 'Kavramlar' },
  { href: '/about', label: 'Hakkımızda' },
  { href: '/support', label: 'Destek' },
  { href: '/privacy', label: 'Gizlilik' },
  { href: '/terms', label: 'Koşullar' },
  { href: '/settings', label: 'Ayarlar' },
];

export function Footer() {
  return (
    <footer className="border-t border-panelBorder px-5 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 text-gold">
            <span>✦</span>
            <span className="text-xs font-bold tracking-[0.3em]">SOULPROFILE</span>
          </Link>
          <nav className="flex flex-wrap gap-x-5 gap-y-2">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="text-xs text-muted hover:text-ink">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <p className="mt-5 text-[11px] leading-relaxed text-faint">
          Eğlence ve farkındalık amaçlıdır. Tıbbi, psikolojik veya finansal tavsiye yerine geçmez.
          Verin sende kalır, istediğin zaman silebilirsin. © {new Date().getFullYear()} SoulProfile.
        </p>
      </div>
    </footer>
  );
}
