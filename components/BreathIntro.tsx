'use client';

import { useEffect, useState } from 'react';
import { useT } from '@/lib/i18n';

const KEY = 'soulprofile.breath.shown';
const TOTAL_MS = 2200;
const FADE_MS = 300;

type Phase = 'in' | 'out' | 'done';

export function BreathIntro({ children }: { children: React.ReactNode }) {
  const { t } = useT();
  const [phase, setPhase] = useState<Phase>('in');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem(KEY)) {
      setPhase('done');
      return;
    }
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (motion) {
      sessionStorage.setItem(KEY, '1');
      setPhase('done');
      return;
    }
    const tOut = window.setTimeout(() => setPhase('out'), TOTAL_MS - FADE_MS);
    const tDone = window.setTimeout(() => {
      sessionStorage.setItem(KEY, '1');
      setPhase('done');
    }, TOTAL_MS);
    return () => {
      window.clearTimeout(tOut);
      window.clearTimeout(tDone);
    };
  }, []);

  if (phase === 'done') return <>{children}</>;

  return (
    <>
      {children}
      <div
        aria-hidden
        className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-7 bg-bg"
        style={{
          opacity: phase === 'out' ? 0 : 1,
          transition: `opacity ${FADE_MS}ms ease-out`,
        }}
      >
        <div className="relative h-32 w-32">
          <span
            className="absolute inset-0 rounded-full bg-gold/15 breath-pulse"
            style={{ animationDelay: '0ms' }}
          />
          <span
            className="absolute inset-4 rounded-full bg-gold/30 breath-pulse"
            style={{ animationDelay: '160ms' }}
          />
          <span
            className="absolute inset-8 rounded-full bg-gold/55 breath-pulse"
            style={{ animationDelay: '320ms' }}
          />
        </div>
        <p className="text-[11px] font-bold uppercase tracking-[0.55em] text-gold/80">
          {t('birth.breath')}
        </p>
      </div>
    </>
  );
}
