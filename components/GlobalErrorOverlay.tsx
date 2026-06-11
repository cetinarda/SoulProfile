'use client';

import { useEffect, useState } from 'react';

/**
 * Görünür hata yakalayıcı — Capacitor/iOS WKWebView'da Safari Web Inspector
 * olmadan runtime hatalarını ekranda gösterir. Happy-path'te HİÇBİR şey
 * render etmez (hata yoksa görünmez). Bir hata/rejection olursa tam ekran
 * kırmızı overlay açar; "Kapat"a basıp uygulamayı kullanmaya devam edebilir.
 *
 * Bu, "butonlar çalışmıyor" gibi sessiz hydration/chunk-load hatalarını
 * teşhis etmek için kalıcı bir güvenlik ağıdır.
 */

type Captured = { kind: string; message: string; stack?: string; at: string };

export function GlobalErrorOverlay() {
  const [errors, setErrors] = useState<Captured[]>([]);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    function push(c: Captured) {
      setErrors((prev) => (prev.length >= 8 ? prev : [...prev, c]));
      setOpen(true);
    }

    function onError(e: ErrorEvent) {
      push({
        kind: 'error',
        message: e.message || String(e.error ?? 'unknown'),
        stack: e.error?.stack ?? `${e.filename}:${e.lineno}:${e.colno}`,
        at: new Date().toISOString().slice(11, 19),
      });
    }

    function onRejection(e: PromiseRejectionEvent) {
      const r = e.reason;
      push({
        kind: 'promise',
        message: r instanceof Error ? r.message : String(r),
        stack: r instanceof Error ? r.stack : undefined,
        at: new Date().toISOString().slice(11, 19),
      });
    }

    // React 19 hydration mismatch'leri window.error'a değil console.error'a
    // düşer — onları da yakala (sessiz "render oldu ama tıklanmıyor" sebebi).
    const origConsoleError = console.error;
    console.error = (...args: unknown[]) => {
      try {
        const text = args
          .map((a) => (a instanceof Error ? a.message : typeof a === 'string' ? a : JSON.stringify(a)))
          .join(' ');
        if (/hydrat|did not match|Minified React error|Maximum update|Cannot read|is not a function|is not defined/i.test(text)) {
          push({ kind: 'console', message: text.slice(0, 600), at: new Date().toISOString().slice(11, 19) });
        }
      } catch {
        /* ignore */
      }
      origConsoleError.apply(console, args as []);
    };

    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onRejection);
    return () => {
      console.error = origConsoleError;
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onRejection);
    };
  }, []);

  if (errors.length === 0 || !open) return null;

  return (
    <div
      role="alertdialog"
      aria-label="Runtime error"
      onClick={(e) => {
        // Tüm overlay tıklanabilir — React onClick'i ölü olsa bile aşağıdaki
        // native fallback dismiss eder.
        if ((e.target as HTMLElement).dataset?.dismiss) setOpen(false);
      }}
      ref={(node) => {
        if (!node) return;
        // React handler'lar bağlanmamış olsa bile çalışan native dismiss yolu.
        const handler = (ev: Event) => {
          const t = ev.target as HTMLElement | null;
          if (t?.dataset?.dismiss) setOpen(false);
        };
        node.addEventListener('click', handler);
        node.addEventListener('touchend', handler);
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2147483647,
        background: 'rgba(20, 0, 0, 0.94)',
        color: '#ffd7d7',
        font: '12px/1.5 ui-monospace, Menlo, monospace',
        padding: 'max(20px, env(safe-area-inset-top)) 16px 16px',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <strong style={{ color: '#ff6b6b', fontSize: 14 }}>⚠︎ {errors.length} runtime hata</strong>
        <button
          type="button"
          data-dismiss="1"
          onClick={() => setOpen(false)}
          style={{
            background: '#ff6b6b',
            color: '#200',
            border: 'none',
            borderRadius: 8,
            padding: '10px 18px',
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          Kapat
        </button>
      </div>
      <p style={{ marginTop: 0, marginBottom: 10, color: '#ffb0b0', fontSize: 11 }}>
        Bu hatayı (1. kart) Claude'a yapıştır — buton sorununun kök nedeni budur.
      </p>
      {errors.map((e, i) => (
        <div
          key={i}
          style={{
            marginBottom: 10,
            padding: 10,
            background: 'rgba(255,255,255,0.06)',
            borderRadius: 8,
            borderLeft: '3px solid #ff6b6b',
          }}
        >
          <div style={{ color: '#ff9b9b' }}>
            [{e.at}] {e.kind}
          </div>
          <div style={{ color: '#fff', fontWeight: 700, margin: '4px 0', wordBreak: 'break-word' }}>
            {e.message}
          </div>
          {e.stack ? (
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0, opacity: 0.8 }}>
              {e.stack.split('\n').slice(0, 6).join('\n')}
            </pre>
          ) : null}
        </div>
      ))}
    </div>
  );
}
