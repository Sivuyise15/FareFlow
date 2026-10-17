import * as SecureStore from 'expo-secure-store';

import { API_URL, SESSION_KEY } from '@/constants/config';
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
    return raw ? ((JSON.parse(raw) as Session).accessToken ?? null) : null;
  } catch {
    return null;
  }
}

/** ASP.NET returns errors as ProblemDetails, a JSON string, or plain text. */
function messageFrom(parsed: unknown, status: number): string {
  if (typeof parsed === 'string' && parsed.trim()) return parsed;

  if (typeof parsed === 'object' && parsed !== null) {
    const p = parsed as { detail?: unknown; title?: unknown; errors?: Record<string, string[]> };
    if (typeof p.detail === 'string') return p.detail;
    if (p.errors) {
      const first = Object.values(p.errors).flat()[0];
      if (first) return first;
    }
    if (typeof p.title === 'string') return p.title;
  }

  return `Request failed (${status}).`;
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, query, auth = true, signal } = options;

  const headers: Record<string, string> = { Accept: 'application/json, text/plain' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  if (auth) {
    const token = await readAccessToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const url = buildUrl(path, query);

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (error) {
    // fetch only rejects when no response arrived: wrong host, offline, TLS failure.
    if (__DEV__) console.warn(`[api] ${method} ${url} failed before a response`, error);
    throw new ApiError(0, `Couldn't reach the server at ${API_URL}.`);
  }

  const text = await response.text();
  let parsed: unknown = text || undefined;
  if (text) {
    try {
      parsed = JSON.parse(text);
    } catch {
      /* plain-text body, keep the raw string */
    }
  }

  if (!response.ok) {
    if (__DEV__) console.warn(`[api] ${method} ${url} -> ${response.status}`, parsed);
    throw new ApiError(response.status, messageFrom(parsed, response.status), parsed);
  }

  return parsed as T;
}
