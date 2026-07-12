'use client';

import { Link } from '@/components/Link';
import { useEffect, useState } from 'react';
import { PageLayout } from '@/components/PageLayout';
import { PLANS, PREMIUM_FEATURES, type Plan } from '@/lib/payments/skus';
import { startCheckout } from '@/lib/payments/checkout';
import { isCapacitorNative } from '@/lib/platform';
import { grantPremium, hasPremium } from '@/lib/entitlements';
import { initIAP, buyOnNative, restorePurchases } from '@/lib/payments/iap';
import { useT } from '@/lib/i18n';

export default function PremiumPage() {
  const { t, locale } = useT();
  const [working, setWorking] = useState<Plan['key'] | null>(null);
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

  async function buy(plan: Plan) {
    setError(null);
    setInfo(null);
    setWorking(plan.key);
    try {
      if (isCapacitorNative()) {
        const res = await buyOnNative(plan.rcPackageId);
        if (res.ok) {
          setOwned(true);
          setInfo(locale === 'tr' ? 'Tam erişim açıldı.' : 'Full access unlocked.');
        } else if (res.error === 'cancelled') {
          // sessiz iptal
        } else {
          setError(res.error ?? 'Purchase failed');
        }
      } else {
        await startCheckout();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error');
    } finally {
      setWorking(null);
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
      title={locale === 'tr' ? 'Gökyüzünü aç' : 'Unlock your sky'}
      intro={
        owned
          ? (locale === 'tr' ? 'Tam erişimin açık. Yıldızlar artık hiçbir şey saklamıyor.' : 'Your full access is unlocked. The stars hold nothing back now.')
          : (locale === 'tr'
              ? 'Karnen, AI yorumun ve ikili uyum tamamen ücretsiz. Sadece haritandaki yıldız ve gezegenlerin konumu ile hareketi (3D Güneş Sistemi, Yaşam Ağacı, zodyak çemberi) premium.'
              : 'Your profile, AI reading and compatibility are entirely free. Only the position and movement of the stars and planets in your chart (3D Solar System, Tree of Life, zodiac wheel) are premium.')
      }
    >
      {error ? (
        <div className="rounded-2xl border border-danger/40 bg-danger/10 p-4 text-sm text-danger">
          {error}
        </div>
      ) : null}

      <div className="rounded-3xl border border-gold/40 bg-gold/[0.05] p-8 md:p-10">
        <h2 className="font-display text-3xl text-ink">
          {locale === 'tr' ? 'Gökyüzünü aç' : 'Unlock your sky'}
        </h2>
        <p className="mt-1 text-sm text-muted">
          {locale === 'tr'
            ? 'Haritandaki yıldız ve gezegen konumları + hareketi. Diğer her şey ücretsiz.'
            : 'Star & planet positions and movement in your chart. Everything else is free.'}
        </p>

        <ul className="mt-5 grid gap-2">
          {PREMIUM_FEATURES.map((f) => (
            <li key={f} className="flex gap-2 text-sm text-ink">
              <span className="text-gold">✦</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>

        {/* İki plan */}
        <div className="mt-6 space-y-3">
          <button
            type="button"
            onClick={() => buy(PLANS.lifetime)}
            disabled={working !== null || owned}
            className="flex w-full items-center justify-between gap-3 rounded-2xl bg-gold px-6 py-4 text-left font-bold text-[#1a0a40] shadow-glow transition-transform hover:scale-[1.01] disabled:opacity-60"
          >
            <span>
              <span className="block text-base">{locale === 'tr' ? 'Tek Seferlik' : 'One-time'}</span>
              <span className="block text-[11px] font-semibold opacity-70">{locale === 'tr' ? 'ömür boyu erişim' : 'lifetime access'}</span>
            </span>
            <span className="text-xl">{working === 'lifetime' ? '…' : PLANS.lifetime.price}</span>
          </button>

          <button
            type="button"
            onClick={() => buy(PLANS.monthly)}
            disabled={working !== null || owned}
            className="flex w-full items-center justify-between gap-3 rounded-2xl border border-gold/40 bg-transparent px-6 py-4 text-left font-bold text-ink transition-colors hover:border-gold/70 disabled:opacity-60"
          >
            <span>
              <span className="block text-base">{locale === 'tr' ? 'Aylık' : 'Monthly'}</span>
              <span className="block text-[11px] font-semibold text-muted">{locale === 'tr' ? 'istediğin zaman iptal' : 'cancel anytime'}</span>
            </span>
            <span className="text-lg text-gold">{working === 'monthly' ? '…' : `${PLANS.monthly.price} ${locale === 'tr' ? '/ ay' : '/ mo'}`}</span>
          </button>
        </div>

        {owned ? (
          <p className="mt-4 rounded-lg border border-success/40 bg-success/10 p-2.5 text-center text-[12px] text-success">
            {locale === 'tr' ? '✓ Tam erişim açık' : '✓ Full access unlocked'}
          </p>
        ) : null}

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
            ? 'iOS: Apple (App Store). Aylık abonelik istediğin zaman iptal edilebilir.'
            : 'iOS: Apple (App Store). Monthly subscription can be cancelled anytime.'}
        </p>
      </div>

      <div className="rounded-2xl border border-panelBorder bg-panel p-6">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">
          {locale === 'tr' ? 'NELER ÜCRETSİZ' : "WHAT'S FREE"}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {locale === 'tr'
            ? 'Doğum karnen, 9 sistem sentezi, AI Kozmik Anlatın ve sınırsız ikili uyum — hepsi ücretsiz. Sadece haritandaki yıldız/gezegen konumu ve hareketini görmek için premium: tek seferlik ya da aylık.'
            : 'Your birth profile, 9-system synthesis, AI cosmic reading and unlimited compatibility — all free. Premium only unlocks the star/planet positions and movement in your chart: one-time or monthly.'}
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
