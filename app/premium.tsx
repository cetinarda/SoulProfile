import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { PageLayout, Section, P } from '../components/PageLayout';
import { colors, radii, spacing } from '../lib/theme';

const PLANS = [
  {
    name: 'Cosmic Weekly',
    price: '$2.99 / hafta',
    description: '7 günlük transit, biyoritm, mantra ve haftalık taşıma rehberi.',
  },
  {
    name: 'Monthly Galactic',
    price: '$14.99 / ay',
    description: 'Yeni & dolunay rehberi, ilişki transitleri, kişisel ay grafiği.',
  },
  {
    name: 'Solar Return',
    price: '$19.99 / yıllık',
    description: 'Doğum gününde 12 ay tema haritası, çeyrek odakları, kapı analizi.',
  },
  {
    name: 'Relationship Sync',
    price: '$9.99 tek seferlik',
    description: 'Synastry + Human Design ilişki haritası.',
  },
  {
    name: 'Premium Bundle',
    price: '$79 / yıl',
    description: 'Tümü + sınırsız karne PDF + AI rehber sohbet.',
    featured: true,
  },
];

export default function Premium() {
  return (
    <PageLayout
      kicker="PREMIUM"
      title="Karnen sadece başlangıç"
      intro="Galaktik karne ücretsiz. Premium üyelikle haftalık ve aylık döngülere, ilişki haritana ve Solar Return analizine açılırsın."
    >
      <View style={styles.grid}>
        {PLANS.map((p) => (
          <View key={p.name} style={[styles.card, p.featured && styles.cardFeatured]}>
            {p.featured ? <Text style={styles.badge}>EN POPÜLER</Text> : null}
            <Text style={styles.planName}>{p.name}</Text>
            <Text style={styles.planPrice}>{p.price}</Text>
            <Text style={styles.planDesc}>{p.description}</Text>
          </View>
        ))}
      </View>

      <Section heading="Yakında">
        <P>
          Premium henüz canlıda değil. Free karneni şimdi al; premium açıldığında ilk sen
          duy diye e-posta listesine kaydolabilirsin.
        </P>
        <Link href="/birth" asChild>
          <Pressable style={styles.cta}>
            <Text style={styles.ctaText}>Free Karnemi Aç</Text>
          </Pressable>
        </Link>
      </Section>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  grid: { gap: spacing(3) },
  card: {
    padding: spacing(5),
    backgroundColor: colors.panel,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    gap: spacing(2),
  },
  cardFeatured: {
    borderColor: colors.gold,
    backgroundColor: 'rgba(245,208,97,0.07)',
  },
  badge: {
    color: colors.gold,
    fontFamily: 'Inter-Bold',
    fontSize: 10,
    letterSpacing: 2,
  },
  planName: { color: colors.text, fontFamily: 'CormorantGaramond', fontSize: 24 },
  planPrice: { color: colors.gold, fontSize: 14, fontFamily: 'Inter-Bold' },
  planDesc: { color: colors.textMuted, fontSize: 13, lineHeight: 19 },
  cta: {
    alignSelf: 'flex-start',
    marginTop: spacing(3),
    paddingHorizontal: spacing(6),
    paddingVertical: spacing(3.5),
    backgroundColor: colors.gold,
    borderRadius: radii.xl,
  },
  ctaText: { color: '#1a0a40', fontFamily: 'Inter-Bold', fontSize: 14 },
});
