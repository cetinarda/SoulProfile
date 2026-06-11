'use client';

import { useRouter } from 'next/navigation';
import { isCapacitorNative } from '@/lib/platform';

/**
 * Capacitor iOS statik export'unda Next App Router'ın RSC soft-navigation'ı
 * `/route.txt` payload'ını arar — bu dosyalar capacitor:// origin'de yok,
 * navigation ölür. Native ortamda tam-sayfa navigasyona düşeriz; WebView
 * directory-index'i (`/report/` → index.html) doğru çözer. Web'de hızlı SPA
 * navigation korunur.
 */

export function toDirUrl(path: string): string {
  const hashIdx = path.indexOf('#');
  const hash = hashIdx >= 0 ? path.slice(hashIdx) : '';
  let base = hashIdx >= 0 ? path.slice(0, hashIdx) : path;
  // query'i varsa dokunma; dosya uzantısı varsa dokunma; yoksa trailing slash
  if (!base.includes('?') && !base.endsWith('/') && !/\.\w+$/.test(base)) {
    base += '/';
  }
  return base + hash;
}

export function useNav() {
  const router = useRouter();
  return {
    push(path: string) {
      if (isCapacitorNative()) window.location.assign(toDirUrl(path));
      else router.push(path);
    },
    replace(path: string) {
      if (isCapacitorNative()) window.location.replace(toDirUrl(path));
      else router.replace(path);
    },
  };
}
