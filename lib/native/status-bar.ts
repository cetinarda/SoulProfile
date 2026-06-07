'use client';

/**
 * iOS StatusBar tema senkronizasyonu. Capacitor değilse no-op.
 * Theme değiştiğinde light/dark icon state'i güncellenir.
 */

let setStyle:
  | ((opts: { style: 'LIGHT' | 'DARK' | 'DEFAULT' }) => Promise<void>)
  | null
  | undefined;

async function load() {
  if (setStyle !== undefined) return setStyle;
  if (typeof window === 'undefined') {
    setStyle = null;
    return setStyle;
  }
  try {
    const dynImport = new Function('m', 'return import(m)') as (
      m: string,
    ) => Promise<{
      StatusBar: { setStyle: (opts: { style: 'LIGHT' | 'DARK' | 'DEFAULT' }) => Promise<void> };
    }>;
    const mod = await dynImport('@capacitor/status-bar');
    setStyle = mod.StatusBar.setStyle.bind(mod.StatusBar);
  } catch {
    setStyle = null;
  }
  return setStyle;
}

export function syncStatusBar(theme: 'light' | 'dark') {
  if (typeof window === 'undefined') return;
  load().then((fn) => {
    if (!fn) return;
    // Capacitor v6: Style.Light = light text (dark bg), Style.Dark = dark text (light bg)
    fn({ style: theme === 'dark' ? 'LIGHT' : 'DARK' }).catch(() => {
      // ignore — web or unsupported
    });
  });
}
