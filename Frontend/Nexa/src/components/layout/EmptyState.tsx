import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { colors } from '@/theme/colors';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

type Props = {
  icon?: IconName;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
};

/** Used for empty lists and for failed loads (pass a retry as the action). */
export function EmptyState({ icon = 'file-tray-outline', title, message, actionLabel, onAction }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.mark}>
        <Ionicons name={icon} size={26} color={colors.textSecondary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {actionLabel && onAction ? (
        <View style={styles.action}>
          <Button label={actionLabel} onPress={onAction} variant="secondary" />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', gap: 10, padding: 32 },
  mark: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  message: { fontSize: 14, lineHeight: 21, color: colors.textSecondary, textAlign: 'center' },
  action: { marginTop: 8, alignSelf: 'stretch' },
});
