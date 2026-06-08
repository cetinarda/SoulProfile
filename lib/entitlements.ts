'use client';

// Ücretsiz kullanım limiti:
//  - 1 kendi karnesi
//  - 1 ikili uyum karşılaştırması (1 başka kişinin haritası)
// Limit aşılınca premium ($4.99 tek seferlik) gerekir.
// iOS Capacitor build = peşin paid app → her zaman premium.
//
// CANONICAL SOURCE: Supabase 'entitlements' tablosu (RLS-protected select).
// Webhook (Stripe + RevenueCat) yazar, client okur.
// localStorage SADECE UI cache — ana karar değil. Boot'ta refreshEntitlement()
// canonical state'i çeker; off-line için cache 24 saat geçerli.

import { isCapacitorNative } from './platform';
import { getSupabase } from './supabase';

const KEY_PREMIUM = 'soulprofile.premium';
const KEY_PREMIUM_TS = 'soulprofile.premium.checkedAt';
const KEY_REPORTS = 'soulprofile.usage.reports';
const KEY_COMPAT = 'soulprofile.usage.compat';

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

export const FREE_REPORT_LIMIT = 1;
export const FREE_COMPAT_LIMIT = 1;

function readInt(key: string): number {
  if (typeof localStorage === 'undefined') return 0;
  const v = Number(localStorage.getItem(key) ?? '0');
  return Number.isFinite(v) ? v : 0;
}

function writeInt(key: string, n: number) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(key, String(n));
}

export function hasPremium(): boolean {
  if (isCapacitorNative()) return true; // iOS peşin satın alındı
  if (typeof localStorage === 'undefined') return false;
  return localStorage.getItem(KEY_PREMIUM) === '1';
}

export function grantPremium() {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(KEY_PREMIUM, '1');
    localStorage.setItem(KEY_PREMIUM_TS, String(Date.now()));
  }
}

export function revokePremium() {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(KEY_PREMIUM);
    localStorage.removeItem(KEY_PREMIUM_TS);
  }
}

/**
 * Canonical entitlement check — Supabase'ten okur, localStorage'ı senkronlar.
 * Auth'lu kullanıcı varsa server-side truth kazanır; yoksa localStorage'a düşer.
 * Boot'ta + premium-gated aksiyon öncesi çağrılmalı.
 */
export async function refreshEntitlement(): Promise<boolean> {
  if (isCapacitorNative()) return true; // iOS paid app
  const sb = getSupabase();
  if (!sb) return hasPremium();
  try {
    const { data: userResult } = await sb.auth.getUser();
    const user = userResult?.user;
    if (!user) return hasPremium();

    const { data, error } = await sb
      .from('entitlements')
      .select('active, expires_at')
      .eq('user_id', user.id)
      .eq('entitlement', 'premium')
      .eq('active', true)
      .limit(1);

    if (error) return hasPremium();

    const row = data?.[0] as { active?: boolean; expires_at?: string | null } | undefined;
    const valid = !!row?.active && (!row.expires_at || new Date(row.expires_at).getTime() > Date.now());

    if (valid) grantPremium();
    else revokePremium();
    return valid;
  } catch {
    return hasPremium();
  }
}

/** localStorage cache 24 saatten eski mi? */
export function isCacheStale(): boolean {
  if (typeof localStorage === 'undefined') return true;
  const ts = Number(localStorage.getItem(KEY_PREMIUM_TS) ?? '0');
  return Date.now() - ts > CACHE_TTL_MS;
}

export function togglePremium(): boolean {
  if (hasPremium()) {
    revokePremium();
    return false;
  }
  grantPremium();
  return true;
}

export function reportCount(): number {
  return readInt(KEY_REPORTS);
}

export function compatCount(): number {
  return readInt(KEY_COMPAT);
}

export function canCreateReport(): boolean {
  return hasPremium() || reportCount() < FREE_REPORT_LIMIT;
}

export function canRunCompat(): boolean {
  return hasPremium() || compatCount() < FREE_COMPAT_LIMIT;
}

export function recordReport() {
  if (hasPremium()) return;
  writeInt(KEY_REPORTS, reportCount() + 1);
}

export function recordCompat() {
  if (hasPremium()) return;
  writeInt(KEY_COMPAT, compatCount() + 1);
}

/** Geliştirme/iade için sıfırlama */
export function resetUsage() {
  if (typeof localStorage === 'undefined') return;
  localStorage.removeItem(KEY_REPORTS);
  localStorage.removeItem(KEY_COMPAT);
}
