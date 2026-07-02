"use client";

import { useState } from "react";
import { ChevronRightIcon } from "@/components/common/Icons";
import { categories, dressStyles, sizes, colors } from "@/data/categories";

const emptyFilters = {
  category: "",
  style: "",
  colors: [],
  sizes: [],
  minPrice: 0,
  maxPrice: 10000,
};

function FilterSection({ label, isOpen, onToggle, children }) {
  return (
    <div className="border-b border-gray-200 py-4">
      <button suppressHydrationWarning
        type="button"
        className="mb-3 flex w-full items-center justify-between text-sm font-semibold"
        onClick={onToggle}
      >
        {label}
        <span className="text-gray-400">{isOpen ? "-" : "+"}</span>
      </button>
      {isOpen && children}
    </div>
  );
}

export default function FilterSidebar({
  filters,
  setFilters,
  onApply,
  className = "border border-gray-200 rounded-2xl p-5",
  showHeader = true,
}) {
  const [openSections, setOpenSections] = useState({
    category: true,
    price: true,
    colors: true,
    sizes: true,
    style: true,
  });

  const toggle = (section) =>
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));

  const updateFilter = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const toggleArray = (key, value) => {
    setFilters((prev) => {
      const arr = prev[key];
      return {
        ...prev,
        [key]: arr.includes(value)
          ? arr.filter((item) => item !== value)
          : [...arr, value],
      };
    });
  };

  const clearAll = () => {
    setFilters(emptyFilters);
  };

  return (
    <div className={className}>
      {showHeader && (
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-base font-bold">Filters</h3>
          <button suppressHydrationWarning
            type="button"
            onClick={clearAll}
            className="text-xs text-gray-400 hover:text-black"
          >
            Clear All
          </button>
        </div>
      )}

      {!showHeader && (
        <div className="mb-2 flex justify-end">
          <button suppressHydrationWarning
            type="button"
            onClick={clearAll}
            className="text-xs text-gray-400 hover:text-black"
          >
            Clear All
          </button>
        </div>
      )}

      <FilterSection
        label="Category"
        isOpen={openSections.category}
        onToggle={() => toggle("category")}
      >
        <ul className="space-y-2">
          {categories.map((cat) => {
            const value = cat.toLowerCase();
            const selected = filters.category === value;

            return (
              <li key={cat}>
                <button suppressHydrationWarning
                  type="button"
                  onClick={() => updateFilter("category", selected ? "" : value)}
                  className={`flex w-full items-center justify-between text-sm ${
                    selected ? "font-bold text-black" : "text-gray-500"
                  }`}
                >
                  {cat} <ChevronRightIcon className="h-4 w-4" />
                </button>
              </li>
            );
          })}
        </ul>
      </FilterSection>

      <FilterSection
        label="Price"
        isOpen={openSections.price}
        onToggle={() => toggle("price")}
      >
        <div>
          <input suppressHydrationWarning
            type="range"
            min={0}
            max={300}
            value={filters.maxPrice}
            onChange={(e) => updateFilter("maxPrice", Number(e.target.value))}
            className="w-full"
          />
          <div className="mt-1 flex justify-between text-xs text-gray-500">
            <span>$0</span>
            <span>${filters.maxPrice}</span>
          </div>
        </div>
      </FilterSection>

      <FilterSection
        label="Colors"
        isOpen={openSections.colors}
        onToggle={() => toggle("colors")}
      >
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => {
            const selected = filters.colors.includes(color.hex);

            return (
              <button suppressHydrationWarning
                key={color.name}
                type="button"
                onClick={() => toggleArray("colors", color.hex)}
                title={color.name}
                className={`h-7 w-7 rounded-full border-2 transition ${
                  selected
                    ? "scale-110 border-black"
                    : "border-transparent hover:border-gray-400"
                } ${color.hex === "#FFFFFF" ? "border-gray-300" : ""}`}
                style={{ backgroundColor: color.hex }}
                aria-label={color.name}
              />
            );
          })}
        </div>
      </FilterSection>

      <FilterSection
        label="Size"
        isOpen={openSections.sizes}
        onToggle={() => toggle("sizes")}
      >
        <div className="flex flex-wrap gap-2">
          {sizes.slice(0, 6).map((size) => {
            const selected = filters.sizes.includes(size);

            return (
              <button suppressHydrationWarning
                key={size}
                type="button"
                onClick={() => toggleArray("sizes", size)}
                className={`rounded-full border px-3 py-1.5 text-xs transition ${
                  selected
                    ? "border-black bg-black text-white"
                    : "border-gray-300 hover:border-gray-600"
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </FilterSection>

      <FilterSection
        label="Dress Style"
        isOpen={openSections.style}
        onToggle={() => toggle("style")}
      >
        <ul className="space-y-2">
          {dressStyles.map((style) => {
            const value = style.toLowerCase();
            const selected = filters.style === value;

            return (
              <li key={style}>
                <button suppressHydrationWarning
                  type="button"
                  onClick={() => updateFilter("style", selected ? "" : value)}
                  className={`flex w-full items-center justify-between text-sm ${
                    selected ? "font-bold text-black" : "text-gray-500"
                  }`}
                >
                  {style} <ChevronRightIcon className="h-4 w-4" />
                </button>
              </li>
            );
          })}
        </ul>
      </FilterSection>

      {onApply && (
        <button suppressHydrationWarning
          type="button"
          onClick={onApply}
          className="mt-5 h-12 w-full rounded-full bg-black text-sm font-semibold text-white transition hover:bg-gray-800"
        >
          Apply Filters
        </button>
      )}
    </div>
  );
}
