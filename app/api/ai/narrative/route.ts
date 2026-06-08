// Tek-kişi karne AI anlatımı — server-side Anthropic.
// Client ham GalacticReport gönderir, parse edilmiş sections döner.

import type { GalacticReport, NarrativeSections } from '@/lib/types';
import { buildSystemPrompt, buildUserPrompt } from '@/lib/narrative/prompt';
import { isStructured, parseNarrative } from '@/lib/narrative/parse';
import {
  corsResponse,
  corsPreflight,
  getAnthropic,
  rateLimit,
  rateKey,
} from '../_shared';

export const runtime = 'edge';

export function OPTIONS() {
  return corsPreflight();
}

type Body = {
  report: Omit<GalacticReport, 'narrative' | 'summary' | 'sections'>;
  locale?: 'tr' | 'en';
};

export async function POST(request: Request) {
  const limit = rateLimit(rateKey(request, 'narrative'), 5);
  if (!limit.ok) {
    return corsResponse(
      { error: 'Rate limit aşıldı', retryAfter: limit.retryAfter },
      { status: 429 },
    );
  }

  let body: Body;
  try {
    body = await request.json();
  } catch {
    return corsResponse({ error: 'Geçersiz istek' }, { status: 400 });
  }
  if (!body?.report?.chart || !body?.report?.humanDesign || !body?.report?.numerology) {
    return corsResponse({ error: 'Eksik veri' }, { status: 400 });
  }

  const client = getAnthropic();
  if (!client) {
    return corsResponse({ error: 'AI yapılandırılmadı', useFallback: true }, { status: 503 });
  }

  const locale = body.locale === 'en' ? 'en' : 'tr';

  try {
    const msg = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2400,
      system: buildSystemPrompt(locale),
      messages: [{ role: 'user', content: buildUserPrompt(body.report) }],
    });
    const text = msg.content
      .map((b) => (b.type === 'text' ? b.text : ''))
      .join('\n')
      .trim();
    const parsed = parseNarrative(text);
    if (!isStructured(parsed)) {
      return corsResponse({ error: 'Parse hatası', useFallback: true }, { status: 502 });
    }
    return corsResponse({ sections: parsed satisfies NarrativeSections });
  } catch (err) {
    console.warn('[api/ai/narrative] Anthropic error', err);
    return corsResponse({ error: 'AI hatası', useFallback: true }, { status: 502 });
  }
}
