// Çapraz platform ürün ID'leri.
// Apple IAP ürün ID'leri tam olarak bu key'lerle App Store Connect'te oluşturulmalı.
// Stripe Price ID'leri ENV üzerinden gelir.

export type SkuKey =
  | 'weekly'
  | 'monthly'
  | 'solar_return'
  | 'relationship'
  | 'bundle_annual';

export type Sku = {
  key: SkuKey;
  appleProductId: string;
  stripePriceEnvKey: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  isSubscription: boolean;
  featured?: boolean;
};

export const SKUS: Sku[] = [
  {
    key: 'weekly',
    appleProductId: 'life.soulprofile.app.weekly',
    stripePriceEnvKey: 'NEXT_PUBLIC_STRIPE_PRICE_WEEKLY',
    name: 'Cosmic Weekly',
    price: '$2.99',
    period: 'hafta',
    description: 'Bir yıldız çocuğun haftalık döngüsü.',
    features: [
      '7 günlük transit kartları',
      'Haftalık biyoritm grafiği',
      'Kişisel mantra önerisi',
      'Yeni & dolunay rehberi',
    ],
    isSubscription: true,
  },
  {
    key: 'monthly',
    appleProductId: 'life.soulprofile.app.monthly',
    stripePriceEnvKey: 'NEXT_PUBLIC_STRIPE_PRICE_MONTHLY',
    name: 'Monthly Galactic',
    price: '$14.99',
    period: 'ay',
    description: 'Daha derin bir kozmik takvim.',
    features: [
      'Aylık genel öngörü',
      'Tüm haftalık özellikler dahil',
      'İlişki transitleri',
      'Kişisel Ay grafiği',
    ],
    isSubscription: true,
  },
  {
    key: 'solar_return',
    appleProductId: 'life.soulprofile.app.solar_return',
    stripePriceEnvKey: 'NEXT_PUBLIC_STRIPE_PRICE_SOLAR_RETURN',
    name: 'Solar Return',
    price: '$19.99',
    period: 'yıl',
    description: 'Doğum gününde 12 aylık tema haritası.',
    features: [
      'Solar Return doğum haritası',
      '4 çeyrek odak teması',
      'Detaylı HD kapı analizi',
      'Yıllık ruhsal pusula',
    ],
    isSubscription: true,
  },
  {
    key: 'relationship',
    appleProductId: 'life.soulprofile.app.relationship',
    stripePriceEnvKey: 'NEXT_PUBLIC_STRIPE_PRICE_RELATIONSHIP',
    name: 'Relationship Sync',
    price: '$9.99',
    period: 'tek seferlik',
    description: 'İki ruhun synastry + HD ilişki haritası.',
    features: [
      'Synastry karşılaştırma',
      'HD ilişki dinamiği',
      'Çatışma sıcak noktaları',
      'Şifa önerileri',
    ],
    isSubscription: false,
  },
  {
    key: 'bundle_annual',
    appleProductId: 'life.soulprofile.app.bundle_annual',
    stripePriceEnvKey: 'NEXT_PUBLIC_STRIPE_PRICE_BUNDLE',
    name: 'Premium Bundle',
    price: '$79',
    period: 'yıl',
    description: 'Tüm premium kapı tek bir bilet.',
    features: [
      'Tüm haftalık + aylık + Solar Return',
      'Sınırsız ilişki haritası',
      'Sınırsız karne PDF',
      'AI Soul Chat (yakında)',
    ],
    isSubscription: true,
    featured: true,
  },
];

export function findSku(key: SkuKey): Sku | undefined {
  return SKUS.find((s) => s.key === key);
}
