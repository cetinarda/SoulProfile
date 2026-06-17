'use client';

// Freemium stratejisi:
//  - Ücretsiz: SINIRSIZ karne + sınırsız uyum, AMA her karnenin/uyumun
//    sadece "üst tabakası" (teaser) gösterilir. Derin AI yorumları,
//    wisdoms/shadows, 3D solar, BirthChartWheel, vb. blur'lu kilit altında.
//  - Premium ($4.99 tek seferlik): tüm blur kilitler açılır.
//  - iOS Capacitor build = peşin paid app → her zaman premium.
//
// CANONICAL SOURCE: Supabase 'entitlements' tablosu (RLS-protected select).
// Webhook (Stripe + RevenueCat) yazar, client okur.
// localStorage SADECE UI cache — ana karar değil. Boot'ta refreshEntitlement()
// canonical state'i çeker; off-line için cache 24 saat geçerli.

import { isCapacitorNative } from './platform';
import { getSupabase } from './supabase';

const KEY_PREMIUM = 'soulprofile.premium';
const KEY_PREMIUM_TS = 'soulprofile.premium.checkedAt';

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

export function hasPremium(): boolean {
  if (isCapacitorNative()) return false; // iOS — RevenueCat ile aç
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
 * Boot'ta + premium-gated aksiyon öncesi çağrılmalı.
 */
export async function refreshEntitlement(): Promise<boolean> {
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

// ─────────────────────────────────────────────────────────────
// Geri uyumlu sayım API'si — artık SINIRSIZ. Çağrı yerleri
// bozulmasın diye export'lar duruyor, hiç gate yok.
// Yeni kod hasPremium() + PremiumLock ile content-level gate yapar.

export const FREE_REPORT_LIMIT = Infinity;
export const FREE_COMPAT_LIMIT = Infinity;

export function canCreateReport(): boolean { return true; }
export function canRunCompat(): boolean { return true; }
export function recordReport(): void { /* sayım yok */ }
export function recordCompat(): void { /* sayım yok */ }
export function reportCount(): number { return 0; }
export function compatCount(): number { return 0; }
export function resetUsage(): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.removeItem('soulprofile.usage.reports');
  localStorage.removeItem('soulprofile.usage.compat');
}
