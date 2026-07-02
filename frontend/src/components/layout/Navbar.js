"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import {
  ChevronDownIcon,
  MenuIcon,
  SearchIcon,
  ShoppingCartIcon,
  XIcon,
} from "@/components/common/Icons";

export default function Navbar() {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      {/* Top promo bar */}
      <div className="bg-black text-white text-center text-xs py-2 px-4">
        Sign up and get 20% off your first order.{" "}
        <Link href="/auth/signup" className="underline font-semibold">
          Sign Up Now
        </Link>
      </div>

      {/* Main nav */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 gap-4">
        {/* Mobile hamburger */}
        <button
          suppressHydrationWarning
          className="lg:hidden flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
        </button>

        {/* Logo */}
        <Link href="/" className="font-black text-xl tracking-tight shrink-0">
          SHOP.CO
        </Link>

        {/* Desktop nav links */}
        <div className="hidden lg:flex items-center gap-6 text-sm font-medium">
          <div className="relative group">
            <button suppressHydrationWarning className="flex items-center gap-1 hover:text-gray-600">
              Shop <ChevronDownIcon className="h-3.5 w-3.5" />
            </button>
            <div className="absolute top-full left-0 bg-white shadow-lg rounded-xl p-4 w-40 hidden group-hover:block z-50">
              <Link href="/shop" className="block py-1 hover:font-semibold">All Products</Link>
              <Link href="/shop?style=casual" className="block py-1 hover:font-semibold">Casual</Link>
              <Link href="/shop?style=formal" className="block py-1 hover:font-semibold">Formal</Link>
              <Link href="/shop?style=party" className="block py-1 hover:font-semibold">Party</Link>
              <Link href="/shop?style=gym" className="block py-1 hover:font-semibold">Gym</Link>
            </div>
          </div>
          <Link href="/shop?sort=top" className="hover:text-gray-600">On Sale</Link>
          <Link href="/shop?filter=new" className="hover:text-gray-600">New Arrivals</Link>
          <Link href="/shop" className="hover:text-gray-600">Brands</Link>
        </div>

        {/* Search bar */}
        <div className="hidden sm:flex flex-1 max-w-md items-center bg-[#F0F0F0] rounded-full px-4 py-2 gap-2">
          <SearchIcon className="h-4 w-4 shrink-0 text-gray-400" />
          <input suppressHydrationWarning
            type="text"
            placeholder="Search for products..."
            className="bg-transparent text-sm outline-none w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-3">
          {/* Mobile search toggle */}
          <button suppressHydrationWarning
            className="sm:hidden flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Search"
          >
            <SearchIcon className="h-5 w-5" />
          </button>

          {/* Cart */}
          <Link
            href="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100"
            aria-label="Cart"
          >
            <ShoppingCartIcon className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Auth */}
          {user ? (
            <div className="relative">
              <button suppressHydrationWarning
                className="w-8 h-8 rounded-full bg-black text-white text-sm font-bold flex items-center justify-center"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {user.name?.[0]?.toUpperCase() || "U"}
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 bg-white shadow-lg rounded-xl w-40 z-50 border border-gray-100">
                  <Link href="/account" className="block px-4 py-3 text-sm hover:bg-gray-50" onClick={() => setDropdownOpen(false)}>
                    My Account
                  </Link>
                  <button suppressHydrationWarning
                    className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-gray-50"
                    onClick={() => { logout(); setDropdownOpen(false); }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="text-sm font-semibold bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition hidden sm:block"
            >
              Login
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile search */}
      {searchOpen && (
        <div className="sm:hidden px-4 pb-3">
          <div className="flex items-center bg-[#F0F0F0] rounded-full px-4 py-2 gap-2">
            <SearchIcon className="h-4 w-4 shrink-0 text-gray-400" />
            <input suppressHydrationWarning
              type="text"
              placeholder="Search for products..."
              className="bg-transparent text-sm outline-none w-full"
              autoFocus
            />
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-4 text-sm font-medium">
          <Link href="/shop" onClick={() => setMenuOpen(false)}>Shop</Link>
          <Link href="/shop?sort=top" onClick={() => setMenuOpen(false)}>On Sale</Link>
          <Link href="/shop?filter=new" onClick={() => setMenuOpen(false)}>New Arrivals</Link>
          <Link href="/shop" onClick={() => setMenuOpen(false)}>Brands</Link>
          {user ? (
            <>
              <Link href="/account" onClick={() => setMenuOpen(false)}>My Account</Link>
              <button suppressHydrationWarning className="text-left text-red-500" onClick={() => { logout(); setMenuOpen(false); }}>Logout</button>
            </>
          ) : (
            <Link href="/auth/login" onClick={() => setMenuOpen(false)} className="font-bold">Login / Sign Up</Link>
          )}
        </div>
      )}
    </header>
  );
}
