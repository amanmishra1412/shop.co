"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getCart,
  addToCartAPI,
  updateCartItemAPI,
  removeFromCartAPI,
  clearCartAPI,
} from "@/utils/cart";
import { normalizeCartItem, normalizeCartItems, normalizeProduct } from "@/utils/normalize";

const CartContext = createContext(null);
const LOCAL_KEY = "shopco_cart";

const loadLocal = () => {
  if (typeof window === "undefined") return [];

  try {
    const saved = window.localStorage.getItem(LOCAL_KEY);
    return saved ? normalizeCartItems(JSON.parse(saved)) : [];
  } catch {
    return [];
  }
};

const saveLocal = (items) => {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(LOCAL_KEY, JSON.stringify(normalizeCartItems(items)));
  } catch {
    // best effort only
  }
};

export function CartProvider({ children }) {
  const { isAuthenticated, user } = useAuth();
  const [items, setItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadCart = async () => {
      setCartLoading(true);

      if (isAuthenticated) {
        const result = await getCart();
        if (!active) return;

        if (result.success) {
          setItems(normalizeCartItems(result.items));
        } else {
          setItems(loadLocal());
        }
      } else {
        setItems(loadLocal());
      }

      if (active) {
        setCartLoading(false);
      }
    };

    loadCart();

    return () => {
      active = false;
    };
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (!isAuthenticated) {
      saveLocal(items);
    }
  }, [items, isAuthenticated]);

  const replaceItems = useCallback((nextItems) => {
    const normalized = normalizeCartItems(nextItems);
    setItems(normalized);
    if (!isAuthenticated) {
      saveLocal(normalized);
    }
  }, [isAuthenticated]);

  const addToCart = useCallback(
    async (product, quantity = 1, size, color) => {
      const normalizedProduct = normalizeProduct(product);

      if (isAuthenticated) {
        const result = await addToCartAPI(normalizedProduct.id, quantity, size, color);
        if (result.success) {
          replaceItems(result.items);
          return;
        }
      }

      setItems((prev) => {
        const next = [...prev];
        const existing = next.find(
          (item) =>
            String(item.id) === String(normalizedProduct.id) &&
            item.size === size &&
            item.color === color
        );

        if (existing) {
          return next.map((item) =>
            String(item.id) === String(normalizedProduct.id) &&
            item.size === size &&
            item.color === color
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }

        return [
          ...next,
          normalizeCartItem({
            ...normalizedProduct,
            quantity,
            size,
            color,
          }),
        ];
      });
    },
    [isAuthenticated, replaceItems]
  );

  const removeFromCart = useCallback(
    async (id, size, color) => {
      if (isAuthenticated) {
        const result = await removeFromCartAPI(id, size, color);
        if (result.success) {
          replaceItems(result.items);
          return;
        }
      }

      setItems((prev) =>
        prev.filter(
          (item) =>
            !(
              String(item.id) === String(id) &&
              item.size === size &&
              item.color === color
            )
        )
      );
    },
    [isAuthenticated, replaceItems]
  );

  const updateQuantity = useCallback(
    async (id, size, color, quantity) => {
      if (quantity < 1) {
        await removeFromCart(id, size, color);
        return;
      }

      if (isAuthenticated) {
        const result = await updateCartItemAPI(id, quantity, size, color);
        if (result.success) {
          replaceItems(result.items);
          return;
        }
      }

      setItems((prev) =>
        prev.map((item) =>
          String(item.id) === String(id) && item.size === size && item.color === color
            ? { ...item, quantity }
            : item
        )
      );
    },
    [isAuthenticated, removeFromCart, replaceItems]
  );

  const clearCart = useCallback(async () => {
    if (isAuthenticated) {
      await clearCartAPI().catch(() => null);
    }

    setItems([]);
    saveLocal([]);
  }, [isAuthenticated]);

  const totalItems = useMemo(
    () => items.reduce((acc, item) => acc + Number(item.quantity || 0), 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((acc, item) => acc + Number(item.price || 0) * Number(item.quantity || 0), 0),
    [items]
  );

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

