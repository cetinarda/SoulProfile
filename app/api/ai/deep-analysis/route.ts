// Premium derin analiz — server-side Anthropic + entitlement gate.
// Bearer JWT'den user_id okunur, entitlements tablosunda 'premium' kontrol edilir.

import type { GalacticReport } from '@/lib/types';
import type { CompatibilityResult } from '@/lib/compatibility';
import {
  deepBuildSystem,
  deepBuildUser,
  deepParseSections,
  deepFallback,
  type DeepAnalysis,
} from '@/lib/compatibility/deep-analysis';
import {
  corsResponse,
  corsPreflight,
  getAnthropic,
  hasPremium,
  readCaller,
  rateLimit,
  rateKey,
} from '../_shared';

export const runtime = 'edge';

export function OPTIONS() {
  return corsPreflight();
}

type Body = {
  a: GalacticReport;
  b: GalacticReport;
  r: CompatibilityResult;
  locale?: 'tr' | 'en';
};

export async function POST(request: Request) {
  // Rate limit önce — entitlement sorgusunu beleş yememek için
  const limit = rateLimit(rateKey(request, 'deep-analysis'), 3);
  if (!limit.ok) {
    return corsResponse(
      { error: 'Rate limit aşıldı', retryAfter: limit.retryAfter },
      { status: 429 },
    );
  }

  // Entitlement gate — auth zorunlu, premium zorunlu
  const caller = readCaller(request);
  if (!caller.userId) {
    return corsResponse({ error: 'Giriş gerekli' }, { status: 401 });
  }
  const isPremium = await hasPremium(caller.userId);
  if (!isPremium) {
    return corsResponse({ error: 'Premium gerekli' }, { status: 403 });
  }

  let body: Body;
  try {
    body = await request.json();
  } catch {
    return corsResponse({ error: 'Geçersiz istek' }, { status: 400 });
  }
  if (!body?.a?.chart || !body?.b?.chart || !body?.r) {
    return corsResponse({ error: 'Eksik veri' }, { status: 400 });
  }

  const client = getAnthropic();
  if (!client) {
    return corsResponse({ error: 'AI yapılandırılmadı', useFallback: true }, { status: 503 });
  }

  const locale = body.locale === 'en' ? 'en' : 'tr';
  const fb = deepFallback(body.a, body.b, body.r, locale);

  try {
    const msg = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4000,
      system: deepBuildSystem(locale),
      messages: [{ role: 'user', content: deepBuildUser(body.a, body.b, body.r) }],
    });
    const text = msg.content.map((c) => (c.type === 'text' ? c.text : '')).join('\n').trim();
    const parsed = deepParseSections(text);

    const merged: DeepAnalysis = {
      generatedAt: new Date().toISOString(),
      soulContract: parsed.soulContract || fb.soulContract,
      whyMet: parsed.whyMet || fb.whyMet,
      whatEachTeaches: {
        aTeachesB: parsed.whatEachTeaches?.aTeachesB || fb.whatEachTeaches.aTeachesB,
        bTeachesA: parsed.whatEachTeaches?.bTeachesA || fb.whatEachTeaches.bTeachesA,
      },
      conflictPattern: parsed.conflictPattern || fb.conflictPattern,
      separationDynamic: parsed.separationDynamic || fb.separationDynamic,
      reunionField: parsed.reunionField || fb.reunionField,
      longTermResonance: parsed.longTermResonance || fb.longTermResonance,
      karmicTheme: parsed.karmicTheme || fb.karmicTheme,
      practiceForCouple:
        parsed.practiceForCouple && parsed.practiceForCouple.length >= 3
          ? parsed.practiceForCouple
          : fb.practiceForCouple,
      closingBlessing: parsed.closingBlessing || fb.closingBlessing,
    };

    return corsResponse({ analysis: merged });
  } catch (err) {
    console.warn('[api/ai/deep-analysis] Anthropic error', err);
    return corsResponse({ error: 'AI hatası', useFallback: true }, { status: 502 });
  }
}
