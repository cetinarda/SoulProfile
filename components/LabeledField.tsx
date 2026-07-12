'use client';

import type { ReactNode } from 'react';
import { FORM_INPUT } from '@/lib/ui';
import { useT } from '@/lib/i18n';

// Tüm formlarda TEK etiketli-alan bileşeni. Etiket stili tek yerde.
const LABEL = 'mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-faint';

export function LabeledField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className={LABEL}>{label}</span>
      {children}
    </label>
  );
}

/**
 * Tarih alanı — iOS'ta appearance:none native gg.aa.yyyy placeholder'ını
 * siliyor, boş kutu "ne gireceğim?" hissi veriyordu. React-kontrollü overlay
 * ile boşken görünür ipucu gösterir. Değer girilince overlay kaybolur,
 * native takvim ikonu sağda tıklanabilir kalır.
 */
export function DateField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const { locale } = useT();
  const ph = locale === 'tr' ? 'gg.aa.yyyy' : 'mm/dd/yyyy';
  return (
    <LabeledField label={label}>
      <div className="relative">
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={FORM_INPUT}
        />
        {!value ? (
          <span className="pointer-events-none absolute inset-y-0 left-5 flex items-center text-base text-faint">
            {ph}
          </span>
        ) : null}
      </div>
    </LabeledField>
  );
}

/**
 * Saat + "biliniyor" onayı — saat inputu ile aynı 56px yükseklikte hizalı
 * pill. (Eski flex-col hizalama bozuktu.)
 */
export function TimeKnownField({
  label,
  value,
  onChange,
  known,
  onKnownChange,
  knownLabel,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  known: boolean;
  onKnownChange: (b: boolean) => void;
  knownLabel: string;
}) {
  return (
    <div>
      <span className={LABEL}>{label}</span>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3">
        <input
          type="time"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={!known}
          className={FORM_INPUT}
        />
        <label className="flex h-[56px] cursor-pointer items-center gap-2 rounded-2xl border border-panelBorder px-4">
          <input
            type="checkbox"
            checked={known}
            onChange={(e) => onKnownChange(e.target.checked)}
            className="h-5 w-5 accent-gold"
          />
          <span className="whitespace-nowrap text-xs text-muted">{knownLabel}</span>
        </label>
      </div>
    </div>
  );
}
