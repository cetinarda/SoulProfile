'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useNav } from '@/lib/nav';
import { PageLayout, Section } from '@/components/PageLayout';
import { listReports } from '@/lib/supabase/reports';
import { useSoulStore } from '@/lib/store';
import type { GalacticReport } from '@/lib/types';
import { SIGN_NAMES_TR } from '@/lib/content/astrology-content';

type Saved = GalacticReport & { savedAt: string };

export default function HistoryPage() {
  const [reports, setReports] = useState<Saved[]>([]);
  const [loading, setLoading] = useState(true);
  const setReport = useSoulStore((s) => s.setReport);
  const nav = useNav();

  useEffect(() => {
    listReports()
      .then((r) => setReports(r))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageLayout
      kicker="GEÇMİŞ KARNELERİN"
      title="Kozmik arşivin"
      intro="Bu cihazda kayıtlı olan karnelerin. Tarayıcı verisini sildiğinde kaybolur — kaybetmek istemiyorsan JSON olarak indir."
    >
      {loading ? (
        <p className="text-sm text-muted">Yükleniyor…</p>
      ) : reports.length === 0 ? (
        <Section heading="Henüz karne yok">
          <p>İlk karneni oluştur, burada saklansın.</p>
          <Link
            href="/birth"
            className="mt-2 inline-block rounded-full bg-gold px-5 py-2 text-sm font-bold text-[#1a0a40]"
          >
            Karne Oluştur
          </Link>
        </Section>
      ) : (
        <div className="grid gap-4">
          {reports.map((r) => {
            const sun = r.chart.planets.find((p) => p.name === 'Sun');
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => {
                  setReport(r);
                  nav.push('/report');
                }}
                className="card-surface rounded-3xl border border-panelBorder p-7 md:p-8 text-left hover:border-gold/50 hover:bg-white/[0.03]"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-2xl text-ink">{r.birth.fullName}</h3>
                  <span className="text-[11px] uppercase tracking-[0.2em] text-faint">
                    {new Date(r.savedAt).toLocaleDateString('tr-TR')}
                  </span>
                </div>
                <p className="mt-3 text-sm text-gold">
                  {r.origin.emoji} {r.origin.race}
                </p>
                <p className="mt-2 text-[12px] leading-[1.85] text-muted">
                  {sun ? SIGN_NAMES_TR[sun.sign] : ''} Güneş ·{' '}
                  {SIGN_NAMES_TR[r.chart.ascendantSign]} Yükselen ·{' '}
                  {r.humanDesign.type} · Yaşam Yolu {r.numerology.lifePath}
                </p>
              </button>
            );
          })}
        </div>
      )}
    </PageLayout>
  );
}
