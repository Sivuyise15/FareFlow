/**
 * Set EXPO_PUBLIC_API_URL in .env (e.g. EXPO_PUBLIC_API_URL=https://192.168.0.12:5001).
 * On a physical device or emulator `localhost` points at the device itself,
 * so use your machine's LAN IP (Android emulator: http://10.0.2.2:<port>).
 */
export const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? 'https://172.20.214.100:5001').replace(
  /\/$/,
  '',
);

export const OAUTH_SCHEME = 'nexa';
export const OAUTH_REDIRECT_PATH = 'oauth';
export const SESSION_KEY = 'nexa.session';
