import api, { getData } from "./api";
import { normalizeCartItems } from "./normalize";

const extractItems = (payload) => payload?.items || payload?.cartItems || payload?.data || payload || [];

export const getCart = async () => {
  try {
    const response = await api.get("/cart");
    const payload = getData(response);

    return {
      success: true,
      items: normalizeCartItems(extractItems(payload)),
    };
  } catch (error) {
    return {
      success: false,
      items: [],
      error: error?.response?.data?.message || "Error while fetching cart.",
    };
  }
};

export const addToCartAPI = async (productId, quantity = 1, size, color) => {
  try {
    const response = await api.post("/cart/add", { productId, quantity, size, color });
    const payload = getData(response);

    return {
      success: true,
      items: normalizeCartItems(extractItems(payload)),
    };
  } catch (error) {
    return {
      success: false,
      error: error?.response?.data?.message || "Error while adding to cart.",
    };
  }
};

export const updateCartItemAPI = async (productId, quantity, size, color) => {
  try {
    const response = await api.put("/cart/update", { productId, quantity, size, color });
    const payload = getData(response);

    return {
      success: true,
      items: normalizeCartItems(extractItems(payload)),
    };
  } catch (error) {
    return {
      success: false,
      error: error?.response?.data?.message || "Error while updating cart.",
    };
  }
};

export const removeFromCartAPI = async (productId, size, color) => {
  try {
    const response = await api.delete("/cart/remove", {
      data: { productId, size, color },
    });
    const payload = getData(response);

    return {
      success: true,
      items: normalizeCartItems(extractItems(payload)),
    };
  } catch (error) {
    return {
      success: false,
      error: error?.response?.data?.message || "Error while removing from cart.",
    };
  }
};

export const clearCartAPI = async () => {
  try {
    await api.delete("/cart/clear");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error?.response?.data?.message || "Error while clearing cart.",
    };
  }
};

