import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/theme/colors';

type Provider = 'google' | 'microsoft';

export default function SignInScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const connect = (provider: Provider) => {
    router.push({ pathname: '/connect-gmail', params: { provider } });
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 28, paddingBottom: insets.bottom + 20 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.mark}>
        <Ionicons name="flash" size={30} color={colors.white} />
      </View>

      <Text style={styles.headline}>
        Track every trip.{'\n'}
        <Text style={styles.headlineAccent}>Effortlessly.</Text>
      </Text>

      <Text style={styles.subhead}>
        Connect your email to automatically import ride receipts from Uber, Bolt
        and inDrive.
      </Text>

      <View style={styles.providers}>
        <ProviderButton
          label="Connect Gmail"
          tint={colors.gmail}
          icon={<Ionicons name="mail" size={20} color={colors.white} />}
          onPress={() => connect('google')}
        />
        <ProviderButton
          label="Connect Outlook"
          tint={colors.outlook}
          icon={
            <MaterialCommunityIcons
              name="microsoft-outlook"
              size={20}
              color={colors.white}
            />
          }
          onPress={() => connect('microsoft')}
        />
      </View>

      <PrivacyPanel />

      <View style={styles.footer}>
        <View style={styles.footerRow}>
          <Ionicons
            name="shield-checkmark"
            size={12}
            color={colors.textTertiary}
          />
          <Text style={styles.footerStrong}>Bank-grade security</Text>
        </View>
        <View style={styles.footerRow}>
          <Ionicons
            name="information-circle-outline"
            size={12}
            color={colors.textTertiary}
          />
          <Text style={styles.footerNote}>
            Nexa follows GDPR and POPIA compliance.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

/* ------------------------------------------------------------------ */

type ProviderButtonProps = {
  label: string;
  tint: string;
  icon: React.ReactNode;
  onPress: () => void;
};

function ProviderButton({ label, tint, icon, onPress }: ProviderButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.provider,
        pressed && styles.providerPressed,
      ]}
    >
      <View style={[styles.providerIcon, { backgroundColor: tint }]}>
        {icon}
      </View>

      <View style={styles.providerText}>
        <Text style={styles.providerLabel}>{label}</Text>
        <View style={styles.providerMetaRow}>
          <Ionicons
            name="lock-closed"
            size={10}
            color={colors.textTertiary}
          />
          <Text style={styles.providerMeta}>Secure authentication</Text>
        </View>
      </View>

      <Ionicons
        name="chevron-forward"
        size={18}
        color={colors.textTertiary}
      />
    </Pressable>
  );
}

function PrivacyPanel() {
  return (
    <View style={styles.panel}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHeaderIcon}>
          <Ionicons name="shield-checkmark" size={13} color={colors.accent} />
        </View>
        <Text style={styles.panelTitle}>Security and privacy</Text>
      </View>

      <Text style={styles.panelBody}>
        Nexa only scans for receipt-specific keywords. We never read personal
        emails or share your data.
      </Text>

      <View style={styles.inset}>
        <Ionicons name="folder-open-outline" size={14} color={colors.accent} />
        <Text style={styles.insetLabel}>Scanning folders</Text>
        <View style={styles.chips}>
          <Chip>Inbox</Chip>
          <Chip>Receipts</Chip>
        </View>
      </View>

      <View style={styles.exampleHeader}>
        <Ionicons
          name="document-text-outline"
          size={12}
          color={colors.textTertiary}
        />
        <Text style={styles.exampleLabel}>Example extraction</Text>
      </View>

      <View style={styles.receipt}>
        <View style={styles.receiptTop}>
          <Text style={styles.receiptTitle}>Uber receipt</Text>
          <Text style={styles.receiptTime}>12:42 PM</Text>
        </View>

        <View style={styles.receiptBottom}>
          <View style={styles.receiptBrand}>
            <Text style={styles.receiptBrandText}>UBER</Text>
          </View>

          <View style={styles.receiptBadge}>
            <Text style={styles.receiptBadgeText}>Verified receipt</Text>
          </View>

          <Text style={styles.receiptAmount}>R142.50</Text>
        </View>
      </View>
    </View>
  );
}

function Chip({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.chip, style]}>
      <Text style={styles.chipText}>{children}</Text>
    </View>
  );
}

/* ------------------------------------------------------------------ */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 22,
    alignItems: 'stretch',
  },

  mark: {
    alignSelf: 'center',
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headline: {
    marginTop: 26,
    textAlign: 'center',
    fontSize: 27,
    lineHeight: 34,
    fontWeight: '800',
    letterSpacing: -0.6,
    color: colors.textPrimary,
  },
  headlineAccent: {
    color: colors.accent,
  },

  subhead: {
    marginTop: 12,
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 21,
    color: colors.textSecondary,
    paddingHorizontal: 6,
  },

  providers: {
    marginTop: 26,
    gap: 12,
  },
  provider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    shadowColor: '#0B0B0F',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  providerPressed: {
    backgroundColor: colors.surfaceMuted,
    transform: [{ scale: 0.99 }],
  },
  providerIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  providerText: {
    flex: 1,
    gap: 3,
  },
  providerLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  providerMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  providerMeta: {
    fontSize: 12,
    color: colors.textTertiary,
  },

  panel: {
    marginTop: 22,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 18,
    padding: 16,
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  panelHeaderIcon: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  panelTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  panelBody: {
    marginTop: 10,
    fontSize: 13,
    lineHeight: 19,
    color: colors.textSecondary,
  },

  inset: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surfaceInset,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  insetLabel: {
    flex: 1,
    fontSize: 12.5,
    color: colors.textSecondary,
  },
  chips: {
    flexDirection: 'row',
    gap: 6,
  },
  chip: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 7,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },

  exampleHeader: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  exampleLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textTertiary,
  },

  receipt: {
    marginTop: 8,
    backgroundColor: colors.surfaceInset,
    borderWidth: 1,
    borderColor: colors.borderAccent,
    borderRadius: 12,
    padding: 12,
  },
  receiptTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  receiptTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  receiptTime: {
    fontSize: 11,
    color: colors.textTertiary,
  },
  receiptBottom: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  receiptBrand: {
    backgroundColor: colors.black,
    borderRadius: 5,
    paddingHorizontal: 7,
    paddingVertical: 4,
  },
  receiptBrandText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  receiptBadge: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  receiptBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
  receiptAmount: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.accent,
  },

  footer: {
    marginTop: 22,
    gap: 8,
    alignItems: 'center',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  footerStrong: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textTertiary,
    letterSpacing: 0.2,
  },
  footerNote: {
    fontSize: 11,
    color: colors.textTertiary,
  },
});
