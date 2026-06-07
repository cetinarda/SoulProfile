'use client';

/**
 * Hafif dokunsal geri bildirim. iOS Capacitor → Impact Light, web → navigator.vibrate(8).
 * SSR-safe: window/navigator yoksa no-op.
 */

type Intensity = 'light' | 'medium' | 'heavy';

const VIBE_MS: Record<Intensity, number> = {
  light: 8,
  medium: 14,
  heavy: 22,
};

let capacitorImpact:
  | ((style: 'LIGHT' | 'MEDIUM' | 'HEAVY') => Promise<void>)
  | null
  | undefined;

async function loadCapacitor() {
  if (capacitorImpact !== undefined) return capacitorImpact;
  if (typeof window === 'undefined') {
    capacitorImpact = null;
    return capacitorImpact;
  }
  try {
    const dynImport = new Function('m', 'return import(m)') as (
      m: string,
    ) => Promise<{
      Haptics: { impact: (opts: { style: 'LIGHT' | 'MEDIUM' | 'HEAVY' }) => Promise<void> };
    }>;
    const mod = await dynImport('@capacitor/haptics');
    capacitorImpact = (style) => mod.Haptics.impact({ style });
  } catch {
    capacitorImpact = null;
  }
  return capacitorImpact;
}

export function tap(intensity: Intensity = 'light') {
  if (typeof window === 'undefined') return;
  loadCapacitor().then((impact) => {
    if (impact) {
      impact(intensity.toUpperCase() as 'LIGHT' | 'MEDIUM' | 'HEAVY').catch(() => {
        webVibrate(intensity);
      });
    } else {
      webVibrate(intensity);
    }
  });
}

function webVibrate(intensity: Intensity) {
  if (typeof navigator === 'undefined') return;
  const nav = navigator as Navigator & { vibrate?: (p: number | number[]) => boolean };
  if (typeof nav.vibrate === 'function') {
    try {
      nav.vibrate(VIBE_MS[intensity]);
    } catch {
      // ignore
    }
  }
}
