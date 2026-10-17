import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

type Props = { icon: IconName; label: string; value: string };

export function StatTile({ icon, label, value }: Props) {
  return (
    <View style={styles.tile}>
      <View style={styles.icon}>
        <Ionicons name={icon} size={16} color={colors.accent} />
      </View>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 8,
  },
  icon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5, color: colors.textSecondary },
  value: { fontSize: 16, fontWeight: '800', letterSpacing: -0.3, color: colors.textPrimary },
});
