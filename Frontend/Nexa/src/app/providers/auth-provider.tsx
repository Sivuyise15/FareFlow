import * as SecureStore from 'expo-secure-store';
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from 'react';

const SESSION_KEY = 'nexa.session';

export type Session = {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: string;
  user: {
    id: string;
    email: string;
    provider: 'google' | 'microsoft';
  };
};

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

type AuthValue = {
  status: AuthStatus;
  session: Session | null;
  signIn: (session: Session) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [session, setSession] = useState<Session | null>(null);

  // Restore whatever the connect flow stored last time the app ran.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const raw = await SecureStore.getItemAsync(SESSION_KEY);
        if (cancelled) return;

        if (raw) {
          setSession(JSON.parse(raw) as Session);
          setStatus('authenticated');
        } else {
          setStatus('unauthenticated');
        }
      } catch {
        if (!cancelled) setStatus('unauthenticated');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback(async (next: Session) => {
    await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(next));
    setSession(next);
    setStatus('authenticated');
  }, []);

  const signOut = useCallback(async () => {
    await SecureStore.deleteItemAsync(SESSION_KEY);
    setSession(null);
    setStatus('unauthenticated');
  }, []);

  const value = useMemo<AuthValue>(
    () => ({ status, session, signIn, signOut }),
    [status, session, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside <AuthProvider>.');
  return value;
}
