"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { registerCandidate } from "@/lib/api/auth";
import { setToken } from "@/lib/api/client";
import { FieldErrors } from "@/types";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    password: "", password_confirmation: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [globalError, setGlobalError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors((prev) => { const n = { ...prev }; delete n[e.target.name]; return n; });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGlobalError("");
    setLoading(true);

    const res = await registerCandidate({
      ...form,
      device_name: "web-browser",
    });

    setLoading(false);

    if (!res.result) {
      if (res.meta?.errors) setErrors(res.meta.errors);
      else setGlobalError(res.message);
      return;
    }

    setToken(res.data.token);
    router.push("/jobs");
  }

  return (
    <AuthLayout title="Create your account" subtitle="Find your next opportunity">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {globalError && (
          <div className="px-4 py-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-600 dark:text-red-400">{globalError}</p>
          </div>
        )}

        <Input
          label="Full name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Ahmed Hassan"
          value={form.name}
          onChange={handleChange}
          error={errors.name?.[0]}
          required
        />

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

        <Input
          label="Phone (optional)"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="+201001234567"
          value={form.phone}
          onChange={handleChange}
          error={errors.phone?.[0]}
        />

        <Input
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="Min 8 characters"
          value={form.password}
          onChange={handleChange}
          error={errors.password?.[0]}
          required
        />

        <Input
          label="Confirm password"
          name="password_confirmation"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          value={form.password_confirmation}
          onChange={handleChange}
          error={errors.password_confirmation?.[0]}
          required
        />

        <Button type="submit" loading={loading} fullWidth size="lg">
          Create account
        </Button>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
            Sign in
          </Link>
          {" · "}
          <Link href="/auth/register-company" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
            Register as company
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}