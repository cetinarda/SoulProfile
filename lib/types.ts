export type BirthInput = {
  fullName: string;
  birthDate: string;
  birthTime: string;
  birthTimeKnown: boolean;
  birthPlace: string;
  latitude: number;
  longitude: number;
  timezone: string;
  photoUri?: string;
};

export type PlanetPosition = {
  name: PlanetName;
  longitude: number;
  sign: ZodiacSign;
  degreeInSign: number;
  house?: number;
  retrograde: boolean;
};

export type PlanetName =
  | 'Sun'
  | 'Moon'
  | 'Mercury'
  | 'Venus'
  | 'Mars'
  | 'Jupiter'
  | 'Saturn'
  | 'Uranus'
  | 'Neptune'
  | 'Pluto'
  | 'NorthNode'
  | 'SouthNode'
  | 'Chiron'
  | 'Ascendant'
  | 'MC';

export type ZodiacSign =
  | 'Aries'
  | 'Taurus'
  | 'Gemini'
  | 'Cancer'
  | 'Leo'
  | 'Virgo'
  | 'Libra'
  | 'Scorpio'
  | 'Sagittarius'
  | 'Capricorn'
  | 'Aquarius'
  | 'Pisces';

export type Chart = {
  ascendant: number;
  midheaven: number;
  ascendantSign: ZodiacSign;
  planets: PlanetPosition[];
  houses: number[];
};

export type Numerology = {
  lifePath: number;
  expression: number;
  soulUrge: number;
  personality: number;
  birthDay: number;
  personalYear: number;
};

export type HumanDesign = {
  type: 'Manifestor' | 'Generator' | 'ManifestingGenerator' | 'Projector' | 'Reflector';
  strategy: string;
  authority: string;
  profile: string;
  incarnationCross: string;
  definedCenters: string[];
};

export type StarOrigin = {
  race: string;
  starSystem: string;
  archetype: string;
  shortName: string;
  emoji: string;
};

export type Mission = {
  title: string;
  description: string;
};

export type MultiSystem = {
  maya: import('./systems/maya').MayaResult;
  vedic: import('./systems/vedic').VedicResult;
  chinese: import('./systems/chinese').ChineseResult;
  norse: import('./systems/norse').NorseResult;
  tarot: import('./systems/tarot').TarotResult;
};

export type GalacticReport = {
  id: string;
  createdAt: string;
  birth: BirthInput;
  chart: Chart;
  numerology: Numerology;
  humanDesign: HumanDesign;
  origin: StarOrigin;
  systems: MultiSystem;
  missions: Mission[];
  northNodeMessage: string;
  southNodeMessage: string;
  summary: string;
  narrative: string;
};
