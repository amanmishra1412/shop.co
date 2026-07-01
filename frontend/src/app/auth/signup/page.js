"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "@/utils/auth";
import { useAuth } from "@/context/AuthContext";
import AuthCard from "@/components/auth/AuthCard";

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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
      const { user } = registerUser(form.name, form.email, form.password);
      login(user);
      router.push("/auth/verify-email");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Create Account"
      subtitle="Enter your details below to create your account"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1.5">Full Name</label>
          <input suppressHydrationWarning
            type="text"
            placeholder="John Doe"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-black transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Email</label>
          <input suppressHydrationWarning
            type="email"
            placeholder="name@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-black transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Password</label>
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
          <label className="block text-sm font-medium mb-1.5">Confirm Password</label>
          <input suppressHydrationWarning
            type="password"
            placeholder="Repeat your password"
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            required
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-black transition"
          />
        </div>

        <button suppressHydrationWarning
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white font-semibold py-3.5 rounded-full hover:bg-gray-800 transition disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>

        <div className="relative flex items-center my-2">
          <hr className="flex-1 border-gray-200" />
          <span className="mx-3 text-xs text-gray-400 uppercase">or continue with</span>
          <hr className="flex-1 border-gray-200" />
        </div>

        <button suppressHydrationWarning
          type="button"
          className="w-full border border-gray-300 rounded-full py-3 flex items-center justify-center gap-2 text-sm font-medium hover:bg-gray-50 transition"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black text-[11px] font-bold text-white">
            G
          </span>
          Sign up with Google
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-black font-semibold hover:underline">
            Sign in
          </Link>
        </p>

        <p className="text-center text-xs text-gray-400 mt-2">
          By clicking continue, you agree to our{" "}
          <Link href="#" className="underline">Terms of Service</Link> and{" "}
          <Link href="#" className="underline">Privacy Policy</Link>.
        </p>
      </form>
    </AuthCard>
  );
}
