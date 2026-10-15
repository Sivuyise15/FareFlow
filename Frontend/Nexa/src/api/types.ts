export type AuthProviderName = 'google' | 'microsoft';

/** What the app keeps in SecureStore once a mailbox is connected. */
export type Session = {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: string;
  user: {
    id: string;
    email: string;
    provider: AuthProviderName;
  };
};

/**
 * Body the app sends to POST /api/google/callback.
 * Adjust the field names to match your controller's request DTO.
 */
export type GoogleCallbackRequest = {
  code: string;
  state?: string;
  redirectUri: string;
};

/**
 * What POST /api/google/callback returns.
 * Adjust to match your controller's response DTO; `toSession` in
 * endpoints/auth.ts is the only place that maps it.
 */
export type GoogleCallbackResponse = {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: string;
  userId: string;
  email: string;
};
