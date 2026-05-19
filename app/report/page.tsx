'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { CosmicBackground } from '@/components/CosmicBackground';
import { ReportCard } from '@/components/ReportCard';
import { useSoulStore } from '@/lib/store';
import { captureNode, downloadDataUrl, shareDataUrl } from '@/lib/share';

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

  return (
    <div className="relative py-12 md:py-16">
      <CosmicBackground variant="cosmic" />
      <div className="mx-auto max-w-3xl px-6">
        <p className="text-center text-xs tracking-[0.3em] text-gold">{report.summary}</p>

        <div className="mt-6 flex justify-center">
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

        <section className="mt-8 rounded-2xl border border-gold/40 bg-gold/5 p-6">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">YAKINDA</p>
          <h3 className="mt-2 font-display text-3xl text-ink">Premium Karneler</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Haftalık & aylık döngüler, Solar Return analizleri, ilişki haritası, biyoritm grafiği,
            çakra tarama ve detaylı Human Design kapı analizleri.
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
