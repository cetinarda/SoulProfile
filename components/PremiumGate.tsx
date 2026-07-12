'use client';

import { useState } from 'react';
import { CosmicBackground } from './CosmicBackground';
import { useT } from '@/lib/i18n';
import { startCheckout } from '@/lib/payments/checkout';
import { isCapacitorNative } from '@/lib/platform';
import { buyOnNative, restorePurchases } from '@/lib/payments/iap';
import { PLANS, PREMIUM_FEATURES, type Plan } from '@/lib/payments/skus';

export function PremiumGate({
  kind,
  onBack,
  onUnlocked,
}: {
  kind: 'report' | 'compat';
  onBack?: () => void;
  onUnlocked?: () => void;
}) {
  const { t, locale } = useT();
  const [working, setWorking] = useState<Plan['key'] | null>(null);
  const [restoring, setRestoring] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function unlock(plan: Plan) {
    setError(null);
    setWorking(plan.key);
    try {
      if (isCapacitorNative()) {
        const res = await buyOnNative(plan.rcPackageId);
        if (res.ok) {
          onUnlocked?.();
        } else if (res.error && res.error !== 'cancelled') {
          const map: Record<string, string> = {
            IAP_NOT_READY:
              locale === 'tr'
                ? 'Satın alma servisi hazır değil. pod install + cap sync gerekli.'
                : 'Purchase service not ready. Needs pod install + cap sync.',
            'No offering configured':
              locale === 'tr' ? 'Ürün henüz mağazada tanımlı değil.' : 'Product not configured in store yet.',
          };
          setError(map[res.error] ?? res.error);
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

  async function restore() {
    setError(null);
    setRestoring(true);
    try {
      const res = await restorePurchases();
      if (res.ok) onUnlocked?.();
      else setError(locale === 'tr' ? 'Geri yüklenecek satın alım yok.' : 'No purchase to restore.');
    } finally {
      setRestoring(false);
    }
  }

  const perMonth = locale === 'tr' ? '/ ay' : '/ mo';
  const lifetimeTag = locale === 'tr' ? 'ömür boyu' : 'lifetime';

  return (
    <div className="relative min-h-[70vh]">
      <CosmicBackground variant="aurora" />
      <div className="mx-auto max-w-lg px-6 py-20 text-center">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-gold/15 text-5xl">
          ✦
        </div>
        <h1 className="font-display text-4xl text-ink">
          {locale === 'tr' ? 'Gökyüzünü aç' : 'Unlock your sky'}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-muted">
          {locale === 'tr'
            ? 'Haritandaki yıldız ve gezegenlerin konumu ile hareketi premium. Diğer her şey ücretsiz.'
            : 'The position and movement of the stars and planets in your chart are premium. Everything else is free.'}
        </p>

        <ul className="mx-auto mt-6 max-w-sm space-y-2 text-left text-sm text-ink">
          {PREMIUM_FEATURES.map((f) => (
            <li key={f} className="flex gap-2">
              <span className="text-gold">✦</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>

        {error ? (
          <p className="mt-5 rounded-lg border border-danger/40 bg-danger/10 p-3 text-sm text-danger">
            {error}
          </p>
        ) : null}

        <div className="mt-7 space-y-3">
          {/* Tek seferlik — öne çıkan */}
          <button
            type="button"
            onClick={() => unlock(PLANS.lifetime)}
            disabled={working !== null}
            className="flex w-full items-center justify-between gap-3 rounded-2xl bg-gold px-6 py-4 text-left font-bold text-[#1a0a40] shadow-glow transition-transform hover:scale-[1.01] disabled:opacity-60"
          >
            <span>
              <span className="block text-base">{locale === 'tr' ? 'Tek Seferlik' : 'One-time'}</span>
              <span className="block text-[11px] font-semibold opacity-70">{lifetimeTag}</span>
            </span>
            <span className="text-xl">{working === 'lifetime' ? '…' : PLANS.lifetime.price}</span>
          </button>

          {/* Aylık — ikincil */}
          <button
            type="button"
            onClick={() => unlock(PLANS.monthly)}
            disabled={working !== null}
            className="flex w-full items-center justify-between gap-3 rounded-2xl border border-gold/40 bg-transparent px-6 py-4 text-left font-bold text-ink transition-colors hover:border-gold/70 disabled:opacity-60"
          >
            <span>
              <span className="block text-base">{locale === 'tr' ? 'Aylık' : 'Monthly'}</span>
              <span className="block text-[11px] font-semibold text-muted">{locale === 'tr' ? 'istediğin zaman iptal' : 'cancel anytime'}</span>
            </span>
            <span className="text-lg text-gold">
              {working === 'monthly' ? '…' : `${PLANS.monthly.price} ${perMonth}`}
            </span>
          </button>
        </div>

        <div className="mt-5 flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={restore}
            disabled={restoring}
            className="text-xs text-muted underline hover:text-gold disabled:opacity-60"
          >
            {restoring ? '...' : locale === 'tr' ? 'Satın Alımı Geri Yükle' : 'Restore Purchase'}
          </button>
          {onBack ? (
            <button type="button" onClick={onBack} className="text-sm text-muted hover:text-gold">
              {t('gate.back')}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
