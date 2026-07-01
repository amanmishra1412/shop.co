"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

const dummyOrders = [
  { id: "#ORD-001", date: "Jun 15, 2023", status: "Delivered", total: 435, items: 3 },
  { id: "#ORD-002", date: "May 28, 2023", status: "Delivered", total: 180, items: 1 },
  { id: "#ORD-003", date: "Apr 10, 2023", status: "Cancelled", total: 260, items: 1 },
];

const statusColors = {
  Delivered: "bg-green-50 text-green-700",
  Shipped: "bg-blue-50 text-blue-700",
  Processing: "bg-yellow-50 text-yellow-700",
  Cancelled: "bg-red-50 text-red-700",
};

export default function AccountPage() {
  const { user, logout, loading } = useAuth();
  const { totalItems, subtotal } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login?redirect=/account");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-black border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
      {/* Breadcrumb */}
      <p className="text-sm text-gray-400 mb-8">
        Home &rsaquo;{" "}
        <span className="text-black font-medium">My Account</span>
      </p>

      {/* Profile header card */}
      <div className="bg-[#F0F0F0] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-8">
        <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center text-3xl font-black shrink-0">
          {user.name?.[0]?.toUpperCase() || "U"}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-black">{user.name}</h1>
          <p className="text-gray-500 text-sm mt-0.5">{user.email}</p>
          <span className="inline-block mt-2 bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
            ✓ Active Member
          </span>
        </div>
        <button suppressHydrationWarning
          onClick={() => { logout(); router.push("/"); }}
          className="shrink-0 border border-red-300 text-red-500 text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-red-50 transition"
        >
          Logout
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Orders", value: dummyOrders.length },
          { label: "Cart Items", value: totalItems },
          { label: "Cart Value", value: `$${subtotal.toFixed(0)}` },
          { label: "Wishlist Items", value: "5" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white border border-gray-200 rounded-2xl p-5 text-center"
          >
            <p className="text-3xl font-black mb-1">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Account info — left panel */}
        <div className="lg:col-span-2 border border-gray-200 rounded-3xl p-6 sm:p-8 h-fit">
          <h2 className="font-bold text-lg mb-6">Account Information</h2>
          <div className="space-y-5">
            {[
              { label: "Full Name", value: user.name },
              { label: "Email", value: user.email },
              { label: "Member Since", value: "June 2023" },
              { label: "Shipping Address", value: null },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                  {label}
                </p>
                <p className={`text-sm ${value ? "font-medium" : "text-gray-300 italic"}`}>
                  {value || "Not set"}
                </p>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2 mt-8">
            <button suppressHydrationWarning className="w-full border border-gray-300 rounded-full py-3 text-sm font-semibold hover:bg-gray-50 transition">
              Edit Profile
            </button>
            <Link
              href="/auth/reset-password"
              className="w-full border border-gray-300 rounded-full py-3 text-sm font-semibold hover:bg-gray-50 transition text-center"
            >
              Change Password
            </Link>
          </div>
        </div>

        {/* Order history — right panel */}
        <div className="lg:col-span-3 border border-gray-200 rounded-3xl p-6 sm:p-8">
          <h2 className="font-bold text-lg mb-6">Order History</h2>
          <div className="space-y-3 mb-6">
            {dummyOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between bg-[#F9F9F9] rounded-2xl px-5 py-4"
              >
                <div>
                  <p className="font-semibold text-sm">{order.id}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {order.date} · {order.items} item{order.items > 1 ? "s" : ""}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm mb-1">${order.total}</p>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <Link
              href="/shop"
              className="flex-1 bg-black text-white text-center text-sm font-semibold py-3.5 rounded-full hover:bg-gray-800 transition"
            >
              Continue Shopping
            </Link>
            <Link
              href="/cart"
              className="flex-1 border border-gray-300 text-center text-sm font-semibold py-3.5 rounded-full hover:bg-gray-50 transition"
            >
              View Cart ({totalItems})
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
