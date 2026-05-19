import Image from 'next/image';
import { forwardRef } from 'react';
import type { GalacticReport } from '@/lib/types';
import { SIGN_GLYPHS, SIGN_NAMES_TR } from '@/lib/content/astrology-content';
import { LIFE_PATH_MEANINGS } from '@/lib/content/numerology-content';

type Props = { report: GalacticReport };

export const ReportCard = forwardRef<HTMLDivElement, Props>(function ReportCard({ report }, ref) {
  const sun = report.chart.planets.find((p) => p.name === 'Sun')!;
  const moon = report.chart.planets.find((p) => p.name === 'Moon')!;
  const nn = report.chart.planets.find((p) => p.name === 'NorthNode')!;
  const sn = report.chart.planets.find((p) => p.name === 'SouthNode')!;
  const lp = LIFE_PATH_MEANINGS[report.numerology.lifePath];

  return (
    <div
      ref={ref}
      className="relative aspect-[9/16] w-full max-w-md overflow-hidden rounded-[28px] bg-galaxy p-6 text-ink card-glow"
      style={{ fontFamily: 'var(--font-sans), Inter, sans-serif' }}
    >
      <div className="starfield" />
      <div className="absolute inset-x-0 top-0 h-1/3 bg-[radial-gradient(40%_60%_at_50%_0%,rgba(124,92,255,0.45),transparent_70%)]" />

      <div className="relative flex h-full flex-col">
        <div className="text-center">
          <p className="text-[10px] font-bold tracking-[0.5em] text-gold">SOULPROFILE</p>
          <p className="font-display text-xl text-ink">Galaktik Karne</p>
        </div>

        <div className="mt-5 flex flex-col items-center">
          <div className="relative h-28 w-28 overflow-hidden rounded-full border-2 border-gold bg-panel">
            {report.birth.photoUri ? (
              <Image
                src={report.birth.photoUri}
                alt={report.birth.fullName}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-full items-center justify-center text-4xl text-gold">
                {report.origin.emoji}
              </div>
            )}
          </div>
          <h2 className="mt-3 font-display text-2xl text-ink">{report.birth.fullName}</h2>
          <p className="mt-1 text-sm font-bold tracking-wide text-gold">
            {report.origin.emoji} {report.origin.race}
          </p>
          <p className="text-[11px] text-starlight">{report.origin.starSystem}</p>
          <p className="mt-1 text-[11px] italic text-muted">"{report.origin.archetype}"</p>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <BigCell label="Güneş" value={SIGN_NAMES_TR[sun.sign]} glyph={SIGN_GLYPHS[sun.sign]} />
          <BigCell label="Ay" value={SIGN_NAMES_TR[moon.sign]} glyph={SIGN_GLYPHS[moon.sign]} />
          <BigCell
            label="Yükselen"
            value={SIGN_NAMES_TR[report.chart.ascendantSign]}
            glyph={SIGN_GLYPHS[report.chart.ascendantSign]}
          />
        </div>

        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-[9px] font-bold tracking-[0.25em] text-gold">HUMAN DESIGN</p>
          <p className="mt-1 font-display text-xl text-ink">{report.humanDesign.type}</p>
          <p className="text-[10px] leading-snug text-muted">
            {report.humanDesign.strategy} · {report.humanDesign.authority} · {report.humanDesign.profile}
          </p>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <MiniCell label="Yaşam Yolu" value={report.numerology.lifePath} sub={lp?.title ?? ''} />
          <MiniCell label="Kişisel Yıl" value={report.numerology.personalYear} sub="Şu anki döngü" />
        </div>

        <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-[9px] font-bold tracking-[0.25em] text-gold">KUZEY AY DÜĞÜMÜ · GÖREV</p>
          <p className="mt-1 text-[11px] font-bold text-ink">
            {SIGN_GLYPHS[nn.sign]} {SIGN_NAMES_TR[nn.sign]} · {nn.house}. ev
          </p>
          <p className="mt-1 text-[10px] leading-snug text-muted">{report.northNodeMessage}</p>
        </div>

        <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-[9px] font-bold tracking-[0.25em] text-gold">GÜNEY AY DÜĞÜMÜ · BIRAK</p>
          <p className="mt-1 text-[11px] font-bold text-ink">
            {SIGN_GLYPHS[sn.sign]} {SIGN_NAMES_TR[sn.sign]} · {sn.house}. ev
          </p>
          <p className="mt-1 text-[10px] leading-snug text-muted">{report.southNodeMessage}</p>
        </div>

        <p className="mt-auto pt-4 text-center text-[9px] tracking-[0.35em] text-faint">
          soulprofile.life
        </p>
      </div>
    </div>
  );
});

function BigCell({ label, value, glyph }: { label: string; value: string; glyph: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-center">
      <div className="text-lg text-gold">{glyph}</div>
      <div className="mt-1 text-[9px] tracking-widest text-muted">{label}</div>
      <div className="text-[11px] font-bold text-ink">{value}</div>
    </div>
  );
}

function MiniCell({ label, value, sub }: { label: string; value: number; sub: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="text-[9px] tracking-widest text-muted">{label}</div>
      <div className="font-display text-3xl leading-none text-gold">{value}</div>
      <div className="mt-1 text-[10px] text-muted">{sub}</div>
    </div>
  );
}
