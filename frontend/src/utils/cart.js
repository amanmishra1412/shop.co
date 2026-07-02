import api, { getData } from './api';

// ─────────────────────────────────────────────
// Cart APIs (Backend-synced)
// ─────────────────────────────────────────────

/**
 * Get the current user's cart from backend
 */
export const getCart = async () => {
    try {
        const response = await api.get("/cart");

        const payload = getData(response);

        return {
            success: true,
            cart: payload.cart,
            items: payload.cart.items,
        };
    } catch (error) {
        return {
            success: false,
            cart: null,
            items: [],
            error:
                error.response?.data?.message ||
                "Error while fetching cart.",
        };
    }
};

/**
 * Add an item to the backend cart
 * @param {string|number} productId
 * @param {number} quantity
 * @param {string} size
 * @param {string} color
 */
export const addToCartAPI = async (
    productId,
    quantity,
    size,
    color
) => {
    try {
        const response = await api.post("/cart/add", {
            productId,
            quantity,
            size,
            color,
        });

        const payload = getData(response);

        return {
            success: true,
            cart: payload.cart,
            items: payload.cart.items,
        };
    } catch (error) {
        return {
            success: false,
            error:
                error.response?.data?.message ||
                "Error while adding product.",
        };
    }
};

/**
 * Update quantity of an item in backend cart
 * @param {string|number} productId
 * @param {number} quantity
 * @param {string} size
 * @param {string} color
 */
export const updateCartItemAPI = async (
    itemId,
    quantity
) => {
    try {
        const response = await api.put(
            `/cart/item/${itemId}`,
            {
                quantity,
            }
        );

        const payload = getData(response);

        return {
            success: true,
            cart: payload.cart,
            items: payload.cart.items,
        };
    } catch (error) {
        return {
            success: false,
            error:
                error.response?.data?.message ||
                "Error while updating cart.",
        };
    }
};

/**
 * Remove an item from backend cart
 * @param {string|number} productId
 * @param {string} size
 * @param {string} color
 */
export const removeFromCartAPI = async (
    itemId
) => {
    try {
        const response = await api.delete(
            `/cart/item/${itemId}`
        );

        const payload = getData(response);

        return {
            success: true,
            cart: payload.cart,
            items: payload.cart.items,
        };
    } catch (error) {
        return {
            success: false,
            error:
                error.response?.data?.message ||
                "Error while removing item.",
        };
    }
};

/**
 * Clear all items from backend cart
 */
export const clearCartAPI = async () => {
    try {
        const response = await api.delete("/cart/clear");

        const payload = getData(response);

        return {
            success: true,
            cart: payload.cart,
            items: [],
        };
    } catch (error) {
        return {
            success: false,
            error:
                error.response?.data?.message ||
                "Error while clearing cart.",
        };
    }
};
