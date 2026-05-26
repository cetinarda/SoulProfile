import Link from 'next/link';

const SECTIONS = [
  {
    title: 'Ürün',
    links: [
      { href: '/', label: 'Ana Sayfa' },
      { href: '/birth', label: 'Karne Oluştur' },
      { href: '/history', label: 'Geçmişin' },
      { href: '/premium', label: 'Premium' },
      { href: '/glossary', label: 'Kavramlar' },
    ],
  },
  {
    title: 'Kurum',
    links: [
      { href: '/about', label: 'Hakkımızda' },
      { href: '/support', label: 'Destek' },
      { href: '/contact', label: 'İletişim' },
      { href: '/settings', label: 'Ayarlar' },
    ],
  },
  {
    title: 'Yasal',
    links: [
      { href: '/privacy', label: 'Gizlilik Politikası' },
      { href: '/terms', label: 'Kullanım Koşulları' },
      { href: '/cookie', label: 'Çerez Politikası' },
      { href: '/data', label: 'Veri Talepleri' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-panelBorder bg-bg/95 px-6 pb-8 pt-12 md:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2 text-gold">
            <span className="text-lg">✦</span>
            <span className="text-sm font-bold tracking-[0.3em]">SOULPROFILE</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-ink">
            Sen sadece insan değilsin — galaktik bir karnen var.
          </p>
          <p className="mt-4 text-xs leading-relaxed text-faint">
            Eğlence ve farkındalık amaçlıdır. Tıbbi, psikolojik veya finansal tavsiye yerine
            geçmez. Doğum verilerin yalnızca karnenin üretilmesi için kullanılır ve istediğin
            zaman silinebilir.
          </p>
        </div>

        {SECTIONS.map((s) => (
          <div key={s.title}>
            <div className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-ink">
              {s.title}
            </div>
            <ul className="space-y-2">
              {s.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-muted hover:text-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-10 flex max-w-6xl flex-wrap items-center justify-between gap-2 border-t border-white/5 pt-5 text-xs text-faint">
        <span>© {new Date().getFullYear()} SoulProfile. Tüm hakları saklıdır.</span>
        <span>Made with ✦ for star children.</span>
      </div>
    </footer>
  );
}
