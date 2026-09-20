import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { colors } from '@/theme/colors';

/**
 * Layout for the unauthenticated part of the app.
 *
 * This file does not render UI of its own — it configures the navigator that
 * wraps every screen inside `(auth)`. The parentheses mean the folder groups
 * routes without adding a `/auth` segment to the URL, so `sign-in.tsx`
 * is reachable at `/sign-in`.
 *
 * If you already have an auth context, uncomment the guard below so a
 * signed-in user who lands here is bounced straight to the tabs.
 */
export default function AuthLayout() {
  // const { status } = useAuth();
  // if (status === 'authenticated') return <Redirect href="/(tabs)" />;

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="sign-in" />
        <Stack.Screen
          name="connect-gmail"
          options={{
            // Presented as a sheet so the OAuth handoff feels like a step
            // on top of sign-in rather than a new destination.
            presentation: 'modal',
            animation: 'slide_from_bottom',
            gestureEnabled: false,
          }}
        />
      </Stack>
    </>
  );
}
