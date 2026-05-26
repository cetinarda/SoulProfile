'use client';

import { useEffect, useState } from 'react';

const SYSTEMS = [
  '🌞 Batı astrolojin hesaplanıyor...',
  '🌙 Ay düğümlerin bulunuyor...',
  '◇ Human Design tipin çıkarılıyor...',
  '⚯ Numerolojik kapın açılıyor...',
  '✨ Yıldız ırkın belirleniyor...',
  '🦋 Maya Tzolkin Kin\'in aranıyor...',
  '🪷 Vedik nakshatran konuşuyor...',
  '🐉 Çin yıldız çarkı çevriliyor...',
  'ᛒ Norse runun çağrılıyor...',
  '🃏 Tarot doğum kartların açılıyor...',
  '🌀 Çakra dengesi okunuyor...',
  '⚛ Element profilin sentezleniyor...',
  '🔮 Kuzey Düğüm görevin dinleniyor...',
  '🕯 Güney Düğüm tortun konuşuyor...',
  '💫 Galaktik mührün aranıyor...',
  '📜 Ruhsal hikâyen yazılıyor...',
  '🌌 Bilgeliklerin toplanıyor...',
  '◐ Gölgelerin haritalanıyor...',
  '⚔ Karakter güçlerin ölçülüyor...',
  '✦ Kozmik kimliğin sentezleniyor...',
];

export function CosmicLoader() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % SYSTEMS.length);
    }, 450);
    return () => clearInterval(t);
  }, []);

  const progress = ((idx + 1) / SYSTEMS.length) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg/95 backdrop-blur">
      <div className="starfield" />
      <div className="relative max-w-md px-6 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center">
          <span className="absolute h-20 w-20 animate-ping rounded-full border-2 border-gold/40" />
          <span className="absolute h-14 w-14 animate-ping rounded-full border border-gold/60 [animation-delay:0.5s]" />
          <span className="relative text-4xl">✦</span>
        </div>

        <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-gold">
          KARNEN HAZIRLANIYOR
        </p>
        <h2 className="mt-3 font-display text-3xl text-ink">
          20 sistem konuşuyor...
        </h2>
        <p className="mt-5 min-h-[28px] text-sm leading-relaxed text-ink transition-opacity">
          {SYSTEMS[idx]}
        </p>

        <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-gold via-nebula to-cosmic transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-[11px] text-faint">{idx + 1} / {SYSTEMS.length}</p>
      </div>
    </div>
  );
}
