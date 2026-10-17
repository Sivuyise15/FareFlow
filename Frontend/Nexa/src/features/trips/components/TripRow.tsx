import { StyleSheet, Text, View } from 'react-native';

import type { Trip } from '@/api/types';
import { formatRand } from '@/lib/currency';
import { formatTripWhen } from '@/lib/date';
import { colors } from '@/theme/colors';

export function TripRow({ trip }: { trip: Trip }) {
  const route = [trip.pickup, trip.dropoff].filter(Boolean).join(' → ');

  return (
    <View style={styles.row}>
      <View style={styles.chip}>
        <Text style={styles.chipText}>{trip.provider.toUpperCase()}</Text>
      </View>

      <View style={styles.middle}>
        <Text style={styles.when}>{formatTripWhen(trip.occurredAt)}</Text>
        {route ? (
          <Text style={styles.route} numberOfLines={1}>
            {route}
          </Text>
        ) : null}
      </View>

      <Text style={styles.amount}>{formatRand(trip.amount)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  chip: {
    minWidth: 58,
    alignItems: 'center',
    backgroundColor: colors.black,
    borderRadius: 7,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  chipText: { color: colors.white, fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  middle: { flex: 1, gap: 2 },
  when: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  route: { fontSize: 12, color: colors.textSecondary },
  amount: { fontSize: 15, fontWeight: '800', letterSpacing: -0.2, color: colors.textPrimary },
});
