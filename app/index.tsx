import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CosmicBackground } from '../components/CosmicBackground';
import { colors, radii, spacing } from '../lib/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Welcome() {
  const insets = useSafeAreaInsets();
  return (
    <CosmicBackground>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingTop: insets.top + spacing(8), paddingBottom: insets.bottom + spacing(8) },
        ]}
      >
        <Text style={styles.kicker}>SOULPROFILE</Text>
        <Text style={styles.title}>Galaktik{'\n'}Karnen seni{'\n'}bekliyor</Text>
        <Text style={styles.subtitle}>
          Doğum bilgilerin ile yıldız kökenini, astrolojik haritanı, Human Design tipini, numerolojini
          ve bu yaşamdaki görevlerini içeren bir karne hazırlıyoruz.
        </Text>

        <View style={styles.features}>
          {FEATURES.map((f) => (
            <View key={f.title} style={styles.feature}>
              <Text style={styles.featureEmoji}>{f.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureDesc}>{f.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        <Link href="/birth" asChild>
          <Pressable style={styles.cta}>
            <Text style={styles.ctaText}>Karnemi Hazırla</Text>
          </Pressable>
        </Link>

        <Text style={styles.footer}>İlk karne ücretsiz · Premium yakında</Text>
      </ScrollView>
    </CosmicBackground>
  );
}

const FEATURES = [
  { emoji: '✨', title: 'Yıldız Kökeni', desc: 'Pleiades, Sirius, Arcturus... Hangi yıldız hattındansın?' },
  { emoji: '🌙', title: 'Astrolojik Harita', desc: 'Güneş, Ay, Yükselen + Kuzey/Güney Düğüm görevin.' },
  { emoji: '◇', title: 'Human Design', desc: 'Tip, otorite, strateji ve profilinle karar pusulan.' },
  { emoji: '⌖', title: 'Numeroloji', desc: 'Yaşam Yolu, İfade, Ruh Arzusu ve Kişisel Yıl.' },
  { emoji: '☼', title: '3 Görev', desc: 'Bu yaşamda hatırlaman gereken kozmik görev çağrısı.' },
];

const styles = StyleSheet.create({
  container: { paddingHorizontal: spacing(6), gap: spacing(4) },
  kicker: {
    color: colors.gold,
    letterSpacing: 4,
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  title: {
    color: colors.text,
    fontSize: 44,
    lineHeight: 50,
    fontFamily: 'CormorantGaramond',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: spacing(2),
  },
  features: { gap: spacing(3), marginTop: spacing(6) },
  feature: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing(3),
    padding: spacing(4),
    backgroundColor: colors.panel,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.panelBorder,
  },
  featureEmoji: { fontSize: 22, color: colors.gold },
  featureTitle: { color: colors.text, fontFamily: 'Inter-Bold', fontSize: 15 },
  featureDesc: { color: colors.textMuted, fontSize: 13, marginTop: 2, lineHeight: 19 },
  cta: {
    marginTop: spacing(6),
    backgroundColor: colors.gold,
    paddingVertical: spacing(4.5),
    borderRadius: radii.xl,
    alignItems: 'center',
  },
  ctaText: {
    color: '#1a0a40',
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    letterSpacing: 0.4,
  },
  footer: {
    color: colors.textFaint,
    textAlign: 'center',
    fontSize: 12,
    marginTop: spacing(3),
  },
});
