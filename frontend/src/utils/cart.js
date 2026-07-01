import api, { getData } from './api';

// ─────────────────────────────────────────────
// Cart APIs (Backend-synced)
// ─────────────────────────────────────────────

/**
 * Get the current user's cart from backend
 */
export const getCart = async () => {
  try {
    const response = await api.get('/cart');
    const payload = getData(response);

    return {
      success: true,
      items: payload?.items || payload || [],
    };
  } catch (error) {
    return {
      success: false,
      items: [],
      error: error?.response?.data?.message || 'Error while fetching cart.',
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
export const addToCartAPI = async (productId, quantity = 1, size, color) => {
  try {
    const response = await api.post('/cart/add', { productId, quantity, size, color });
    const payload = getData(response);

    return {
      success: true,
      items: payload?.items || [],
    };
  } catch (error) {
    return {
      success: false,
      error: error?.response?.data?.message || 'Error while adding to cart.',
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
export const updateCartItemAPI = async (productId, quantity, size, color) => {
  try {
    const response = await api.put('/cart/update', { productId, quantity, size, color });
    const payload = getData(response);

    return {
      success: true,
      items: payload?.items || [],
    };
  } catch (error) {
    return {
      success: false,
      error: error?.response?.data?.message || 'Error while updating cart.',
    };
  }
};

/**
 * Remove an item from backend cart
 * @param {string|number} productId
 * @param {string} size
 * @param {string} color
 */
export const removeFromCartAPI = async (productId, size, color) => {
  try {
    const response = await api.delete('/cart/remove', {
      data: { productId, size, color },
    });
    const payload = getData(response);

    return {
      success: true,
      items: payload?.items || [],
    };
  } catch (error) {
    return {
      success: false,
      error: error?.response?.data?.message || 'Error while removing from cart.',
    };
  }
};

/**
 * Clear all items from backend cart
 */
export const clearCartAPI = async () => {
  try {
    await api.delete('/cart/clear');
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error?.response?.data?.message || 'Error while clearing cart.',
    };
  }
};
