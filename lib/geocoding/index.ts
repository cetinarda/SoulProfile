// Lightweight geocoding using Open-Meteo's public geocoding API (no key required).
// https://open-meteo.com/en/docs/geocoding-api

export type GeocodeResult = {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
};

export async function geocodePlace(query: string): Promise<GeocodeResult[]> {
  if (!query.trim()) return [];
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    query,
  )}&count=5&language=tr&format=json`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = (await res.json()) as {
    results?: Array<{
      name: string;
      country: string;
      latitude: number;
      longitude: number;
      timezone: string;
    }>;
  };
  return (data.results ?? []).map((r) => ({
    name: r.name,
    country: r.country,
    latitude: r.latitude,
    longitude: r.longitude,
    timezone: r.timezone,
  }));
}
