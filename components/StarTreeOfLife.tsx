'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { buildLifeTimeline, PLANET_COLORS } from '@/lib/astrology/timeline';

type Props = {
  birthISO: string;
  size?: number;
};

type Point = { x: number; y: number; planet: string; age: number; date: string };

const SIZE = 720;
const CENTER = SIZE / 2;
const OUTER_RADIUS = SIZE * 0.42;
const ZODIAC_GLYPHS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];

function longitudeToXY(longitude: number, age: number, totalYears: number): { x: number; y: number } {
  // Spiral: yaş arttıkça merkeze yaklaşır. Açı = ekliptik boylam.
  const angle = ((longitude - 90) * Math.PI) / 180;
  const t = totalYears > 0 ? age / totalYears : 0;
  const r = OUTER_RADIUS * (1 - 0.55 * t);
  return {
    x: CENTER + Math.cos(angle) * r,
    y: CENTER + Math.sin(angle) * r,
  };
}

export function StarTreeOfLife({ birthISO, size = SIZE }: Props) {
  const [revealStep, setRevealStep] = useState(0);
  const [playKey, setPlayKey] = useState(0);
  const rafRef = useRef<number | null>(null);

  const { points, lines, totalYears, lifePathPoints } = useMemo(() => {
    const snapshots = buildLifeTimeline(birthISO, 2); // her 6 ayda bir nokta
    const totalYears = snapshots[snapshots.length - 1]?.age ?? 0;

    const points: Point[] = [];
    const lifePath: Record<string, Point[]> = {};

    for (const snap of snapshots) {
      for (const planet of Object.keys(snap.positions)) {
        const lon = snap.positions[planet]!;
        const { x, y } = longitudeToXY(lon, snap.age, totalYears);
        const p = { x, y, planet, age: snap.age, date: snap.date };
        points.push(p);
        if (!lifePath[planet]) lifePath[planet] = [];
        lifePath[planet]!.push(p);
      }
    }

    // Web bağlantıları: aynı snapshot'taki gezegenler arası (aspect web)
    const lines: Array<{ x1: number; y1: number; x2: number; y2: number; opacity: number; step: number }> = [];
    snapshots.forEach((snap, idx) => {
      const planets = Object.keys(snap.positions);
      const pts: Point[] = planets.map((p) => {
        const { x, y } = longitudeToXY(snap.positions[p]!, snap.age, totalYears);
        return { x, y, planet: p, age: snap.age, date: snap.date };
      });
      // Her gezegenden 3 en yakın komşusuna bağlan (Voronoi/Delaunay benzeri ucuz)
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i]!;
        const others = pts
          .map((b, j) => ({ b, d: Math.hypot(a.x - b.x, a.y - b.y), j }))
          .filter((o) => o.j !== i)
          .sort((u, v) => u.d - v.d)
          .slice(0, 2);
        for (const { b } of others) {
          lines.push({
            x1: a.x,
            y1: a.y,
            x2: b.x,
            y2: b.y,
            opacity: 0.18,
            step: idx,
          });
        }
      }
    });

    return { points, lines, totalYears, lifePathPoints: lifePath };
  }, [birthISO]);

  const totalSteps = useMemo(() => {
    const steps = new Set(lines.map((l) => l.step));
    return Math.max(steps.size, 1);
  }, [lines]);

  useEffect(() => {
    setRevealStep(0);
    let raf = 0;
    const start = performance.now();
    const duration = 14000; // 14 saniyede tüm hayat web'i çizilir (yavaş + meditatif)
    const tick = (now: number) => {
      const elapsed = now - start;
      // ease-in-out cubic
      const t = Math.min(1, elapsed / duration);
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      setRevealStep(Math.floor(eased * totalSteps));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    rafRef.current = raf;
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [totalSteps, playKey]);

  return (
    <div className="relative mx-auto" style={{ width: size, maxWidth: '100%' }}>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="h-auto w-full">
        <defs>
          <radialGradient id="nebula-bg" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#1a0a40" stopOpacity="0.6" />
            <stop offset="60%" stopColor="#05060f" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#05060f" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="star-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="60%" stopColor="white" stopOpacity="0.4" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Arkaplan nebulası */}
        <circle cx={CENTER} cy={CENTER} r={OUTER_RADIUS * 1.1} fill="url(#nebula-bg)" />

        {/* Zodyak çember + glifler */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={OUTER_RADIUS * 1.05}
          fill="none"
          stroke="rgba(245,208,97,0.18)"
          strokeWidth="0.5"
        />
        {ZODIAC_GLYPHS.map((glyph, i) => {
          const a = ((i * 30 - 75) * Math.PI) / 180;
          const r = OUTER_RADIUS * 1.13;
          return (
            <text
              key={glyph}
              x={CENTER + Math.cos(a) * r}
              y={CENTER + Math.sin(a) * r}
              fontSize="14"
              fill="rgba(245,208,97,0.5)"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {glyph}
            </text>
          );
        })}

        {/* Web bağlantıları — sırayla beliriyor */}
        {lines.map((l, i) => {
          const visible = l.step <= revealStep;
          return (
            <line
              key={i}
              x1={l.x1}
              y1={l.y1}
              x2={l.x2}
              y2={l.y2}
              stroke="rgba(255,255,255,0.35)"
              strokeWidth="0.6"
              opacity={visible ? 0.6 : 0}
              style={{ transition: 'opacity 600ms ease-out' }}
            />
          );
        })}

        {/* Her gezegenin yaşam yolu çizgisi (spiral) */}
        {Object.entries(lifePathPoints).map(([planet, pts]) => {
          const d = pts
            .filter((_, idx) => idx <= revealStep)
            .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
            .join(' ');
          return (
            <path
              key={planet}
              d={d}
              fill="none"
              stroke={PLANET_COLORS[planet] ?? '#fff'}
              strokeWidth="1.2"
              strokeOpacity="0.55"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          );
        })}

        {/* Yıldız noktaları */}
        {points.map((p, i) => {
          const stepOfPoint = Math.floor(i / 9); // ~9 gezegen per snapshot
          const visible = stepOfPoint <= revealStep;
          if (!visible) return null;
          const color = PLANET_COLORS[p.planet] ?? '#fff';
          return (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r={4} fill="url(#star-glow)" opacity={0.5} />
              <circle cx={p.x} cy={p.y} r={1.4} fill={color} opacity={0.95} />
            </g>
          );
        })}

        {/* Doğum noktası — merkez */}
        <circle cx={CENTER} cy={CENTER} r={6} fill="#f5d061" opacity="0.95" />
        <circle cx={CENTER} cy={CENTER} r={10} fill="none" stroke="#f5d061" strokeOpacity="0.4" />
      </svg>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-[11px] text-faint">
        <span>Doğum → Bugün ({totalYears.toFixed(1)} yıl)</span>
        <button
          type="button"
          onClick={() => setPlayKey((k) => k + 1)}
          className="rounded-full border border-gold/40 bg-gold/[0.06] px-3 py-1 text-[10px] font-bold tracking-wide text-gold hover:bg-gold/[0.12]"
        >
          ↺ Tekrar Oynat
        </button>
        <span>{Math.floor((revealStep / totalSteps) * 100)}%</span>
      </div>
    </div>
  );
}
