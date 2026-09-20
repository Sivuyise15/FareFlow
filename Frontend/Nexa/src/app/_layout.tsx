import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/inter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { colors } from '@/theme/colors';
import { AuthProvider, useAuth } from './providers/auth-provider';

// expo-router's own error screen. Exporting it here gives you a readable
// stack trace in dev instead of a blank screen.
export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync().catch(() => {
  /* already hidden — safe to ignore */
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 60_000,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  // A missing font shouldn't trap the user behind a splash screen forever.
  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <StatusBar style="dark" />
          <RootNavigator />
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

/**
 * The auth gate.
 *
 * It lives in a child component because it needs `useAuth`, which only works
 * below <AuthProvider>. It watches the current route segment and pushes the
 * user across the (auth) / (tabs) boundary whenever session state and location
 * disagree.
 */
function RootNavigator() {
  const { status } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [navReady, setNavReady] = useState(false);
  const splashHidden = useRef(false);

  // The router can't navigate on the very first render pass.
  useEffect(() => {
    setNavReady(true);
  }, []);

  useEffect(() => {
    if (!navReady || status === 'loading') return;

    const inAuthGroup = segments[0] === '(auth)';

    if (status === 'unauthenticated' && !inAuthGroup) {
      router.replace('/sign-in');
    } else if (status === 'authenticated' && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [navReady, status, segments, router]);

  // Hold the splash until we know which side of the gate we're on, so the
  // user never sees sign-in flash before being sent to the tabs.
  useEffect(() => {
    if (status !== 'loading' && !splashHidden.current) {
      splashHidden.current = true;
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [status]);

  if (status === 'loading') return null;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      {/* <Stack.Screen
        name="trip/[id]"
        options={{
          headerShown: true,
          headerTitle: 'Trip',
          headerBackTitle: 'Back',
          headerShadowVisible: false,
          headerTitleStyle: { fontFamily: 'Inter_600SemiBold', fontSize: 16 },
        }}
      /> */}
      <Stack.Screen name="+not-found" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
