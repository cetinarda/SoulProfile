// Web ödeme uç noktası: Stripe Checkout Session oluşturur.
// iOS'ta StoreKit/RevenueCat kullanılır, bu endpoint çağrılmaz.

import { NextResponse } from 'next/server';
import { findSku, type SkuKey } from '@/lib/payments/skus';

export const runtime = 'edge';

export async function POST(request: Request) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return NextResponse.json(
      { error: 'Stripe henüz yapılandırılmadı.' },
      { status: 503 },
    );
  }

  let body: { sku: SkuKey; userEmail?: string } | null = null;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Geçersiz istek' }, { status: 400 });
  }

  const sku = body?.sku ? findSku(body.sku) : null;
  if (!sku) return NextResponse.json({ error: 'Ürün bulunamadı' }, { status: 404 });

  const priceId = process.env[sku.stripePriceEnvKey];
  if (!priceId) {
    return NextResponse.json(
      { error: `Stripe price ID eksik: ${sku.stripePriceEnvKey}` },
      { status: 503 },
    );
  }

  const origin = request.headers.get('origin') ?? 'https://soulprofile.life';

  const params = new URLSearchParams();
  params.set('mode', sku.isSubscription ? 'subscription' : 'payment');
  params.set('success_url', `${origin}/premium?success=1&sku=${sku.key}`);
  params.set('cancel_url', `${origin}/premium?canceled=1`);
  params.append('line_items[0][price]', priceId);
  params.append('line_items[0][quantity]', '1');
  if (body?.userEmail) params.set('customer_email', body.userEmail);
  params.set('allow_promotion_codes', 'true');
  params.set('billing_address_collection', 'auto');
  params.set('automatic_tax[enabled]', 'true');

  const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${stripeKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error('[checkout] stripe error', errText);
    return NextResponse.json({ error: 'Ödeme oturumu açılamadı' }, { status: 500 });
  }

  const data = (await res.json()) as { url?: string; id?: string };
  if (!data.url) return NextResponse.json({ error: 'Ödeme URL\'i alınamadı' }, { status: 500 });

  return NextResponse.json({ url: data.url, sessionId: data.id });
}
