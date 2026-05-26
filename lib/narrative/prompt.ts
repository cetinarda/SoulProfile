import type { GalacticReport } from '../types';

export function buildSystemPrompt(): string {
  return `Sen "SoulProfile" uygulamasının galaktik karne yazarısın. Doğum verilerinden çıkarılan
Batı astrolojisi, Vedik nakshatra, Çin zodyak, Maya Tzolkin, Norse rune, Tarot doğum kartı,
Human Design ve numeroloji bilgilerini şiirsel, sıcak ve güçlendirici bir Türkçe ile anlatıyorsun.

KURALLAR:
- Sıradan kişilik testlerinden kaç. Mistik, kozmik, kalp-merkezli ol.
- "Human" yerine "yıldız çocuk", "köprü ruh", "kozmik yolcu" gibi ifadeler kullan.
- Kuzey Ay Düğümü = bu hayattaki ruhsal görev. Güney Ay Düğümü = bırakılması gereken konfor.
- Human Design tipini, otoritesini ve stratejisini açıkça vurgula.
- Tıbbi/psikolojik/finansal tavsiye verme. Sembolik dilde kal.
- Bedenlenme/inkarnasyon sayılarını VERİRKEN "sembolik bir okuma" olduğunu netleştir
  (asla kesin gerçek diye sunma).

ÇIKTI FORMATI: Aşağıdaki başlıklarla, her başlık altında 1 paragraf (3-4 cümle).
Başlıkları tam olarak şu şekilde yaz: "## Açılış", "## Astroloji & Düğümler",
"## Human Design Pusulası", "## Görev Çağrısı", "## Ruhun Hikâyesi", "## Bilgelikleri",
"## Gölgeleri".

- "Ruhun Hikâyesi": Sembolik bir bedenlenme okuması. Kaç kez (örn. 7-12 arası bir sayı, "yaklaşık")
  ne tür enkarnasyonlar (rahip, savaşçı, şifacı, sanatçı vs.) yaşamış olabileceğini, BU YAŞAMA
  niye geldiğini, ne armağan getirdiğini, ne öğrenmeye çalıştığını anlat. 4-5 cümle.
- "Bilgelikleri": 5 kısa madde (her madde 1 cümle), "- " ile başlasın.
- "Gölgeleri": 5 kısa madde (her madde 1 cümle), "- " ile başlasın. Gölge = bastırılmış/öğrenilmemiş
  yön, asla "kötü huy" tonunda değil; "tanışılması gereken kapı" tonunda.`;
}

export function buildUserPrompt(
  report: Omit<GalacticReport, 'narrative' | 'summary' | 'sections'>,
): string {
  const sun = report.chart.planets.find((p) => p.name === 'Sun');
  const moon = report.chart.planets.find((p) => p.name === 'Moon');
  const nn = report.chart.planets.find((p) => p.name === 'NorthNode');
  const sn = report.chart.planets.find((p) => p.name === 'SouthNode');
  const s = report.systems;

  return `Bu yıldız çocuk için galaktik karnesini yaz:

İsim: ${report.birth.fullName}
Doğum: ${report.birth.birthDate} ${report.birth.birthTime} ${report.birth.birthPlace}
Yıldız Kökeni: ${report.origin.race} (${report.origin.starSystem}) — ${report.origin.archetype}

BATI ASTROLOJİSİ:
- Güneş: ${sun?.sign} ${sun?.degreeInSign.toFixed(1)}° (${sun?.house}. ev)
- Ay: ${moon?.sign} ${moon?.degreeInSign.toFixed(1)}° (${moon?.house}. ev)
- Yükselen: ${report.chart.ascendantSign}
- Kuzey Düğüm (Görev): ${nn?.sign} ${nn?.house}. ev
- Güney Düğüm (Bırak): ${sn?.sign} ${sn?.house}. ev

VEDİK: ${s.vedic.nakshatra.name} nakshatrası (Pada ${s.vedic.pada}), tanrı ${s.vedic.nakshatra.deity}
ÇİN: ${s.chinese.signature}
MAYA: Kin ${s.maya.kin} — ${s.maya.tone.tr} ${s.maya.daySign.tr}
NORSE: ${s.norse.rune.name} runu (${s.norse.rune.meaning})
TAROT: Kişilik ${s.tarot.personality.name}, Ruh ${s.tarot.soul.name}

NUMEROLOJİ:
- Yaşam Yolu: ${report.numerology.lifePath}
- İfade: ${report.numerology.expression}, Ruh Arzusu: ${report.numerology.soulUrge}
- Kişisel Yıl: ${report.numerology.personalYear}

HUMAN DESIGN:
- Tip: ${report.humanDesign.type}, Strateji: ${report.humanDesign.strategy}
- Otorite: ${report.humanDesign.authority}, Profil: ${report.humanDesign.profile}

GÖREVLER:
${report.missions.map((m, i) => `${i + 1}. ${m.title}: ${m.description}`).join('\n')}

Şimdi 7 başlıkla anlatıyı yaz: ## Açılış, ## Astroloji & Düğümler, ## Human Design Pusulası,
## Görev Çağrısı, ## Ruhun Hikâyesi, ## Bilgelikleri, ## Gölgeleri.`;
}
