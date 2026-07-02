"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  addToCartAPI,
  clearCartAPI,
  getCart,
  removeFromCartAPI,
  updateCartItemAPI,
} from "@/utils/cart";
import { normalizeCart, normalizeCartItem, normalizeCartItems, normalizeProduct } from "@/utils/normalize";

const CartContext = createContext(null);
const LOCAL_KEY = "shopco_cart";

const loadLocal = () => {
  if (typeof window === "undefined") return normalizeCart({ items: [] });

  try {
    const saved = window.localStorage.getItem(LOCAL_KEY);
    return saved ? normalizeCart(JSON.parse(saved)) : normalizeCart({ items: [] });
  } catch {
    return normalizeCart({ items: [] });
  }
};

const saveLocal = (cart) => {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(LOCAL_KEY, JSON.stringify(normalizeCart(cart)));
  } catch {
    // best effort only
  }
};

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState(() => normalizeCart({ items: [] }));
  const [cartLoading, setCartLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setCartLoading(true);

      if (isAuthenticated) {
        const result = await getCart();
        if (!active) return;

        if (result.success) {
          setCart(result.cart);
        } else {
          setCart(loadLocal());
        }
      } else {
        setCart(loadLocal());
      }

      if (active) {
        setCartLoading(false);
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      saveLocal(cart);
    }
  }, [cart, isAuthenticated]);

  const setNextCart = useCallback(
    (nextCart) => {
      const normalized = normalizeCart(nextCart);
      setCart(normalized);
      if (!isAuthenticated) {
        saveLocal(normalized);
      }
    },
    [isAuthenticated]
  );

  const addToCart = useCallback(
    async (product, quantity = 1, size, color) => {
      const normalizedProduct = normalizeProduct(product);

      if (isAuthenticated) {
        const result = await addToCartAPI(normalizedProduct.id, quantity, size, color);
        if (result.success) {
          setNextCart(result.cart);
          return;
        }
      }

      setCart((prev) => {
        const existing = prev.items.find(
          (item) =>
            String(item.productId) === String(normalizedProduct.id) &&
            item.size === size &&
            item.color === color
        );

        if (existing) {
          return {
            ...prev,
            items: prev.items.map((item) =>
              item.cartItemId === existing.cartItemId
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          };
        }

        return normalizeCart({
          ...prev,
          items: [
            ...prev.items,
            normalizeCartItem({
              _id: `${normalizedProduct.id}-${size}-${color}`,
              productId: normalizedProduct,
              quantity,
              size,
              color,
              price: normalizedProduct.price,
            }),
          ],
        });
      });
    },
    [isAuthenticated, setNextCart]
  );

  const removeFromCart = useCallback(
    async (itemId) => {
      if (isAuthenticated) {
        const result = await removeFromCartAPI(itemId);
        if (result.success) {
          setNextCart(result.cart);
          return;
        }
      }

      setCart((prev) => normalizeCart({ ...prev, items: prev.items.filter((item) => item.cartItemId !== itemId) }));
    },
    [isAuthenticated, setNextCart]
  );

  const updateQuantity = useCallback(
    async (itemId, quantity) => {
      if (quantity < 1) {
        await removeFromCart(itemId);
        return;
      }

      if (isAuthenticated) {
        const result = await updateCartItemAPI(itemId, quantity);
        if (result.success) {
          setNextCart(result.cart);
          return;
        }
      }

      setCart((prev) =>
        normalizeCart({
          ...prev,
          items: prev.items.map((item) =>
            item.cartItemId === itemId ? { ...item, quantity } : item
          ),
        })
      );
    },
    [isAuthenticated, removeFromCart, setNextCart]
  );

  const clearCart = useCallback(async () => {
    if (isAuthenticated) {
      const result = await clearCartAPI();
      if (result.success) {
        setNextCart(result.cart);
        return;
      }
    }

    setCart(normalizeCart({ items: [] }));
    saveLocal({ items: [] });
  }, [isAuthenticated, setNextCart]);

  const items = cart.items;
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
