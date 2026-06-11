'use client';

import { useEffect } from 'react';
import { toDirUrl } from '@/lib/nav';

/**
 * Capacitor iOS statik export navigation fix.
 *
 * Next.js App Router'ın <Link> soft-navigation'ı RSC payload'ını
 * `/route.txt` olarak fetch etmeye çalışır. Statik export + capacitor://
 * origin'de bu dosyalar YOK → "Failed to fetch RSC payload" → navigation
 * ölür, butonlar tıklanmıyor gibi görünür.
 *
 * Çözüm: native ortamda tüm iç link tıklamalarını capture-phase'de yakala
 * (React'in onClick'inden ÖNCE), preventDefault + tam-sayfa navigasyon yap.
 * WebView `/compatibility/` → index.html'i doğru çözer.
 *
 * Web'de hiçbir şey yapmaz — SPA navigation korunur.
 */
export function CapacitorNav() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const w = window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } };
    if (!w.Capacitor?.isNativePlatform?.()) return;

    function onClick(e: MouseEvent) {
      if (e.defaultPrevented) return;
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const target = e.target as HTMLElement | null;
      const a = target?.closest('a');
      if (!a) return;

      const href = a.getAttribute('href');
      if (!href) return;
      // sadece iç linkler; dış URL / protocol-relative / yeni sekme → dokunma
      if (!href.startsWith('/') || href.startsWith('//')) return;
      if (a.getAttribute('target') === '_blank') return;
      if (a.hasAttribute('download')) return;

      e.preventDefault();
      e.stopPropagation();
      window.location.assign(toDirUrl(href));
    }

    document.addEventListener('click', onClick, true); // capture — React'ten önce
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  return null;
}
