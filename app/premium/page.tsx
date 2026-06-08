'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { PageLayout } from '@/components/PageLayout';
import { PRODUCT } from '@/lib/payments/skus';
import { startCheckout } from '@/lib/payments/checkout';
import { isCapacitorNative } from '@/lib/platform';
import { grantPremium, hasPremium } from '@/lib/entitlements';
import { initIAP, buyOnNative, restorePurchases } from '@/lib/payments/iap';
import { useT } from '@/lib/i18n';

export default function PremiumPage() {
  const { t, locale } = useT();
  const [working, setWorking] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [owned, setOwned] = useState(false);

  useEffect(() => {
    // Stripe başarı dönüşü → server-side session doğrulaması, sonra premium
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');
    if (sessionId && /^cs_(test|live)_[A-Za-z0-9]+$/.test(sessionId)) {
      fetch(`/api/verify-session?session_id=${encodeURIComponent(sessionId)}`)
        .then((r) => r.json())
        .then((data: { ok?: boolean }) => {
          if (data.ok) {
            grantPremium();
            setOwned(true);
            setInfo(
              locale === 'tr'
                ? 'Ödemen onaylandı. Tam erişim açık.'
                : 'Payment confirmed. Full access unlocked.',
            );
            window.history.replaceState({}, '', '/premium');
          }
        })
        .catch(() => {
          /* sessiz */
        });
    }
    setOwned(hasPremium());
    // iOS Capacitor ortamında RevenueCat init
    initIAP();
  }, [locale]);

  async function buy() {
    setError(null);
    setInfo(null);
    setWorking(true);
    try {
      if (isCapacitorNative()) {
        // iOS / Android — Apple StoreKit / Google Play Billing
        const res = await buyOnNative();
        if (res.ok) {
          setOwned(true);
          setInfo(locale === 'tr' ? 'Tam erişim açıldı.' : 'Full access unlocked.');
        } else if (res.error === 'cancelled') {
          // sessiz iptal
        } else {
          setError(res.error ?? 'Purchase failed');
        }
      } else {
        // Web — Stripe Checkout
        await startCheckout();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error');
    } finally {
      setWorking(false);
    }
  }

  async function onRestore() {
    setError(null);
    setInfo(null);
    setRestoring(true);
    try {
      const res = await restorePurchases();
      if (res.ok) {
        setOwned(true);
        setInfo(locale === 'tr' ? 'Önceki satın alımın geri yüklendi.' : 'Your previous purchase was restored.');
      } else {
        setError(
          res.error === 'No active entitlement to restore'
            ? (locale === 'tr' ? 'Geri yüklenecek aktif bir satın alım bulunamadı.' : 'No active purchase to restore.')
            : (res.error ?? 'Restore failed'),
        );
      }
    } finally {
      setRestoring(false);
    }
  }

  return (
    <PageLayout
      kicker={owned ? (locale === 'tr' ? 'TAM ERİŞİM AÇIK' : 'FULL ACCESS UNLOCKED') : (locale === 'tr' ? 'TAM ERİŞİM' : 'FULL ACCESS')}
      title={locale === 'tr' ? 'Tek seferlik · Abonelik yok' : 'One-time · No subscription'}
      intro={
        owned
          ? (locale === 'tr' ? 'Tam erişimin açık. Sınırsız karne ve ikili uyum karşılaştırması yapabilirsin.' : 'Your full access is unlocked. Enjoy unlimited profiles and compatibility checks.')
          : (locale === 'tr'
              ? 'İlk karnen ve ilk uyum karşılaştırman ücretsiz. Sınırsız erişim için bir kerelik öde — abonelik, gizli ücret yok.'
              : 'Your first profile and first compatibility check are free. Pay once for unlimited access — no subscription, no hidden fees.')
      }
    >
      {error ? (
        <div className="rounded-2xl border border-danger/40 bg-danger/10 p-4 text-sm text-danger">
          {error}
        </div>
      ) : null}

      <div className="rounded-3xl border border-gold/40 bg-gold/[0.05] p-8 md:p-10">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <h2 className="font-display text-3xl text-ink">{PRODUCT.name}</h2>
            <p className="mt-1 text-sm text-muted">{PRODUCT.description}</p>
          </div>
          <div className="text-right">
            <p className="font-display text-4xl text-gold">{PRODUCT.price}</p>
            <p className="text-xs text-muted">/ {PRODUCT.priceTr} · {locale === 'tr' ? 'tek seferlik' : 'one-time'}</p>
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
          disabled={working || owned}
          className="mt-6 w-full rounded-full bg-gold py-4 text-base font-bold tracking-wide text-[#1a0a40] shadow-glow transition-transform hover:scale-[1.02] disabled:opacity-60"
        >
          {owned
            ? (locale === 'tr' ? '✓ Tam erişim açık' : '✓ Full access unlocked')
            : working
            ? (locale === 'tr' ? 'İşleniyor...' : 'Processing...')
            : (locale === 'tr' ? `${PRODUCT.price} öde, tüm erişimi aç` : `Pay ${PRODUCT.price}, unlock everything`)}
        </button>

        {/* Restore Purchases — Apple guideline 3.1.1 zorunluluğu */}
        <button
          type="button"
          onClick={onRestore}
          disabled={restoring || owned}
          className="mt-3 w-full rounded-full border border-panelBorder bg-transparent py-3 text-[12px] font-bold text-muted transition-colors hover:text-ink disabled:opacity-60"
        >
          {restoring
            ? (locale === 'tr' ? 'Geri yükleniyor...' : 'Restoring...')
            : (locale === 'tr' ? 'Önceki satın alımı geri yükle' : 'Restore previous purchase')}
        </button>

        {info ? (
          <p className="mt-3 rounded-lg border border-success/40 bg-success/10 p-2.5 text-center text-[12px] text-success">
            {info}
          </p>
        ) : null}

        <p className="mt-3 text-center text-[11px] text-faint">
          {locale === 'tr'
            ? 'iOS: Apple sistemi ile (App Store). Web: Stripe ile. Tek seferlik · abonelik yok.'
            : 'iOS: Apple system (App Store). Web: Stripe. One-time · no subscription.'}
        </p>
      </div>

      <div className="rounded-2xl border border-panelBorder bg-panel p-6">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">
          {locale === 'tr' ? 'NEDEN TEK FİYAT' : 'WHY ONE PRICE'}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {locale === 'tr'
            ? 'Kimliğin sabittir — bir kez doğdun, bir kez sentezlenir. İlk karnen ve ilk uyum karşılaştırman ücretsiz. Daha fazlası için bir kere öde, sınırsız karne ve karşılaştırma yap.'
            : 'Your identity is fixed — you were born once, synthesized once. Your first profile and first compatibility check are free. For more, pay once and get unlimited profiles and comparisons.'}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/birth"
            className="inline-block rounded-full bg-gold px-6 py-3 text-sm font-bold text-[#1a0a40] shadow-glow"
          >
            {t('home.path1.cta')}
          </Link>
          <Link
            href="/compatibility"
            className="inline-block rounded-full border border-panelBorder px-6 py-3 text-sm text-ink hover:border-gold"
          >
            {t('home.path2.cta')}
          </Link>
        </div>
      </div>

      <p className="text-xs text-faint">
        {locale === 'tr'
          ? "iOS App Store'da peşin $4.99 (yaklaşık 99 ₺) olarak listelenir. Web sürümünde aynı tek seferlik ödeme Stripe ile yapılır. AB ve Türkiye'de 14 gün cayma hakkın saklıdır. "
          : 'On the iOS App Store it is listed as a $4.99 upfront purchase. On web the same one-time payment is made via Stripe. 14-day right of withdrawal applies in the EU and Türkiye. '}
        <Link href="/terms" className="text-gold underline">
          {t('nav.terms')}
        </Link>
        .
      </p>
    </PageLayout>
  );
}
