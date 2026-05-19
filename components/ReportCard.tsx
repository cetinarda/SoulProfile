import { Image, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { colors, gradients, radii, spacing } from '../lib/theme';
import { SIGN_GLYPHS, SIGN_NAMES_TR } from '../lib/content/astrology-content';
import { LIFE_PATH_MEANINGS } from '../lib/content/numerology-content';
import type { GalacticReport } from '../lib/types';

export const REPORT_CARD_WIDTH = 1080;
export const REPORT_CARD_HEIGHT = 1920;

type Props = {
  report: GalacticReport;
};

export function ReportCard({ report }: Props) {
  const sun = report.chart.planets.find((p) => p.name === 'Sun')!;
  const moon = report.chart.planets.find((p) => p.name === 'Moon')!;
  const nn = report.chart.planets.find((p) => p.name === 'NorthNode')!;
  const sn = report.chart.planets.find((p) => p.name === 'SouthNode')!;
  const lp = LIFE_PATH_MEANINGS[report.numerology.lifePath];

  return (
    <View style={styles.card}>
      <LinearGradient colors={gradients.galaxy} style={StyleSheet.absoluteFill} />
      <BackgroundStars />

      <View style={styles.header}>
        <Text style={styles.brand}>SOULPROFILE</Text>
        <Text style={styles.brandSub}>Galaktik Karne</Text>
      </View>

      <View style={styles.photoFrame}>
        {report.birth.photoUri ? (
          <Image source={{ uri: report.birth.photoUri }} style={styles.photo} />
        ) : (
          <View style={[styles.photo, styles.photoPlaceholder]}>
            <Text style={styles.photoGlyph}>{report.origin.emoji}</Text>
          </View>
        )}
        <View style={styles.photoRing} />
      </View>

      <Text style={styles.name}>{report.birth.fullName}</Text>
      <Text style={styles.origin}>
        {report.origin.emoji}  {report.origin.race}
      </Text>
      <Text style={styles.starSystem}>{report.origin.starSystem}</Text>
      <Text style={styles.archetype}>"{report.origin.archetype}"</Text>

      <View style={styles.bigGrid}>
        <BigCell label="Güneş" value={SIGN_NAMES_TR[sun.sign]} glyph={SIGN_GLYPHS[sun.sign]} />
        <BigCell label="Ay" value={SIGN_NAMES_TR[moon.sign]} glyph={SIGN_GLYPHS[moon.sign]} />
        <BigCell
          label="Yükselen"
          value={SIGN_NAMES_TR[report.chart.ascendantSign]}
          glyph={SIGN_GLYPHS[report.chart.ascendantSign]}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Human Design</Text>
        <Text style={styles.hdType}>{report.humanDesign.type}</Text>
        <Text style={styles.hdMeta}>
          {report.humanDesign.strategy} · {report.humanDesign.authority} · {report.humanDesign.profile}
        </Text>
      </View>

      <View style={styles.row}>
        <View style={styles.miniCell}>
          <Text style={styles.miniLabel}>Yaşam Yolu</Text>
          <Text style={styles.miniValue}>{report.numerology.lifePath}</Text>
          <Text style={styles.miniSub}>{lp?.title}</Text>
        </View>
        <View style={styles.miniCell}>
          <Text style={styles.miniLabel}>Kişisel Yıl</Text>
          <Text style={styles.miniValue}>{report.numerology.personalYear}</Text>
          <Text style={styles.miniSub}>Şu anki döngü</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kuzey Ay Düğümü · Görev</Text>
        <Text style={styles.nodeSign}>
          {SIGN_GLYPHS[nn.sign]} {SIGN_NAMES_TR[nn.sign]} · {nn.house}. ev
        </Text>
        <Text style={styles.nodeBody}>{report.northNodeMessage}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Güney Ay Düğümü · Bırak</Text>
        <Text style={styles.nodeSign}>
          {SIGN_GLYPHS[sn.sign]} {SIGN_NAMES_TR[sn.sign]} · {sn.house}. ev
        </Text>
        <Text style={styles.nodeBody}>{report.southNodeMessage}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3 Görev</Text>
        {report.missions.map((m, i) => (
          <View key={i} style={styles.missionRow}>
            <Text style={styles.missionNumber}>0{i + 1}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.missionTitle}>{m.title}</Text>
              <Text style={styles.missionDesc}>{m.description}</Text>
            </View>
          </View>
        ))}
      </View>

      <Text style={styles.footer}>soulprofile.life</Text>
    </View>
  );
}

function BigCell({ label, value, glyph }: { label: string; value: string; glyph: string }) {
  return (
    <View style={styles.bigCell}>
      <Text style={styles.bigGlyph}>{glyph}</Text>
      <Text style={styles.bigLabel}>{label}</Text>
      <Text style={styles.bigValue}>{value}</Text>
    </View>
  );
}

function BackgroundStars() {
  const stars = Array.from({ length: 70 }, (_, i) => ({
    cx: `${(i * 53) % 100}%`,
    cy: `${(i * 37) % 100}%`,
    r: ((i * 7) % 4) * 0.7 + 0.5,
    o: ((i * 13) % 10) * 0.07 + 0.2,
  }));
  return (
    <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
      <Defs>
        <RadialGradient id="nebula" cx="50%" cy="15%" r="55%">
          <Stop offset="0%" stopColor="#7c5cff" stopOpacity="0.4" />
          <Stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </RadialGradient>
      </Defs>
      <Circle cx="50%" cy="14%" r="320" fill="url(#nebula)" />
      {stars.map((s, i) => (
        <Circle key={i} cx={s.cx as never} cy={s.cy as never} r={s.r} fill="white" opacity={s.o} />
      ))}
    </Svg>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    aspectRatio: 9 / 16,
    borderRadius: radii.xl,
    overflow: 'hidden',
    padding: spacing(6),
    backgroundColor: '#04020f',
  },
  header: { alignItems: 'center', marginTop: spacing(2) },
  brand: { color: colors.gold, fontFamily: 'Inter-Bold', letterSpacing: 5, fontSize: 11 },
  brandSub: {
    color: colors.text,
    fontFamily: 'CormorantGaramond',
    fontSize: 22,
    marginTop: 4,
  },
  photoFrame: {
    alignSelf: 'center',
    width: 150,
    height: 150,
    borderRadius: 75,
    marginTop: spacing(4),
    alignItems: 'center',
    justifyContent: 'center',
  },
  photo: { width: 150, height: 150, borderRadius: 75 },
  photoPlaceholder: { backgroundColor: colors.panel, alignItems: 'center', justifyContent: 'center' },
  photoGlyph: { color: colors.gold, fontSize: 56 },
  photoRing: {
    position: 'absolute',
    width: 162,
    height: 162,
    borderRadius: 81,
    borderWidth: 1.5,
    borderColor: colors.gold,
  },
  name: {
    color: colors.text,
    fontFamily: 'CormorantGaramond',
    fontSize: 28,
    textAlign: 'center',
    marginTop: spacing(3),
  },
  origin: {
    color: colors.gold,
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    textAlign: 'center',
    marginTop: spacing(2),
    letterSpacing: 1,
  },
  starSystem: { color: colors.starlight, textAlign: 'center', fontSize: 12, marginTop: 4 },
  archetype: {
    color: colors.textMuted,
    textAlign: 'center',
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 4,
  },
  bigGrid: { flexDirection: 'row', gap: spacing(2), marginTop: spacing(5) },
  bigCell: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: radii.md,
    padding: spacing(3),
    borderWidth: 1,
    borderColor: colors.panelBorder,
    alignItems: 'center',
  },
  bigGlyph: { color: colors.gold, fontSize: 22 },
  bigLabel: { color: colors.textMuted, fontSize: 10, marginTop: 4, letterSpacing: 1 },
  bigValue: { color: colors.text, fontFamily: 'Inter-Bold', fontSize: 13, marginTop: 2 },
  section: {
    marginTop: spacing(4),
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: radii.lg,
    padding: spacing(4),
    borderWidth: 1,
    borderColor: colors.panelBorder,
  },
  sectionTitle: {
    color: colors.gold,
    fontSize: 10,
    letterSpacing: 2,
    fontFamily: 'Inter-Bold',
    textTransform: 'uppercase',
  },
  hdType: { color: colors.text, fontFamily: 'CormorantGaramond', fontSize: 22, marginTop: 6 },
  hdMeta: { color: colors.textMuted, fontSize: 11, marginTop: 4, lineHeight: 17 },
  row: { flexDirection: 'row', gap: spacing(2), marginTop: spacing(3) },
  miniCell: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: radii.md,
    padding: spacing(3),
    borderWidth: 1,
    borderColor: colors.panelBorder,
  },
  miniLabel: { color: colors.textMuted, fontSize: 10, letterSpacing: 1.5 },
  miniValue: {
    color: colors.gold,
    fontFamily: 'CormorantGaramond',
    fontSize: 36,
    marginTop: 2,
    lineHeight: 38,
  },
  miniSub: { color: colors.textMuted, fontSize: 11 },
  nodeSign: { color: colors.text, fontFamily: 'Inter-Bold', fontSize: 13, marginTop: 4 },
  nodeBody: { color: colors.textMuted, fontSize: 11, lineHeight: 17, marginTop: 4 },
  missionRow: { flexDirection: 'row', gap: spacing(3), marginTop: spacing(3) },
  missionNumber: {
    color: colors.gold,
    fontFamily: 'CormorantGaramond',
    fontSize: 22,
    width: 36,
  },
  missionTitle: { color: colors.text, fontFamily: 'Inter-Bold', fontSize: 12 },
  missionDesc: { color: colors.textMuted, fontSize: 10, lineHeight: 16, marginTop: 2 },
  footer: {
    color: colors.textFaint,
    textAlign: 'center',
    fontSize: 10,
    marginTop: spacing(5),
    letterSpacing: 3,
  },
});
