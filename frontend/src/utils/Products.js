import api, { getData } from "./api";
import { products as fallbackProducts } from "@/data/products";
import { normalizeProduct, normalizeProducts } from "./normalize";

const extractProductList = (payload) =>
  payload?.products ||
  payload?.items ||
  payload?.docs ||
  payload?.rows ||
  payload?.data ||
  payload ||
  [];

const fallbackCatalog = normalizeProducts(fallbackProducts);

const applyLocalFilters = (list = [], params = {}) => {
  let filtered = [...list];
  const category = params.category?.toString().trim();
  const style = params.style?.toString().trim().toLowerCase();
  const colors = Array.isArray(params.colors) ? params.colors : [];
  const sizes = Array.isArray(params.sizes) ? params.sizes : [];
  const search = params.search || params.q || "";
  const minPrice = Number(params.minPrice ?? 0);
  const maxPrice = Number(params.maxPrice ?? Number.MAX_SAFE_INTEGER);

  if (category) {
    filtered = filtered.filter((product) => String(product.category || "").toLowerCase() === category.toLowerCase());
  }

  if (style) {
    filtered = filtered.filter((product) => String(product.dressStyle || "").toLowerCase() === style);
  }

  if (colors.length) {
    filtered = filtered.filter((product) =>
      (product.colors || []).some((color) => colors.includes(color))
    );
  }

  if (sizes.length) {
    filtered = filtered.filter((product) =>
      (product.sizes || []).some((size) => sizes.includes(size))
    );
  }

  filtered = filtered.filter(
    (product) =>
      Number(product.price || 0) >= minPrice &&
      Number(product.price || 0) <= maxPrice
  );

  if (search) {
    const needle = search.toString().trim().toLowerCase();
    filtered = filtered.filter((product) =>
      [product.name, product.category, product.dressStyle, product.description]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(needle))
    );
  }

  return filtered;
};

const sortProducts = (list = [], sort = "") => {
  const sorted = [...list];

  if (sort === "price-asc") return sorted.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") return sorted.sort((a, b) => b.price - a.price);
  if (sort === "rating") return sorted.sort((a, b) => b.rating - a.rating);
  return sorted;
};

export const GetProductsAll = async (params = {}) => {
  try {
    const response = await api.get("/products", { params });
    const payload = getData(response);
    const products = normalizeProducts(extractProductList(payload));
    const filtered = sortProducts(applyLocalFilters(products, params), params.sort);

    return {
      success: true,
      products: filtered,
      total: filtered.length,
    };
  } catch (error) {
    const filteredFallback = sortProducts(applyLocalFilters(fallbackCatalog, params), params.sort);

    return {
      success: filteredFallback.length > 0,
      products: filteredFallback,
      total: filteredFallback.length,
      error: error?.response?.data?.message || "Error while getting products.",
    };
  }
};

export const GetProductById = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    const payload = getData(response);
    const product = normalizeProduct(payload?.product || payload);

    if (!product?.id) {
      throw new Error("Product not found");
    }

    return {
      success: true,
      product,
    };
  } catch (error) {
    const localProduct = fallbackCatalog.find(
      (item) => String(item.id) === String(id) || String(item.raw?._id) === String(id)
    );

    return {
      success: Boolean(localProduct),
      product: localProduct || null,
      error: error?.response?.data?.message || "Error while getting product.",
    };
  }
};

export const SearchProducts = async (query) => {
  try {
    const response = await api.get("/products/search", { params: { q: query } });
    const payload = getData(response);
    const products = normalizeProducts(extractProductList(payload));

    return {
      success: true,
      products,
    };
  } catch (error) {
    const needle = query?.toString().trim().toLowerCase();
    const products = needle
      ? fallbackCatalog.filter((product) =>
          [product.name, product.category, product.dressStyle, product.description]
            .filter(Boolean)
            .some((field) => String(field).toLowerCase().includes(needle))
        )
      : fallbackCatalog;

    return {
      success: products.length > 0,
      products,
      error: error?.response?.data?.message || "Error while searching products.",
    };
  }
};

export const GetProductsByCategory = async (category) => {
  try {
    const response = await api.get("/products", { params: { category } });
    const payload = getData(response);
    const products = normalizeProducts(extractProductList(payload));

    return {
      success: true,
      products,
    };
  } catch (error) {
    const products = fallbackCatalog.filter(
      (product) => String(product.category || "").toLowerCase() === String(category || "").toLowerCase()
    );

    return {
      success: products.length > 0,
      products,
      error: error?.response?.data?.message || "Error while getting products.",
    };
  }
};

