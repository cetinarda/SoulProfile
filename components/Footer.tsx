import { Link } from 'expo-router';
import { Platform, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { colors, spacing } from '../lib/theme';

const SECTIONS = [
  {
    title: 'Ürün',
    links: [
      { href: '/', label: 'Ana Sayfa' },
      { href: '/birth', label: 'Karne Oluştur' },
      { href: '/premium', label: 'Premium' },
      { href: '/glossary', label: 'Kavramlar' },
    ],
  },
  {
    title: 'Kurum',
    links: [
      { href: '/about', label: 'Hakkımızda' },
      { href: '/support', label: 'Destek' },
      { href: '/contact', label: 'İletişim' },
    ],
  },
  {
    title: 'Yasal',
    links: [
      { href: '/privacy', label: 'Gizlilik Politikası' },
      { href: '/terms', label: 'Kullanım Koşulları' },
      { href: '/cookie', label: 'Çerez Politikası' },
      { href: '/data', label: 'Veri Talepleri (KVKK/GDPR)' },
    ],
  },
] as const;

export function Footer() {
  const { width } = useWindowDimensions();
  if (Platform.OS !== 'web') return null;
  const compact = width < 820;

  return (
    <View style={styles.footer}>
      <View style={[styles.grid, compact && styles.gridCompact]}>
        <View style={styles.brandCol}>
          <Text style={styles.brand}>✦ SOULPROFILE</Text>
          <Text style={styles.brandLine}>
            Sen sadece insan değilsin — galaktik bir karnen var.
          </Text>
          <Text style={styles.disclaimer}>
            Eğlence ve farkındalık amaçlıdır. Tıbbi, psikolojik veya finansal tavsiye yerine
            geçmez. Doğum verilerin yalnızca karnenin üretilmesi için kullanılır ve istediğin
            zaman silinebilir.
          </Text>
        </View>

        {SECTIONS.map((s) => (
          <View key={s.title} style={styles.col}>
            <Text style={styles.colTitle}>{s.title}</Text>
            {s.links.map((l) => (
              <Link key={l.href} href={l.href as never} asChild>
                <Pressable>
                  <Text style={styles.link}>{l.label}</Text>
                </Pressable>
              </Link>
            ))}
          </View>
        ))}
      </View>

      <View style={styles.bottom}>
        <Text style={styles.copy}>© {new Date().getFullYear()} SoulProfile. Tüm hakları saklıdır.</Text>
        <Text style={styles.copy}>Made with ✦ for star children.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    paddingTop: spacing(10),
    paddingBottom: spacing(8),
    paddingHorizontal: spacing(8),
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(2,3,10,0.85)',
  },
  grid: { flexDirection: 'row', gap: spacing(10), maxWidth: 1180, marginHorizontal: 'auto' as never, width: '100%' },
  gridCompact: { flexDirection: 'column', gap: spacing(6) },
  brandCol: { flex: 1.4, gap: spacing(2) },
  brand: { color: colors.gold, fontFamily: 'Inter-Bold', letterSpacing: 3, fontSize: 14 },
  brandLine: { color: colors.text, fontSize: 13, lineHeight: 19 },
  disclaimer: { color: colors.textFaint, fontSize: 11, lineHeight: 16, marginTop: spacing(2) },
  col: { flex: 1, gap: spacing(2) },
  colTitle: {
    color: colors.text,
    fontFamily: 'Inter-Bold',
    fontSize: 12,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: spacing(1),
  },
  link: { color: colors.textMuted, fontSize: 13, paddingVertical: 4 },
  bottom: {
    marginTop: spacing(8),
    paddingTop: spacing(4),
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: spacing(2),
    maxWidth: 1180,
    width: '100%',
    marginHorizontal: 'auto' as never,
  },
  copy: { color: colors.textFaint, fontSize: 11 },
});
