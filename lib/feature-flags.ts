// Lansman dönemi: tüm premium özellikler herkese açık, ücretsiz.
// Promo bitiş: bu tarihten sonra paywall devreye girer.

export const LAUNCH_PROMO_END = new Date('2026-09-01T00:00:00Z');

export function isLaunchPromoActive(now = new Date()): boolean {
  return now < LAUNCH_PROMO_END;
}

export function premiumOpen(): boolean {
  return isLaunchPromoActive();
}

export function daysUntilPromoEnd(now = new Date()): number {
  const ms = LAUNCH_PROMO_END.getTime() - now.getTime();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}
