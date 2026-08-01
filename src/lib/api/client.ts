import { useAuthStore } from '../store/auth-store';

/** Tolerates a bare host (e.g. from a platform's cross-service env var linking) missing a scheme and/or the /v1 suffix. */
function normalizeApiUrl(url: string): string {
  let normalized = url.startsWith('http') ? url : `https://${url}`;
  normalized = normalized.replace(/\/+$/, '');
  if (!normalized.endsWith('/v1')) normalized += '/v1';
  return normalized;
}

export const API_URL = normalizeApiUrl(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/v1');

export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  auth?: boolean; // defaults to true — set false for public endpoints called before login
}

// Access tokens are short-lived (15 min by default). A single in-flight
// refresh promise is shared across concurrent requests so a burst of 401s
// triggers one POST /auth/refresh, not one per request.
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = useAuthStore.getState().refreshToken;
  if (!refreshToken) return null;

  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const res = await fetch(`${API_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });
        const json = await res.json().catch(() => null);
        if (!res.ok || json?.success === false) {
          useAuthStore.getState().clearSession();
          return null;
        }
        const { user, access_token, refresh_token } = json.data;
        useAuthStore.getState().setSession(user, access_token, refresh_token);
        return access_token as string;
      } catch {
        useAuthStore.getState().clearSession();
        return null;
      } finally {
        refreshPromise = null;
      }
    })();
  }
  return refreshPromise;
}

async function doFetch(path: string, options: RequestOptions, retryOn401: boolean): Promise<Response> {
  const { body, auth = true, headers, ...rest } = options;
  const token = auth ? useAuthStore.getState().accessToken : null;

  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // Only retry requests that carried a token — auth:false calls (login,
  // register, refresh itself) 401 for other reasons and must not loop.
  if (res.status === 401 && auth && retryOn401) {
    const newToken = await refreshAccessToken();
    if (newToken) return doFetch(path, options, false);
  }

  return res;
}

/**
 * Thin fetch wrapper matching the BoaFie API's response envelope:
 * { success, data, meta? } on success, { success: false, error: {...} } on failure.
 * Every hook in lib/api/hooks/* goes through this so auth headers, error
 * unwrapping, and the API base URL live in exactly one place.
 */
async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const res = await doFetch(path, options, true);

  let json: any = null;
  try {
    json = await res.json();
  } catch {
    // no body (e.g. 204)
  }

  if (!res.ok || json?.success === false) {
    const message = json?.error?.message || res.statusText || 'Request failed';
    const code = json?.error?.code;
    throw new ApiError(Array.isArray(message) ? message.join(', ') : message, res.status, code);
  }

  return (json?.data ?? json) as T;
}

/** Same as request(), but also returns the `meta` block for paginated list endpoints. */
async function requestWithMeta<T>(
  path: string,
  options: RequestOptions = {},
): Promise<{ data: T; meta?: { page: number; limit: number; total: number } }> {
  const res = await doFetch(path, options, true);
  const json = await res.json().catch(() => null);

  if (!res.ok || json?.success === false) {
    const message = json?.error?.message || res.statusText || 'Request failed';
    throw new ApiError(Array.isArray(message) ? message.join(', ') : message, res.status, json?.error?.code);
  }

  return { data: json?.data as T, meta: json?.meta };
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'POST', body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'PATCH', body }),
  delete: <T>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: 'DELETE' }),
  getPaginated: <T>(path: string, options?: RequestOptions) => requestWithMeta<T>(path, { ...options, method: 'GET' }),
};
