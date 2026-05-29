'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { CosmicBackground } from '@/components/CosmicBackground';
import { ReportCard } from '@/components/ReportCard';
import { StarTreeOfLife } from '@/components/StarTreeOfLife';
import { BirthChartWheel } from '@/components/BirthChartWheel';
import { SolarSystem3D } from '@/components/SolarSystem3D';
import { CharacterStats } from '@/components/CharacterStats';
import { ConceptCard } from '@/components/ConceptCard';
import { useSoulStore } from '@/lib/store';
import { captureNode, downloadDataUrl, shareDataUrl } from '@/lib/share';
import { premiumOpen } from '@/lib/feature-flags';
import { buildConceptDecks } from '@/lib/concepts';
import { useT } from '@/lib/i18n';

export default function ReportPage() {
  const router = useRouter();
  const { t, locale } = useT();
  const report = useSoulStore((s) => s.report);
  const cardRef = useRef<HTMLDivElement>(null);
  const [working, setWorking] = useState<'share' | 'download' | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const concepts = useMemo(() => (report ? buildConceptDecks(report) : []), [report]);

  if (hydrated && !report) {
    return (
      <div className="relative flex min-h-[70vh] items-center justify-center px-6">
        <CosmicBackground variant="cosmic" />
        <div className="rounded-2xl border border-panelBorder bg-panel p-8 text-center">
          <p className="text-base text-ink">{t('report.empty')}</p>
          <button
            type="button"
            onClick={() => router.replace('/birth')}
            className="mt-4 rounded-full bg-gold px-6 py-3 text-sm font-bold text-[#1a0a40]"
          >
            {t('report.createCard')}
          </button>
        </div>
      </div>
    );
  }

  if (!report) return null;

  async function onShare() {
    if (!cardRef.current) return;
    setWorking('share');
    try {
      const dataUrl = await captureNode(cardRef.current);
      await shareDataUrl(dataUrl);
    } catch (err) {
      console.error(err);
    } finally {
      setWorking(null);
    }
  }

  async function onDownload() {
    if (!cardRef.current) return;
    setWorking('download');
    try {
      const dataUrl = await captureNode(cardRef.current);
      downloadDataUrl(dataUrl);
    } catch (err) {
      console.error(err);
    } finally {
      setWorking(null);
    }
  }

  const isPremium = premiumOpen();
  const birthISO =
    report.birth.birthDate
      ? `${report.birth.birthDate}T${report.birth.birthTime || '12:00'}:00Z`
      : new Date().toISOString();

  return (
    <div className="relative py-12 md:py-16">
      <CosmicBackground variant="cosmic" />
      <div className="mx-auto max-w-4xl px-4 md:px-6">
        <p className="text-center text-xs tracking-[0.3em] text-gold">{report.summary}</p>

        {/* 3D Solar Sistem — touch ile döndürülebilir */}
        <section className="mt-8 rounded-3xl border border-gold/30 bg-panel/60 p-4 backdrop-blur md:p-6">
          <div className="mb-3 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold">{t('report.sky3d')}</p>
            <p className="mt-1 font-display text-2xl text-ink">{t('report.sky3dTitle')}</p>
            <p className="mt-1 text-[12px] text-muted">
              {report.birth.birthDate} · {report.birth.birthTime} · {report.birth.birthPlace}
            </p>
          </div>
          <SolarSystem3D chart={report.chart} />
        </section>

        {/* 2D Astrolojik harita — klasik görüm */}
        <section className="mt-6 rounded-3xl border border-panelBorder bg-panel/60 p-4 backdrop-blur md:p-6">
          <div className="mb-3 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold">{t('report.wheel')}</p>
            <p className="mt-1 font-display text-xl text-ink">{t('report.wheelTitle')}</p>
          </div>
          <div className="mx-auto max-w-xl">
            <BirthChartWheel chart={report.chart} />
          </div>
        </section>

        {/* Yıldız Yaşam Ağacı animasyonu */}
        <section className="mt-6 rounded-3xl border border-panelBorder bg-panel/60 p-4 backdrop-blur md:p-6">
          <div className="mb-3 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold">{t('report.tree')}</p>
            <p className="mt-1 font-display text-2xl text-ink">{t('report.treeTitle')}</p>
            <p className="mt-1 text-[12px] text-muted">
              Her gezegenin yolu, her çizgi bir kesişim. Dıştan içe — doğumdan bugüne.
            </p>
          </div>
          <StarTreeOfLife birthISO={birthISO} />
        </section>

        {/* Karakter Stat Kartı */}
        <section className="mt-6">
          <CharacterStats
            chart={report.chart}
            numerology={report.numerology}
            humanDesign={report.humanDesign}
          />
        </section>

        {/* Paylaşılabilir karne */}
        <div className="mt-8 flex justify-center">
          <ReportCard ref={cardRef} report={report} />
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={onShare}
            disabled={working !== null}
            className="rounded-full bg-gold px-6 py-3 text-sm font-bold text-[#1a0a40] disabled:opacity-60"
          >
            {working === 'share' ? t('report.preparing') : t('report.share')}
          </button>
          <button
            type="button"
            onClick={onDownload}
            disabled={working !== null}
            className="rounded-full border border-panelBorder bg-panel px-6 py-3 text-sm font-bold text-ink hover:border-gold"
          >
            {working === 'download' ? t('report.preparing') : t('report.download')}
          </button>
        </div>

        {/* Kozmik Anlatın — zenginleştirilmiş bölümler */}
        <article className="mt-10 rounded-2xl border border-panelBorder bg-panel p-6 md:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">{t('report.narrative')}</p>
          <h2 className="mt-1 font-display text-3xl text-ink">{report.birth.fullName}</h2>

          <div className="mt-6 space-y-4">
            {report.sections.opening ? (
              <p className="text-[15px] leading-relaxed text-ink">{report.sections.opening}</p>
            ) : null}
            {report.sections.astrology ? (
              <p className="text-[15px] leading-relaxed text-ink">{report.sections.astrology}</p>
            ) : null}
            {report.sections.humanDesign ? (
              <p className="text-[15px] leading-relaxed text-ink">{report.sections.humanDesign}</p>
            ) : null}
            {report.sections.callToAction ? (
              <p className="text-[15px] leading-relaxed text-ink">{report.sections.callToAction}</p>
            ) : null}
          </div>

          {report.sections.soulStory ? (
            <section className="mt-8 rounded-2xl border border-gold/30 bg-gold/[0.04] p-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-gold">{t('report.soulStory')}</p>
              <p className="mt-3 text-[15px] leading-relaxed text-ink">{report.sections.soulStory}</p>
            </section>
          ) : null}

          {report.sections.wisdoms.length > 0 ? (
            <section className="mt-6 rounded-2xl border border-success/30 bg-success/[0.04] p-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-success">{t('report.wisdoms')}</p>
              <ul className="mt-3 space-y-2">
                {report.sections.wisdoms.map((w, i) => (
                  <li key={i} className="flex gap-3 text-[14px] leading-relaxed text-ink">
                    <span className="text-success">✦</span>
                    <span className="flex-1">{w}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {report.sections.shadows.length > 0 ? (
            <section className="mt-6 rounded-2xl border border-cosmic/40 bg-cosmic/[0.06] p-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-cosmic">{t('report.shadows')}</p>
              <ul className="mt-3 space-y-2">
                {report.sections.shadows.map((s, i) => (
                  <li key={i} className="flex gap-3 text-[14px] leading-relaxed text-ink">
                    <span className="text-cosmic">◐</span>
                    <span className="flex-1">{s}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </article>

        {/* Detaylı sistem kartları — tıklanabilir */}
        <section className="mt-10">
          <h2 className="mb-4 text-center font-display text-2xl text-ink">
            {t('report.concepts')}
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {concepts.map((c) => (
              <ConceptCard
                key={c.kicker + c.title}
                kicker={c.kicker}
                title={c.title}
                highlight={c.highlight}
                short={c.short}
                details={c.details}
                accent={c.accent}
              />
            ))}
          </div>
        </section>

        {/* İkili uyum CTA — büyük, görsel */}
        <section className="mt-10 overflow-hidden rounded-3xl border border-cosmic/50 bg-gradient-to-br from-[#0b0524] via-[#1e1a6e] to-[#9d3cb1]/40 p-7 md:p-9">
          <div className="grid items-center gap-6 md:grid-cols-[1fr_auto]">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-cosmic">
                {t('home.path2.title')}
              </p>
              <h2 className="mt-3 font-display text-3xl leading-tight text-ink md:text-4xl">
                {t('report.compatCta')}
              </h2>
              <div className="mt-5 flex flex-wrap gap-3 text-[12px] text-ink">
                <span className="rounded-full border border-cosmic/40 bg-cosmic/[0.08] px-3 py-1">⚡ {locale === 'tr' ? 'Çekim' : 'Attraction'}</span>
                <span className="rounded-full border border-cosmic/40 bg-cosmic/[0.08] px-3 py-1">◐ {locale === 'tr' ? 'Hâkimiyet' : 'Dominance'}</span>
                <span className="rounded-full border border-cosmic/40 bg-cosmic/[0.08] px-3 py-1">📊 {locale === 'tr' ? 'Uyum skoru' : 'Score'}</span>
                <span className="rounded-full border border-cosmic/40 bg-cosmic/[0.08] px-3 py-1">📜 {locale === 'tr' ? 'AI yorum' : 'AI reading'}</span>
              </div>
            </div>
            <Link
              href="/compatibility"
              className="group inline-flex shrink-0 items-center gap-3 rounded-full bg-cosmic px-8 py-5 text-base font-bold tracking-wide text-white shadow-glow transition-transform hover:scale-105"
            >
              <span className="text-xl">⚯</span>
              {t('report.compatBtn')}
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </section>

        {/* Premium showcase — sadece premium yoksa göster */}
        {!isPremium ? (
          <section className="mt-10 rounded-2xl border border-gold/40 bg-gold/[0.06] p-6">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">
              {locale === 'tr' ? 'TAM ERİŞİM' : 'FULL ACCESS'}
            </p>
            <h3 className="mt-2 font-display text-3xl text-ink">
              {locale === 'tr' ? 'Sınırsız karne ve karşılaştırma' : 'Unlimited profiles & comparisons'}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {locale === 'tr'
                ? 'İlk karnen ve ilk uyum karşılaştırman ücretsiz. Daha fazlası için tek seferlik $4.99 ile tam erişimi aç.'
                : 'Your first profile and first compatibility check are free. Unlock full access with a one-time $4.99 for more.'}
            </p>
            <Link
              href="/premium"
              className="mt-4 inline-block rounded-full bg-gold px-6 py-3 text-sm font-bold text-[#1a0a40] shadow-glow"
            >
              {locale === 'tr' ? 'Tam Erişimi Aç · $4.99' : 'Unlock Full Access · $4.99'}
            </Link>
          </section>
        ) : null}

        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-muted hover:text-gold">
            {t('report.newCard')}
          </Link>
        </div>
      </div>
    </div>
  );
}
