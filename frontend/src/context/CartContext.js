"use client";

import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("shopco_cart");
    if (saved) setItems(JSON.parse(saved));
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    localStorage.setItem("shopco_cart", JSON.stringify(items));
  }, [items]);

  const addToCart = (product, quantity = 1, size, color) => {
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
  };

  const removeFromCart = (id, size, color) => {
    setItems((prev) =>
      prev.filter((i) => !(i.id === id && i.size === size && i.color === color))
    );
  };

  const updateQuantity = (id, size, color, quantity) => {
    if (quantity < 1) return;
    setItems((prev) =>
      prev.map((i) =>
        i.id === id && i.size === size && i.color === color
          ? { ...i, quantity }
          : i
      )
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0);

  const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, subtotal }}
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
