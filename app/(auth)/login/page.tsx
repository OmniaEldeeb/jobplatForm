"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { login } from "@/lib/api/auth";
import { setToken } from "@/lib/api/client";
import { FieldErrors } from "@/types";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [globalError, setGlobalError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    // Clear field error when user types
    if (errors[e.target.name]) {
      setErrors((prev) => { const n = { ...prev }; delete n[e.target.name]; return n; });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGlobalError("");
    setLoading(true);

    const res = await login({
      email: form.email,
      password: form.password,
      device_name: "web-browser",
    });

    setLoading(false);

    if (!res.result) {
      if (res.meta?.errors) {
        setErrors(res.meta.errors);
      } else {
        setGlobalError(res.message);
      }
      return;
    }

    // Save token and go to the right home screen based on role
    setToken(res.data.token);
    if (res.data.role === "company") {
      router.push("/dashboard");
    } else {
      router.push("/jobs");
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your account to continue"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Global error (e.g. wrong credentials) */}
        {globalError && (
          <div className="px-4 py-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-600 dark:text-red-400">{globalError}</p>
          </div>
        )}

        <Input
          label="Email address"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          error={errors.email?.[0]}
          required
        />

        <div className="flex flex-col gap-1.5">
          <Input
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            error={errors.password?.[0]}
            required
          />
          <div className="flex justify-end">
            <Link
              href="/auth/forgot-password"
              className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <Button type="submit" loading={loading} fullWidth size="lg">
          Sign in
        </Button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-800" />
          </div>
          <div className="relative flex justify-center">
            <span className="px-3 text-xs text-gray-400 dark:text-gray-600 bg-white dark:bg-gray-900">
              OR
            </span>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/register"
            className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
          >
            Sign up as candidate
          </Link>
          {" · "}
          <Link
            href="/auth/register-company"
            className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
          >
            Post a job
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}