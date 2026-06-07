"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { registerCompany } from "@/lib/api/auth";
import { setToken } from "@/lib/api/client";
import { FieldErrors } from "@/types";

export default function RegisterCompanyPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "", email: "", company_name: "",
    industry: "", headquarters: "", website: "",
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

    const res = await registerCompany({
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
    router.push("/dashboard");
  }

  return (
    <AuthLayout title="Post your first job" subtitle="Create a company account to start hiring">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {globalError && (
          <div className="px-4 py-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-600 dark:text-red-400">{globalError}</p>
          </div>
        )}

        <div className="pb-2 border-b border-gray-100 dark:border-gray-800">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Your details</p>
        </div>

        <Input
          label="Your full name"
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
          label="Work email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="ahmed@company.com"
          value={form.email}
          onChange={handleChange}
          error={errors.email?.[0]}
          required
        />

        <div className="pb-2 border-b border-gray-100 dark:border-gray-800 pt-1">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Company details</p>
        </div>

        <Input
          label="Company name"
          name="company_name"
          type="text"
          placeholder="TechCorp Egypt"
          value={form.company_name}
          onChange={handleChange}
          error={errors.company_name?.[0]}
          required
        />

        <Input
          label="Industry (optional)"
          name="industry"
          type="text"
          placeholder="Software"
          value={form.industry}
          onChange={handleChange}
          error={errors.industry?.[0]}
        />

        <Input
          label="Headquarters (optional)"
          name="headquarters"
          type="text"
          placeholder="Cairo, Egypt"
          value={form.headquarters}
          onChange={handleChange}
          error={errors.headquarters?.[0]}
        />

        <Input
          label="Website (optional)"
          name="website"
          type="url"
          placeholder="https://company.com"
          value={form.website}
          onChange={handleChange}
          error={errors.website?.[0]}
        />

        <div className="pb-2 border-b border-gray-100 dark:border-gray-800 pt-1">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Password</p>
        </div>

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
          Create company account
        </Button>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
            Sign in
          </Link>
          {" · "}
          <Link href="/auth/register" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
            Register as candidate
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}