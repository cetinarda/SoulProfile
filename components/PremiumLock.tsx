'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { Link } from '@/components/Link';
import { hasPremium } from '@/lib/entitlements';
import { useT } from '@/lib/i18n';

/**
 * Freemium teaser — premium içeriği blur'lu ve merak uyandıran kilit altında
 * gösterir. Ücretsiz kullanıcı `teaser` (ilk birkaç cümle) görür, gerisi
 * blur + "Aç" CTA. Premium kullanıcı tüm `children`'i normal görür.
 *
 * Apple guideline 3.1.2: "free preview + paid full" örüntüsü kabul edilir.
 */

type Props = {
  /** Premium'da gösterilen tam içerik */
  children: ReactNode;
  /** Free'de gösterilen kısa önizleme (ilk 1-2 paragraf veya başlık) */
  teaser?: ReactNode;
  /** Kilit altındaki içeriğin türü — CTA metni için */
  kicker?: string;
  /** Merak uyandırıcı tek cümle (kilit kartında) */
  hint?: string;
  /** Kilit kart yüksekliği — preview blur'unun ne kadarı görünsün */
  previewMaxHeight?: number;
};

export function PremiumLock({
  children,
  teaser,
  kicker,
  hint,
  previewMaxHeight = 180,
}: Props) {
  const { locale } = useT();
  const [mounted, setMounted] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    setMounted(true);
    setUnlocked(hasPremium());
  }, []);

  // SSR ve ilk render'da tutarlı: kilit kartı varsayılan (hidrasyon güvenli)
  if (!mounted || !unlocked) {
    return (
      <div className="relative">
        {teaser ? <div className="mb-4">{teaser}</div> : null}

        {/* Blur'lu preview — children'ın üst kısmı sisli görünür */}
        <div
          aria-hidden
          className="relative overflow-hidden rounded-3xl"
          style={{ maxHeight: previewMaxHeight }}
        >
          <div className="pointer-events-none select-none blur-[6px] saturate-75 opacity-70">
            {children}
          </div>
          {/* alttan gradient fade → kilit kartına geçiş */}
          <div
            className="absolute inset-x-0 bottom-0 h-24"
            style={{
              background:
                'linear-gradient(to bottom, transparent, var(--bg) 90%)',
            }}
          />
        </div>

        {/* Kilit kartı — CTA */}
        <div className="mt-3 rounded-3xl border border-gold/40 bg-gradient-to-br from-gold/[0.08] via-cosmic/[0.06] to-transparent p-6 text-center">
          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-gold/50 bg-bg/60">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M6 10V8a6 6 0 1 1 12 0v2m-9 4h6m-9 6h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2Z"
                stroke="#f5d061"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          {kicker ? (
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold">
              {kicker}
            </p>
          ) : null}
          <p className="mt-2 font-display text-xl text-ink md:text-2xl">
            {hint ??
              (locale === 'tr'
                ? 'Yıldızların burada söylediklerinin tamamı kilitli'
                : 'The full reading lies behind this veil')}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {locale === 'tr'
              ? '$19.99 tek seferlik · ya da $4.99/ay'
              : '$19.99 one-time · or $4.99/mo'}
          </p>
          <Link
            href="/premium"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3 text-sm font-bold tracking-wide text-[#1a0a40] transition-transform hover:scale-[1.02]"
            style={{ boxShadow: '0 16px 44px -20px rgba(245, 208, 97, 0.55)' }}
          >
            <span>✦</span>
            {locale === 'tr' ? 'Gökyüzünü Aç' : 'Unlock Your Sky'}
            <span>→</span>
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
