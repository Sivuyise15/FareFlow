import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import { EmptyState } from '@/components/layout/EmptyState';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { BudgetCard } from '@/features/dashboard/components/BudgetCard';
import { StatTile } from '@/features/dashboard/components/StatTile';
import { useDashboard } from '@/features/dashboard/hooks/useDashboard';
import { getBudgetStatus } from '@/lib/budget';
import { formatRand } from '@/lib/currency';
import { colors } from '@/theme/colors';

export default function BudgetScreen() {
  const { data, isLoading, isError, error, refetch, isRefetching } = useDashboard();

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Budget" />

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent} />
        </View>
      ) : isError || !data ? (
        <View style={styles.center}>
          <EmptyState
            icon="cloud-offline-outline"
            title="Couldn't load your budget"
            message={error instanceof Error ? error.message : 'Something went wrong.'}
            actionLabel="Try again"
            onAction={() => void refetch()}
          />
        </View>
      ) : (
        <BudgetBody
          spent={data.budget.spent}
          limit={data.budget.limit}
          refreshing={isRefetching}
          onRefresh={() => void refetch()}
        />
      )}
    </View>
  );
}

function BudgetBody({
  spent,
  limit,
  refreshing,
  onRefresh,
}: {
  spent: number;
  limit: number;
  refreshing: boolean;
  onRefresh: () => void;
}) {
  const status = getBudgetStatus(spent, limit);

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />
      }
    >
      <BudgetCard spent={spent} limit={limit} />

      <View style={styles.tiles}>
        <StatTile
          icon="wallet-outline"
          label={status.remaining < 0 ? 'OVER BY' : 'REMAINING'}
          value={formatRand(Math.abs(status.remaining), { decimals: 0 })}
        />
        <StatTile
          icon="calendar-outline"
          label="PER DAY LEFT"
          value={formatRand(status.perDayLeft, { decimals: 0 })}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { padding: 18, paddingBottom: 32, gap: 20 },
  tiles: { flexDirection: 'row', gap: 10 },
});
