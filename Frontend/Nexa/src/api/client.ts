import * as SecureStore from 'expo-secure-store';

import { API_URL, SESSION_KEY } from '../constants/config';
import type { Session } from './types';

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, message: string, body?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
  /** Set false for endpoints that run before the user has a session. */
  auth?: boolean;
  signal?: AbortSignal;
};

export function buildUrl(path: string, query?: RequestOptions['query']) {
  const url = `${API_URL}${path.startsWith('/') ? path : `/${path}`}`;
  if (!query) return url;

  const search = Object.entries(query)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');

  return search ? `${url}?${search}` : url;
}

async function readAccessToken(): Promise<string | null> {
  try {
    const raw = await SecureStore.getItemAsync(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Session).accessToken : null;
  } catch {
    return null;
  }
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, query, auth = true, signal } = options;

  const headers: Record<string, string> = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  if (auth) {
    const token = await readAccessToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(buildUrl(path, query), {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal,
  });

  const text = await response.text();
  let parsed: unknown = undefined;
  if (text) {
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = text;
    }
  }

  if (!response.ok) {
    const detail =
      typeof parsed === 'object' && parsed !== null && 'detail' in parsed
        ? String((parsed as { detail: unknown }).detail)
        : `Request failed (${response.status}).`;
    throw new ApiError(response.status, detail, parsed);
  }

  return parsed as T;
}
