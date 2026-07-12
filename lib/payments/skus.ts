// İki fiyat seçeneği:
//  - Lifetime (tek seferlik non-consumable): $19.99
//  - Monthly (aylık auto-renewable subscription): $4.99/ay
// Her ikisi de 'premium' entitlement'ını açar → kendi haritadaki
// yıldız/gezegen konumu + hareketi (3D/ağaç/çark) görünür olur.

export type PlanKey = 'lifetime' | 'monthly';

export type Plan = {
  key: PlanKey;
  appleProductId: string;      // App Store Connect product ID
  rcPackageId: string;         // RevenueCat package identifier (offering içinde)
  stripePriceEnvKey: string;   // Web Stripe price env
  price: string;               // gösterim
  period: 'once' | 'month';
};

export const PLANS: Record<PlanKey, Plan> = {
  lifetime: {
    key: 'lifetime',
    appleProductId: 'life.soulprofile.app.unlock',
    rcPackageId: '$rc_lifetime',
    stripePriceEnvKey: 'NEXT_PUBLIC_STRIPE_PRICE_LIFETIME',
    price: '$19.99',
    period: 'once',
  },
  monthly: {
    key: 'monthly',
    appleProductId: 'life.soulprofile.app.monthly',
    rcPackageId: '$rc_monthly',
    stripePriceEnvKey: 'NEXT_PUBLIC_STRIPE_PRICE_MONTHLY',
    price: '$4.99',
    period: 'month',
  },
};

// Premium'un açtığı özellikler (gate kartlarında gösterilir).
export const PREMIUM_FEATURES: string[] = [
  'Sınırsız karne — farklı kişilerin haritasına bak',
  'Sınırsız ikili uyum karşılaştırması',
  'Tüm özellikler + gelecek güncellemeler',
];

// Geri uyumluluk için tek PRODUCT referansı (eski çağrı yerleri).
export const PRODUCT = {
  key: 'soulprofile_unlock' as const,
  name: 'SoulProfile Premium',
  price: PLANS.lifetime.price,
  description: 'Tüm özelliklere sınırsız erişim.',
  features: PREMIUM_FEATURES,
};
