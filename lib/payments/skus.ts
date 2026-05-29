// SoulProfile tek seferlik satın alma modeline geçti.
// iOS: $4.99 (peşin paid app, IAP yok)
// Web: Stripe Checkout ile tek seferlik ödeme
// Bundle ID tek: life.soulprofile.app

export type ProductKey = 'soulprofile_unlock';

export type Product = {
  key: ProductKey;
  appleProductId?: string;     // Paid app modeli için App Store Connect'te ürün İD'sine ihtiyaç yok
  stripePriceEnvKey: string;
  name: string;
  price: string;
  priceTr: string;             // Türkiye için PPP-aware (App Store otomatik dönüştürür)
  description: string;
  features: string[];
};

export const PRODUCT: Product = {
  key: 'soulprofile_unlock',
  stripePriceEnvKey: 'NEXT_PUBLIC_STRIPE_PRICE_UNLOCK',
  name: 'SoulProfile Tam Erişim',
  price: '$4.99',
  priceTr: '99 ₺',
  description: 'Doğum verinden çıkan kalıcı kozmik kimlik. Tek seferlik ödeme — abonelik yok.',
  features: [
    'Tam galaktik karne (9 sistem sentezi)',
    '3D solar sistem (gerçek gezegen dokuları)',
    'Yıldız Yaşam Ağacı animasyonu',
    'Karakter Stat oyun kartı',
    'Tıklanabilir derin kavram detayları',
    'AI Kozmik Anlatın (7 bölüm)',
    'Sınırsız İkili Uyum karşılaştırması',
    'Paylaşılabilir karne PNG\'leri',
    'JSON dışa aktarma + veri silme',
    'Lansman boyunca tamamen ücretsiz',
  ],
};
