import { buildUrl, request } from '../client';
import type { GoogleCallbackRequest, GoogleCallbackResponse, Session } from '../types';

/**
 * URL the in-app browser opens to begin Google consent.
 *
 * This is deliberately a URL and not a fetch: GET /api/google/start answers
 * with a redirect to Google, which only makes sense inside a browser session.
 * `redirectUri` tells the backend where to send the user once it is done.
 */
export function googleStartUrl(redirectUri: string) {
  return buildUrl('/api/google/start', { redirectUri });
}

/** Trade the authorisation code for a Nexa session. */
export async function exchangeGoogleCode(payload: GoogleCallbackRequest): Promise<Session> {
  const data = await request<GoogleCallbackResponse>('/api/google/callback', {
    method: 'POST',
    body: payload,
    auth: false,
  });

  return toSession(data);
}

/** The one place the backend's response shape is mapped to the app's Session. */
function toSession(data: GoogleCallbackResponse): Session {
  return {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    expiresAt: data.expiresAt,
    user: {
      id: data.userId,
      email: data.email,
      provider: 'google',
    },
  };
}
