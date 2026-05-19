import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { PageLayout } from '../components/PageLayout';
import { GLOSSARY, type GlossaryEntry } from '../lib/content/glossary';
import { colors, radii, spacing } from '../lib/theme';

const FILTERS: Array<{ key: GlossaryEntry['category'] | 'all'; label: string }> = [
  { key: 'all', label: 'Tümü' },
  { key: 'numerology', label: 'Numeroloji' },
  { key: 'astrology', label: 'Astroloji' },
  { key: 'chakra', label: 'Çakra' },
  { key: 'biorhythm', label: 'Biyoritm' },
  { key: 'reiki', label: 'Reiki' },
  { key: 'practice', label: 'Pratikler' },
];

export default function Glossary() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]['key']>('all');

  const items = useMemo(
    () => (filter === 'all' ? GLOSSARY : GLOSSARY.filter((g) => g.category === filter)),
    [filter],
  );

  return (
    <PageLayout
      kicker="KAVRAMLAR"
      title="Kozmik sözlüğün"
      intro="Karnende karşına çıkan tüm kavramların açıklamaları. Yaşam Yolu Sayısından çakralara, Kuzey Düğümden biyoritme."
    >
      <View style={styles.filters}>
        {FILTERS.map((f) => (
          <Pressable
            key={f.key}
            onPress={() => setFilter(f.key)}
            style={[styles.chip, filter === f.key && styles.chipActive]}
          >
            <Text style={[styles.chipText, filter === f.key && styles.chipTextActive]}>
              {f.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={{ gap: spacing(3) }}>
        {items.map((entry) => (
          <View key={entry.id} style={styles.card}>
            <Text style={styles.term}>{entry.term}</Text>
            <Text style={styles.desc}>{entry.description}</Text>
          </View>
        ))}
      </View>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing(2),
    marginBottom: spacing(3),
  },
  chip: {
    paddingHorizontal: spacing(4),
    paddingVertical: spacing(2),
    borderRadius: 20,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.panelBorder,
  },
  chipActive: { backgroundColor: colors.gold, borderColor: colors.gold },
  chipText: { color: colors.textMuted, fontSize: 13 },
  chipTextActive: { color: '#1a0a40', fontFamily: 'Inter-Bold' },
  card: {
    padding: spacing(5),
    backgroundColor: colors.panel,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    gap: spacing(2),
  },
  term: { color: colors.text, fontFamily: 'Inter-Bold', fontSize: 15 },
  desc: { color: colors.textMuted, fontSize: 14, lineHeight: 21 },
});
