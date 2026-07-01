"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPassword } from "@/utils/auth";
import AuthCard from "@/components/auth/AuthCard";
import { Suspense } from "react";
import { CheckIcon } from "@/components/common/Icons";

function ResetForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // In production, you'd validate this token from the URL
  const email = searchParams.get("email") || "";

  const [form, setForm] = useState({ password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const result = await resetPassword(email, form.password);
      if (result.success) {
        setSuccess(true);
        setTimeout(() => router.push("/auth/login"), 2500);
      } else {
        setError(result.error || "Error occurred while resetting password.");
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthCard title="Password Reset!" subtitle="">
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5 text-3xl">
            <CheckIcon className="h-7 w-7 text-green-700" />
          </div>
          <p className="text-sm text-gray-600 mb-2">
            Your password has been reset successfully.
          </p>
          <p className="text-xs text-gray-400">Redirecting to login...</p>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Reset Password"
      subtitle="Enter your new password below"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1.5">New Password</label>
          <div className="relative">
            <input suppressHydrationWarning
              type={showPassword ? "text" : "password"}
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-black transition pr-12"
            />
            <button suppressHydrationWarning
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Confirm New Password</label>
          <input suppressHydrationWarning
            type="password"
            placeholder="Repeat your new password"
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            required
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-black transition"
          />
        </div>

        {/* Password strength indicator */}
        <div>
          <div className="flex gap-1 mt-1">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  form.password.length === 0
                    ? "bg-gray-200"
                    : form.password.length < 6
                    ? i <= 1 ? "bg-red-400" : "bg-gray-200"
                    : form.password.length < 10
                    ? i <= 2 ? "bg-yellow-400" : "bg-gray-200"
                    : i <= 3 ? "bg-green-400" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {form.password.length === 0
              ? "Enter a password"
              : form.password.length < 6
              ? "Too weak"
              : form.password.length < 10
              ? "Fair"
              : "Strong"}
          </p>
        </div>

        <button suppressHydrationWarning
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white font-semibold py-3.5 rounded-full hover:bg-gray-800 transition disabled:opacity-60"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        <Link
          href="/auth/login"
          className="block text-center text-sm text-gray-500 hover:text-black mt-4"
        >
          ← Back to Login
        </Link>
      </form>
    </AuthCard>
  );
}

export default function ResetPasswordPage() {
  return <Suspense><ResetForm /></Suspense>;
}
