import { Ionicons } from '@expo/vector-icons';
import * as AuthSession from 'expo-auth-session';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { colors } from '@/theme/colors';

WebBrowser.maybeCompleteAuthSession();

// Move these into src/constants/config.ts once you have more than one.
const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://172.20.214.100:5222';
const SESSION_KEY = 'nexa.session';

type Provider = 'google' | 'microsoft';
type Phase = 'starting' | 'consent' | 'exchanging' | 'cancelled' | 'error';

const PROVIDER_LABEL: Record<Provider, string> = {
  google: 'Gmail',
  microsoft: 'Outlook',
};

/**
 * The handoff screen.
 *
 * `sign-in.tsx` is the screen the user *sees and chooses from*. This screen is
 * what happens after they tap a provider: it opens the consent browser, waits
 * for the redirect back into the app, trades the authorisation code with
 * Nexa.API for a session, stores it, and sends the user to the tabs.
 *
 * It exists as a route rather than inline logic so that the OAuth redirect has
 * a stable place to land, and so cancel/error states have somewhere to live.
 *
 * Once you support more providers, rename this to `connect/[provider].tsx` —
 * the body barely changes, since everything already keys off `provider`.
 */
export default function ConnectMailboxScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ provider?: Provider }>();
  const provider: Provider = params.provider === 'microsoft' ? 'microsoft' : 'google';

  const [phase, setPhase] = useState<Phase>('starting');
  const [message, setMessage] = useState<string | null>(null);
  const started = useRef(false);

  const close = useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace('/sign-in');
  }, [router]);

  const run = useCallback(async () => {
    setPhase('starting');
    setMessage(null);

    try {
      const redirectUri = AuthSession.makeRedirectUri({ scheme: 'nexa', path: 'oauth' });

      const startUrl =
        `${API_URL}/api/auth/${provider}/start` +
        `?redirectUri=${encodeURIComponent(redirectUri)}`;

      setPhase('consent');
      const result = await WebBrowser.openAuthSessionAsync(startUrl, redirectUri);

      if (result.type !== 'success') {
        setPhase('cancelled');
        return;
      }
      
      const url = new URL(result.url);

      const code = url.searchParams.get("code");
      const state = url.searchParams.get("state");




      if (url.searchParams.get("error")) throw new Error(String(url.searchParams.get("error")));
      if (!code) throw new Error('No authorisation code came back from the provider.');

      setPhase('exchanging');

      const response = await fetch(`${API_URL}/api/auth/${provider}/callback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, state, redirectUri }),
      });

      if (!response.ok) {
        throw new Error(`The server rejected the sign-in (${response.status}).`);
      }

      const session = await response.json();
      await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));

      router.replace('./app/(tabs)');
    } catch (error) {
      setPhase('error');
      setMessage(
        error instanceof Error ? error.message : 'Something went wrong connecting your mailbox.',
      );
    }
  }, [provider, router]);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void run();
  }, [run]);

  const label = PROVIDER_LABEL[provider];

  return (
    <View style={styles.screen}>
      <Pressable style={styles.close} onPress={close} accessibilityLabel="Close">
        <Ionicons name="close" size={22} color={colors.textSecondary} />
      </Pressable>

      <View style={styles.body}>
        {phase === 'error' || phase === 'cancelled' ? (
          <View style={[styles.mark, styles.markQuiet]}>
            <Ionicons
              name={phase === 'error' ? 'alert-circle-outline' : 'mail-outline'}
              size={28}
              color={colors.textSecondary}
            />
          </View>
        ) : (
          <View style={styles.mark}>
            <ActivityIndicator color={colors.white} />
          </View>
        )}

        <Text style={styles.title}>
          {phase === 'error'
            ? `Couldn't connect ${label}`
            : phase === 'cancelled'
              ? `${label} wasn't connected`
              : phase === 'exchanging'
                ? 'Finishing up'
                : `Connecting ${label}`}
        </Text>

        <Text style={styles.detail}>
          {phase === 'error'
            ? message
            : phase === 'cancelled'
              ? 'You closed the consent screen before granting access. Nothing was changed.'
              : phase === 'exchanging'
                ? 'Setting up your mailbox sync. This takes a moment.'
                : `A secure ${label} window will open. Grant read access so Nexa can find your ride receipts.`}
        </Text>

        {(phase === 'error' || phase === 'cancelled') && (
          <View style={styles.actions}>
            <Pressable
              style={({ pressed }) => [styles.primary, pressed && styles.pressed]}
              onPress={() => void run()}
            >
              <Text style={styles.primaryText}>Try again</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.secondary, pressed && styles.pressed]}
              onPress={close}
            >
              <Text style={styles.secondaryText}>Choose another provider</Text>
            </Pressable>
          </View>
        )}
      </View>

      <View style={styles.foot}>
        <Ionicons name="lock-closed" size={11} color={colors.textTertiary} />
        <Text style={styles.footText}>
          Nexa never stores your password. Access can be revoked at any time.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 26,
    paddingTop: 16,
    paddingBottom: 28,
  },
  close: {
    alignSelf: 'flex-end',
    padding: 6,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  mark: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markQuiet: {
    backgroundColor: colors.surfaceMuted,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.4,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  detail: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  actions: {
    marginTop: 10,
    alignSelf: 'stretch',
    gap: 10,
  },
  primary: {
    backgroundColor: colors.black,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
  },
  primaryText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  secondary: {
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
  },
  secondaryText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.85,
  },
  foot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingHorizontal: 12,
  },
  footText: {
    fontSize: 11,
    color: colors.textTertiary,
    textAlign: 'center',
  },
});
