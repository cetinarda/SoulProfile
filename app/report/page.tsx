'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { CosmicBackground } from '@/components/CosmicBackground';
import { ReportCard } from '@/components/ReportCard';
import { StarTreeOfLife } from '@/components/StarTreeOfLife';
import { useSoulStore } from '@/lib/store';
import { captureNode, downloadDataUrl, shareDataUrl } from '@/lib/share';
import { premiumOpen } from '@/lib/feature-flags';

export default function ReportPage() {
  const router = useRouter();
  const report = useSoulStore((s) => s.report);
  const cardRef = useRef<HTMLDivElement>(null);
  const [working, setWorking] = useState<'share' | 'download' | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

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
  const s = report.systems;

  return (
    <div className="relative py-12 md:py-16">
      <CosmicBackground variant="cosmic" />
      <div className="mx-auto max-w-3xl px-6">
        <p className="text-center text-xs tracking-[0.3em] text-gold">{report.summary}</p>

        {/* Yıldız Yaşam Ağacı animasyonu */}
        <section className="mt-8 rounded-3xl border border-panelBorder bg-panel/60 p-4 backdrop-blur md:p-6">
          <div className="mb-3 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold">YILDIZ YAŞAM AĞACI</p>
            <p className="mt-1 font-display text-2xl text-ink">Doğumundan bugüne yıldızların izi</p>
            <p className="mt-1 text-[12px] text-muted">
              Her nokta bir gezegen pozisyonu, her çizgi bir kesişim. Dışta doğum, içte bugün.
            </p>
          </div>
          <StarTreeOfLife birthISO={report.createdAt && report.birth.birthDate
            ? `${report.birth.birthDate}T${report.birth.birthTime || '12:00'}:00Z`
            : new Date().toISOString()} />
        </section>

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

        <article className="mt-10 rounded-2xl border border-panelBorder bg-panel p-6 md:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">Kozmik Anlatın</p>
          <div className="mt-4 space-y-4">
            {report.narrative.split('\n\n').map((p, i) => (
              <p key={i} className="text-[15px] leading-relaxed text-ink">
                {p}
              </p>
            ))}
          </div>
        </article>

        {/* Detaylı sistem kartları */}
        <section className="mt-10 grid gap-4 md:grid-cols-2">
          <DetailCard
            kicker="MAYA TZOLKİN"
            title={`Kin ${s.maya.kin}`}
            highlight={`${s.maya.tone.tr} · ${s.maya.daySign.tr}`}
            body={`${s.maya.daySign.power}. ${s.maya.tone.power}.`}
          />
          <DetailCard
            kicker="VEDİK NAKSHATRA"
            title={s.vedic.nakshatra.name}
            highlight={`Pada ${s.vedic.pada} · ${s.vedic.nakshatra.deity}`}
            body={`Sembol: ${s.vedic.nakshatra.symbol}. ${s.vedic.nakshatra.power}.`}
          />
          <DetailCard
            kicker="ÇİN ZODYAK"
            title={s.chinese.signature}
            highlight={`${s.chinese.element.glyph} ${s.chinese.element.tr} · ${s.chinese.animal.glyph} ${s.chinese.animal.tr}`}
            body={`${s.chinese.element.power}. ${s.chinese.animal.traits}.`}
          />
          <DetailCard
            kicker="NORSE RUNE"
            title={`${s.norse.rune.glyph} ${s.norse.rune.name}`}
            highlight={s.norse.rune.meaning}
            body={s.norse.rune.power}
          />
          <DetailCard
            kicker="TAROT — KİŞİLİK KARTI"
            title={`${s.tarot.personality.glyph} ${s.tarot.personality.name}`}
            highlight={`#${s.tarot.personality.num}`}
            body={s.tarot.personality.power}
          />
          <DetailCard
            kicker="TAROT — RUH KARTI"
            title={`${s.tarot.soul.glyph} ${s.tarot.soul.name}`}
            highlight={`#${s.tarot.soul.num}`}
            body={s.tarot.soul.power}
          />
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

function DetailCard({
  kicker,
  title,
  highlight,
  body,
}: {
  kicker: string;
  title: string;
  highlight: string;
  body: string;
}) {
  return (
    <article className="rounded-2xl border border-panelBorder bg-panel p-5">
      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold">{kicker}</p>
      <h3 className="mt-2 font-display text-2xl text-ink">{title}</h3>
      <p className="mt-1 text-[12px] font-bold text-gold">{highlight}</p>
      <p className="mt-3 text-sm leading-relaxed text-muted">{body}</p>
    </article>
  );
}
