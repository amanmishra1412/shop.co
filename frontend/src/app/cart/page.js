"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import NewsletterBanner from "@/components/common/NewsletterBanner";
import { ArrowRightIcon, CheckIcon, ShoppingCartIcon, TagIcon, TrashIcon } from "@/components/common/Icons";

const PROMO_CODES = { SAVE20: 20, FIRST10: 10 };

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, subtotal, totalItems, cartLoading } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [promo, setPromo] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");

  const applyPromo = () => {
    const code = promo.toUpperCase().trim();
    if (PROMO_CODES[code]) {
      setDiscount(PROMO_CODES[code]);
      setPromoError("");
    } else {
      setPromoError("Invalid promo code");
      setDiscount(0);
    }
  };

  const discountAmount = (subtotal * discount) / 100;
  const deliveryFee = subtotal > 200 ? 0 : 15;
  const total = subtotal - discountAmount + deliveryFee;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      router.push("/auth/login?redirect=/cart");
    } else {
      alert("Order placed successfully! (Demo)");
    }
  };

  if (cartLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#F0F0F0]">
          <ShoppingCartIcon className="h-9 w-9" />
        </div>
        <h2 className="text-2xl font-bold mb-3">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven&apos;t added anything yet.</p>
        <Link
          href="/shop"
          className="inline-block bg-black text-white font-semibold px-10 py-4 rounded-full hover:bg-gray-800 transition"
        >
          Start Shopping
        </Link>
      </div>
      <NewsletterBanner />
      </>
    );
  }

  return (
    <>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <p className="text-sm text-gray-400 mb-6">Home &rsaquo; <span className="text-black font-medium">Cart</span></p>
      <h1 className="text-3xl font-black uppercase tracking-tight mb-8">Your Cart</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Cart items */}
        <div className="flex-1 space-y-4">
          {items.map((item) => (
            <div
              key={`${item.id}-${item.size}-${item.color}`}
              className="border border-gray-200 rounded-2xl p-4 flex gap-4"
            >
              <div className="w-24 h-24 sm:w-28 sm:h-28 bg-[#F0F0F0] rounded-xl overflow-hidden shrink-0">
                <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-semibold text-sm sm:text-base truncate">{item.name}</h3>
                  <button suppressHydrationWarning
                    onClick={() => removeFromCart(item.id, item.size, item.color)}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-red-400 transition hover:bg-red-50 hover:text-red-600"
                    aria-label="Remove"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Size: <span className="font-medium text-black">{item.size}</span>
                </p>
                <p className="text-xs text-gray-500">
                  Color: <span
                    className="inline-block w-3 h-3 rounded-full border border-gray-300 ml-1"
                    style={{ backgroundColor: item.color }}
                  />
                </p>
                <div className="flex items-center justify-between mt-3">
                  <p className="font-bold">${item.price}</p>
                  <div className="flex items-center border border-gray-300 rounded-full">
                    <button suppressHydrationWarning
                      onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)}
                      className="px-3 py-1.5 hover:bg-gray-100 transition rounded-l-full"
                    >
                      −
                    </button>
                    <span className="px-3 text-sm font-semibold">{item.quantity}</span>
                    <button suppressHydrationWarning
                      onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                      className="px-3 py-1.5 hover:bg-gray-100 transition rounded-r-full"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="lg:w-80 xl:w-96 shrink-0">
          <div className="border border-gray-200 rounded-2xl p-6">
            <h3 className="font-bold text-lg mb-6">Order Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal ({totalItems} items)</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-red-500">
                  <span>Discount ({discount}%)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Delivery Fee</span>
                <span className={deliveryFee === 0 ? "text-green-500 font-semibold" : "font-semibold"}>
                  {deliveryFee === 0 ? "Free" : `$${deliveryFee}`}
                </span>
              </div>
              <hr className="border-gray-200" />
              <div className="flex justify-between font-bold text-base">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Promo code */}
            <div className="mt-6">
              <div className="flex gap-2">
                <div className="flex-1 flex items-center bg-[#F0F0F0] rounded-full px-4 py-2 gap-2">
                  <TagIcon className="h-4 w-4 shrink-0 text-gray-400" />
                  <input suppressHydrationWarning
                    type="text"
                    placeholder="Add promo code"
                    value={promo}
                    onChange={(e) => setPromo(e.target.value)}
                    className="bg-transparent text-sm outline-none w-full"
                  />
                </div>
                <button suppressHydrationWarning
                  onClick={applyPromo}
                  className="bg-black text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-gray-800 transition"
                >
                  Apply
                </button>
              </div>
              {promoError && <p className="text-red-500 text-xs mt-2 pl-4">{promoError}</p>}
              {discount > 0 && (
                <p className="flex items-center gap-1 text-green-500 text-xs mt-2 pl-4">
                  <CheckIcon className="h-3.5 w-3.5" /> {discount}% discount applied!
                </p>
              )}
              <p className="text-xs text-gray-400 mt-2 pl-4">Try: SAVE20 or FIRST10</p>
            </div>

            <button suppressHydrationWarning
              onClick={handleCheckout}
              className="w-full mt-6 bg-black text-white font-semibold py-4 rounded-full hover:bg-gray-800 transition flex items-center justify-center gap-2"
            >
              Go to Checkout <ArrowRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
    <NewsletterBanner />
    </>
  );
}
