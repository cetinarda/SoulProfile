// Apple StoreKit 2 + Google Play Billing v6 üzerine RevenueCat soyutlaması.
// Web'de no-op (Stripe ile devam eder); iOS/Android'de RevenueCat SDK çağırılır.
// Sakin / mindfulness / spiritüel kategorideki TR app'lerin standart pratiği:
//   - Subscription değil, tek-seferlik (consumable) → 4.3 spam riski daha düşük
//   - Free taneli + premium tek-fiyat
//   - Restore Purchases zorunlu (Apple guideline 3.1.1)

import { isCapacitorNative, platform } from '../platform';
import { grantPremium, hasPremium } from '../entitlements';

export const APPLE_PRODUCT_ID = 'life.soulprofile.app.unlock';
export const REVENUECAT_ENTITLEMENT = 'premium';

let initialized = false;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getPlugin(): Promise<any | null> {
  if (typeof window === 'undefined') return null;
  if (!isCapacitorNative()) return null;
  try {
    // eval kullanımı webpack'in build-time resolution'unu atlatır —
    // paket Mac/iOS'ta kurulduğunda runtime'da yüklenir, web build'inde
    // resolve denenmez.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dynamicImport = new Function('m', 'return import(m)') as (m: string) => Promise<any>;
    const mod = await dynamicImport('@revenuecat/purchases-capacitor');
    return mod?.Purchases ?? null;
  } catch {
    return null;
  }
}

export async function initIAP(): Promise<void> {
  if (initialized) return;
  const Purchases = await getPlugin();
  if (!Purchases) return;
  const apiKey =
    platform() === 'ios'
      ? process.env.NEXT_PUBLIC_REVENUECAT_IOS_KEY
      : process.env.NEXT_PUBLIC_REVENUECAT_ANDROID_KEY;
  if (!apiKey) {
    console.warn('[iap] RevenueCat API key missing');
    return;
  }
  try {
    await Purchases.configure({ apiKey });
    initialized = true;
    // Mevcut entitlement durumunu lokale yansıt
    await syncEntitlement();
  } catch (e) {
    console.warn('[iap] configure failed', e);
  }
}

export async function syncEntitlement(): Promise<boolean> {
  const Purchases = await getPlugin();
  if (!Purchases) return hasPremium();
  try {
    const info = await Purchases.getCustomerInfo();
    const entitlement = info?.customerInfo?.entitlements?.active?.[REVENUECAT_ENTITLEMENT];
    if (entitlement) {
      grantPremium();
      return true;
    }
    return hasPremium();
  } catch {
    return hasPremium();
  }
}

export async function buyOnNative(): Promise<{ ok: boolean; error?: string }> {
  const Purchases = await getPlugin();
  if (!Purchases) return { ok: false, error: 'Native IAP unavailable' };
  try {
    const offerings = await Purchases.getOfferings();
    const pkg = offerings?.current?.availablePackages?.[0];
    if (!pkg) return { ok: false, error: 'No offering configured' };
    const result = await Purchases.purchasePackage({ aPackage: pkg });
    const entitled = result?.customerInfo?.entitlements?.active?.[REVENUECAT_ENTITLEMENT];
    if (entitled) {
      grantPremium();
      return { ok: true };
    }
    return { ok: false, error: 'Purchase did not unlock entitlement' };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    if (/cancel/i.test(msg)) return { ok: false, error: 'cancelled' };
    return { ok: false, error: msg };
  }
}

export async function restorePurchases(): Promise<{ ok: boolean; error?: string }> {
  const Purchases = await getPlugin();
  if (!Purchases) return { ok: false, error: 'Native IAP unavailable' };
  try {
    const result = await Purchases.restorePurchases();
    const entitled = result?.customerInfo?.entitlements?.active?.[REVENUECAT_ENTITLEMENT];
    if (entitled) {
      grantPremium();
      return { ok: true };
    }
    return { ok: false, error: 'No active entitlement to restore' };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Restore failed' };
  }
}
