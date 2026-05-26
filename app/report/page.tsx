'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { CosmicBackground } from '@/components/CosmicBackground';
import { ReportCard } from '@/components/ReportCard';
import { StarTreeOfLife } from '@/components/StarTreeOfLife';
import { BirthChartWheel } from '@/components/BirthChartWheel';
import { CharacterStats } from '@/components/CharacterStats';
import { ConceptCard } from '@/components/ConceptCard';
import { useSoulStore } from '@/lib/store';
import { captureNode, downloadDataUrl, shareDataUrl } from '@/lib/share';
import { premiumOpen } from '@/lib/feature-flags';
import { buildConceptDecks } from '@/lib/concepts';

export default function ReportPage() {
  const router = useRouter();
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
          <p className="text-base text-ink">Henüz bir karne yok.</p>
          <button
            type="button"
            onClick={() => router.replace('/birth')}
            className="mt-4 rounded-full bg-gold px-6 py-3 text-sm font-bold text-[#1a0a40]"
          >
            Karne Hazırla
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

        {/* Doğum anı sabit gezegen çarkı */}
        <section className="mt-8 rounded-3xl border border-panelBorder bg-panel/60 p-4 backdrop-blur md:p-6">
          <div className="mb-3 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold">DOĞUM ANI GÖKYÜZÜ</p>
            <p className="mt-1 font-display text-2xl text-ink">Yıldızlar sana ne söylüyordu</p>
            <p className="mt-1 text-[12px] text-muted">
              {report.birth.birthDate} · {report.birth.birthTime} · {report.birth.birthPlace}
            </p>
          </div>
          <div className="mx-auto max-w-xl">
            <BirthChartWheel chart={report.chart} />
          </div>
        </section>

        {/* Yıldız Yaşam Ağacı animasyonu */}
        <section className="mt-6 rounded-3xl border border-panelBorder bg-panel/60 p-4 backdrop-blur md:p-6">
          <div className="mb-3 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold">YILDIZ YAŞAM AĞACI</p>
            <p className="mt-1 font-display text-2xl text-ink">Doğumundan bugüne yıldızların izi</p>
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
            {working === 'share' ? 'Hazırlanıyor...' : 'Görsel Olarak Paylaş'}
          </button>
          <button
            type="button"
            onClick={onDownload}
            disabled={working !== null}
            className="rounded-full border border-panelBorder bg-panel px-6 py-3 text-sm font-bold text-ink hover:border-gold"
          >
            {working === 'download' ? 'Hazırlanıyor...' : 'PNG İndir'}
          </button>
        </div>

        {/* Kozmik Anlatın — zenginleştirilmiş bölümler */}
        <article className="mt-10 rounded-2xl border border-panelBorder bg-panel p-6 md:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">Kozmik Anlatın</p>
          <h2 className="mt-1 font-display text-3xl text-ink">{report.birth.fullName}, hikâyen</h2>

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
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-gold">RUHUN HİKÂYESİ</p>
              <p className="mt-3 text-[15px] leading-relaxed text-ink">{report.sections.soulStory}</p>
            </section>
          ) : null}

          {report.sections.wisdoms.length > 0 ? (
            <section className="mt-6 rounded-2xl border border-success/30 bg-success/[0.04] p-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-success">BİLGELİKLERİN</p>
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
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-cosmic">GÖLGELERİN</p>
              <p className="mt-1 text-[11px] text-faint">
                "Kötü huy" değil; tanışılması gereken kapılar.
              </p>
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
            Kimlik kavramların — tıkla, derinleş
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

        {/* Premium showcase */}
        <section className={`mt-10 rounded-2xl border p-6 ${isPremium ? 'border-gold/60 bg-gold/[0.08]' : 'border-panelBorder bg-panel'}`}>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">
            {isPremium ? 'LANSMAN PROMOSU · ÜCRETSİZ AÇIK' : 'YAKINDA'}
          </p>
          <h3 className="mt-2 font-display text-3xl text-ink">Premium Karneler</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {isPremium
              ? 'Lansman dönemi boyunca aşağıdaki tüm premium içerikler senin için açık. Haftalık & aylık döngüler, Solar Return, ilişki haritası, biyoritm grafiği, çakra tarama ve detaylı Human Design kapı analizleri.'
              : 'Haftalık & aylık döngüler, Solar Return analizleri, ilişki haritası, biyoritm grafiği, çakra tarama ve detaylı Human Design kapı analizleri.'}
          </p>
          <Link
            href="/premium"
            className="mt-4 inline-block text-sm font-bold text-gold underline"
          >
            Premium planlara bak →
          </Link>
        </section>

        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-muted hover:text-gold">
            Yeni karne oluştur
          </Link>
        </div>
      </div>
    </div>
  );
}
