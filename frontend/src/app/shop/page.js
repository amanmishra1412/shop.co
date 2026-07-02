"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import NewsletterBanner from "@/components/common/NewsletterBanner";
import ProductCard from "@/components/common/ProductCard";
import FilterSidebar from "@/components/shop/FilterSidebar";
import { GetProductsAll } from "@/utils/Products";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  SearchIcon,
  SlidersIcon,
  XIcon,
} from "@/components/common/Icons";

const cloneFilters = (filters) => ({
  ...filters,
  colors: [...filters.colors],
  sizes: [...filters.sizes],
});

function ShopContent() {
  const searchParams = useSearchParams();

  const initialFilters = {
    category: "",
    colors: [],
    sizes: [],
    minPrice: 0,
    maxPrice: 10000,
  };

  const [allProducts, setAllProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");

  const [appliedFilters, setAppliedFilters] = useState(() => cloneFilters(initialFilters));
  const [draftFilters, setDraftFilters] = useState(() => cloneFilters(initialFilters));
  const sort = searchParams.get("sort") || "";
  const [page, setPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const perPage = 9;

  // ── Fetch products from backend ───────────────────
  useEffect(() => {
    const fetchProducts = async () => {
      setProductsLoading(true);
      setProductsError("");
      const result = await GetProductsAll();
      if (result.success) {
        setAllProducts(result.products);
      } else {
        setProductsError(result.error || "Failed to load products.");
      }
      setProductsLoading(false);
    };

    fetchProducts();
  }, []);

  // ── Filter + sort ─────────────────────────────────
  const filtered = useMemo(() => {
  let list = [...allProducts];

  // Category
  if (appliedFilters.category) {
    list = list.filter(
      (p) => p.category === appliedFilters.category
    );
  }

  // Colors
  if (appliedFilters.colors.length > 0) {
    list = list.filter((p) =>
      p.colors?.some((color) =>
        appliedFilters.colors.includes(color)
      )
    );
  }

  // Sizes
  if (appliedFilters.sizes.length > 0) {
    list = list.filter((p) =>
      p.sizes?.some((size) =>
        appliedFilters.sizes.includes(size)
      )
    );
  }

  // Price
  list = list.filter(
    (p) =>
      p.price >= appliedFilters.minPrice &&
      p.price <= appliedFilters.maxPrice
  );

  // Sorting
  switch (sort) {
    case "price-asc":
      list.sort((a, b) => a.price - b.price);
      break;

    case "price-desc":
      list.sort((a, b) => b.price - a.price);
      break;

    case "rating":
      list.sort((a, b) => b.rating - a.rating);
      break;

    default:
      break;
  }

  return list;
}, [allProducts, appliedFilters, sort]);
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const applyFilters = () => {
    setAppliedFilters(cloneFilters(draftFilters));
    setPage(1);
    setSidebarOpen(false);
  };
  const openFilters = () => {
    setDraftFilters(cloneFilters(appliedFilters));
    setSidebarOpen(true);
  };
  const closeFilters = () => {
    setDraftFilters(cloneFilters(appliedFilters));
    setSidebarOpen(false);
  };

  const sortOptions = [
    { value: "", label: "Sort by: Most Popular", href: "/shop" },
    { value: "price-asc", label: "Price: Low to High", href: "/shop?sort=price-asc" },
    { value: "price-desc", label: "Price: High to Low", href: "/shop?sort=price-desc" },
    { value: "rating", label: "Top Rated", href: "/shop?sort=rating" },
  ];
  const currentSort = sortOptions.find((option) => option.value === sort) || sortOptions[0];

  return (
    <div className="flex flex-col flex-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full flex-1">
        {/* Breadcrumb */}
        <p className="text-sm text-gray-400 mb-6">
          Home &rsaquo; <span className="text-black font-medium">Shop</span>
        </p>

        <div className="flex gap-8">
          {/* Sidebar - desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <FilterSidebar
              filters={draftFilters}
              setFilters={setDraftFilters}
              onApply={applyFilters}
            />
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Top bar */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-xl font-bold">Shop</h1>
                <p className="text-sm text-gray-500">
                  {productsLoading ? "Loading..." : `Showing ${filtered.length} Products`}
                </p>
              </div>
              <div className="flex w-full items-center gap-3 sm:w-auto">
                {/* Mobile filter button */}
                <button suppressHydrationWarning
                  className="flex h-10 items-center gap-2 rounded-full border border-gray-300 px-4 text-sm lg:hidden"
                  onClick={openFilters}
                >
                  <SlidersIcon className="h-4 w-4" /> Filters
                </button>
                <details className="group relative min-w-0 flex-1 sm:w-[236px] sm:flex-none">
                  <summary className="flex h-10 w-full cursor-pointer list-none items-center justify-between gap-3 rounded-full border border-gray-300 bg-white pl-4 pr-3 text-left text-sm outline-none transition hover:border-gray-500 focus:border-black [&::-webkit-details-marker]:hidden">
                    <span className="min-w-0 truncate">{currentSort.label}</span>
                    <ChevronDownIcon className="h-4 w-4 shrink-0 text-gray-500 transition group-open:rotate-180" />
                  </summary>

                  <div className="absolute right-0 top-full z-30 mt-2 w-full min-w-[220px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-gray-200 bg-white p-1 shadow-xl">
                    {sortOptions.map((option) => (
                      <Link
                        key={option.value}
                        href={option.href}
                        className={`block w-full rounded-xl px-4 py-2.5 text-left text-sm transition ${sort === option.value
                          ? "bg-black text-white"
                          : "text-gray-600 hover:bg-gray-100 hover:text-black"
                          }`}
                      >
                        {option.label}
                      </Link>
                    ))}
                  </div>
                </details>
              </div>
            </div>

            {/* Loading state */}
            {productsLoading && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
                ))}
              </div>
            )}

            {/* Error state */}
            {!productsLoading && productsError && (
              <div className="text-center py-20 text-red-500">
                <p className="font-semibold">{productsError}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-6 py-2 bg-black text-white rounded-full text-sm"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Product grid */}
            {!productsLoading && !productsError && (
              paginated.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                    <SearchIcon className="h-6 w-6" />
                  </div>
                  <p className="font-semibold">No products found</p>
                  <p className="text-sm mt-1">Try adjusting your filters</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                  {paginated.map((product) => (
                    <ProductCard key={product._id || product.id} product={product} />
                  ))}
                </div>
              )
            )}

            {/* Pagination */}
            {!productsLoading && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10 flex-wrap">
                <button suppressHydrationWarning
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full text-sm hover:bg-gray-100 disabled:opacity-40 transition"
                >
                  <ArrowLeftIcon className="h-4 w-4" /> Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                  <button suppressHydrationWarning
                    key={num}
                    onClick={() => setPage(num)}
                    className={`w-9 h-9 rounded-full text-sm font-medium transition ${page === num ? "bg-black text-white" : "hover:bg-gray-100 border border-gray-300"
                      }`}
                  >
                    {num}
                  </button>
                ))}
                <button suppressHydrationWarning
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full text-sm hover:bg-gray-100 disabled:opacity-40 transition"
                >
                  Next <ArrowRightIcon className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 flex flex-col bg-white lg:hidden">
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 px-5">
              <h3 className="text-lg font-bold">Filters</h3>
              <button suppressHydrationWarning
                onClick={closeFilters}
                className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100"
                aria-label="Close filters"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-5">
              <FilterSidebar
                filters={draftFilters}
                setFilters={setDraftFilters}
                onApply={applyFilters}
                className="border-0 p-0"
                showHeader={false}
              />
            </div>
          </div>
        )}
      </div>
      <NewsletterBanner />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense>
      <ShopContent />
    </Suspense>
  );
}
