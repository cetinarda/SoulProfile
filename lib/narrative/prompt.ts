import type { GalacticReport } from '../types';

export function buildSystemPrompt(): string {
  return `Sen "SoulProfile" uygulamasının galaktik karne yazarısın. Kullanıcıya doğum verilerinden çıkarılan astroloji, numeroloji, Human Design ve yıldız kökeni bilgilerini şiirsel, sıcak ve güçlendirici bir Türkçe ile anlatıyorsun.

KURALLAR:
- Sıradan kişilik testlerinden kaç. Mistik, kozmik, kalp-merkezli ol.
- Kesinlikle "human" kelimesini kullanma. Onun yerine "yıldız çocuk", "köprü ruh", "kozmik yolcu" gibi ifadeler kullan.
- Kuzey Ay Düğümü'nü bu hayattaki ruhsal görev, Güney Ay Düğümü'nü bırakılması gereken konfor olarak ele al.
- Human Design tipini, otoritesini ve stratejisini açıkça vurgula.
- Tıbbi, psikolojik veya finansal tavsiye verme. Sembolik dilde kal.
- 4 paragrafı aşma. Her paragraf ortalama 3-4 cümle.`;
}

export function buildUserPrompt(report: Omit<GalacticReport, 'narrative' | 'summary'>): string {
  const sun = report.chart.planets.find((p) => p.name === 'Sun');
  const moon = report.chart.planets.find((p) => p.name === 'Moon');
  const nn = report.chart.planets.find((p) => p.name === 'NorthNode');
  const sn = report.chart.planets.find((p) => p.name === 'SouthNode');

  return `Bu yıldız çocuk için galaktik karnesini yaz:

İsim: ${report.birth.fullName}
Yıldız Kökeni: ${report.origin.race} (${report.origin.starSystem}) — ${report.origin.archetype}

ASTROLOJİ:
- Güneş: ${sun?.sign} ${sun?.degreeInSign.toFixed(1)}° (${sun?.house}. ev)
- Ay: ${moon?.sign} ${moon?.degreeInSign.toFixed(1)}° (${moon?.house}. ev)
- Yükselen: ${report.chart.ascendantSign}
- Kuzey Düğüm (Görev): ${nn?.sign} ${nn?.house}. ev
- Güney Düğüm (Bırak): ${sn?.sign} ${sn?.house}. ev

NUMEROLOJİ:
- Yaşam Yolu: ${report.numerology.lifePath}
- İfade: ${report.numerology.expression}
- Ruh Arzusu: ${report.numerology.soulUrge}
- Kişisel Yıl: ${report.numerology.personalYear}

HUMAN DESIGN:
- Tip: ${report.humanDesign.type}
- Strateji: ${report.humanDesign.strategy}
- Otorite: ${report.humanDesign.authority}
- Profil: ${report.humanDesign.profile}
- Enkarnasyon: ${report.humanDesign.incarnationCross}

GÖREVLER:
${report.missions.map((m, i) => `${i + 1}. ${m.title}: ${m.description}`).join('\n')}

ÇIKTI YAPISI:
1) Açılış: Yıldız kökenini ve gelişin anlamını şiirsel anlat (1 paragraf).
2) Astroloji & Düğümler: Güneş-Ay-Yükselen üçlüsünü Kuzey-Güney düğüm görevi ile bağla (1 paragraf).
3) Human Design Pusulası: Tip, strateji ve otorite ile günlük karar verme yolunu anlat (1 paragraf).
4) Görev Çağrısı: 3 görevi tek bir kapanış cümlesinde ruh çağrısı olarak sentezle (1 paragraf).`;
}
