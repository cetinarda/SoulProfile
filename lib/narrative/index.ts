import Anthropic from '@anthropic-ai/sdk';
import type { GalacticReport, Mission, NarrativeSections } from '../types';
import { buildSystemPrompt, buildUserPrompt } from './prompt';
import { isStructured, parseNarrative } from './parse';
import { SIGN_NAMES_TR } from '../content/astrology-content';
import { LIFE_PATH_MEANINGS, PERSONAL_YEAR_MEANINGS } from '../content/numerology-content';
import { NORTH_NODE_GUIDE, SOUTH_NODE_RELEASE } from '../content/astrology-content';

function getAnthropicKey(): string | undefined {
  return process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY;
}

function fallbackSections(
  report: Omit<GalacticReport, 'narrative' | 'summary' | 'sections'>,
): NarrativeSections {
  const sun = report.chart.planets.find((p) => p.name === 'Sun')!;
  const moon = report.chart.planets.find((p) => p.name === 'Moon')!;
  const nn = report.chart.planets.find((p) => p.name === 'NorthNode')!;
  const sn = report.chart.planets.find((p) => p.name === 'SouthNode')!;
  const lp = LIFE_PATH_MEANINGS[report.numerology.lifePath];
  const py = PERSONAL_YEAR_MEANINGS[report.numerology.personalYear];
  const s = report.systems;

  // Sembolik bedenlenme sayısı: yaşam yolu + life path master katkısı
  const incarnations = 7 + ((report.numerology.lifePath + report.numerology.expression) % 6);

  return {
    opening: `${report.birth.fullName}, ${report.origin.race} hattından gelen bir yıldız çocuksun. ${report.origin.starSystem} kapısı senin ruhsal mührünü taşıyor; bu Dünya'ya ${report.origin.archetype.toLowerCase()} olarak indin. Maya hattında Kin ${s.maya.kin} — ${s.maya.daySign.tr} — kozmik tonun ${s.maya.tone.tr}.`,
    astrology: `${SIGN_NAMES_TR[sun.sign]} Güneş'in ışığını ${SIGN_NAMES_TR[moon.sign]} Ay'ın derin sezgisi ve ${SIGN_NAMES_TR[report.chart.ascendantSign]} yükselenin dış kapısıyla birlikte taşıyorsun. Vedik hatta Ay'ın ${s.vedic.nakshatra.name} nakshatrasında — ${s.vedic.nakshatra.power}. Kuzey Düğüm ${SIGN_NAMES_TR[nn.sign]} burcunda: ${NORTH_NODE_GUIDE[nn.sign].toLowerCase()} Güney Düğüm ${SIGN_NAMES_TR[sn.sign]}: ${SOUTH_NODE_RELEASE[sn.sign].toLowerCase()}`,
    humanDesign: `Human Design pusulan ${report.humanDesign.type} olduğunu söylüyor. Stratejin "${report.humanDesign.strategy}", otoriten ${report.humanDesign.authority}. ${report.humanDesign.profile} profilin hayatı hangi ritimle yaşayacağının haritasıdır. Bu üçlüye sadık kaldığında doğru kararlar zaten içeriden gelir.`,
    callToAction: `Yaşam Yolu ${report.numerology.lifePath} — ${lp?.title}. ${lp?.summary} Şu an ${py?.title} içindesin: ${py?.theme} Görevlerin: ${report.missions.map((m: Mission) => m.title).join(' · ')}.`,
    soulStory: `Sembolik bir okuma — bu ruh yaklaşık ${incarnations} kez bedenlendi. Önceki yaşamlarda ${s.tarot.soul.name.toLowerCase()} arketipiyle iz bıraktın; ${s.norse.rune.power.toLowerCase()} Bu yaşama ${s.chinese.element.tr.toLowerCase()} enerjisi ve ${s.chinese.animal.tr.toLowerCase()} totemiyle döndün. Geliş sebebin Kuzey Düğümünün gösterdiği şey: ${report.northNodeMessage.toLowerCase()} Armağan olarak ${s.tarot.personality.power.toLowerCase()} getirdin, deneyimlemek için seçtiğin tema ise ${lp?.energy?.toLowerCase() ?? lp?.summary?.toLowerCase()}`,
    wisdoms: [
      `${SIGN_NAMES_TR[sun.sign]} Güneş'inden gelen iç ışık: kendini ifade ederken cesaretten besleniyorsun.`,
      `${s.vedic.nakshatra.name} nakshatrasının armağanı: ${s.vedic.nakshatra.power.toLowerCase()}`,
      `${report.humanDesign.type} olarak en güçlü tarafın: stratejine güvendiğinde evren senin için kapı açar.`,
      `${s.maya.tone.tr} tonu sana ${s.maya.tone.power.toLowerCase()} verir.`,
      `${s.tarot.soul.name} ruh kartın senin öz pusulan: ${s.tarot.soul.power.toLowerCase()}`,
    ],
    shadows: [
      `Güney Düğüm gölgesi: ${SOUTH_NODE_RELEASE[sn.sign].toLowerCase()}`,
      `${SIGN_NAMES_TR[moon.sign]} Ay'ının kapanma eğilimi — duyguları bastırma riski.`,
      `${report.humanDesign.type} tipi için en sık tuzak: stratejiyi atlama, "şimdi başlamak" iç sesine kapılma.`,
      `Yaşam Yolu ${report.numerology.lifePath} gölgesi: yeteneklerini küçümseme ya da fazla zorlama.`,
      `${s.tarot.personality.name} kartının gölge yüzü: ${s.tarot.personality.power.toLowerCase()} gücünü tıkayan iç ses.`,
    ],
  };
}

function sectionsToNarrative(s: NarrativeSections): string {
  return [
    s.opening,
    s.astrology,
    s.humanDesign,
    s.callToAction,
    s.soulStory,
  ]
    .filter(Boolean)
    .join('\n\n');
}

function buildSummary(report: Omit<GalacticReport, 'narrative' | 'summary' | 'sections'>): string {
  const sun = report.chart.planets.find((p) => p.name === 'Sun')!;
  return `${report.origin.race} · ${SIGN_NAMES_TR[sun.sign]} Güneş · ${SIGN_NAMES_TR[report.chart.ascendantSign]} Yükselen · ${report.humanDesign.type} · Yaşam Yolu ${report.numerology.lifePath}`;
}

export async function generateNarrative(
  report: Omit<GalacticReport, 'narrative' | 'summary' | 'sections'>,
  locale: 'tr' | 'en' = 'tr',
): Promise<{ narrative: string; summary: string; sections: NarrativeSections }> {
  const summary = buildSummary(report);
  const key = getAnthropicKey();

  if (!key) {
    const sections = fallbackSections(report);
    return { narrative: sectionsToNarrative(sections), summary, sections };
  }

  try {
    const client = new Anthropic({ apiKey: key, dangerouslyAllowBrowser: true });
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2400,
      system: buildSystemPrompt(locale),
      messages: [{ role: 'user', content: buildUserPrompt(report) }],
    });
    const text = message.content
      .map((b) => (b.type === 'text' ? b.text : ''))
      .join('\n')
      .trim();
    const parsed = parseNarrative(text);
    const sections = isStructured(parsed) ? parsed : fallbackSections(report);
    return { narrative: sectionsToNarrative(sections), summary, sections };
  } catch (err) {
    console.warn('[narrative] Claude API failed, using fallback', err);
    const sections = fallbackSections(report);
    return { narrative: sectionsToNarrative(sections), summary, sections };
  }
}
