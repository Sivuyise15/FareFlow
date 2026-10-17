import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { formatRand } from '@/lib/currency';
import { colors } from '@/theme/colors';
import { Sparkline } from './Sparkline';

type Props = { total: number; providers: string[]; trend: number[] };

export function SummaryCard({ total, providers, trend }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <Text style={styles.eyebrow}>TOTAL THIS MONTH</Text>
        <View style={styles.trendIcon}>
          <Ionicons name="trending-up" size={16} color={colors.accent} />
        </View>
      </View>

      <Text style={styles.total} accessibilityLabel={`Total this month ${formatRand(total)}`}>
        {formatRand(total)}
      </Text>

      {providers.length > 0 ? (
        <Text style={styles.sub}>
          Aggregated across <Text style={styles.subStrong}>{providers.join(', ')}</Text>
        </Text>
      ) : null}

      <View style={styles.spark}>
        <Sparkline values={trend} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
    borderRadius: 16,
    padding: 18,
    shadowColor: '#0B0B0F',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  eyebrow: { fontSize: 12, fontWeight: '600', letterSpacing: 0.8, color: colors.textSecondary },
  trendIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  total: {
    marginTop: 2,
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -1,
    color: colors.textPrimary,
  },
  sub: { marginTop: 4, fontSize: 12, color: colors.textSecondary },
  subStrong: { fontWeight: '700', color: colors.textPrimary },
  spark: { marginTop: 14 },
});
