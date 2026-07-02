"use client";

import { useState } from "react";
import Link from "next/link";
import AuthCard from "@/components/auth/AuthCard";
import { MailIcon } from "@/components/common/Icons";
import { forgotPassword } from "@/utils/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await forgotPassword(email);
      if (result.success) {
        setSent(true);
      } else {
        setError(result.error || "Error occurred while sending email.");
      }
    } catch (err) {
      setError(err?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <AuthCard title="Check Your Email" subtitle="">
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5 text-3xl">
            <MailIcon className="h-7 w-7 text-green-700" />
          </div>
          <p className="text-sm text-gray-600 mb-2">We sent a password reset link to</p>
          <p className="font-semibold text-sm mb-6">{email}</p>
          <p className="text-xs text-gray-400 mb-6">
            Didn&apos;t receive it? Check your spam folder or try again.
          </p>

          <button
            onClick={() => setSent(false)}
            className="w-full border border-gray-300 rounded-full py-3 text-sm font-medium hover:bg-gray-50 transition mb-3"
          >
            Try a different email
          </button>

          <Link
            href={`/auth/reset-password?email=${encodeURIComponent(email)}`}
            className="block w-full bg-black text-white font-semibold py-3.5 rounded-full hover:bg-gray-800 transition text-center mb-3"
          >
            Continue to Reset
          </Link>

          <Link href="/auth/login" className="block text-sm text-gray-500 hover:text-black">
            Back to Login
          </Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Forgot Password" subtitle="Enter your email and we'll send you a reset link">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1.5">Email Address</label>
          <input
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-black transition"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white font-semibold py-3.5 rounded-full hover:bg-gray-800 transition disabled:opacity-60"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <Link
          href="/auth/login"
          className="block text-center text-sm text-gray-500 hover:text-black mt-4"
        >
          Back to Login
        </Link>
      </form>
    </AuthCard>
  );
}

