'use client';

/**
 * iOS deep link / custom scheme handler.
 * soulprofile://match?i=<token> formatındaki URL'leri kabul eder.
 * Bilinmeyen path/host → reddedilir (open-redirect koruması).
 */

const ALLOWED_HOSTS = new Set(['match', 'report', 'compatibility', 'premium', 'settings']);
const ALLOWED_PARAM_KEYS = new Set(['i', 'ref', 'session_id', 'canceled', 'tab']);

type AppUrlOpenEvent = { url: string };

let initialized = false;
let listener:
  | ((opts: { eventName: string; callback: (e: AppUrlOpenEvent) => void }) => Promise<unknown>)
  | null
  | undefined;

async function loadCapacitorApp() {
  if (listener !== undefined) return listener;
  if (typeof window === 'undefined') {
    listener = null;
    return listener;
  }
  try {
    const dynImport = new Function('m', 'return import(m)') as (
      m: string,
    ) => Promise<{
      App: {
        addListener: (
          eventName: string,
          callback: (e: AppUrlOpenEvent) => void,
        ) => Promise<unknown>;
      };
    }>;
    const mod = await dynImport('@capacitor/app');
    listener = ({ eventName, callback }) => mod.App.addListener(eventName, callback);
  } catch {
    listener = null;
  }
  return listener;
}

function safeRoute(url: string): string | null {
  try {
    const parsed = new URL(url);
    const host = parsed.host || parsed.hostname;
    if (!ALLOWED_HOSTS.has(host)) return null;

    const params: string[] = [];
    parsed.searchParams.forEach((value, key) => {
      if (!ALLOWED_PARAM_KEYS.has(key)) return;
      // Param value length cap — abuse koruması
      if (value.length > 4096) return;
      params.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    });

    const query = params.length ? `?${params.join('&')}` : '';
    return `/${host}${query}`;
  } catch {
    return null;
  }
}

export async function initDeepLink(): Promise<void> {
  if (initialized) return;
  const add = await loadCapacitorApp();
  if (!add) return;
  initialized = true;
  await add({
    eventName: 'appUrlOpen',
    callback: (event: AppUrlOpenEvent) => {
      const route = safeRoute(event.url);
      if (!route) {
        console.warn('[deep-link] rejected', event.url);
        return;
      }
      // Soft navigation — full reload yerine pushState
      if (typeof window !== 'undefined') {
        window.history.pushState({}, '', route);
        // Next router'ı route'a yönlendir
        window.dispatchEvent(new Event('popstate'));
      }
    },
  });
}
