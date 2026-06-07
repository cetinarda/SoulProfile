'use client';

// Ücretsiz kullanım limiti:
//  - 1 kendi karnesi
//  - 1 ikili uyum karşılaştırması (1 başka kişinin haritası)
// Limit aşılınca premium ($4.99 tek seferlik) gerekir.
// iOS Capacitor build = peşin paid app → her zaman premium.

import { isCapacitorNative } from './platform';

const KEY_PREMIUM = 'soulprofile.premium';
const KEY_REPORTS = 'soulprofile.usage.reports';
const KEY_COMPAT = 'soulprofile.usage.compat';

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
  if (typeof localStorage !== 'undefined') localStorage.setItem(KEY_PREMIUM, '1');
}

export function revokePremium() {
  if (typeof localStorage !== 'undefined') localStorage.removeItem(KEY_PREMIUM);
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
