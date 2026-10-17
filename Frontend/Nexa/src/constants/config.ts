/**
 * Set EXPO_PUBLIC_API_URL in .env for devices/emulators that cannot reach localhost.
 */
export const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:5222').replace(
  /\/$/,
  '',
);

export const SESSION_KEY = 'nexa.session';
