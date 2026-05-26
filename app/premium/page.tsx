import Link from 'next/link';
import clsx from 'clsx';
import { PageLayout } from '@/components/PageLayout';
import { daysUntilPromoEnd, isLaunchPromoActive } from '@/lib/feature-flags';

export const metadata = { title: 'Premium — SoulProfile' };

const PLANS = [
  { name: 'Cosmic Weekly', price: '$2.99 / hafta', description: '7 günlük transit, biyoritm, mantra ve haftalık taşıma rehberi.' },
  { name: 'Monthly Galactic', price: '$14.99 / ay', description: 'Yeni & dolunay rehberi, ilişki transitleri, kişisel ay grafiği.' },
  { name: 'Solar Return', price: '$19.99 / yıllık', description: 'Doğum gününde 12 ay tema haritası, çeyrek odakları, kapı analizi.' },
  { name: 'Relationship Sync', price: '$9.99 tek seferlik', description: 'Synastry + Human Design ilişki haritası.' },
  { name: 'Premium Bundle', price: '$79 / yıl', description: 'Tümü + sınırsız karne PDF + AI rehber sohbet.', featured: true },
];

export default function Premium() {
  const promoActive = isLaunchPromoActive();
  const days = daysUntilPromoEnd();
  return (
    <PageLayout
      kicker={promoActive ? `LANSMAN PROMOSU · ${days} GÜN` : 'PREMIUM'}
      title={promoActive ? 'Şu an her şey ücretsiz' : 'Karnen sadece başlangıç'}
      intro={
        promoActive
          ? `Lansman dönemi boyunca tüm premium içerikler herkese açık. Kalan ${days} gün — galaktik karneni al, haftalık döngülerini gör, Solar Return haritanı çıkar.`
          : 'Galaktik karne ücretsiz. Premium üyelikle haftalık ve aylık döngülere, ilişki haritana ve Solar Return analizine açılırsın.'
      }
    >
      <div className="grid gap-4 md:grid-cols-2">
        {PLANS.map((p) => (
          <div
            key={p.name}
            className={clsx(
              'rounded-2xl border p-6',
              p.featured
                ? 'border-gold bg-gold/[0.07] md:col-span-2'
                : 'border-panelBorder bg-panel',
            )}
          >
            {p.featured ? (
              <p className="mb-2 text-[10px] font-bold tracking-[0.3em] text-gold">EN POPÜLER</p>
            ) : null}
            <h3 className="font-display text-2xl text-ink">{p.name}</h3>
            <p className="mt-1 text-sm font-bold text-gold">{p.price}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">{p.description}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-gold/40 bg-gold/[0.06] p-6">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">
          {promoActive ? `KALAN ${days} GÜN` : 'YAKINDA'}
        </p>
        <p className="mt-3 text-ink">
          {promoActive
            ? 'Lansman boyunca yukarıdaki planların hepsi ücretsiz açık. Bedavadayken karneni al, premium içeriklerin tadına bak; promo bittikten sonra istediğin planda kalabilirsin.'
            : 'Premium henüz canlıda değil. Free karneni şimdi al; premium açıldığında ilk sen duy diye e-posta listesine kaydolabilirsin.'}
        </p>
        <Link
          href="/birth"
          className="mt-4 inline-block rounded-full bg-gold px-6 py-3 text-sm font-bold text-[#1a0a40] shadow-glow"
        >
          {promoActive ? 'Karnemi Şimdi Aç' : 'Free Karnemi Aç'}
        </Link>
      </div>
    </PageLayout>
  );
}
