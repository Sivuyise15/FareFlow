import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from 'react-native';

import { EmptyState } from '@/components/layout/EmptyState';
import { TripRow } from '@/features/trips/components/TripRow';
import { useTrips } from '@/features/trips/hooks/useTrips';
import { colors } from '@/theme/colors';

export default function TransactionsScreen() {
  const { data, isLoading, isError, error, refetch, isRefetching } = useTrips();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View style={styles.center}>
        <EmptyState
          icon="cloud-offline-outline"
          title="Couldn't load transactions"
          message={error instanceof Error ? error.message : 'Something went wrong.'}
          actionLabel="Try again"
          onAction={() => void refetch()}
        />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.list}
      data={data}
      keyExtractor={(trip) => trip.id}
      renderItem={({ item }) => <TripRow trip={item} />}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      contentContainerStyle={data.length === 0 ? styles.emptyContent : undefined}
      ListEmptyComponent={
        <EmptyState
          icon="receipt-outline"
          title="No transactions yet"
          message="Import your receipts from the Home tab and your trips will show up here."
        />
      }
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={() => void refetch()} tintColor={colors.accent} />
      }
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  list: { backgroundColor: colors.background },
  separator: { height: 1, marginLeft: 18, backgroundColor: colors.borderSoft },
  emptyContent: { flexGrow: 1, justifyContent: 'center' },
});
