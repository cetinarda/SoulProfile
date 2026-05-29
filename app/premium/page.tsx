'use client';

import Link from 'next/link';
import { useState } from 'react';
import { PageLayout } from '@/components/PageLayout';
import { daysUntilPromoEnd, isLaunchPromoActive } from '@/lib/feature-flags';
import { PRODUCT } from '@/lib/payments/skus';
import { startCheckout } from '@/lib/payments/checkout';
import { isCapacitorNative } from '@/lib/platform';

export default function PremiumPage() {
  const promoActive = isLaunchPromoActive();
  const days = daysUntilPromoEnd();
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function buy() {
    setError(null);
    if (isCapacitorNative()) {
      setError('iOS uygulamasında peşin satın alındı, tam erişim zaten açık.');
      return;
    }
    setWorking(true);
    try {
      await startCheckout();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Bir hata oldu');
    } finally {
      setWorking(false);
    }
  }

  return (
    <PageLayout
      kicker={promoActive ? `LANSMAN PROMOSU · ${days} GÜN` : 'TAM ERİŞİM'}
      title={promoActive ? 'Şu an her şey ücretsiz' : 'Tek seferlik · Abonelik yok'}
      intro={
        promoActive
          ? `Lansman boyunca SoulProfile'ın her özelliği herkese açık. Kalan ${days} gün — karneni al, ikili uyumu dene, geçmişini sakla.`
          : 'Bir kerelik ödeyip uygulamaya ömür boyu sahip olursun. Abonelik, gizli ücret veya tekrar eden masraflar yok.'
      }
    >
      {error ? (
        <div className="rounded-2xl border border-danger/40 bg-danger/10 p-4 text-sm text-danger">
          {error}
        </div>
      ) : null}

      <div className="rounded-3xl border border-gold/60 bg-gold/[0.08] p-8">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <h2 className="font-display text-3xl text-ink">{PRODUCT.name}</h2>
            <p className="mt-1 text-sm text-muted">{PRODUCT.description}</p>
          </div>
          <div className="text-right">
            <p className="font-display text-4xl text-gold">{PRODUCT.price}</p>
            <p className="text-xs text-muted">veya {PRODUCT.priceTr} · tek seferlik</p>
          </div>
        </div>

        <ul className="mt-6 grid gap-2 md:grid-cols-2">
          {PRODUCT.features.map((f) => (
            <li key={f} className="flex gap-2 text-sm text-ink">
              <span className="text-gold">✦</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={buy}
          disabled={working || promoActive}
          className="mt-6 w-full rounded-full bg-gold py-4 text-base font-bold tracking-wide text-[#1a0a40] shadow-glow transition-transform hover:scale-[1.02] disabled:opacity-60"
        >
          {promoActive
            ? `Lansmanda ücretsiz · ${days} gün`
            : working
            ? 'Yönlendiriliyor...'
            : `${PRODUCT.price} öde, tüm erişimi aç`}
        </button>

        <p className="mt-3 text-center text-[11px] text-faint">
          Web: Stripe ile ödeme. iOS: peşin satın alındı, ayrı ödeme gerekmez.
        </p>
      </div>

      <div className="rounded-2xl border border-panelBorder bg-panel p-6">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">NEDEN TEK FİYAT</p>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Kimliğin sabittir — bir kez doğdun, bir kez sentezlenir. Sürekli ödeyeceğin bir
          abonelik kurgusu değil bu. Bir kere öde, sahip ol, istediğin kadar karne oluştur
          ve istediğin kadar ikili uyum karşılaştırması yap.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/birth"
            className="inline-block rounded-full bg-gold px-6 py-3 text-sm font-bold text-[#1a0a40] shadow-glow"
          >
            {promoActive ? 'Karnemi Şimdi Aç' : 'Ücretsiz Karneye Bak'}
          </Link>
          <Link
            href="/compatibility"
            className="inline-block rounded-full border border-panelBorder px-6 py-3 text-sm text-ink hover:border-gold"
          >
            İkili Uyumu Dene
          </Link>
        </div>
      </div>

      <p className="text-xs text-faint">
        iOS App Store'da peşin $4.99 (yaklaşık 99 ₺) olarak listelenir. Web sürümünde aynı tek
        seferlik ödeme Stripe ile yapılır. AB ve Türkiye'de 14 gün cayma hakkın saklıdır.
        Detay için{' '}
        <Link href="/terms" className="text-gold underline">
          Kullanım Koşulları
        </Link>
        .
      </p>
    </PageLayout>
  );
}
