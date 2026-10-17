import { buildUrl, request } from '../client';
import type { GoogleConnectionStatus, GoogleOAuthCompleteRequest, Session } from '../types';

const GOOGLE_START = '/api/auth/google/auth/start';
const GOOGLE_CALLBACK = '/api/auth/google/auth/callback';
const GOOGLE_CONNECTION = '/api/me/email-connections/google';

export function googleStartUrl(redirectUri: string) {
  return buildUrl(GOOGLE_START, { redirectUri });
}

export function completeGoogleSignIn(payload: GoogleOAuthCompleteRequest) {
  return request<Session>(GOOGLE_CALLBACK, {
    method: 'POST',
    body: payload,
    auth: false,
  });
}

export function getGoogleConnection() {
  return request<GoogleConnectionStatus>(GOOGLE_CONNECTION);
}

export function disconnectGoogleAccount() {
  return request<void>(GOOGLE_CONNECTION, { method: 'DELETE' });
}
