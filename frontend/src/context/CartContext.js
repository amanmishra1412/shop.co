"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getCart,
  addToCartAPI,
  updateCartItemAPI,
  removeFromCartAPI,
  clearCartAPI,
} from "@/utils/cart";

const CartContext = createContext(null);

const LOCAL_KEY = "shopco_cart";

// ─── LocalStorage helpers ───────────────────────────
const loadLocal = () => {
  try {
    const saved = localStorage.getItem(LOCAL_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveLocal = (items) => {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(items));
  } catch {}
};

// ─── Provider ───────────────────────────────────────
export function CartProvider({ children }) {
  const { isAuthenticated, user } = useAuth();
  const [items, setItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);

  // ── Load cart on auth change ──────────────────────
  useEffect(() => {
    const loadCart = async () => {
      setCartLoading(true);

      if (isAuthenticated) {
        // Logged in → fetch from backend
        const result = await getCart();
        if (result.success) {
          setItems(result.items);
        } else {
          // Fallback to localStorage if backend fails
          setItems(loadLocal());
        }
      } else {
        // Guest → use localStorage
        setItems(loadLocal());
      }

      setCartLoading(false);
    };

    loadCart();
  }, [isAuthenticated, user]);

  // ── Save to localStorage for guests ──────────────
  useEffect(() => {
    if (!isAuthenticated) {
      saveLocal(items);
    }
  }, [items, isAuthenticated]);

  // ── addToCart ────────────────────────────────────
  const addToCart = useCallback(async (product, quantity = 1, size, color) => {
    if (isAuthenticated) {
      const result = await addToCartAPI(product._id || product.id, quantity, size, color);
      if (result.success) {
        setItems(result.items);
        return;
      }
    }

    // Guest or fallback
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.id === product.id && i.size === size && i.color === color
      );
      if (existing) {
        return prev.map((i) =>
          i.id === product.id && i.size === size && i.color === color
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { ...product, quantity, size, color }];
    });
  }, [isAuthenticated]);

  // ── removeFromCart ───────────────────────────────
  const removeFromCart = useCallback(async (id, size, color) => {
    if (isAuthenticated) {
      const result = await removeFromCartAPI(id, size, color);
      if (result.success) {
        setItems(result.items);
        return;
      }
    }

    // Guest or fallback
    setItems((prev) =>
      prev.filter((i) => !(i.id === id && i.size === size && i.color === color))
    );
  }, [isAuthenticated]);

  // ── updateQuantity ───────────────────────────────
  const updateQuantity = useCallback(async (id, size, color, quantity) => {
    if (quantity < 1) {
      await removeFromCart(id, size, color);
      return;
    }

    if (isAuthenticated) {
      const result = await updateCartItemAPI(id, quantity, size, color);
      if (result.success) {
        setItems(result.items);
        return;
      }
    }

    // Guest or fallback
    setItems((prev) =>
      prev.map((i) =>
        i.id === id && i.size === size && i.color === color
          ? { ...i, quantity }
          : i
      )
    );
  }, [isAuthenticated, removeFromCart]);

  // ── clearCart ────────────────────────────────────
  const clearCart = useCallback(async () => {
    if (isAuthenticated) {
      await clearCartAPI();
    }
    setItems([]);
    saveLocal([]);
  }, [isAuthenticated]);

  // ── Computed values ──────────────────────────────
  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0);
  const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        cartLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};
