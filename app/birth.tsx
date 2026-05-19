import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CosmicBackground } from '../components/CosmicBackground';
import { colors, radii, spacing } from '../lib/theme';
import { useSoulStore } from '../lib/store';
import { geocodePlace, type GeocodeResult } from '../lib/geocoding';
import { buildGalacticReport } from '../lib/report';

export default function BirthScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const birth = useSoulStore((s) => s.birth);
  const setBirth = useSoulStore((s) => s.setBirth);
  const setReport = useSoulStore((s) => s.setReport);
  const setLoading = useSoulStore((s) => s.setLoading);
  const setError = useSoulStore((s) => s.setError);
  const loading = useSoulStore((s) => s.loading);

  const [placeQuery, setPlaceQuery] = useState(birth.birthPlace ?? '');
  const [suggestions, setSuggestions] = useState<GeocodeResult[]>([]);
  const [searching, setSearching] = useState(false);

  async function pickPhoto() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });
    if (!result.canceled && result.assets[0]) {
      setBirth({ photoUri: result.assets[0].uri });
    }
  }

  async function searchPlace(value: string) {
    setPlaceQuery(value);
    setBirth({ birthPlace: value });
    if (value.length < 2) {
      setSuggestions([]);
      return;
    }
    setSearching(true);
    try {
      const r = await geocodePlace(value);
      setSuggestions(r);
    } finally {
      setSearching(false);
    }
  }

  function pickSuggestion(s: GeocodeResult) {
    setPlaceQuery(`${s.name}, ${s.country}`);
    setBirth({
      birthPlace: `${s.name}, ${s.country}`,
      latitude: s.latitude,
      longitude: s.longitude,
      timezone: s.timezone,
    });
    setSuggestions([]);
  }

  async function submit() {
    if (!birth.fullName || !birth.birthDate || birth.latitude == null) {
      setError('Lütfen isim, doğum tarihi ve doğum yerini gir.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const report = await buildGalacticReport({
        fullName: birth.fullName!,
        birthDate: birth.birthDate!,
        birthTime: birth.birthTime ?? '12:00',
        birthTimeKnown: birth.birthTimeKnown ?? true,
        birthPlace: birth.birthPlace!,
        latitude: birth.latitude!,
        longitude: birth.longitude!,
        timezone: birth.timezone ?? 'UTC',
        photoUri: birth.photoUri,
      });
      setReport(report);
      router.push('/report');
    } catch (e) {
      console.error(e);
      setError('Karne üretilemedi. Lütfen tekrar dene.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <CosmicBackground variant="aurora">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={[
            styles.container,
            { paddingTop: insets.top + spacing(8), paddingBottom: insets.bottom + spacing(8) },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Doğum Bilgilerin</Text>
          <Text style={styles.subtitle}>
            Karnen ne kadar derin olsun istersen, o kadar tam bilgi ver. Doğum saati Yükselen Burç ve
            Human Design otoritesi için kritik.
          </Text>

          <Pressable style={styles.photoSlot} onPress={pickPhoto}>
            {birth.photoUri ? (
              <Image source={{ uri: birth.photoUri }} style={styles.photo} />
            ) : (
              <View style={styles.photoEmpty}>
                <Text style={styles.photoEmptyIcon}>✦</Text>
                <Text style={styles.photoEmptyText}>Profil fotoğrafı seç</Text>
                <Text style={styles.photoEmptyHint}>Karnen üzerine basılacak</Text>
              </View>
            )}
          </Pressable>

          <Field label="Tam Adın">
            <TextInput
              style={styles.input}
              value={birth.fullName}
              onChangeText={(v) => setBirth({ fullName: v })}
              placeholder="Ada Yıldız"
              placeholderTextColor={colors.textFaint}
              autoCapitalize="words"
            />
          </Field>

          <Field label="Doğum Tarihi (YYYY-AA-GG)">
            <TextInput
              style={styles.input}
              value={birth.birthDate}
              onChangeText={(v) => setBirth({ birthDate: v })}
              placeholder="1995-04-21"
              placeholderTextColor={colors.textFaint}
              keyboardType="numbers-and-punctuation"
            />
          </Field>

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Field label="Doğum Saati (24h)">
                <TextInput
                  style={styles.input}
                  value={birth.birthTime}
                  onChangeText={(v) => setBirth({ birthTime: v })}
                  placeholder="14:30"
                  placeholderTextColor={colors.textFaint}
                  keyboardType="numbers-and-punctuation"
                  editable={birth.birthTimeKnown !== false}
                />
              </Field>
            </View>
            <View style={styles.switchBox}>
              <Text style={styles.switchLabel}>Biliniyor</Text>
              <Switch
                value={birth.birthTimeKnown !== false}
                onValueChange={(v) => setBirth({ birthTimeKnown: v })}
                trackColor={{ true: colors.cosmic, false: '#33334a' }}
                thumbColor={colors.gold}
              />
            </View>
          </View>

          <Field label="Doğum Yeri">
            <TextInput
              style={styles.input}
              value={placeQuery}
              onChangeText={searchPlace}
              placeholder="İstanbul, Türkiye"
              placeholderTextColor={colors.textFaint}
            />
            {searching ? <ActivityIndicator color={colors.gold} style={{ marginTop: 6 }} /> : null}
            {suggestions.length > 0 ? (
              <View style={styles.suggestions}>
                {suggestions.map((s, i) => (
                  <Pressable
                    key={`${s.name}-${i}`}
                    onPress={() => pickSuggestion(s)}
                    style={styles.suggestion}
                  >
                    <Text style={styles.suggestionText}>
                      {s.name}, {s.country}
                    </Text>
                    <Text style={styles.suggestionMeta}>
                      {s.latitude.toFixed(2)}, {s.longitude.toFixed(2)} · {s.timezone}
                    </Text>
                  </Pressable>
                ))}
              </View>
            ) : null}
          </Field>

          <Pressable style={[styles.cta, loading && { opacity: 0.6 }]} disabled={loading} onPress={submit}>
            {loading ? (
              <ActivityIndicator color="#1a0a40" />
            ) : (
              <Text style={styles.ctaText}>Galaktik Karnemi Aç</Text>
            )}
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </CosmicBackground>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: spacing(6), gap: spacing(4) },
  title: { color: colors.text, fontSize: 30, fontFamily: 'CormorantGaramond' },
  subtitle: { color: colors.textMuted, fontSize: 14, lineHeight: 20 },
  photoSlot: {
    alignSelf: 'center',
    width: 130,
    height: 130,
    borderRadius: 65,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: colors.gold,
    marginVertical: spacing(2),
  },
  photo: { width: '100%', height: '100%' },
  photoEmpty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.panel,
    gap: 4,
  },
  photoEmptyIcon: { color: colors.gold, fontSize: 22 },
  photoEmptyText: { color: colors.text, fontSize: 12, fontFamily: 'Inter-Bold' },
  photoEmptyHint: { color: colors.textFaint, fontSize: 10 },
  label: { color: colors.textMuted, fontSize: 12, letterSpacing: 1, textTransform: 'uppercase' },
  input: {
    backgroundColor: colors.panel,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    paddingHorizontal: spacing(4),
    paddingVertical: spacing(3.5),
    color: colors.text,
    fontSize: 15,
  },
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing(3) },
  switchBox: { alignItems: 'center', gap: 4, paddingBottom: 6 },
  switchLabel: { color: colors.textMuted, fontSize: 11 },
  suggestions: {
    backgroundColor: colors.bgElevated,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    marginTop: 6,
    overflow: 'hidden',
  },
  suggestion: {
    paddingHorizontal: spacing(4),
    paddingVertical: spacing(3),
    borderBottomWidth: 1,
    borderBottomColor: colors.panelBorder,
  },
  suggestionText: { color: colors.text, fontSize: 14 },
  suggestionMeta: { color: colors.textFaint, fontSize: 11, marginTop: 2 },
  cta: {
    marginTop: spacing(4),
    backgroundColor: colors.gold,
    paddingVertical: spacing(4.5),
    borderRadius: radii.xl,
    alignItems: 'center',
  },
  ctaText: { color: '#1a0a40', fontFamily: 'Inter-Bold', fontSize: 16, letterSpacing: 0.4 },
});
