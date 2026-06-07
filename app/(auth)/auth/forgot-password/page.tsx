"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { forgotPassword, verifyOtp, resetPassword } from "@/lib/api/auth";
import { FieldErrors } from "@/types";

type Step = "request" | "verify" | "reset";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("request");
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState(""); // memory only, never stored
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [globalError, setGlobalError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  function clearErrors() {
    setErrors({});
    setGlobalError("");
  }

  // Step 1 — request OTP
  async function handleRequest(e: React.FormEvent) {
    e.preventDefault();
    clearErrors();
    setLoading(true);
    const res = await forgotPassword(identifier);
    setLoading(false);
    if (!res.result) {
      if (res.meta?.errors) setErrors(res.meta.errors);
      else setGlobalError(res.message);
      return;
    }
    setSuccessMessage("OTP sent! Check your email or phone.");
    setStep("verify");
  }

  // Step 2 — verify OTP
  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    clearErrors();
    setLoading(true);
    const res = await verifyOtp({ identifier, otp });
    setLoading(false);
    if (!res.result) {
      if (res.meta?.errors) setErrors(res.meta.errors);
      else setGlobalError(res.message);
      return;
    }
    setResetToken(res.data.reset_token); // keep in memory only
    setSuccessMessage("");
    setStep("reset");
  }

  // Step 3 — reset password
  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    clearErrors();
    setLoading(true);
    const res = await resetPassword({
      identifier,
      reset_token: resetToken,
      password,
      password_confirmation: passwordConfirmation,
    });
    setLoading(false);
    if (!res.result) {
      if (res.meta?.errors) setErrors(res.meta.errors);
      else setGlobalError(res.message);
      return;
    }
    router.push("/auth/login?reset=success");
  }

  const stepTitles = {
    request: { title: "Forgot password", subtitle: "Enter your email or phone to receive an OTP" },
    verify: { title: "Enter OTP", subtitle: "Check your email or phone for the code" },
    reset: { title: "New password", subtitle: "Choose a strong password" },
  };

  return (
    <AuthLayout
      title={stepTitles[step].title}
      subtitle={stepTitles[step].subtitle}
    >
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-6">
        {(["request", "verify", "reset"] as Step[]).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
              s === step
                ? "bg-primary-600 text-white"
                : step === "verify" && s === "request" || step === "reset"
                  ? "bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-400"
            }`}>
              {i + 1}
            </div>
            {i < 2 && <div className={`flex-1 h-px w-8 ${
              (step === "verify" && i === 0) || step === "reset"
                ? "bg-primary-300 dark:bg-primary-700"
                : "bg-gray-200 dark:bg-gray-700"
            }`} />}
          </div>
        ))}
      </div>

      {/* Global error */}
      {globalError && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400">{globalError}</p>
        </div>
      )}

      {/* Success message */}
      {successMessage && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
          <p className="text-sm text-green-600 dark:text-green-400">{successMessage}</p>
        </div>
      )}

      {/* Step 1 */}
      {step === "request" && (
        <form onSubmit={handleRequest} className="flex flex-col gap-5">
          <Input
            label="Email or phone"
            name="identifier"
            type="text"
            placeholder="you@example.com"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            error={errors.identifier?.[0]}
            required
          />
          <Button type="submit" loading={loading} fullWidth size="lg">
            Send OTP
          </Button>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Remember your password?{" "}
            <Link href="/auth/login" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      )}

      {/* Step 2 */}
      {step === "verify" && (
        <form onSubmit={handleVerify} className="flex flex-col gap-5">
          <Input
            label="OTP code"
            name="otp"
            type="text"
            placeholder="Enter the code you received"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            error={errors.otp?.[0]}
            required
          />
          <Button type="submit" loading={loading} fullWidth size="lg">
            Verify OTP
          </Button>
          <button
            type="button"
            onClick={() => { clearErrors(); setStep("request"); }}
            className="text-center text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            ← Back
          </button>
        </form>
      )}

      {/* Step 3 */}
      {step === "reset" && (
        <form onSubmit={handleReset} className="flex flex-col gap-5">
          <Input
            label="New password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="Min 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password?.[0]}
            required
          />
          <Input
            label="Confirm new password"
            name="password_confirmation"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            error={errors.password_confirmation?.[0]}
            required
          />
          <Button type="submit" loading={loading} fullWidth size="lg">
            Reset password
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}