"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import StarRating from "@/components/common/StarRating";
import ProductCard from "@/components/common/ProductCard";
import NewsletterBanner from "@/components/common/NewsletterBanner";
import { getReviewsByProduct } from "@/data/reviews";
import { getRelatedProducts } from "@/data/products";
import { notFound } from "next/navigation";

export default function ProductDetailClient({ product }) {
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[1] || product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("reviews");
  const [added, setAdded] = useState(false);

  const reviews = getReviewsByProduct(product.id);
  const related = getRelatedProducts(product.id, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <>
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
      {/* Breadcrumb */}
      <p className="text-sm text-gray-400 mb-8">
        Home &rsaquo; Shop &rsaquo;{" "}
        <span className="text-black font-medium">{product.name}</span>
      </p>

      {/* Product top section */}
      <div className="flex flex-col lg:flex-row gap-10 mb-16">
        {/* Image Gallery */}
        <div className="flex flex-col-reverse sm:flex-row gap-4 lg:w-[45%]">
          {/* Thumbnails */}
          <div className="flex sm:flex-col gap-3 shrink-0">
            {product.images.map((img, i) => (
              <button suppressHydrationWarning
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                  selectedImage === i
                    ? "border-black"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
          {/* Main image */}
          <div className="flex-1 bg-[#F2F0F1] rounded-2xl overflow-hidden">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full min-h-[380px] object-cover"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1 flex flex-col">
          <h1 className="text-3xl sm:text-4xl font-black uppercase leading-tight tracking-tight mb-3">
            {product.name}
          </h1>

          {/* Rating row */}
          <div className="flex items-center gap-2 mb-5">
            <StarRating rating={product.rating} size="md" />
            <span className="text-sm text-gray-500">
              {product.rating}/5 ({reviews.length} Reviews)
            </span>
          </div>

          {/* Price row */}
          <div className="flex items-center gap-3 mb-5">
            <span className="text-3xl font-bold">${product.price}</span>
            {product.originalPrice && (
              <span className="text-xl text-gray-400 line-through">${product.originalPrice}</span>
            )}
            {product.discount && (
              <span className="bg-red-100 text-red-600 text-sm font-semibold px-3 py-1 rounded-full">
                -{product.discount}%
              </span>
            )}
          </div>

          <p className="text-gray-500 text-sm leading-relaxed mb-5 pb-5 border-b border-gray-200">
            {product.description}
          </p>

          {/* Colors */}
          <div className="mb-5 pb-5 border-b border-gray-200">
            <p className="text-sm text-gray-500 mb-3 font-medium">Select Colors</p>
            <div className="flex gap-3 flex-wrap">
              {product.colors.map((color) => (
                <button suppressHydrationWarning
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  style={{ backgroundColor: color }}
                  title={color}
                  className={`w-10 h-10 rounded-full border-4 transition-all ${
                    selectedColor === color
                      ? "border-black scale-110"
                      : "border-transparent hover:border-gray-300"
                  } ${color === "#FFFFFF" ? "shadow-sm" : ""}`}
                />
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <p className="text-sm text-gray-500 mb-3 font-medium">Choose Size</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button suppressHydrationWarning
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-6 py-2.5 rounded-full text-sm font-medium border transition-all ${
                    selectedSize === size
                      ? "bg-black text-white border-black"
                      : "border-gray-200 bg-[#F0F0F0] hover:border-gray-400"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Qty + Add to Cart */}
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-[#F0F0F0] rounded-full overflow-hidden">
              <button suppressHydrationWarning
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-11 h-11 flex items-center justify-center hover:bg-gray-200 transition text-xl font-bold"
              >
                −
              </button>
              <span className="px-4 font-semibold text-base min-w-[2.5rem] text-center">
                {quantity}
              </span>
              <button suppressHydrationWarning
                onClick={() => setQuantity((q) => q + 1)}
                className="w-11 h-11 flex items-center justify-center hover:bg-gray-200 transition text-xl font-bold"
              >
                +
              </button>
            </div>
            <button suppressHydrationWarning
              onClick={handleAddToCart}
              className={`flex-1 py-4 rounded-full font-semibold text-base transition-all ${
                added
                  ? "bg-green-500 text-white"
                  : "bg-black text-white hover:bg-gray-800"
              }`}
            >
              {added ? "✓ Added to Cart!" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-10">
        <div className="flex gap-10 max-w-7xl">
          {[
            { label: "Product Details", id: "details" },
            { label: "Rating & Reviews", id: "reviews" },
            { label: "FAQs", id: "faqs" },
          ].map((tab) => (
            <button suppressHydrationWarning
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 text-sm font-medium border-b-2 transition-all ${
                activeTab === tab.id
                  ? "border-black text-black"
                  : "border-transparent text-gray-400 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mb-16">
        {activeTab === "details" && (
          <div className="text-sm text-gray-600 leading-relaxed max-w-2xl space-y-3">
            <p>{product.description}</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>100% Premium Combed Cotton</li>
              <li>Machine washable at 30°C</li>
              <li>Regular / Slim fit depending on style</li>
              <li>Reinforced stitching at stress points</li>
            </ul>
          </div>
        )}

        {activeTab === "reviews" && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-xl">
                All Reviews{" "}
                <span className="text-gray-400 font-normal text-base">
                  ({reviews.length})
                </span>
              </h3>
              <button suppressHydrationWarning className="bg-black text-white text-sm font-semibold px-6 py-3 rounded-full hover:bg-gray-800 transition">
                Write a Review
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="border border-gray-200 rounded-2xl p-6 flex flex-col gap-3"
                >
                  <StarRating rating={review.rating} />
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm">{review.name}</span>
                    {review.verified && (
                      <span className="text-green-500 text-xs font-medium">✓ Verified</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    "{review.comment}"
                  </p>
                  <p className="text-xs text-gray-300">Posted on {review.date}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "faqs" && (
          <div className="max-w-2xl space-y-3">
            {[
              {
                q: "What is your return policy?",
                a: "We offer a 30-day hassle-free return policy on all unworn items with original tags.",
              },
              {
                q: "How long does shipping take?",
                a: "Standard shipping takes 3–5 business days. Express shipping (1–2 days) is available at checkout.",
              },
              {
                q: "Are the sizes true to fit?",
                a: "Generally yes. Check the size guide on each product page for measurements. We recommend one size up for oversized fit.",
              },
            ].map((faq) => (
              <details
                key={faq.q}
                className="border border-gray-200 rounded-2xl p-5 cursor-pointer group"
              >
                <summary className="font-semibold text-sm list-none flex justify-between items-center">
                  {faq.q}
                  <span className="text-gray-400 group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <p className="mt-3 text-sm text-gray-500 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        )}
      </div>

      {/* Related Products */}
      <section>
        <h2 className="text-3xl sm:text-4xl font-black uppercase text-center tracking-tight mb-10">
          You Might Also Like
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
    <NewsletterBanner />
    </>
  );
}
