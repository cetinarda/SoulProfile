import { daysUntilPromoEnd, isLaunchPromoActive } from '@/lib/feature-flags';

export function PromoBanner() {
  if (!isLaunchPromoActive()) return null;
  const days = daysUntilPromoEnd();
  return (
    <div className="bg-gradient-to-r from-cosmicDeep via-cosmic to-nebula text-center text-[12px] font-bold tracking-wide text-white">
      <div className="mx-auto max-w-6xl px-4 py-2">
        ✦ LANSMAN PROMOSU · Tüm premium özellikler ücretsiz · Kalan {days} gün ✦
      </div>
    </div>
  );
}
