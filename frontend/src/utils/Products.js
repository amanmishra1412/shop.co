import api, { getData } from './api';

// ─────────────────────────────────────────────
// Products APIs
// ─────────────────────────────────────────────

/**
 * Get all products (with optional query params for filter/sort/search)
 * @param {Object} params - e.g. { category, style, sort, minPrice, maxPrice, page, limit }
 */
export const GetProductsAll = async (params = {}) => {
  try {
    const response = await api.get('/products', { params });
    const payload = getData(response);

    return {
      success: true,
      products: payload?.products || payload || [],
      total: payload?.total || 0,
    };
  } catch (error) {
    return {
      success: false,
      products: [],
      error: error?.response?.data?.message || 'Error while getting products.',
    };
  }
};

/**
 * Get a single product by ID
 * @param {string|number} id
 */
export const GetProductById = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    const payload = getData(response);

    return {
      success: true,
      product: payload?.product || payload || null,
    };
  } catch (error) {
    return {
      success: false,
      product: null,
      error: error?.response?.data?.message || 'Error while getting product.',
    };
  }
};

/**
 * Search products by keyword
 * @param {string} query
 */
export const SearchProducts = async (query) => {
  try {
    const response = await api.get('/products/search', { params: { q: query } });
    const payload = getData(response);

    return {
      success: true,
      products: payload?.products || payload || [],
    };
  } catch (error) {
    return {
      success: false,
      products: [],
      error: error?.response?.data?.message || 'Error while searching products.',
    };
  }
};

/**
 * Get products by category
 * @param {string} category
 */
export const GetProductsByCategory = async (category) => {
  try {
    const response = await api.get('/products', { params: { category } });
    const payload = getData(response);

    return {
      success: true,
      products: payload?.products || payload || [],
    };
  } catch (error) {
    return {
      success: false,
      products: [],
      error: error?.response?.data?.message || 'Error while getting products.',
    };
  }
};