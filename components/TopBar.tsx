import { Link, usePathname } from 'expo-router';
import { Platform, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { colors, spacing } from '../lib/theme';

const NAV_LINKS = [
  { href: '/', label: 'Ana Sayfa' },
  { href: '/birth', label: 'Karne Oluştur' },
  { href: '/glossary', label: 'Kavramlar' },
  { href: '/about', label: 'Hakkımızda' },
  { href: '/premium', label: 'Premium' },
] as const;

export function TopBar() {
  const pathname = usePathname();
  const { width } = useWindowDimensions();

  if (Platform.OS !== 'web') return null;

  const compact = width < 820;

  return (
    <View style={[styles.bar, compact && styles.barCompact]}>
      <Link href="/" asChild>
        <Pressable style={styles.brandWrap}>
          <Text style={styles.brandMark}>✦</Text>
          <View>
            <Text style={styles.brandTitle}>SOULPROFILE</Text>
            <Text style={styles.brandTag}>Galaktik Karnen</Text>
          </View>
        </Pressable>
      </Link>

      {!compact ? (
        <View style={styles.nav}>
          {NAV_LINKS.map((l) => {
            const active = pathname === l.href;
            return (
              <Link key={l.href} href={l.href} asChild>
                <Pressable>
                  <Text style={[styles.navLink, active && styles.navLinkActive]}>
                    {l.label}
                  </Text>
                </Pressable>
              </Link>
            );
          })}
        </View>
      ) : null}

      <View style={styles.actions}>
        <Link href="/birth" asChild>
          <Pressable style={styles.cta}>
            <Text style={styles.ctaText}>Karnemi Aç</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

export const TOP_BAR_HEIGHT = 68;

const styles = StyleSheet.create({
  bar: {
    height: TOP_BAR_HEIGHT,
    paddingHorizontal: spacing(8),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing(6),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(5,6,15,0.72)',
    ...Platform.select({
      web: { position: 'sticky' as never, top: 0, zIndex: 50, backdropFilter: 'blur(14px)' as never },
    }),
  },
  barCompact: { paddingHorizontal: spacing(4) },
  brandWrap: { flexDirection: 'row', alignItems: 'center', gap: spacing(2) },
  brandMark: { color: colors.gold, fontSize: 24, marginRight: 4 },
  brandTitle: {
    color: colors.text,
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    letterSpacing: 4,
  },
  brandTag: { color: colors.textMuted, fontSize: 10, letterSpacing: 1.5 },
  nav: { flexDirection: 'row', gap: spacing(7) },
  navLink: { color: colors.textMuted, fontSize: 13, letterSpacing: 0.4 },
  navLinkActive: { color: colors.gold, fontFamily: 'Inter-Bold' },
  actions: { flexDirection: 'row', alignItems: 'center', gap: spacing(3) },
  cta: {
    paddingHorizontal: spacing(4),
    paddingVertical: spacing(2.5),
    backgroundColor: colors.gold,
    borderRadius: 22,
  },
  ctaText: { color: '#1a0a40', fontFamily: 'Inter-Bold', fontSize: 12, letterSpacing: 0.5 },
});
