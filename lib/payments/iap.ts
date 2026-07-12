// Apple StoreKit 2 + Google Play Billing v6 üzerine RevenueCat soyutlaması.
// Web'de Purchases.configure no-op (Capacitor pluginleri web stub); iOS/Android'de
// native SDK çağrılır. STATİK import — eski dinamik import bundle'da resolve
// edilmediği için iOS'ta hiç yüklenmiyordu.

import { Purchases, LOG_LEVEL } from '@revenuecat/purchases-capacitor';
import { Capacitor } from '@capacitor/core';
import { platform } from '../platform';
import { grantPremium, revokePremium, hasPremium } from '../entitlements';
import { getSupabase } from '../supabase';

export const APPLE_PRODUCT_ID = 'life.soulprofile.app.unlock';
export const REVENUECAT_ENTITLEMENT = 'premium';

let initialized = false;

export async function initIAP(): Promise<void> {
  if (initialized) return;
  if (typeof window === 'undefined') return;
  if (!Capacitor.isNativePlatform()) return;

  const apiKey =
    platform() === 'ios'
      ? process.env.NEXT_PUBLIC_REVENUECAT_IOS_KEY
      : process.env.NEXT_PUBLIC_REVENUECAT_ANDROID_KEY;
  if (!apiKey) {
    console.warn('[iap] RevenueCat API key missing — premium satın alma kapalı');
    return;
  }

  try {
    let appUserID: string | undefined;
    const sb = getSupabase();
    if (sb) {
      const { data } = await sb.auth.getUser();
      appUserID = data.user?.id;
    }
    await Purchases.setLogLevel({ level: LOG_LEVEL.WARN });
    await Purchases.configure(appUserID ? { apiKey, appUserID } : { apiKey });
    initialized = true;
    await syncEntitlement();
  } catch (e) {
    console.warn('[iap] configure failed', e);
  }
}

export async function syncEntitlement(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return hasPremium();
  try {
    const info = await Purchases.getCustomerInfo();
    const entitlement = info?.customerInfo?.entitlements?.active?.[REVENUECAT_ENTITLEMENT];
    if (entitlement) {
      grantPremium();
      return true;
    }
    // AUTHORITATIVE: RevenueCat sorgusu BAŞARILI + aktif entitlement YOK →
    // premium değil. Stale localStorage (eski DevToggle vb.) burada temizlenir.
    // (Sorgu hata verirse catch → cache korunur, offline paid user kilitlenmez.)
    revokePremium();
    return false;
  } catch {
    return hasPremium();
  }
}

function isUnimplemented(e: unknown): boolean {
  const code = (e as { code?: string })?.code;
  const msg = e instanceof Error ? e.message : String(e);
  return code === 'UNIMPLEMENTED' || /not implemented/i.test(msg);
}

export async function buyOnNative(): Promise<{ ok: boolean; error?: string }> {
  if (!Capacitor.isNativePlatform()) {
    return { ok: false, error: 'Native IAP unavailable' };
  }
  if (!initialized) await initIAP();
  if (!initialized) {
    // configure edilemedi (UNIMPLEMENTED / key yok) → net mesaj
    return { ok: false, error: 'IAP_NOT_READY' };
  }
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
    if (isUnimplemented(e)) return { ok: false, error: 'IAP_NOT_READY' };
    if (/cancel/i.test(msg)) return { ok: false, error: 'cancelled' };
    return { ok: false, error: msg };
  }
}

export async function restorePurchases(): Promise<{ ok: boolean; error?: string }> {
  if (!Capacitor.isNativePlatform()) {
    return { ok: false, error: 'Native IAP unavailable' };
  }
  if (!initialized) await initIAP();
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
