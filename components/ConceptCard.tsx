'use client';

import { useState } from 'react';
import clsx from 'clsx';

type Props = {
  kicker: string;
  title: string;
  highlight: string;
  short: string;
  details: { heading: string; body: string }[];
  accent?: string;
};

export function ConceptCard({ kicker, title, highlight, short, details, accent = '#f5d061' }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group rounded-2xl border border-panelBorder bg-panel p-5 text-left transition-all hover:border-gold/50 hover:bg-panel/80"
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: accent }}>
          {kicker}
        </p>
        <h3 className="mt-2 font-display text-2xl text-ink">{title}</h3>
        <p className="mt-1 text-[12px] font-bold" style={{ color: accent }}>
          {highlight}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted">{short}</p>
        <p className="mt-3 text-[11px] text-gold opacity-0 transition-opacity group-hover:opacity-100">
          Detaylar için tıkla →
        </p>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm md:items-center md:p-6"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-panelBorder bg-bgElevated p-6 md:rounded-3xl md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: accent }}>
                  {kicker}
                </p>
                <h2 className="mt-2 font-display text-3xl text-ink">{title}</h2>
                <p className="mt-1 text-sm font-bold" style={{ color: accent }}>
                  {highlight}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-panelBorder px-3 py-1 text-lg leading-none text-muted hover:text-ink"
                aria-label="Kapat"
              >
                ×
              </button>
            </div>

            <div className="mt-6 space-y-5">
              <p className="text-[15px] leading-relaxed text-ink">{short}</p>
              {details.map((d, i) => (
                <section key={i} className="rounded-2xl border border-panelBorder bg-panel p-4">
                  <h3 className={clsx('text-xs font-bold uppercase tracking-[0.2em]')} style={{ color: accent }}>
                    {d.heading}
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-muted">{d.body}</p>
                </section>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
