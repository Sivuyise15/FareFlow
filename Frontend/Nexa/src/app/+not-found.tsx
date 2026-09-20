import { Ionicons } from '@expo/vector-icons';
import { Link, Stack, usePathname } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

/**
 * Catches any path expo-router can't match — a stale deep link, a typo in a
 * `router.push`, or an OAuth redirect landing on the wrong route. Having it
 * here means those cases surface as a readable screen instead of a crash.
 */
export default function NotFoundScreen() {
  const pathname = usePathname();

  return (
    <>
      <Stack.Screen options={{ title: 'Page not found' }} />

      <View style={styles.screen}>
        <View style={styles.mark}>
          <Ionicons name="compass-outline" size={28} color={colors.textSecondary} />
        </View>

        <Text style={styles.title}>This page doesn't exist</Text>

        <Text style={styles.detail}>
          Nothing is set up at {pathname}. If you arrived from a link, it may be
          out of date.
        </Text>

        <Link href="/(tabs)" replace style={styles.action}>
          <Text style={styles.actionText}>Go to your trips</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    paddingHorizontal: 32,
    backgroundColor: colors.background,
  },
  mark: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 20,
    letterSpacing: -0.4,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  detail: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 21,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  action: {
    marginTop: 8,
    backgroundColor: colors.black,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 22,
    overflow: 'hidden',
  },
  actionText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 15,
    color: colors.white,
  },
});
