'use client';

import { useState } from 'react';
import { CosmicBackground } from './CosmicBackground';
import { useT } from '@/lib/i18n';
import { startCheckout } from '@/lib/payments/checkout';
import { isCapacitorNative } from '@/lib/platform';
import { buyOnNative, restorePurchases } from '@/lib/payments/iap';
import { PRODUCT } from '@/lib/payments/skus';

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
  const [working, setWorking] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function unlock() {
    setError(null);
    setWorking(true);
    try {
      if (isCapacitorNative()) {
        // iOS — RevenueCat / Apple StoreKit satın alma
        const res = await buyOnNative();
        if (res.ok) {
          onUnlocked?.();
        } else if (res.error && res.error !== 'cancelled') {
          const map: Record<string, string> = {
            IAP_NOT_READY:
              locale === 'tr'
                ? 'Satın alma servisi hazır değil (RevenueCat native eklentisi kurulmamış). pod install + cap sync gerekli.'
                : 'Purchase service not ready (RevenueCat native plugin missing). Needs pod install + cap sync.',
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
      setWorking(false);
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

  return (
    <div className="relative min-h-[70vh]">
      <CosmicBackground variant="aurora" />
      <div className="mx-auto max-w-lg px-6 py-20 text-center">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-gold/15 text-5xl">
          ✦
        </div>
        <h1 className="font-display text-4xl text-ink">
          {kind === 'report' ? t('gate.report.title') : t('gate.compat.title')}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-muted">
          {kind === 'report' ? t('gate.report.desc') : t('gate.compat.desc')}
        </p>

        <ul className="mx-auto mt-6 max-w-sm space-y-2 text-left text-sm text-ink">
          {PRODUCT.features.slice(0, 6).map((f) => (
            <li key={f} className="flex gap-2">
              <span className="text-gold">✦</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>

        {error ? (
          <p className="mt-4 rounded-lg border border-danger/40 bg-danger/10 p-3 text-sm text-danger">
            {error}
          </p>
        ) : null}

        <button
          type="button"
          onClick={unlock}
          disabled={working}
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-gold px-9 py-4 text-base font-bold tracking-wide text-[#1a0a40] shadow-glow transition-transform hover:scale-105 disabled:opacity-60"
        >
          {working ? '...' : t('gate.cta')}
        </button>

        <div className="mt-4 flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={restore}
            disabled={restoring}
            className="text-xs text-muted underline hover:text-gold disabled:opacity-60"
          >
            {restoring ? '...' : (locale === 'tr' ? 'Satın Alımı Geri Yükle' : 'Restore Purchase')}
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
