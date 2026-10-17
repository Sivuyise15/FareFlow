import { useRouter } from 'expo-router';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '@/components/layout/EmptyState';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Button } from '@/components/ui/Button';
import { BudgetCard } from '@/features/dashboard/components/BudgetCard';
import { StatTile } from '@/features/dashboard/components/StatTile';
import { SummaryCard } from '@/features/dashboard/components/SummaryCard';
import { useDashboard } from '@/features/dashboard/hooks/useDashboard';
import { useImportReceipts } from '@/features/sync/hooks/useImportReceipts';
import { formatRand } from '@/lib/currency';
import { colors } from '@/theme/colors';

export default function HomeScreen() {
  const router = useRouter();
  const { data, isLoading, isError, error, refetch, isRefetching } = useDashboard();
  const importer = useImportReceipts();

  return (
    <View style={styles.screen}>
      <ScreenHeader />

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent} />
        </View>
      ) : isError || !data ? (
        <View style={styles.center}>
          <EmptyState
            icon="cloud-offline-outline"
            title="Couldn't load your spending"
            message={error instanceof Error ? error.message : 'Something went wrong.'}
            actionLabel="Try again"
            onAction={() => void refetch()}
          />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching && !importer.isPending}
              onRefresh={() => void refetch()}
              tintColor={colors.accent}
            />
          }
        >
          <SummaryCard total={data.monthTotal} providers={data.providers} trend={data.trend} />

          <View style={styles.actions}>
            <Button
              label={importer.isPending ? 'Importing…' : 'Import receipts'}
              icon="sync"
              loading={importer.isPending}
              onPress={() => importer.mutate()}
            />
            <Button
              label="View all transactions"
              variant="secondary"
              iconRight="arrow-forward"
              onPress={() => router.push('./transactions')}
            />

            {importer.isSuccess ? (
              <Text style={styles.feedback}>
                {importer.data.imported === 0
                  ? 'No new receipts found.'
                  : `Imported ${importer.data.imported} new receipt${importer.data.imported === 1 ? '' : 's'}.`}
              </Text>
            ) : null}
            {importer.isError ? (
              <Text style={[styles.feedback, styles.feedbackError]}>
                {importer.error instanceof Error ? importer.error.message : 'Import failed.'}
              </Text>
            ) : null}
          </View>

          <BudgetCard spent={data.budget.spent} limit={data.budget.limit} />

          <View style={styles.tiles}>
            <StatTile icon="time-outline" label="THIS WEEK" value={formatRand(data.thisWeek, { decimals: 0 })} />
            <StatTile icon="trending-up" label="AVG TRIP" value={formatRand(data.averageTrip, { decimals: 0 })} />
            <StatTile icon="flash" label="TOP APP" value={data.topProvider ?? '—'} />
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { padding: 18, paddingBottom: 32, gap: 20 },
  actions: { gap: 10 },
  feedback: { textAlign: 'center', fontSize: 13, color: colors.textSecondary },
  feedbackError: { color: colors.danger },
  tiles: { flexDirection: 'row', gap: 10 },
});
