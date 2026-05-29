'use client';

import { useState } from 'react';
import { CosmicBackground } from './CosmicBackground';
import { useT } from '@/lib/i18n';
import { startCheckout } from '@/lib/payments/checkout';
import { isCapacitorNative } from '@/lib/platform';
import { PRODUCT } from '@/lib/payments/skus';

export function PremiumGate({
  kind,
  onBack,
}: {
  kind: 'report' | 'compat';
  onBack?: () => void;
}) {
  const { t } = useT();
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function unlock() {
    setError(null);
    if (isCapacitorNative()) return;
    setWorking(true);
    try {
      await startCheckout();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error');
    } finally {
      setWorking(false);
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

        {onBack ? (
          <div className="mt-4">
            <button type="button" onClick={onBack} className="text-sm text-muted hover:text-gold">
              {t('gate.back')}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
