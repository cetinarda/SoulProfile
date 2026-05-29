'use client';

import Link from 'next/link';
import { useEffect, useState, type ChangeEvent } from 'react';
import { CosmicBackground } from '@/components/CosmicBackground';
import { CompatibilityView } from '@/components/CompatibilityView';
import { useSoulStore } from '@/lib/store';
import { listReports } from '@/lib/supabase/reports';
import { geocodePlace, type GeocodeResult } from '@/lib/geocoding';
import { buildGalacticReport } from '@/lib/report';
import { compareReports, type CompatibilityResult } from '@/lib/compatibility';
import { generateCompatNarrative, type CompatNarrative } from '@/lib/compatibility/narrative';
import type { GalacticReport } from '@/lib/types';
import { SIGN_NAMES_TR } from '@/lib/content/astrology-content';

const inputClass =
  'w-full rounded-xl border border-panelBorder bg-panel px-4 py-3.5 text-ink placeholder:text-faint focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold';

export default function CompatibilityPage() {
  const storeReport = useSoulStore((s) => s.report);
  const [me, setMe] = useState<GalacticReport | null>(storeReport);
  const [hydrated, setHydrated] = useState(false);

  // İkinci kişi formu
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('12:00');
  const [timeKnown, setTimeKnown] = useState(true);
  const [placeQuery, setPlaceQuery] = useState('');
  const [place, setPlace] = useState<GeocodeResult | null>(null);
  const [suggestions, setSuggestions] = useState<GeocodeResult[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CompatibilityResult | null>(null);
  const [narrative, setNarrative] = useState<CompatNarrative | null>(null);

  useEffect(() => {
    setHydrated(true);
    if (!storeReport) {
      listReports().then((r) => {
        if (r[0]) setMe(r[0]);
      });
    }
  }, [storeReport]);

  async function searchPlace(v: string) {
    setPlaceQuery(v);
    setPlace(null);
    if (v.length < 2) {
      setSuggestions([]);
      return;
    }
    const r = await geocodePlace(v);
    setSuggestions(r);
  }

  function pickSuggestion(s: GeocodeResult) {
    setPlace(s);
    setPlaceQuery(`${s.name}, ${s.country}`);
    setSuggestions([]);
  }

  async function compare() {
    if (!me) return;
    if (!name || !date || !place) {
      setError('Lütfen ikinci kişinin adını, doğum tarihini ve yerini gir.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const other = await buildGalacticReport({
        fullName: name,
        birthDate: date,
        birthTime: timeKnown ? time : '12:00',
        birthTimeKnown: timeKnown,
        birthPlace: `${place.name}, ${place.country}`,
        latitude: place.latitude,
        longitude: place.longitude,
        timezone: place.timezone,
      });
      const res = compareReports(me, other);
      const narr = await generateCompatNarrative(me, other, res);
      setResult(res);
      setNarrative(narr);
      setTimeout(() => {
        document.getElementById('compat-result')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (e) {
      console.error(e);
      setError('Karşılaştırma yapılamadı. Lütfen tekrar dene.');
    } finally {
      setLoading(false);
    }
  }

  // Kendi karnesi yoksa
  if (hydrated && !me) {
    return (
      <div className="relative min-h-[70vh]">
        <CosmicBackground variant="aurora" />
        <div className="mx-auto max-w-xl px-6 py-20 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.5em] text-gold">İKİLİ UYUM</p>
          <h1 className="mt-3 font-display text-4xl text-ink">Önce kendini tanı</h1>
          <p className="mt-3 text-muted">
            İki kimliği karşılaştırmadan önce kendi galaktik karneni oluşturman gerekiyor.
          </p>
          <Link
            href="/birth"
            className="mt-6 inline-block rounded-full bg-gold px-7 py-4 text-sm font-bold text-[#1a0a40] shadow-glow"
          >
            Önce Karnemi Oluştur →
          </Link>
        </div>
      </div>
    );
  }

  if (!me) return null;

  const mySun = me.chart.planets.find((p) => p.name === 'Sun');

  return (
    <div className="relative py-12 md:py-16">
      <CosmicBackground variant="aurora" />
      <div className="mx-auto max-w-3xl px-5 md:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.5em] text-gold">İKİLİ KOZMİK UYUM</p>
        <h1 className="mt-3 font-display text-4xl leading-tight text-ink md:text-5xl">
          İki ruh nasıl anlaşır?
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted">
          Senin kimliğin ile başka birinin doğum verisini karşılaştırıyoruz: astroloji synastry,
          Human Design tanımlı–tanımsız merkez dansı ve numeroloji uyumu — sonra nasıl bir deneyim
          olacağını yorumluyoruz.
        </p>

        {/* Kişi 1 — sen */}
        <div className="mt-8 rounded-2xl border border-gold/30 bg-gold/[0.05] p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold">1. KİŞİ — SEN</p>
          <p className="mt-2 font-display text-2xl text-ink">{me.birth.fullName}</p>
          <p className="mt-1 text-sm text-muted">
            {mySun ? SIGN_NAMES_TR[mySun.sign] : ''} Güneş ·{' '}
            {SIGN_NAMES_TR[me.chart.ascendantSign]} Yükselen · {me.humanDesign.type} · Yaşam Yolu{' '}
            {me.numerology.lifePath}
          </p>
        </div>

        {/* Kişi 2 — form */}
        <div className="mt-4 rounded-2xl border border-panelBorder bg-panel p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-cosmic">2. KİŞİ</p>

          <div className="mt-4 space-y-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Adı (örn. Deniz Kaya)"
              className={inputClass}
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={inputClass}
            />
            <div className="grid grid-cols-[1fr_auto] gap-3">
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                disabled={!timeKnown}
                className={inputClass}
              />
              <label className="flex cursor-pointer flex-col items-center justify-center gap-1">
                <input
                  type="checkbox"
                  checked={timeKnown}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setTimeKnown(e.target.checked)}
                  className="h-5 w-5 accent-gold"
                />
                <span className="text-xs text-muted">Saat biliniyor</span>
              </label>
            </div>
            <div className="relative">
              <input
                type="text"
                value={placeQuery}
                onChange={(e) => searchPlace(e.target.value)}
                placeholder="Doğum yeri (örn. Ankara, Türkiye)"
                className={inputClass}
              />
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
          </div>
        </div>

        {error ? (
          <p className="mt-4 rounded-lg border border-danger/40 bg-danger/10 p-3 text-sm text-danger">
            {error}
          </p>
        ) : null}

        <button
          type="button"
          onClick={compare}
          disabled={loading}
          className="group mt-5 flex w-full items-center justify-center gap-3 rounded-full bg-cosmic py-5 text-base font-bold tracking-wide text-white shadow-glow transition-transform hover:scale-[1.02] disabled:opacity-60"
        >
          {loading ? (
            <>
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              İki kimlik karşılaştırılıyor...
            </>
          ) : (
            <>
              <span className="text-xl">⚯</span>
              Uyumu Hesapla
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </>
          )}
        </button>

        {result && narrative ? (
          <div id="compat-result" className="mt-12">
            <CompatibilityView result={result} narrative={narrative} />
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => {
                  setResult(null);
                  setNarrative(null);
                  setName('');
                  setDate('');
                  setPlaceQuery('');
                  setPlace(null);
                }}
                className="text-sm text-muted hover:text-gold"
              >
                Başka biriyle karşılaştır
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
