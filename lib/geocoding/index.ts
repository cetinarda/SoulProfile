// Open-Meteo geocoding — anahtarsız.
// https://open-meteo.com/en/docs/geocoding-api
//
// iOS Capacitor (capacitor://localhost origin) altında Open-Meteo CORS başlığı
// bu scheme'i kabul etmiyor → preflight başarısız → fetch throw eder.
// Native'de @capacitor/core CapacitorHttp plugin'ini kullanıyoruz: WebView
// dışından native HTTP yapıyor, CORS yok.

import { isCapacitorNative } from '../platform';

export type GeocodeResult = {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
};

type RawHit = {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
};

type CapacitorHttpResponse = { data: { results?: RawHit[] } | string; status: number };
type CapacitorHttpModule = {
  CapacitorHttp: {
    get: (opts: { url: string; headers?: Record<string, string> }) => Promise<CapacitorHttpResponse>;
  };
};

let nativeHttp: CapacitorHttpModule['CapacitorHttp']['get'] | null | undefined;

async function loadNativeHttp() {
  if (nativeHttp !== undefined) return nativeHttp;
  if (typeof window === 'undefined') {
    nativeHttp = null;
    return null;
  }
  try {
    const dynImport = new Function('m', 'return import(m)') as (m: string) => Promise<CapacitorHttpModule>;
    const mod = await dynImport('@capacitor/core');
    nativeHttp = mod.CapacitorHttp.get.bind(mod.CapacitorHttp);
  } catch {
    nativeHttp = null;
  }
  return nativeHttp;
}

async function fetchJson(url: string): Promise<{ results?: RawHit[] } | null> {
  if (isCapacitorNative()) {
    const http = await loadNativeHttp();
    if (http) {
      try {
        const res = await http({ url, headers: { Accept: 'application/json' } });
        if (res.status >= 200 && res.status < 300) {
          // CapacitorHttp 'data'yı JSON ise parse edip verir; string gelirse parse et.
          if (typeof res.data === 'string') {
            try {
              return JSON.parse(res.data);
            } catch {
              return null;
            }
          }
          return res.data;
        }
        return null;
      } catch {
        return null;
      }
    }
  }
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return (await res.json()) as { results?: RawHit[] };
  } catch {
    return null;
  }
}

export async function geocodePlace(query: string, language: string = 'tr'): Promise<GeocodeResult[]> {
  if (!query.trim()) return [];
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    query,
  )}&count=5&language=${encodeURIComponent(language)}&format=json`;
  const data = await fetchJson(url);
  if (!data) return [];
  return (data.results ?? []).map((r) => ({
    name: r.name,
    country: r.country,
    latitude: r.latitude,
    longitude: r.longitude,
    timezone: r.timezone,
  }));
}
