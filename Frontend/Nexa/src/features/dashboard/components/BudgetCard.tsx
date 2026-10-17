import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { getBudgetStatus } from '@/lib/budget';
import { formatRand } from '@/lib/currency';
import { colors } from '@/theme/colors';

type Props = { spent: number; limit: number };

export function BudgetCard({ spent, limit }: Props) {
  const status = getBudgetStatus(spent, limit);
  const over = status.usedPct >= 1;
  const fill = Math.min(Math.max(status.usedPct, 0), 1);

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.title}>Monthly Budget</Text>
        <Text style={[styles.used, over && styles.usedOver]}>
          {Math.round(status.usedPct * 100)}% used
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.track}>
          <View
            style={[styles.fill, { width: `${fill * 100}%` }, over && { backgroundColor: colors.danger }]}
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.spent}>{formatRand(spent, { decimals: 0 })} spent</Text>
          <Text style={styles.limit}>Limit: {formatRand(limit, { decimals: 0 })}</Text>
        </View>

        {status.alert ? (
          <View style={styles.alert} accessibilityRole="alert">
            <Ionicons name="alert-circle-outline" size={18} color={colors.danger} />
            <View style={styles.alertText}>
              <Text style={styles.alertTitle}>{status.alert.title}</Text>
              <Text style={styles.alertMessage}>{status.alert.message}</Text>
            </View>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  title: { fontSize: 18, fontWeight: '800', letterSpacing: -0.3, color: colors.textPrimary },
  used: { fontSize: 13, fontWeight: '600', color: colors.accent },
  usedOver: { color: colors.danger },

  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accentTrack,
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: 4, backgroundColor: colors.accent },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  spent: { fontSize: 12, fontWeight: '700', color: colors.textPrimary },
  limit: { fontSize: 12, color: colors.textSecondary },

  alert: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
    backgroundColor: colors.dangerSoft,
    borderWidth: 1,
    borderColor: colors.dangerBorder,
    borderRadius: 10,
    padding: 12,
  },
  alertText: { flex: 1, gap: 2 },
  alertTitle: { fontSize: 11, fontWeight: '800', letterSpacing: 0.4, color: colors.danger },
  alertMessage: { fontSize: 12, lineHeight: 17, color: colors.dangerText },
});
