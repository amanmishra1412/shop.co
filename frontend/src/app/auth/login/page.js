"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { loginUser } from "@/utils/auth";
import { useAuth } from "@/context/AuthContext";
import AuthCard from "@/components/auth/AuthCard";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const redirect = searchParams.get("redirect") || "/";

// useEffect(() => {
//   first

//   return () => {
//     second
//   }
// }, [third])


  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
    const result = loginUser(form.email, form.password);

      if (result.success) {
        toast.success("Login successful");
        login(user);
        router.push(redirect);
        return;
      }

     

      setError(result.error || 'Unable to sign in. Please check your credentials and try again.');
      toast.error(result.error || 'Unable to sign in. Please check your credentials and try again.');
    } catch (loginError) {
      setError(result.error || 'Unable to sign in. Please check your credentials and try again.');
      toast.error(result.error || 'Unable to sign in. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <AuthCard
      title="Welcome Back"
      subtitle="Enter your credentials to access your account"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

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
              placeholder="••••••••"
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
          <div className="text-right mt-1.5">
            <Link href="/auth/forgot-password" className="text-xs text-gray-500 hover:text-black">
              Forgot password?
            </Link>
          </div>
        </div>

        <button suppressHydrationWarning
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white font-semibold py-3.5 rounded-full hover:bg-gray-800 transition disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <div className="relative flex items-center my-4">
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
          Continue with Google
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Don't have an account?{" "}
          <Link href="/auth/signup" className="text-black font-semibold hover:underline">
            Sign up
          </Link>
        </p>

        <p className="text-center text-xs text-gray-400 mt-4">
          By clicking continue, you agree to our{" "}
          <Link href="#" className="underline">Terms of Service</Link> and{" "}
          <Link href="#" className="underline">Privacy Policy</Link>.
        </p>

        {/* Demo hint */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-600 text-center">
          Demo login: <strong>demo@shopco.com</strong> / <strong>password123</strong>
        </div>
      </form>
    </AuthCard>
  );
}

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>;
}
