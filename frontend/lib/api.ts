export function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";
}

type JsonResponse<T> = { data?: T } & Record<string, unknown>;

export async function apiFetch<T>(
  path: string,
  options?: { token?: string; method?: string; body?: unknown }
): Promise<T> {
  const baseUrl = getApiBaseUrl();

  const headers: Record<string, string> = {
    "Content-Type": "application/json"
  };

  if (options?.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  const res = await fetch(`${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`, {
    method: options?.method ?? "GET",
    headers,
    body: options?.body === undefined ? undefined : JSON.stringify(options.body)
  });

  if (!res.ok) {
    const maybeJson = await res
      .json()
      .catch(() => ({} as Record<string, unknown>));

    const message =
      typeof (maybeJson as JsonResponse<unknown>)?.message === "string"
        ? ((maybeJson as JsonResponse<unknown>).message as string)
        : `Request failed: ${res.status}`;

    const err: Error & { status?: number } = new Error(message);
    err.status = res.status;
    throw err;
  }

  const payload = (await res.json().catch(() => ({}))) as JsonResponse<T>;
  return (payload.data ?? (payload as unknown as T));
}

