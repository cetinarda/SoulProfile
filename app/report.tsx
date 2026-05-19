import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { captureRef } from 'react-native-view-shot';
import { CosmicBackground } from '../components/CosmicBackground';
import { ReportCard } from '../components/ReportCard';
import { colors, radii, spacing } from '../lib/theme';
import { useSoulStore } from '../lib/store';
import { saveImageToGallery, shareImage } from '../lib/share';

export default function ReportScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const report = useSoulStore((s) => s.report);
  const cardRef = useRef<View | null>(null);
  const [working, setWorking] = useState<'share' | 'save' | null>(null);

  if (!report) {
    return (
      <CosmicBackground>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Henüz bir karne yok.</Text>
          <Pressable style={styles.cta} onPress={() => router.replace('/birth')}>
            <Text style={styles.ctaText}>Karne Hazırla</Text>
          </Pressable>
        </View>
      </CosmicBackground>
    );
  }

  async function captureCard(): Promise<string | null> {
    if (!cardRef.current) return null;
    try {
      const uri = await captureRef(cardRef, {
        format: 'png',
        quality: 1,
        result: 'tmpfile',
      });
      return uri;
    } catch (e) {
      console.warn('[report] capture failed', e);
      return null;
    }
  }

  async function onShare() {
    setWorking('share');
    try {
      const uri = await captureCard();
      if (uri) await shareImage(uri);
    } finally {
      setWorking(null);
    }
  }

  async function onSave() {
    setWorking('save');
    try {
      const uri = await captureCard();
      if (!uri) return;
      if (Platform.OS === 'web') {
        await shareImage(uri);
        return;
      }
      const ok = await saveImageToGallery(uri);
      if (ok) {
        Alert.alert('Kaydedildi', 'Karnen galerine eklendi.');
      } else {
        Alert.alert('İzin yok', 'Galeriye kaydetmek için izin gerekiyor.');
      }
    } finally {
      setWorking(null);
    }
  }

  return (
    <CosmicBackground variant="cosmic">
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingTop: insets.top + spacing(6), paddingBottom: insets.bottom + spacing(10) },
        ]}
      >
        <Text style={styles.summary}>{report.summary}</Text>

        <View style={styles.cardWrap} ref={cardRef} collapsable={false}>
          <ReportCard report={report} />
        </View>

        <View style={styles.actions}>
          <Pressable style={[styles.action, styles.actionPrimary]} onPress={onShare} disabled={working !== null}>
            {working === 'share' ? (
              <ActivityIndicator color="#1a0a40" />
            ) : (
              <Text style={styles.actionPrimaryText}>Görsel Olarak Paylaş</Text>
            )}
          </Pressable>
          <Pressable style={styles.action} onPress={onSave} disabled={working !== null}>
            {working === 'save' ? (
              <ActivityIndicator color={colors.text} />
            ) : (
              <Text style={styles.actionText}>
                {Platform.OS === 'web' ? 'PNG İndir' : 'Galeriye Kaydet'}
              </Text>
            )}
          </Pressable>
        </View>

        <View style={styles.narrative}>
          <Text style={styles.narrativeTitle}>Kozmik Anlatın</Text>
          {report.narrative.split('\n\n').map((p, i) => (
            <Text key={i} style={styles.narrativeP}>
              {p}
            </Text>
          ))}
        </View>

        <View style={styles.premium}>
          <Text style={styles.premiumKicker}>YAKINDA</Text>
          <Text style={styles.premiumTitle}>Premium Karneler</Text>
          <Text style={styles.premiumDesc}>
            Haftalık & aylık döngüler, Solar Return analizleri, ilişki haritası, biyoritm grafiği, çakra
            tarama ve detaylı Human Design kapı analizleri.
          </Text>
        </View>

        <Pressable onPress={() => router.replace('/')}>
          <Text style={styles.again}>Yeni karne oluştur</Text>
        </Pressable>
      </ScrollView>
    </CosmicBackground>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: spacing(4), gap: spacing(5) },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing(4) },
  emptyText: { color: colors.text, fontSize: 16 },
  summary: { color: colors.gold, textAlign: 'center', fontSize: 13, letterSpacing: 1 },
  cardWrap: { width: '100%' },
  actions: { flexDirection: 'row', gap: spacing(3) },
  action: {
    flex: 1,
    paddingVertical: spacing(4),
    borderRadius: radii.lg,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    alignItems: 'center',
  },
  actionPrimary: { backgroundColor: colors.gold, borderColor: colors.gold },
  actionText: { color: colors.text, fontFamily: 'Inter-Bold', fontSize: 14 },
  actionPrimaryText: { color: '#1a0a40', fontFamily: 'Inter-Bold', fontSize: 14 },
  narrative: {
    padding: spacing(5),
    backgroundColor: colors.panel,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    gap: spacing(3),
  },
  narrativeTitle: {
    color: colors.gold,
    fontSize: 11,
    letterSpacing: 3,
    fontFamily: 'Inter-Bold',
  },
  narrativeP: { color: colors.text, fontSize: 14, lineHeight: 22 },
  premium: {
    padding: spacing(5),
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.gold,
    backgroundColor: 'rgba(245,208,97,0.07)',
  },
  premiumKicker: { color: colors.gold, letterSpacing: 3, fontSize: 10, fontFamily: 'Inter-Bold' },
  premiumTitle: {
    color: colors.text,
    fontFamily: 'CormorantGaramond',
    fontSize: 24,
    marginTop: 4,
  },
  premiumDesc: { color: colors.textMuted, fontSize: 13, lineHeight: 20, marginTop: 6 },
  cta: {
    backgroundColor: colors.gold,
    paddingVertical: spacing(4),
    paddingHorizontal: spacing(8),
    borderRadius: radii.xl,
  },
  ctaText: { color: '#1a0a40', fontFamily: 'Inter-Bold' },
  again: { color: colors.textMuted, textAlign: 'center', fontSize: 13, padding: spacing(3) },
});
