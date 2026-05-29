import type { GalacticReport, PlanetName } from '../types';
import { CHANNELS, type HDCenter } from '../human-design/gates';
import {
  CENTER_RELATIONSHIP,
  CENTER_THEME,
  CENTER_TR,
  channelTheme,
} from './hd-content';
import { SIGN_NAMES_TR } from '../content/astrology-content';

const CENTERS: HDCenter[] = [
  'Head', 'Ajna', 'Throat', 'G', 'Heart', 'SolarPlexus', 'Sacral', 'Spleen', 'Root',
];

export type CenterDynamic = {
  center: HDCenter;
  centerTr: string;
  status: 'companionship' | 'a-conditions-b' | 'b-conditions-a' | 'shared-openness';
  statusLabel: string;
  meaning: string;
};

export type ChannelConnection = {
  kind: 'electromagnetic' | 'dominance-a' | 'dominance-b' | 'companionship';
  channel: string;
  theme: string;
  title: string;
  meaning: string;
};

export type AstroAspect = {
  a: string;
  b: string;
  aspect: string;
  flavor: 'flowing' | 'tense' | 'fusion';
  meaning: string;
};

export type CompatibilityResult = {
  nameA: string;
  nameB: string;
  scoreOverall: number;
  scoreHD: number;
  scoreAstro: number;
  scoreNumerology: number;
  hdCenters: CenterDynamic[];
  hdConnections: ChannelConnection[];
  astroAspects: AstroAspect[];
  numerology: { aLifePath: number; bLifePath: number; harmony: string; score: number };
  headline: string;
};

// ---------- HUMAN DESIGN ----------

function centerDynamics(a: GalacticReport, b: GalacticReport): CenterDynamic[] {
  const aDef = new Set(a.humanDesign.definedCenters as HDCenter[]);
  const bDef = new Set(b.humanDesign.definedCenters as HDCenter[]);
  const out: CenterDynamic[] = [];

  for (const center of CENTERS) {
    const aHas = aDef.has(center);
    const bHas = bDef.has(center);
    const rel = CENTER_RELATIONSHIP[center];
    const theme = CENTER_THEME[center];

    if (aHas && bHas) {
      out.push({
        center,
        centerTr: CENTER_TR[center],
        status: 'companionship',
        statusLabel: 'İkisi de tanımlı',
        meaning: `${theme} alanında ${rel.bothDefined}`,
      });
    } else if (aHas && !bHas) {
      out.push({
        center,
        centerTr: CENTER_TR[center],
        status: 'a-conditions-b',
        statusLabel: `${a.birth.fullName.split(' ')[0]} → ${b.birth.fullName.split(' ')[0]}`,
        meaning: `${theme} alanında ${a.birth.fullName.split(' ')[0]} ${rel.conditions}`,
      });
    } else if (!aHas && bHas) {
      out.push({
        center,
        centerTr: CENTER_TR[center],
        status: 'b-conditions-a',
        statusLabel: `${b.birth.fullName.split(' ')[0]} → ${a.birth.fullName.split(' ')[0]}`,
        meaning: `${theme} alanında ${b.birth.fullName.split(' ')[0]} ${rel.conditions}`,
      });
    } else {
      out.push({
        center,
        centerTr: CENTER_TR[center],
        status: 'shared-openness',
        statusLabel: 'İkisi de açık',
        meaning: `${theme} alanında ${rel.bothOpen}`,
      });
    }
  }
  return out;
}

function channelConnections(a: GalacticReport, b: GalacticReport): ChannelConnection[] {
  const aGates = new Set(a.humanDesign.gates);
  const bGates = new Set(b.humanDesign.gates);
  const nameA = a.birth.fullName.split(' ')[0];
  const nameB = b.birth.fullName.split(' ')[0];
  const out: ChannelConnection[] = [];

  for (const { gates, centers } of CHANNELS) {
    const [g1, g2] = gates;
    const aHasG1 = aGates.has(g1);
    const aHasG2 = aGates.has(g2);
    const bHasG1 = bGates.has(g1);
    const bHasG2 = bGates.has(g2);
    const aFull = aHasG1 && aHasG2;
    const bFull = bHasG1 && bHasG2;
    const channel = `${g1}-${g2}`;
    const theme = channelTheme(centers[0], centers[1]);

    if (aFull && bFull) {
      out.push({
        kind: 'companionship',
        channel,
        theme,
        title: 'Arkadaşlık Kanalı',
        meaning: `İkiniz de ${channel} kanalına (${theme}) sahipsiniz. Bu alanda birbirinize çok benzersiniz — aynı dili konuşur, birlikte rahat edersiniz. Yan yana yürüyen iki benzer enerji.`,
      });
    } else if (aFull && (bHasG1 || bHasG2)) {
      out.push({
        kind: 'dominance-a',
        channel,
        theme,
        title: 'Hâkimiyet (Dominance)',
        meaning: `${nameA} ${channel} kanalının tamamına sahip, ${nameB} ise yalnızca bir ucuna. Bu temada (${theme}) ${nameA} tonu belirler; ${nameB} bu enerjiyi onun üzerinden deneyimler. Bilinçli olunca öğretici, değilse bastırıcı olabilir.`,
      });
    } else if (bFull && (aHasG1 || aHasG2)) {
      out.push({
        kind: 'dominance-b',
        channel,
        theme,
        title: 'Hâkimiyet (Dominance)',
        meaning: `${nameB} ${channel} kanalının tamamına sahip, ${nameA} ise yalnızca bir ucuna. Bu temada (${theme}) ${nameB} tonu belirler; ${nameA} bu enerjiyi onun üzerinden deneyimler.`,
      });
    } else if ((aHasG1 && bHasG2) || (aHasG2 && bHasG1)) {
      out.push({
        kind: 'electromagnetic',
        channel,
        theme,
        title: 'Elektromanyetik Çekim',
        meaning: `${nameA} ve ${nameB} ${channel} kanalının (${theme}) birer ucuna sahip — birlikteyken kanal tamamlanıyor. Bu, klasik "çekim" noktası: yan yana geldiğinizde bu alan canlanır, birbirinizi tetikler ve tamamlarsınız.`,
      });
    }
  }
  // Elektromanyetik bağları öne al
  return out.sort((x, y) => {
    const order = { electromagnetic: 0, companionship: 1, 'dominance-a': 2, 'dominance-b': 2 };
    return order[x.kind] - order[y.kind];
  });
}

// ---------- ASTROLOJİ SYNASTRY ----------

const ASPECTS: Array<{ angle: number; orb: number; name: string; flavor: AstroAspect['flavor'] }> = [
  { angle: 0, orb: 8, name: 'kavuşum', flavor: 'fusion' },
  { angle: 60, orb: 5, name: 'altmışlık (sextile)', flavor: 'flowing' },
  { angle: 90, orb: 6, name: 'kare (square)', flavor: 'tense' },
  { angle: 120, orb: 7, name: 'üçgen (trine)', flavor: 'flowing' },
  { angle: 180, orb: 8, name: 'karşıtlık (opposition)', flavor: 'tense' },
];

function angleDiff(a: number, b: number): number {
  let d = Math.abs(a - b) % 360;
  if (d > 180) d = 360 - d;
  return d;
}

function findAspect(lonA: number, lonB: number) {
  const d = angleDiff(lonA, lonB);
  for (const asp of ASPECTS) {
    if (Math.abs(d - asp.angle) <= asp.orb) return asp;
  }
  return null;
}

const PLANET_TR: Record<string, string> = {
  Sun: 'Güneş', Moon: 'Ay', Mercury: 'Merkür', Venus: 'Venüs', Mars: 'Mars',
  Jupiter: 'Jüpiter', Saturn: 'Satürn', Ascendant: 'Yükselen', NorthNode: 'Kuzey Düğüm',
};

// Synastry'de en anlamlı gezegen çiftleri
const SYNASTRY_PAIRS: Array<{ a: PlanetName; b: PlanetName; theme: string }> = [
  { a: 'Sun', b: 'Moon', theme: 'kimlik ve duygusal besleme — klasik ruh eşi göstergesi' },
  { a: 'Moon', b: 'Sun', theme: 'duygusal besleme ve kimlik — karşılıklı yuva hissi' },
  { a: 'Venus', b: 'Mars', theme: 'romantik ve fiziksel çekim' },
  { a: 'Mars', b: 'Venus', theme: 'tutku ve estetik çekim' },
  { a: 'Sun', b: 'Sun', theme: 'temel kimlik ve yaşam yönü uyumu' },
  { a: 'Moon', b: 'Moon', theme: 'duygusal dil ve ev hissi' },
  { a: 'Venus', b: 'Venus', theme: 'sevgi dili ve değer uyumu' },
  { a: 'Sun', b: 'Ascendant', theme: 'doğal görünürlük ve ilk çekim' },
  { a: 'Moon', b: 'Ascendant', theme: 'içgüdüsel yakınlık ve rahatlık' },
  { a: 'Saturn', b: 'Sun', theme: 'sorumluluk, kalıcılık ve olgunlaştıran bağ' },
  { a: 'NorthNode', b: 'Sun', theme: 'kaderî / büyüten karmik bağ' },
  { a: 'Sun', b: 'NorthNode', theme: 'ortak ruhsal yön ve kader hissi' },
];

const ASPECT_MEANING: Record<AstroAspect['flavor'], string> = {
  fusion: 'enerjiler birleşir, yoğun ve birbirinden ayrılamaz bir tema',
  flowing: 'doğal akış, kolaylık ve karşılıklı destek',
  tense: 'sürtünme ve gerilim — ama doğru kullanılınca en çok büyüten bağ',
};

function planetLon(report: GalacticReport, name: PlanetName): number | null {
  const p = report.chart.planets.find((pl) => pl.name === name);
  return p ? p.longitude : null;
}

function astroAspects(a: GalacticReport, b: GalacticReport): AstroAspect[] {
  const nameA = a.birth.fullName.split(' ')[0];
  const nameB = b.birth.fullName.split(' ')[0];
  const out: AstroAspect[] = [];
  const seen = new Set<string>();

  for (const pair of SYNASTRY_PAIRS) {
    const lonA = planetLon(a, pair.a);
    const lonB = planetLon(b, pair.b);
    if (lonA == null || lonB == null) continue;
    const asp = findAspect(lonA, lonB);
    if (!asp) continue;
    const key = [pair.a, pair.b].sort().join('-') + asp.name;
    if (seen.has(key)) continue;
    seen.add(key);

    out.push({
      a: `${nameA} ${PLANET_TR[pair.a]}`,
      b: `${nameB} ${PLANET_TR[pair.b]}`,
      aspect: asp.name,
      flavor: asp.flavor,
      meaning: `${pair.theme}. ${ASPECT_MEANING[asp.flavor]}.`,
    });
  }
  return out;
}

// ---------- NUMEROLOJİ ----------

function numerologyHarmony(a: number, b: number): { harmony: string; score: number } {
  if (a === b) {
    return {
      harmony: `İkiniz de Yaşam Yolu ${a}. Aynı temel dersi paylaşıyorsunuz — birbirinizi derinden anlarsınız ama aynı kör noktaları da paylaşırsınız.`,
      score: 78,
    };
  }
  const harmonious: Record<number, number[]> = {
    1: [5, 7, 3],
    2: [4, 6, 8],
    3: [1, 5, 9, 6],
    4: [2, 8, 6],
    5: [1, 3, 7],
    6: [2, 3, 9, 4],
    7: [1, 5, 11],
    8: [2, 4, 22],
    9: [3, 6, 11],
    11: [2, 7, 9],
    22: [4, 8],
    33: [6, 9],
  };
  const aHarm = harmonious[a] ?? [];
  if (aHarm.includes(b)) {
    return {
      harmony: `Yaşam Yolu ${a} ve ${b} doğal olarak akan bir kombinasyon. Farklı güçler getirirsiniz ama birbirinizi tamamlarsınız.`,
      score: 82,
    };
  }
  const diff = Math.abs(a - b);
  if (diff <= 2) {
    return {
      harmony: `Yaşam Yolu ${a} ve ${b} birbirine yakın enerjiler — çoğu konuda anlaşır, bazen aynılaşmaktan sıkılırsınız.`,
      score: 68,
    };
  }
  return {
    harmony: `Yaşam Yolu ${a} ve ${b} farklı ritimlerde. Çekim güçlü olabilir ama uyum için bilinçli çaba ve saygı gerekir — en çok büyüten ilişkiler bunlardır.`,
    score: 58,
  };
}

// ---------- SKORLAMA ----------

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

export function compareReports(a: GalacticReport, b: GalacticReport): CompatibilityResult {
  const hdCenters = centerDynamics(a, b);
  const hdConnections = channelConnections(a, b);
  const aspects = astroAspects(a, b);
  const num = numerologyHarmony(a.numerology.lifePath, b.numerology.lifePath);

  // HD skoru
  const electro = hdConnections.filter((c) => c.kind === 'electromagnetic').length;
  const companion = hdConnections.filter((c) => c.kind === 'companionship').length;
  const dominance = hdConnections.filter((c) => c.kind.startsWith('dominance')).length;
  const scoreHD = clamp(50 + electro * 9 + companion * 6 - dominance * 1.5);

  // Astro skoru
  const flowing = aspects.filter((x) => x.flavor === 'flowing').length;
  const fusion = aspects.filter((x) => x.flavor === 'fusion').length;
  const tense = aspects.filter((x) => x.flavor === 'tense').length;
  const scoreAstro = clamp(48 + flowing * 8 + fusion * 7 + tense * 2);

  const scoreNumerology = num.score;

  const scoreOverall = clamp(scoreHD * 0.4 + scoreAstro * 0.4 + scoreNumerology * 0.2);

  const nameA = a.birth.fullName.split(' ')[0];
  const nameB = b.birth.fullName.split(' ')[0];

  let headline: string;
  if (scoreOverall >= 80) headline = `${nameA} & ${nameB}: Manyetik bir uyum`;
  else if (scoreOverall >= 65) headline = `${nameA} & ${nameB}: Akan ve besleyen bir bağ`;
  else if (scoreOverall >= 50) headline = `${nameA} & ${nameB}: Büyüten, dengeli bir karışım`;
  else headline = `${nameA} & ${nameB}: Zıtların öğretici dansı`;

  return {
    nameA,
    nameB,
    scoreOverall,
    scoreHD,
    scoreAstro,
    scoreNumerology,
    hdCenters,
    hdConnections,
    astroAspects: aspects,
    numerology: {
      aLifePath: a.numerology.lifePath,
      bLifePath: b.numerology.lifePath,
      harmony: num.harmony,
      score: num.score,
    },
    headline,
  };
}

export { SIGN_NAMES_TR };
