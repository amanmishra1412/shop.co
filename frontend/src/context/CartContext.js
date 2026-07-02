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
    } catch { }
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

                    setItems(result.cart.items);

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

            const result = await addToCartAPI(
                product._id,
                quantity,
                size,
                color
            );

            if (result.success) {
                setItems(result.items);
                return;
            }

        }

        setItems(prev => {

            const existing = prev.find(item =>
                (item._id || item.id) === (product._id || product.id) &&
                item.size === size &&
                item.color === color
            );

            if (existing) {

                return prev.map(item =>

                    (item._id || item.id) === (product._id || product.id) &&
                        item.size === size &&
                        item.color === color

                        ? {
                            ...item,
                            quantity: item.quantity + quantity
                        }

                        : item

                );

            }

            return [
                ...prev,
                {
                    ...product,
                    quantity,
                    size,
                    color,
                },
            ];

        });

    }, [isAuthenticated]);

    // ── removeFromCart ───────────────────────────────
    const removeFromCart = useCallback(async (itemId) => {

        if (isAuthenticated) {

            const result = await removeFromCartAPI(itemId);

            if (result.success) {
                setItems(result.items);
                return;
            }

        }

        setItems(prev =>
            prev.filter(item =>
                (item._id || item.id) !== itemId
            )
        );

    }, [isAuthenticated]);
    // ── updateQuantity ───────────────────────────────
    const updateQuantity = useCallback(async (
        itemId,
        quantity
    ) => {

        if (quantity < 1) {

            await removeFromCart(itemId);

            return;

        }

        if (isAuthenticated) {

            const result =
                await updateCartItemAPI(
                    itemId,
                    quantity
                );

            if (result.success) {

                setItems(result.items);

                return;

            }

        }

        setItems(prev =>
            prev.map(item =>

                (item._id || item.id) === itemId

                    ? {
                        ...item,
                        quantity
                    }

                    : item

            )
        );

    }, [
        isAuthenticated,
        removeFromCart
    ]);

    // ── clearCart ────────────────────────────────────
    const clearCart = useCallback(async () => {

        if (isAuthenticated) {

            const result = await clearCartAPI();

            if (result.success) {

                setItems([]);

            }

        } else {

            setItems([]);

            saveLocal([]);

        }

    }, [
        isAuthenticated
    ]);

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
