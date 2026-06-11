// Open-Meteo geocoding — anahtarsız.
// https://open-meteo.com/en/docs/geocoding-api
//
// iOS Capacitor (capacitor://localhost origin) altında Open-Meteo CORS başlığı
// bu scheme'i kabul etmiyor → WKWebView preflight başarısız → fetch throw eder.
// Native'de @capacitor/core'un CapacitorHttp'sini kullanıyoruz: HTTP isteği
// WebView'ın DIŞINDA, native katmanda yapılır → CORS yok.
//
// ÖNEMLİ: @capacitor/core STATİK import edilir. Eski kod `new Function(...import)`
// ile dinamik import ediyordu; webpack bunu bundle'layamadığı için native'de
// `capacitor://localhost/@capacitor/core` → 404 → her zaman fail ediyordu.
// Statik import doğru bundle'lanır ve hem web hem native'de çalışır.

import { Capacitor, CapacitorHttp } from '@capacitor/core';

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

async function fetchJson(url: string): Promise<{ results?: RawHit[] } | null> {
  // Native: CapacitorHttp (CORS bypass)
  if (Capacitor.isNativePlatform()) {
    try {
      const res = await CapacitorHttp.get({ url, headers: { Accept: 'application/json' } });
      if (res.status >= 200 && res.status < 300) {
        const d = res.data;
        if (typeof d === 'string') {
          try {
            return JSON.parse(d);
          } catch {
            return null;
          }
        }
        return d as { results?: RawHit[] };
      }
      return null;
    } catch {
      return null;
    }
  }

  // Web: normal fetch (Open-Meteo web origin'lerde CORS *'a izin verir)
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
