'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useRef, useState, type ChangeEvent } from 'react';
import { CosmicBackground } from '@/components/CosmicBackground';
import { CosmicLoader } from '@/components/CosmicLoader';
import { useSoulStore } from '@/lib/store';
import { geocodePlace, type GeocodeResult } from '@/lib/geocoding';
import { buildGalacticReport } from '@/lib/report';
import { saveReport } from '@/lib/supabase/reports';
import { useT } from '@/lib/i18n';
import { canCreateReport, recordReport } from '@/lib/entitlements';
import { PremiumGate } from '@/components/PremiumGate';

export default function BirthPage() {
  const router = useRouter();
  const { t, locale } = useT();
  const [gated, setGated] = useState(false);
  const birth = useSoulStore((s) => s.birth);
  const setBirth = useSoulStore((s) => s.setBirth);
  const setReport = useSoulStore((s) => s.setReport);
  const setLoading = useSoulStore((s) => s.setLoading);
  const setError = useSoulStore((s) => s.setError);
  const loading = useSoulStore((s) => s.loading);
  const error = useSoulStore((s) => s.error);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [placeQuery, setPlaceQuery] = useState(birth.birthPlace ?? '');
  const [suggestions, setSuggestions] = useState<GeocodeResult[]>([]);
  const [searching, setSearching] = useState(false);

  async function onPhotoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const result = evt.target?.result as string;
      setBirth({ photoUri: result });
    };
    reader.readAsDataURL(file);
  }

  async function searchPlace(value: string) {
    setPlaceQuery(value);
    setBirth({ birthPlace: value });
    if (value.length < 2) {
      setSuggestions([]);
      return;
    }
    setSearching(true);
    try {
      const r = await geocodePlace(value);
      setSuggestions(r);
    } finally {
      setSearching(false);
    }
  }

  function pickSuggestion(s: GeocodeResult) {
    setPlaceQuery(`${s.name}, ${s.country}`);
    setBirth({
      birthPlace: `${s.name}, ${s.country}`,
      latitude: s.latitude,
      longitude: s.longitude,
      timezone: s.timezone,
    });
    setSuggestions([]);
  }

  async function submit() {
    if (!birth.fullName || !birth.birthDate || birth.latitude == null) {
      setError(t('birth.error'));
      return;
    }
    if (!canCreateReport()) {
      setGated(true);
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const report = await buildGalacticReport({
        fullName: birth.fullName,
        birthDate: birth.birthDate,
        birthTime: birth.birthTime ?? '12:00',
        birthTimeKnown: birth.birthTimeKnown ?? true,
        birthPlace: birth.birthPlace!,
        latitude: birth.latitude,
        longitude: birth.longitude!,
        timezone: birth.timezone ?? 'UTC',
        photoUri: birth.photoUri,
      }, locale);
      setReport(report);
      recordReport();
      saveReport(report).catch((e) => console.warn('[birth] save failed', e));
      router.push('/report');
    } catch (e) {
      console.error(e);
      setError(locale === 'tr' ? 'Karne üretilemedi. Lütfen tekrar dene.' : 'Could not generate profile. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (gated) {
    return <PremiumGate kind="report" onBack={() => setGated(false)} />;
  }

  return (
    <div className="relative min-h-[80vh] py-20 md:py-28">
      {loading ? <CosmicLoader /> : null}
      <CosmicBackground variant="aurora" />
      <div className="mx-auto max-w-xl px-6">
        <p className="text-xs font-bold uppercase tracking-[0.5em] text-gold">{t('birth.kicker')}</p>
        <h1 className="mt-3 font-display text-4xl leading-tight text-ink md:text-5xl">
          {t('birth.title')}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted">{t('birth.subtitle')}</p>

        <div className="mt-8 space-y-5">
          <Field label={t('birth.name')}>
            <input
              type="text"
              value={birth.fullName ?? ''}
              onChange={(e) => setBirth({ fullName: e.target.value })}
              placeholder={locale === 'tr' ? 'Ada Yıldız' : 'Alex Rivers'}
              autoComplete="name"
              className={inputClass}
            />
          </Field>

          <Field label={t('birth.date')}>
            <input
              type="date"
              value={birth.birthDate ?? ''}
              onChange={(e) => setBirth({ birthDate: e.target.value })}
              className={inputClass}
            />
          </Field>

          <div className="grid grid-cols-[1fr_auto] gap-3">
            <Field label={t('birth.time')}>
              <input
                type="time"
                value={birth.birthTime ?? ''}
                onChange={(e) => setBirth({ birthTime: e.target.value })}
                disabled={birth.birthTimeKnown === false}
                className={inputClass}
              />
            </Field>
            <div className="flex flex-col items-center justify-end pb-2">
              <label className="flex cursor-pointer flex-col items-center gap-1">
                <input
                  type="checkbox"
                  checked={birth.birthTimeKnown !== false}
                  onChange={(e) => setBirth({ birthTimeKnown: e.target.checked })}
                  className="h-5 w-5 accent-gold"
                />
                <span className="text-xs text-muted">{t('birth.timeKnown')}</span>
              </label>
            </div>
          </div>

          <Field label={t('birth.place')}>
            <div className="relative">
              <input
                type="text"
                value={placeQuery}
                onChange={(e) => searchPlace(e.target.value)}
                placeholder={locale === 'tr' ? 'İstanbul, Türkiye' : 'London, UK'}
                className={inputClass}
              />
              {searching ? <p className="mt-2 text-xs text-muted">{locale === 'tr' ? 'Aranıyor...' : 'Searching...'}</p> : null}
              {suggestions.length > 0 ? (
                <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-panelBorder bg-bgElevated">
                  {suggestions.map((s, i) => (
                    <button
                      key={`${s.name}-${i}`}
                      type="button"
                      onClick={() => pickSuggestion(s)}
                      className="block w-full border-b border-panelBorder px-4 py-3 text-left text-sm last:border-b-0 hover:bg-panel"
                    >
                      <div className="text-ink">
                        {s.name}, {s.country}
                      </div>
                      <div className="text-[11px] text-faint">
                        {s.latitude.toFixed(2)}, {s.longitude.toFixed(2)} · {s.timezone}
                      </div>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </Field>

          {/* Opsiyonel profil fotoğrafı — kompakt, en sonda */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full items-center gap-3 rounded-xl border border-dashed border-panelBorder bg-panel px-4 py-3 text-left transition-colors hover:border-gold/50"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gold/40 bg-bg">
              {birth.photoUri ? (
                <Image src={birth.photoUri} alt="" width={48} height={48} className="h-full w-full object-cover" unoptimized />
              ) : (
                <span className="text-lg text-gold">✦</span>
              )}
            </span>
            <span className="flex-1">
              <span className="block text-sm font-bold text-ink">
                {t('birth.photo')} <span className="text-[11px] font-normal text-faint">({locale === 'tr' ? 'opsiyonel' : 'optional'})</span>
              </span>
              <span className="block text-[11px] text-faint">{t('birth.photoHint')}</span>
            </span>
            <span className="shrink-0 text-xs text-gold">{birth.photoUri ? (locale === 'tr' ? 'Değiştir' : 'Change') : (locale === 'tr' ? 'Ekle' : 'Add')}</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onPhotoChange}
            className="hidden"
          />

          {error ? (
            <p className="rounded-lg border border-danger/40 bg-danger/10 p-3 text-sm text-danger">
              {error}
            </p>
          ) : null}

          <button
            type="button"
            onClick={submit}
            disabled={loading}
            className="group mt-3 flex w-full items-center justify-center gap-3 rounded-full bg-gold py-5 text-base font-bold tracking-wide text-[#1a0a40] shadow-glow transition-transform hover:scale-[1.02] disabled:opacity-60"
          >
            {loading ? (
              <>
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#1a0a40]/30 border-t-[#1a0a40]" />
                {t('birth.loading')}
              </>
            ) : (
              <>
                <span className="text-xl">✦</span>
                {t('birth.submit')}
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </>
            )}
          </button>

          <p className="text-center text-xs text-faint">
            {t('birth.privacyNote')}{' '}
            <a href="/privacy" className="text-muted hover:text-gold underline">
              {t('nav.privacy')}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

const inputClass =
  'input-surface w-full rounded-2xl border border-panelBorder px-5 py-4 text-[15px] text-ink placeholder:text-faint focus:border-gold/70 focus:outline-none';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="block text-xs font-bold uppercase tracking-[0.2em] text-muted">{label}</span>
      {children}
    </label>
  );
}
