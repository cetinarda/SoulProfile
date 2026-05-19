'use client';

import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { PageLayout } from '@/components/PageLayout';
import { GLOSSARY, type GlossaryEntry } from '@/lib/content/glossary';

const FILTERS: Array<{ key: GlossaryEntry['category'] | 'all'; label: string }> = [
  { key: 'all', label: 'Tümü' },
  { key: 'numerology', label: 'Numeroloji' },
  { key: 'astrology', label: 'Astroloji' },
  { key: 'chakra', label: 'Çakra' },
  { key: 'biorhythm', label: 'Biyoritm' },
  { key: 'reiki', label: 'Reiki' },
  { key: 'practice', label: 'Pratikler' },
];

export default function Glossary() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]['key']>('all');
  const items = useMemo(
    () => (filter === 'all' ? GLOSSARY : GLOSSARY.filter((g) => g.category === filter)),
    [filter],
  );

  return (
    <PageLayout
      kicker="KAVRAMLAR"
      title="Kozmik sözlüğün"
      intro="Karnende karşına çıkan tüm kavramların açıklamaları. Yaşam Yolu Sayısından çakralara, Kuzey Düğümden biyoritme."
    >
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={clsx(
              'rounded-full border px-4 py-2 text-sm transition-colors',
              filter === f.key
                ? 'border-gold bg-gold text-[#1a0a40] font-bold'
                : 'border-panelBorder bg-panel text-muted hover:border-gold/40 hover:text-ink',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {items.map((entry) => (
          <article
            key={entry.id}
            className="rounded-2xl border border-panelBorder bg-panel p-5"
          >
            <h3 className="text-base font-bold text-ink">{entry.term}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{entry.description}</p>
          </article>
        ))}
      </div>
    </PageLayout>
  );
}
