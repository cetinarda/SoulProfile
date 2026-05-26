'use client';

import Link from 'next/link';
import clsx from 'clsx';
import { useState } from 'react';
import { PageLayout } from '@/components/PageLayout';
import { daysUntilPromoEnd, isLaunchPromoActive } from '@/lib/feature-flags';
import { SKUS } from '@/lib/payments/skus';
import { startCheckout } from '@/lib/payments/checkout';

export default function PremiumPage() {
  const promoActive = isLaunchPromoActive();
  const days = daysUntilPromoEnd();
  const [working, setWorking] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function buy(skuKey: string) {
    setError(null);
    setWorking(skuKey);
    try {
      await startCheckout(skuKey as never);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Bir hata oldu';
      setError(`${msg}. Lansman bittikten sonra tekrar dene.`);
    } finally {
      setWorking(null);
    }
  }

  return (
    <PageLayout
      kicker={promoActive ? `LANSMAN PROMOSU · ${days} GÜN` : 'PREMIUM'}
      title={promoActive ? 'Şu an her şey ücretsiz' : 'Karnen sadece başlangıç'}
      intro={
        promoActive
          ? `Lansman boyunca tüm premium içerikler herkese açık. Kalan ${days} gün — galaktik karneni al, haftalık döngülerini gör, Solar Return haritanı çıkar.`
          : 'Galaktik karne ücretsiz. Premium üyelikle haftalık ve aylık döngülere, ilişki haritana ve Solar Return analizine açılırsın.'
      }
    >
      {error ? (
        <div className="rounded-2xl border border-danger/40 bg-danger/10 p-4 text-sm text-danger">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {SKUS.map((p) => (
          <div
            key={p.key}
            className={clsx(
              'rounded-2xl border p-6 transition-all',
              p.featured
                ? 'border-gold/60 bg-gold/[0.08] md:col-span-2'
                : 'border-panelBorder bg-panel',
            )}
          >
            {p.featured ? (
              <p className="mb-2 text-[10px] font-bold tracking-[0.3em] text-gold">EN POPÜLER</p>
            ) : null}
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-display text-2xl text-ink">{p.name}</h3>
              <p className="text-base font-bold text-gold">
                {p.price} <span className="text-xs text-muted">/ {p.period}</span>
              </p>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted">{p.description}</p>
            <ul className="mt-4 space-y-1.5 text-sm text-ink">
              {p.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="text-gold">✦</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => buy(p.key)}
              disabled={working !== null}
              className={clsx(
                'mt-5 w-full rounded-full px-6 py-3 text-sm font-bold transition-transform hover:scale-[1.02] disabled:opacity-60',
                p.featured
                  ? 'bg-gold text-[#1a0a40] shadow-glow'
                  : 'border border-gold/50 bg-transparent text-gold hover:bg-gold/10',
              )}
            >
              {working === p.key
                ? 'Yönlendiriliyor...'
                : promoActive
                ? 'Lansmanda ücretsiz · İncele'
                : 'Satın Al'}
            </button>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-gold/40 bg-gold/[0.06] p-6">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">
          {promoActive ? `KALAN ${days} GÜN` : 'YAKINDA'}
        </p>
        <p className="mt-3 text-ink">
          {promoActive
            ? 'Lansman boyunca yukarıdaki planlar ücretsiz açık. Bedavadayken karneni al, premium içeriklerin tadına bak; promo bittikten sonra istediğin planda kalabilirsin.'
            : 'Premium henüz canlıda değil. Free karneni şimdi al; premium açıldığında ilk sen duy diye e-posta listesine kaydolabilirsin.'}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/birth"
            className="inline-block rounded-full bg-gold px-6 py-3 text-sm font-bold text-[#1a0a40] shadow-glow"
          >
            {promoActive ? 'Karnemi Şimdi Aç' : 'Free Karnemi Aç'}
          </Link>
          <Link
            href="/support"
            className="inline-block rounded-full border border-panelBorder px-6 py-3 text-sm text-ink hover:border-gold"
          >
            Sorum Var
          </Link>
        </div>
      </div>

      <p className="text-xs text-faint">
        Abonelikler otomatik yenilenir. İstediğin zaman iptal edebilirsin. iOS aboneliklerini
        Ayarlar → Apple ID → Abonelikler bölümünden, web aboneliklerini Profil sayfanızdan
        yönetebilirsiniz. Detay için{' '}
        <Link href="/terms" className="text-gold underline">
          Kullanım Koşulları
        </Link>
        .
      </p>
    </PageLayout>
  );
}
