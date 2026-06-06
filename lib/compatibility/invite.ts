// Basit MVP davet linki: doğum verisini base64 URL-safe encode et,
// /match?i=<token> ile karşılaşan kişinin doğum verisi taşınır.
// Backend YOK — viral döngünün ilk versiyonu.

import type { BirthInput } from '../types';

type InvitePayload = {
  n: string;       // name (full)
  d: string;       // YYYY-MM-DD
  t: string;       // HH:MM
  tk: 0 | 1;       // birthTimeKnown
  p: string;       // place display
  lat: number;
  lon: number;
  tz: string;
};

function toPayload(b: BirthInput): InvitePayload {
  return {
    n: b.fullName,
    d: b.birthDate,
    t: b.birthTime,
    tk: b.birthTimeKnown ? 1 : 0,
    p: b.birthPlace,
    lat: b.latitude,
    lon: b.longitude,
    tz: b.timezone,
  };
}

function fromPayload(p: InvitePayload): BirthInput {
  return {
    fullName: p.n,
    birthDate: p.d,
    birthTime: p.t,
    birthTimeKnown: p.tk === 1,
    birthPlace: p.p,
    latitude: p.lat,
    longitude: p.lon,
    timezone: p.tz,
  };
}

function b64UrlEncode(s: string): string {
  if (typeof btoa !== 'undefined') {
    return btoa(unescape(encodeURIComponent(s)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/g, '');
  }
  return Buffer.from(s, 'utf-8').toString('base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function b64UrlDecode(s: string): string {
  const pad = s.length % 4 === 0 ? '' : '='.repeat(4 - (s.length % 4));
  const std = s.replace(/-/g, '+').replace(/_/g, '/') + pad;
  if (typeof atob !== 'undefined') {
    return decodeURIComponent(escape(atob(std)));
  }
  return Buffer.from(std, 'base64').toString('utf-8');
}

export function encodeInvite(birth: BirthInput): string {
  const payload = toPayload(birth);
  return b64UrlEncode(JSON.stringify(payload));
}

export function decodeInvite(token: string): BirthInput | null {
  try {
    const json = b64UrlDecode(token);
    const payload = JSON.parse(json) as InvitePayload;
    if (!payload.d || !payload.lat || !payload.lon) return null;
    return fromPayload(payload);
  } catch {
    return null;
  }
}

export function inviteUrl(birth: BirthInput, origin?: string): string {
  const base = origin ?? (typeof window !== 'undefined' ? window.location.origin : 'https://soulprofile.life');
  return `${base}/match?i=${encodeURIComponent(encodeInvite(birth))}`;
}
