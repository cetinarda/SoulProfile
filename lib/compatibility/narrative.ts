import Anthropic from '@anthropic-ai/sdk';
import type { GalacticReport } from '../types';
import type { CompatibilityResult } from './index';
import { SIGN_NAMES_TR } from '../content/astrology-content';

export type CompatNarrative = {
  overview: string;
  hdDynamic: string;
  strengths: string[];
  frictions: string[];
  advice: string;
};

function getKey(): string | undefined {
  return process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY;
}

function system(locale: 'tr' | 'en' = 'tr'): string {
  if (locale === 'en') {
    return `You are the relationship-compatibility interpreter for the "SoulProfile" app. You
compare two people's astrology + Human Design + numerology derived from birth data and describe
what kind of relationship / friendship / partnership experience it could be — in a warm,
balanced and empowering English voice.

RULES:
- Never say "incompatible/bad/won't work". Every bond is a growth lesson.
- Clearly explain the Human Design defined-open center dynamic: the defined person
  "conditions" the open person; the open person experiences that energy intensely.
  Electromagnetic = attraction; dominance = one side sets the tone; companionship channel = similarity.
- No medical/psychological advice. Stay symbolic.
- Don't say "human"; use "star child", "two souls".
- OUTPUT headings exactly (keep them in Turkish so the app can parse, write the BODY in English):
  "## Genel", "## Human Design Dansı", "## Güçlü Yanlar", "## Sürtünme Noktaları", "## Tavsiye".
- "## Güçlü Yanlar" and "## Sürtünme Noktaları" are bullet lists ("- "), 3-4 items, 1 sentence each.
  Other headings: 1 paragraph (3-4 sentences).`;
  }
  return `Sen "SoulProfile" uygulamasının ilişki uyumu yorumcususun. İki kişinin doğum
verisinden çıkan astroloji + Human Design + numeroloji bilgilerini karşılaştırıp nasıl bir
ilişki/arkadaşlık/iş ortaklığı deneyimi olacağını sıcak, dengeli ve güçlendirici bir Türkçe
ile anlatıyorsun.

KURALLAR:
- Asla "uyumsuz/kötü/yürümez" deme. Her bağ büyüten bir derstir.
- Human Design tanımlı-tanımsız (defined-open) merkez dinamiğini net açıkla:
  tanımlı taraf açık tarafı "koşullar" (conditions); açık taraf bu enerjiyi yoğun deneyimler.
  Elektromanyetik bağ = çekim; hâkimiyet = bir tarafın tonu belirlemesi; arkadaşlık kanalı = benzerlik.
- Tıbbi/psikolojik tavsiye verme. Sembolik kal.
- "Human" deme; "yıldız çocuk", "iki ruh" gibi ifadeler kullan.
- ÇIKTI başlıkları tam olarak: "## Genel", "## Human Design Dansı", "## Güçlü Yanlar",
  "## Sürtünme Noktaları", "## Tavsiye".
- "Güçlü Yanlar" ve "Sürtünme Noktaları" madde listesi ("- " ile), her biri 1 cümle, 3-4 madde.
- Diğer başlıklar 1 paragraf (3-4 cümle).`;
}

function userPrompt(a: GalacticReport, b: GalacticReport, r: CompatibilityResult): string {
  const sun = (rep: GalacticReport) => SIGN_NAMES_TR[rep.chart.planets.find((p) => p.name === 'Sun')!.sign];
  const moon = (rep: GalacticReport) => SIGN_NAMES_TR[rep.chart.planets.find((p) => p.name === 'Moon')!.sign];

  return `İki yıldız çocuğun uyumunu yorumla.

${r.nameA}:
- ${sun(a)} Güneş · ${moon(a)} Ay · ${SIGN_NAMES_TR[a.chart.ascendantSign]} Yükselen
- Human Design: ${a.humanDesign.type}, ${a.humanDesign.authority}, ${a.humanDesign.profile}
- Tanımlı merkezler: ${a.humanDesign.definedCenters.join(', ') || 'yok (Reflector)'}
- Yaşam Yolu: ${a.numerology.lifePath} · Yıldız ırkı: ${a.origin.race}

${r.nameB}:
- ${sun(b)} Güneş · ${moon(b)} Ay · ${SIGN_NAMES_TR[b.chart.ascendantSign]} Yükselen
- Human Design: ${b.humanDesign.type}, ${b.humanDesign.authority}, ${b.humanDesign.profile}
- Tanımlı merkezler: ${b.humanDesign.definedCenters.join(', ') || 'yok (Reflector)'}
- Yaşam Yolu: ${b.numerology.lifePath} · Yıldız ırkı: ${b.origin.race}

HESAPLANAN BAĞLAR:
- Elektromanyetik çekim kanalları: ${r.hdConnections.filter((c) => c.kind === 'electromagnetic').map((c) => c.channel).join(', ') || 'yok'}
- Arkadaşlık (ortak) kanalları: ${r.hdConnections.filter((c) => c.kind === 'companionship').map((c) => c.channel).join(', ') || 'yok'}
- Hâkimiyet kanalları: ${r.hdConnections.filter((c) => c.kind.startsWith('dominance')).map((c) => c.channel).join(', ') || 'yok'}
- Önemli astroloji açıları: ${r.astroAspects.slice(0, 6).map((x) => `${x.a}–${x.b} ${x.aspect}`).join('; ') || 'belirgin açı yok'}
- Genel uyum skoru: ${r.scoreOverall}/100 (HD ${r.scoreHD}, Astro ${r.scoreAstro}, Numeroloji ${r.scoreNumerology})

5 başlıkla yaz: ## Genel, ## Human Design Dansı, ## Güçlü Yanlar, ## Sürtünme Noktaları, ## Tavsiye.`;
}

function parse(text: string): CompatNarrative {
  const sections: Record<string, string[]> = {};
  let cur = '';
  for (const line of text.split('\n')) {
    const h = line.match(/^#+\s*(.+)/);
    if (h) {
      cur = h[1].toLowerCase().trim();
      sections[cur] = [];
      continue;
    }
    if (cur) (sections[cur] ??= []).push(line);
  }
  const get = (keys: string[]) => {
    for (const k of Object.keys(sections)) {
      if (keys.some((key) => k.includes(key))) return sections[k].join('\n').trim();
    }
    return '';
  };
  const bullets = (block: string) =>
    block.split('\n').map((l) => l.replace(/^[-•*]\s*/, '').trim()).filter((l) => l.length > 2);

  return {
    overview: get(['genel']),
    hdDynamic: get(['human design', 'dans']),
    strengths: bullets(get(['güçlü'])).slice(0, 6),
    frictions: bullets(get(['sürtünme', 'friction'])).slice(0, 6),
    advice: get(['tavsiye']),
  };
}

function fallback(a: GalacticReport, b: GalacticReport, r: CompatibilityResult): CompatNarrative {
  const electro = r.hdConnections.filter((c) => c.kind === 'electromagnetic');
  const companion = r.hdConnections.filter((c) => c.kind === 'companionship');
  const aCond = r.hdCenters.filter((c) => c.status === 'a-conditions-b');
  const bCond = r.hdCenters.filter((c) => c.status === 'b-conditions-a');
  const shared = r.hdCenters.filter((c) => c.status === 'shared-openness');

  const overview = `${r.nameA} ve ${r.nameB} bir araya geldiğinde ${r.scoreOverall} üzerinden 100'lük bir rezonans doğuyor. ${a.humanDesign.type} ile ${b.humanDesign.type} enerjileri ${electro.length > 0 ? 'birbirini manyetik biçimde çekiyor' : 'birbirini sakin biçimde tamamlıyor'}. ${r.headline.split(': ')[1] ?? ''}`;

  const hdDynamic = `Human Design dansınızda ${r.nameA}, ${aCond.length} merkezde ${r.nameB}'yi koşullarken (${aCond.map((c) => c.centerTr.split(' ')[0]).join(', ') || '—'}), ${r.nameB} ${bCond.length} merkezde ${r.nameA}'yı koşulluyor (${bCond.map((c) => c.centerTr.split(' ')[0]).join(', ') || '—'}). ${shared.length} merkezde ikiniz de açıksınız — bu alanlarda birbirinizin aynası olur, aynı dış etkileri birlikte hissedersiniz. ${electro.length > 0 ? `${electro.length} elektromanyetik kanal birbirinizi tetikleyen bir kimya yaratıyor.` : 'Belirgin elektromanyetik kanal yok; bağınız çekimden çok huzura dayanıyor.'}`;

  const strengths: string[] = [];
  if (electro.length > 0) strengths.push(`${electro.length} elektromanyetik kanal birbirinizi canlandıran doğal bir çekim yaratıyor.`);
  if (companion.length > 0) strengths.push(`${companion.length} ortak kanalda aynı dili konuşuyor, birbirinizi zahmetsizce anlıyorsunuz.`);
  if (r.astroAspects.some((x) => x.flavor === 'flowing' || x.flavor === 'fusion')) strengths.push('Astrolojik açılarınız duygusal ve romantik akışı destekliyor.');
  strengths.push(`Yaşam Yolu ${r.numerology.aLifePath} ve ${r.numerology.bLifePath}: ${r.numerology.harmony}`);
  if (shared.length > 0) strengths.push(`Ortak açık merkezleriniz, birlikte aynı dersleri öğrenmenize ve birbirinize bilgelik aynası olmanıza yarıyor.`);

  const frictions: string[] = [];
  const dom = r.hdConnections.filter((c) => c.kind.startsWith('dominance'));
  if (dom.length > 0) frictions.push(`${dom.length} hâkimiyet kanalında bir taraf tonu belirler; bilinçli olunmazsa diğeri kısılmış hissedebilir.`);
  if (aCond.length >= 4) frictions.push(`${r.nameA} birçok merkezi koşulluyor; ${r.nameB} kendi enerjisini ayırt etmeyi öğrenmeli.`);
  if (bCond.length >= 4) frictions.push(`${r.nameB} birçok merkezi koşulluyor; ${r.nameA} kendi merkezine dönmeyi hatırlamalı.`);
  if (r.astroAspects.some((x) => x.flavor === 'tense')) frictions.push('Bazı gergin açılar büyüme sürtünmesi yaratır — fark edilirse en güçlü gelişim alanınız olur.');
  if (a.humanDesign.authority !== b.humanDesign.authority) frictions.push(`Karar ritimleriniz farklı (${a.humanDesign.authority} vs ${b.humanDesign.authority}); birbirinizin zamanlamasına saygı şart.`);
  if (frictions.length === 0) frictions.push('Belirgin bir sürtünme noktası görünmüyor; yine de farklılıklara alan açmak ilişkiyi taze tutar.');

  const advice = `${r.nameA} ve ${r.nameB}, her birinizin Human Design stratejisine (${a.humanDesign.strategy} / ${b.humanDesign.strategy}) sadık kalın. Açık merkezlerinizde "bu duygu/baskı gerçekten benim mi?" diye sorun; tanımlı tarafın enerjisini bilinçle kullanın. Çekim noktalarınızı kutlayın, hâkimiyet alanlarında söz hakkını dengeleyin.`;

  return { overview, hdDynamic, strengths, frictions, advice };
}

export async function generateCompatNarrative(
  a: GalacticReport,
  b: GalacticReport,
  r: CompatibilityResult,
  locale: 'tr' | 'en' = 'tr',
): Promise<CompatNarrative> {
  const key = getKey();
  if (!key) return fallback(a, b, r);
  try {
    const client = new Anthropic({ apiKey: key, dangerouslyAllowBrowser: true });
    const msg = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1800,
      system: system(locale),
      messages: [{ role: 'user', content: userPrompt(a, b, r) }],
    });
    const text = msg.content.map((c) => (c.type === 'text' ? c.text : '')).join('\n').trim();
    const parsed = parse(text);
    if (parsed.overview.length > 20 && parsed.strengths.length >= 2) return parsed;
    return fallback(a, b, r);
  } catch (e) {
    console.warn('[compat] narrative fallback', e);
    return fallback(a, b, r);
  }
}
