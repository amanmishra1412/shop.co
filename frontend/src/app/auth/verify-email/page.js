import Link from "next/link";
import AuthCard from "@/components/auth/AuthCard";
import { CheckIcon } from "@/components/common/Icons";

export default function VerifyEmailPage() {
  return (
    <AuthCard title="Verify Your Email" subtitle="">
      <div className="text-center py-4">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
          <CheckIcon className="h-9 w-9 text-green-700" />
        </div>
        <h2 className="font-bold text-lg mb-2">Account Created!</h2>
        <p className="text-sm text-gray-500 mb-2">
          Welcome to SHOP.CO! A verification email has been sent to your inbox.
        </p>
        <p className="text-xs text-gray-400 mb-8">
          In this demo, no real email is sent - you are already logged in.
        </p>

        <Link
          href="/"
          className="block w-full bg-black text-white font-semibold py-3.5 rounded-full hover:bg-gray-800 transition text-center mb-3"
        >
          Start Shopping
        </Link>
        <Link href="/account" className="block text-sm text-gray-500 hover:text-black">
          Go to My Account
        </Link>
      </div>
    </AuthCard>
  );
}

