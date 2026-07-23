'use client';

import { useMemo } from 'react';
import type { GalacticReport } from '@/lib/types';
import { todayTransits, moonPhase } from '@/lib/astrology/transits';
import { useT } from '@/lib/i18n';

const TONE_COLOR: Record<string, string> = {
  flow: '#5bd9a0',
  tension: '#ff7ad9',
  blend: '#f5d061',
};

/**
 * "Bugünün Gökyüzü" — kişinin natal haritasına göre bugünkü transitler.
 * Her gün değişir; günlük geri gelme motoru. Deterministik, AI yok.
 * NOT: Date.now new Date() client'ta çalışır (SSR'da render edilmez — 'use client').
 */
export function TodaySky({ report }: { report: GalacticReport }) {
  const { locale } = useT();
  const tr = locale === 'tr';
  // build sırasında (SSG) Date kullanımı yok; sadece client render'da hesaplanır.
  const insights = useMemo(() => {
    if (typeof window === 'undefined') return [];
    return todayTransits(report, new Date());
  }, [report]);

  const moon = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return moonPhase(new Date());
  }, []);

  if (insights.length === 0) return null;

  const today = new Date().toLocaleDateString(tr ? 'tr-TR' : 'en-US', {
    day: 'numeric',
    month: 'long',
  });

  return (
    <section className="mt-12 overflow-hidden rounded-3xl border border-gold/30 bg-gradient-to-br from-[#0f1230] via-[#161a3d] to-[#0b0524] p-6 md:p-8">
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-gold">
            {tr ? 'BUGÜNÜN GÖKYÜZÜ' : "TODAY'S SKY"}
          </p>
          <h2 className="mt-2 font-display text-3xl text-ink">
            {tr ? 'Yıldızlar bugün sana ne diyor?' : 'What do the stars say today?'}
          </h2>
        </div>
        {moon ? (
          <div className="flex shrink-0 flex-col items-center gap-1.5">
            <MoonDisc fraction={moon.fraction} waxing={moon.waxing} />
            <span className="text-[10px] font-semibold tracking-wide text-gold/90">
              {tr ? moon.name.tr : moon.name.en}
            </span>
            <span className="text-[10px] text-faint">{today}</span>
          </div>
        ) : (
          <span className="shrink-0 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[11px] font-bold text-gold">
            {today}
          </span>
        )}
      </div>

      <div className="mt-6 space-y-4">
        {insights.map((it) => (
          <div key={it.id} className="flex gap-4 rounded-2xl border border-panelBorder bg-bg/40 p-4">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xl"
              style={{ backgroundColor: `${TONE_COLOR[it.tone]}1a`, color: TONE_COLOR[it.tone] }}
            >
              {it.glyph}
            </div>
            <div className="flex-1">
              <p className="text-[11px] font-bold uppercase tracking-[0.25em]" style={{ color: TONE_COLOR[it.tone] }}>
                {tr ? it.title.tr : it.title.en}
              </p>
              <p className="mt-1.5 text-[14px] leading-relaxed text-ink">
                {tr ? it.body.tr : it.body.en}
              </p>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-center text-[11px] text-faint">
        {tr
          ? 'Bugünkü gökyüzü × senin doğum haritan. Her gün yenilenir.'
          : "Today's sky × your natal chart. Refreshed daily."}
      </p>
    </section>
  );
}

/**
 * Ay evresi diski — sakin, gerçek geometri. Aydınlık yarım-daire + terminatör
 * elipsi (hilalde gölge oyar, şişkinde ışık ekler; dördünde düz). Tüm evrelerde
 * doğru: yeni → hilal → dördün → şişkin → dolunay.
 */
function MoonDisc({ fraction, waxing, size = 46 }: { fraction: number; waxing: boolean; size?: number }) {
  const R = size / 2;
  const rxTerm = R * Math.abs(1 - 2 * fraction); // terminatör yarı-eni (dördünde 0)
  const gibbous = fraction > 0.5;
  const uid = `m${Math.round(fraction * 1000)}${waxing ? 'x' : 'n'}`;
  const litX = waxing ? R : 0; // aydınlık yarım: büyürken sağ, küçülürken sol
  const shadow = '#1a1b38';
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden="true"
      style={{ filter: 'drop-shadow(0 0 8px rgba(245,208,97,0.25))' }}
    >
      <defs>
        <clipPath id={`${uid}c`}>
          <circle cx={R} cy={R} r={R - 1} />
        </clipPath>
        <radialGradient id={`${uid}g`} cx="38%" cy="34%" r="80%">
          <stop offset="0%" stopColor="#fffdf3" />
          <stop offset="100%" stopColor="#f2e3b0" />
        </radialGradient>
      </defs>
      <g clipPath={`url(#${uid}c)`}>
        <circle cx={R} cy={R} r={R} fill={shadow} />
        <rect x={litX} y={0} width={R} height={size} fill={`url(#${uid}g)`} />
        <ellipse cx={R} cy={R} rx={rxTerm} ry={R} fill={gibbous ? `url(#${uid}g)` : shadow} />
      </g>
      <circle cx={R} cy={R} r={R - 1} fill="none" stroke="rgba(245,208,97,0.4)" strokeWidth="1" />
    </svg>
  );
}
