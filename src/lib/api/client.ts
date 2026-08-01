import { useAuthStore } from '../store/auth-store';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/v1';

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

/**
 * Thin fetch wrapper matching the BoaFie API's response envelope:
 * { success, data, meta? } on success, { success: false, error: {...} } on failure.
 * Every hook in lib/api/hooks/* goes through this so auth headers, error
 * unwrapping, and the API base URL live in exactly one place.
 */
async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
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
