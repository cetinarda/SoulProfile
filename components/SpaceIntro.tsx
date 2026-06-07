'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'soulprofile.spaceIntro.seen';

export function SpaceIntro() {
  const [show, setShow] = useState(false);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Hareket azaltma tercihi varsa intro yok
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    if (localStorage.getItem(STORAGE_KEY) === '1') return;
    setShow(true);
    const tFade = setTimeout(() => setFade(true), 1600);
    const tHide = setTimeout(() => {
      setShow(false);
      try {
        localStorage.setItem(STORAGE_KEY, '1');
      } catch {
        /* private mode */
      }
    }, 2400);
    return () => {
      clearTimeout(tFade);
      clearTimeout(tHide);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center bg-bg"
      style={{
        opacity: fade ? 0 : 1,
        transition: 'opacity 800ms cubic-bezier(0.4, 0, 0.6, 1)',
      }}
    >
      <div className="space-intro-glow" />
      <div className="relative text-center">
        <div className="space-intro-sigil text-6xl text-gold">✦</div>
        <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.5em] text-gold/70">
          SOULPROFILE
        </p>
      </div>

      <style jsx>{`
        .space-intro-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(40% 30% at 50% 50%, rgba(124, 92, 255, 0.35), transparent 70%);
          animation: spaceGlow 2.4s ease-out forwards;
        }
        .space-intro-sigil {
          animation: spaceBreath 2.4s ease-out forwards;
        }
        @keyframes spaceGlow {
          0%   { opacity: 0; transform: scale(0.7); }
          40%  { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.4); }
        }
        @keyframes spaceBreath {
          0%   { opacity: 0; transform: scale(0.5); letter-spacing: 0.2em; }
          50%  { opacity: 1; transform: scale(1); letter-spacing: 0; }
          100% { opacity: 0.85; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}
