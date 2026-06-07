import { ApiResponse } from "@/types";

// ─── Change this to your real backend URL ─────────────────────────────────
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://YOUR_DOMAIN/api";


// ─── Token helpers (stored in a cookie set by the server, or we read it) ──
// We store the token in a JS-accessible cookie only for SSR reads.
// For real security, configure your backend to set an httpOnly cookie.
function getToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)auth_token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export function setToken(token: string) {
  // 7-day expiry, SameSite=Strict
  document.cookie = `auth_token=${encodeURIComponent(token)}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict`;
}

export function clearToken() {
  document.cookie = "auth_token=; path=/; max-age=0";
}

// ─── Core fetch wrapper ────────────────────────────────────────────────────

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE" | "PUT";
  body?: Record<string, unknown> | FormData;
  noAuth?: boolean;          // set true for public endpoints
  isFormData?: boolean;      // set true for file uploads
};

export async function apiRequest<T = unknown>(
  path: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { method = "GET", body, noAuth = false, isFormData = false } = options;

  const headers: HeadersInit = {
    "ngrok-skip-browser-warning": "true",
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  if (!noAuth) {
    const token = getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (body) {
    config.body = isFormData
      ? (body as FormData)
      : JSON.stringify(body);
  }

  try {
    const res = await fetch(`${BASE_URL}${path}`, config);

    // 401 → clear token, redirect to login
    if (res.status === 401) {
      clearToken();
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login";
      }
      return {
        result: false,
        code: "UNAUTHENTICATED",
        message: "Session expired. Please log in again.",
      };
    }

    const data = await res.json();
    return data as ApiResponse<T>;
  } catch {
    return {
      result: false,
      code: "NETWORK_ERROR",
      message: "Network error. Please check your connection.",
    };
  }
}


export function storageUrl(url: string): string {
  if (!url) return "";
  return url.replace(
    "https://jeana-unselected-linnie.ngrok-free.dev/storage",
    "/storage"
  );
}

export function proxyImage(url: string): string {
  if (!url) return "";
  return `/api/image?url=${encodeURIComponent(url)}`;
}