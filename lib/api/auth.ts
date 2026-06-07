import { apiRequest } from "./client";
import { AuthData } from "@/types";

// ─── Candidate register ────────────────────────────────────────────────────
export function registerCandidate(data: {
  name: string;
  email: string;
  phone?: string;
  password: string;
  password_confirmation: string;
  device_name: string;
}) {
  return apiRequest<AuthData>("/auth/register", {
    method: "POST",
    body: data,
    noAuth: true,
  });
}

// ─── Company register ──────────────────────────────────────────────────────
export function registerCompany(data: {
  name: string;
  email: string;
  company_name: string;
  industry?: string;
  headquarters?: string;
  website?: string;
  password: string;
  password_confirmation: string;
  device_name: string;
}) {
  return apiRequest<AuthData>("/auth/company/register", {
    method: "POST",
    body: data,
    noAuth: true,
  });
}

// ─── Login ─────────────────────────────────────────────────────────────────
export function login(data: {
  email: string;
  password: string;
  device_name: string;
}) {
  return apiRequest<AuthData>("/auth/login", {
    method: "POST",
    body: data,
    noAuth: true,
  });
}

// ─── Google sign-in ────────────────────────────────────────────────────────
export function googleSignIn(data: { id_token: string; device_name: string }) {
  return apiRequest<AuthData>("/auth/google", {
    method: "POST",
    body: data,
    noAuth: true,
  });
}

// ─── Logout ────────────────────────────────────────────────────────────────
export function logout() {
  return apiRequest("/auth/logout", { method: "POST" });
}

// ─── Get current user ──────────────────────────────────────────────────────
export function getMe() {
  return apiRequest<{ user: { id: number; name: string; email: string; role: string } }>("/auth/me");
}

// ─── Forgot password — step 1 ─────────────────────────────────────────────
export function forgotPassword(identifier: string) {
  return apiRequest("/auth/forgot-password", {
    method: "POST",
    body: { identifier },
    noAuth: true,
  });
}

// ─── Verify OTP — step 2 ──────────────────────────────────────────────────
export function verifyOtp(data: { identifier: string; otp: string }) {
  return apiRequest<{ reset_token: string }>("/auth/verify-otp", {
    method: "POST",
    body: data,
    noAuth: true,
  });
}

// ─── Reset password — step 3 ──────────────────────────────────────────────
export function resetPassword(data: {
  identifier: string;
  reset_token: string;
  password: string;
  password_confirmation: string;
}) {
  return apiRequest("/auth/reset-password", {
    method: "POST",
    body: data,
    noAuth: true,
  });
}