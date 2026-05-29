import type { CompatibilityResult } from '@/lib/compatibility';
import type { CompatNarrative } from '@/lib/compatibility/narrative';

function ScoreRing({ score, label }: { score: number; label: string }) {
  const r = 34;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 75 ? '#5bd9a0' : score >= 55 ? '#f5d061' : '#ff7ad9';
  return (
    <div className="flex flex-col items-center gap-1">
      <svg viewBox="0 0 80 80" className="h-20 w-20">
        <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
        <circle
          cx="40"
          cy="40"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          transform="rotate(-90 40 40)"
        />
        <text x="40" y="46" textAnchor="middle" fontSize="20" fill="#f4f1ff" fontWeight="700">
          {score}
        </text>
      </svg>
      <span className="text-[11px] text-muted">{label}</span>
    </div>
  );
}

const STATUS_COLOR: Record<string, string> = {
  companionship: '#5bd9a0',
  'a-conditions-b': '#f5d061',
  'b-conditions-a': '#9dd9ff',
  'shared-openness': '#c79dff',
};

const FLAVOR_COLOR: Record<string, string> = {
  flowing: '#5bd9a0',
  fusion: '#f5d061',
  tense: '#ff7ad9',
};

const KIND_BADGE: Record<string, { label: string; color: string }> = {
  electromagnetic: { label: '⚡ Çekim', color: '#f5d061' },
  companionship: { label: '🤝 Ortak', color: '#5bd9a0' },
  'dominance-a': { label: '◐ Hâkimiyet', color: '#9dd9ff' },
  'dominance-b': { label: '◑ Hâkimiyet', color: '#9dd9ff' },
};

export function CompatibilityView({
  result,
  narrative,
}: {
  result: CompatibilityResult;
  narrative: CompatNarrative;
}) {
  return (
    <div className="space-y-8">
      {/* Skor başlığı */}
      <section className="rounded-3xl border border-gold/30 bg-gradient-to-br from-[#0a0524] via-[#1a0a40] to-[#2a0a5a] p-6 shadow-glow">
        <div className="starfield opacity-30" />
        <div className="relative text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold">İKİLİ KOZMİK UYUM</p>
          <h2 className="mt-2 font-display text-3xl text-ink">{result.headline}</h2>
          <div className="mx-auto mt-5 flex items-center justify-center">
            <ScoreRing score={result.scoreOverall} label="Genel Uyum" />
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-5">
            <ScoreRing score={result.scoreHD} label="Human Design" />
            <ScoreRing score={result.scoreAstro} label="Astroloji" />
            <ScoreRing score={result.scoreNumerology} label="Numeroloji" />
          </div>
        </div>
      </section>

      {/* Genel yorum */}
      <article className="rounded-2xl border border-panelBorder bg-panel p-6">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">Genel</p>
        <p className="mt-3 text-[15px] leading-relaxed text-ink">{narrative.overview}</p>
        <div className="mt-5 rounded-2xl border border-cosmic/40 bg-cosmic/[0.06] p-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-cosmic">Human Design Dansı</p>
          <p className="mt-2 text-[14px] leading-relaxed text-ink">{narrative.hdDynamic}</p>
        </div>
      </article>

      {/* Güçlü + Sürtünme */}
      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-2xl border border-success/30 bg-success/[0.04] p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-success">Güçlü Yanlar</p>
          <ul className="mt-3 space-y-2">
            {narrative.strengths.map((s, i) => (
              <li key={i} className="flex gap-2 text-[14px] leading-relaxed text-ink">
                <span className="text-success">✦</span>
                <span className="flex-1">{s}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-2xl border border-nebula/40 bg-nebula/[0.06] p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-nebula">Sürtünme Noktaları</p>
          <ul className="mt-3 space-y-2">
            {narrative.frictions.map((s, i) => (
              <li key={i} className="flex gap-2 text-[14px] leading-relaxed text-ink">
                <span className="text-nebula">◐</span>
                <span className="flex-1">{s}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* HD merkez matrisi */}
      <section className="rounded-2xl border border-panelBorder bg-panel p-6">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">
          Human Design Merkez Karşılaştırması
        </p>
        <p className="mt-1 text-[12px] text-muted">
          Tanımlı taraf, açık tarafı o alanda "koşullar" — açık taraf bu enerjiyi yoğun yaşar.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {result.hdCenters.map((c) => (
            <div
              key={c.center}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
              style={{ borderLeftColor: STATUS_COLOR[c.status], borderLeftWidth: 3 }}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[13px] font-bold text-ink">{c.centerTr}</span>
                <span
                  className="rounded-full px-2 py-0.5 text-[9px] font-bold"
                  style={{ backgroundColor: `${STATUS_COLOR[c.status]}22`, color: STATUS_COLOR[c.status] }}
                >
                  {c.statusLabel}
                </span>
              </div>
              <p className="mt-2 text-[12px] leading-snug text-muted">{c.meaning}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Kanal bağları */}
      {result.hdConnections.length > 0 ? (
        <section className="rounded-2xl border border-panelBorder bg-panel p-6">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">Kanal Bağlarınız</p>
          <div className="mt-4 space-y-3">
            {result.hdConnections.map((c, i) => {
              const badge = KIND_BADGE[c.kind];
              return (
                <div key={i} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-center gap-2">
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                      style={{ backgroundColor: `${badge.color}22`, color: badge.color }}
                    >
                      {badge.label}
                    </span>
                    <span className="text-[12px] font-bold text-ink">Kanal {c.channel}</span>
                    <span className="text-[11px] text-faint">· {c.theme}</span>
                  </div>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted">{c.meaning}</p>
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      {/* Astroloji açıları */}
      {result.astroAspects.length > 0 ? (
        <section className="rounded-2xl border border-panelBorder bg-panel p-6">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">Astrolojik Açılar (Synastry)</p>
          <div className="mt-4 space-y-2">
            {result.astroAspects.map((x, i) => (
              <div
                key={i}
                className="flex flex-wrap items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] p-3"
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: FLAVOR_COLOR[x.flavor] }}
                />
                <span className="text-[13px] font-bold text-ink">{x.a}</span>
                <span className="text-[12px] text-gold">{x.aspect}</span>
                <span className="text-[13px] font-bold text-ink">{x.b}</span>
                <span className="w-full text-[12px] leading-snug text-muted">{x.meaning}</span>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* Numeroloji */}
      <section className="rounded-2xl border border-panelBorder bg-panel p-6">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">Numeroloji Uyumu</p>
        <p className="mt-2 text-[14px] leading-relaxed text-ink">{result.numerology.harmony}</p>
      </section>

      {/* Tavsiye */}
      <section className="rounded-2xl border border-gold/40 bg-gold/[0.06] p-6">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">Tavsiye</p>
        <p className="mt-2 text-[15px] leading-relaxed text-ink">{narrative.advice}</p>
      </section>

      <p className="text-center text-[11px] text-faint">
        Eğlence ve farkındalık amaçlıdır. İlişki tavsiyesi veya psikolojik danışmanlık yerine geçmez.
      </p>
    </div>
  );
}
