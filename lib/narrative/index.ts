import Anthropic from '@anthropic-ai/sdk';
import Constants from 'expo-constants';
import type { GalacticReport, Mission } from '../types';
import { buildSystemPrompt, buildUserPrompt } from './prompt';
import { SIGN_NAMES_TR } from '../content/astrology-content';
import { LIFE_PATH_MEANINGS, PERSONAL_YEAR_MEANINGS } from '../content/numerology-content';
import { NORTH_NODE_GUIDE, SOUTH_NODE_RELEASE } from '../content/astrology-content';

function getAnthropicKey(): string | undefined {
  return (
    process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY ||
    (Constants.expoConfig?.extra as { anthropicApiKey?: string } | undefined)?.anthropicApiKey
  );
}

function fallbackNarrative(report: Omit<GalacticReport, 'narrative' | 'summary'>): string {
  const sun = report.chart.planets.find((p) => p.name === 'Sun');
  const moon = report.chart.planets.find((p) => p.name === 'Moon');
  const nn = report.chart.planets.find((p) => p.name === 'NorthNode');
  const sn = report.chart.planets.find((p) => p.name === 'SouthNode');
  const lifePath = LIFE_PATH_MEANINGS[report.numerology.lifePath];
  const py = PERSONAL_YEAR_MEANINGS[report.numerology.personalYear];

  return [
    `${report.birth.fullName}, ${report.origin.race} hattından gelen bir yıldız çocuksun. ${report.origin.starSystem} kapısı senin ruhsal mührünü taşıyor; bu Dünya'ya ${report.origin.archetype.toLowerCase()} olarak indin.`,
    `${SIGN_NAMES_TR[sun!.sign]} Güneş'in ışığını, ${SIGN_NAMES_TR[moon!.sign]} Ay'ın derin sezgisi ve ${SIGN_NAMES_TR[report.chart.ascendantSign]} yükselenin dış kapısıyla birlikte taşıyorsun. Kuzey Ay Düğümü ${SIGN_NAMES_TR[nn!.sign]} burcunda — ${NORTH_NODE_GUIDE[nn!.sign].toLowerCase()} Güney Düğüm ise ${SIGN_NAMES_TR[sn!.sign]}: ${SOUTH_NODE_RELEASE[sn!.sign].toLowerCase()}`,
    `Human Design pusulan ${report.humanDesign.type} olduğunu söylüyor. Stratejin: ${report.humanDesign.strategy}. Otoriten: ${report.humanDesign.authority}. ${report.humanDesign.profile} profili, hayatı hangi ritimle yaşayacağının haritasını verir. Bu üçlüye sadık kaldığında doğru kararlar zaten içeriden gelir.`,
    `Yaşam Yolu ${report.numerology.lifePath} — ${lifePath?.title}: ${lifePath?.summary} Şu an ${py?.title} içindesin — ${py?.theme} Görevlerin: ${report.missions.map((m: Mission) => m.title).join(', ')}.`,
  ].join('\n\n');
}

function buildSummary(report: Omit<GalacticReport, 'narrative' | 'summary'>): string {
  return `${report.origin.race} kökenli, ${SIGN_NAMES_TR[report.chart.planets.find((p) => p.name === 'Sun')!.sign]} Güneş · ${SIGN_NAMES_TR[report.chart.ascendantSign]} Yükselen · ${report.humanDesign.type} · Yaşam Yolu ${report.numerology.lifePath}`;
}

export async function generateNarrative(
  report: Omit<GalacticReport, 'narrative' | 'summary'>,
): Promise<{ narrative: string; summary: string }> {
  const summary = buildSummary(report);
  const key = getAnthropicKey();

  if (!key) {
    return { narrative: fallbackNarrative(report), summary };
  }

  try {
    const client = new Anthropic({ apiKey: key, dangerouslyAllowBrowser: true });
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1200,
      system: buildSystemPrompt(),
      messages: [{ role: 'user', content: buildUserPrompt(report) }],
    });
    const text = message.content
      .map((block) => (block.type === 'text' ? block.text : ''))
      .join('\n')
      .trim();
    return { narrative: text || fallbackNarrative(report), summary };
  } catch (err) {
    console.warn('[narrative] Claude API failed, using fallback', err);
    return { narrative: fallbackNarrative(report), summary };
  }
}
