import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import { CosmicBackground } from './CosmicBackground';
import { colors, radii, spacing } from '../lib/theme';

type Props = {
  kicker?: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
  variant?: 'galaxy' | 'cosmic' | 'aurora' | 'card';
};

export function PageLayout({ kicker, title, intro, children, variant = 'cosmic' }: Props) {
  const insets = useSafeAreaInsets();
  const Wrapper = Platform.OS === 'web' ? View : CosmicBackground;
  const wrapperProps = Platform.OS === 'web' ? { style: { flex: 1, backgroundColor: colors.bg } } : { variant };

  return (
    <Wrapper {...(wrapperProps as never)}>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          {
            paddingTop: Platform.OS === 'web' ? spacing(10) : insets.top + spacing(8),
            paddingBottom: Platform.OS === 'web' ? spacing(12) : insets.bottom + spacing(10),
          },
        ]}
      >
        <View style={styles.inner}>
          {kicker ? <Text style={styles.kicker}>{kicker}</Text> : null}
          <Text style={styles.title}>{title}</Text>
          {intro ? <Text style={styles.intro}>{intro}</Text> : null}
          <View style={styles.body}>{children}</View>
        </View>
      </ScrollView>
    </Wrapper>
  );
}

export function Section({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionHeading}>{heading}</Text>
      <View style={{ gap: spacing(2) }}>{children}</View>
    </View>
  );
}

export function P({ children }: { children: React.ReactNode }) {
  return <Text style={styles.paragraph}>{children}</Text>;
}

export function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.bulletRow}>
      <Text style={styles.bulletDot}>✦</Text>
      <Text style={styles.bulletText}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: spacing(6) },
  inner: { maxWidth: 760, width: '100%', alignSelf: 'center', gap: spacing(3) },
  kicker: { color: colors.gold, letterSpacing: 4, fontSize: 12, fontFamily: 'Inter-Bold' },
  title: { color: colors.text, fontFamily: 'CormorantGaramond', fontSize: 40, lineHeight: 46 },
  intro: { color: colors.textMuted, fontSize: 15, lineHeight: 23, marginTop: spacing(1) },
  body: { gap: spacing(6), marginTop: spacing(4) },
  section: {
    padding: spacing(5),
    backgroundColor: colors.panel,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    gap: spacing(3),
  },
  sectionHeading: {
    color: colors.gold,
    fontFamily: 'Inter-Bold',
    fontSize: 13,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  paragraph: { color: colors.text, fontSize: 14, lineHeight: 22 },
  bulletRow: { flexDirection: 'row', gap: spacing(2), alignItems: 'flex-start' },
  bulletDot: { color: colors.gold, fontSize: 12, marginTop: 4 },
  bulletText: { flex: 1, color: colors.textMuted, fontSize: 13, lineHeight: 20 },
});
