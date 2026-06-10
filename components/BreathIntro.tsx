'use client';

import { useEffect, useState } from 'react';
import { useT } from '@/lib/i18n';

const KEY = 'soulprofile.breath.shown';

type Phase = 'in' | 'done';

export function BreathIntro({ children }: { children: React.ReactNode }) {
  const { t, locale } = useT();
  // Başlangıçta 'done' — JS çalışmazsa overlay HİÇ gösterilmez, içerik
  // her zaman tıklanabilir. Overlay yalnız hydration sonrası (mount) açılır.
  const [phase, setPhase] = useState<Phase>('done');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem(KEY)) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (motion) {
      sessionStorage.setItem(KEY, '1');
      return;
    }
    setPhase('in');
    const tDone = window.setTimeout(() => {
      sessionStorage.setItem(KEY, '1');
      setPhase('done');
    }, 2200);
    return () => window.clearTimeout(tDone);
  }, []);

  function skip() {
    sessionStorage.setItem(KEY, '1');
    setPhase('done');
  }

  return (
    <>
      {children}
      {phase === 'in' ? (
        <button
          type="button"
          onClick={skip}
          aria-label={locale === 'tr' ? 'Atla' : 'Skip'}
          className="breath-overlay fixed inset-0 z-50 flex flex-col items-center justify-center gap-7 bg-bg"
        >
          <div className="relative h-32 w-32">
            <span className="absolute inset-0 rounded-full bg-gold/15 breath-pulse" style={{ animationDelay: '0ms' }} />
            <span className="absolute inset-4 rounded-full bg-gold/30 breath-pulse" style={{ animationDelay: '160ms' }} />
            <span className="absolute inset-8 rounded-full bg-gold/55 breath-pulse" style={{ animationDelay: '320ms' }} />
          </div>
          <p className="text-[11px] font-bold uppercase tracking-[0.55em] text-gold/80">
            {t('birth.breath')}
          </p>
          <p className="text-[10px] tracking-[0.3em] text-faint">
            {locale === 'tr' ? 'Atlamak için dokun' : 'Tap to skip'}
          </p>
        </button>
      ) : null}
    </>
  );
}