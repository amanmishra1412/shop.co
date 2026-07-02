"use client";

import { useMemo, useState } from "react";
import { useCart } from "@/context/CartContext";
import StarRating from "@/components/common/StarRating";
import ProductCard from "@/components/common/ProductCard";
import NewsletterBanner from "@/components/common/NewsletterBanner";
import { getReviewsByProduct } from "@/data/reviews";
import { getRelatedProducts } from "@/data/products";
import { normalizeProduct, normalizeReviews } from "@/utils/normalize";

const formatReviewDate = () =>
  new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

export default function ProductDetailClient({ product }) {
  const { addToCart } = useCart();
  const normalizedProduct = useMemo(() => normalizeProduct(product), [product]);
  const productImages = useMemo(
    () => (normalizedProduct.images.length ? normalizedProduct.images : ["/file.svg"]),
    [normalizedProduct.images]
  );
  const availableSizes = useMemo(
    () => (normalizedProduct.sizes.length ? normalizedProduct.sizes : ["One Size"]),
    [normalizedProduct.sizes]
  );
  const availableColors = useMemo(
    () => (normalizedProduct.colors.length ? normalizedProduct.colors : ["#111111"]),
    [normalizedProduct.colors]
  );

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(availableSizes[0]);
  const [selectedColor, setSelectedColor] = useState(availableColors[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("reviews");
  const [added, setAdded] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewDraft, setReviewDraft] = useState({ name: "", rating: 5, comment: "" });
  const [reviews, setReviews] = useState(() =>
    normalizeReviews(
      normalizedProduct.reviews.length
        ? normalizedProduct.reviews
        : getReviewsByProduct(normalizedProduct.id)
    )
  );

  const related = useMemo(
    () =>
      getRelatedProducts(normalizedProduct.id, 4).map((item) => normalizeProduct(item)).filter(Boolean),
    [normalizedProduct.id]
  );

  const handleAddToCart = () => {
    addToCart(normalizedProduct, quantity, selectedSize, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleReviewSubmit = (event) => {
    event.preventDefault();

    const nextReview = {
      id: `local-${Date.now()}`,
      productId: normalizedProduct.id,
      name: reviewDraft.name.trim() || "You",
      verified: false,
      rating: Number(reviewDraft.rating),
      comment: reviewDraft.comment.trim(),
      date: formatReviewDate(),
    };

    if (!nextReview.comment) return;

    setReviews((current) => [nextReview, ...current]);
    setReviewDraft({ name: "", rating: 5, comment: "" });
    setShowReviewForm(false);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
        <p className="text-sm text-gray-400 mb-8">
          Home &rsaquo; Shop &rsaquo;{" "}
          <span className="text-black font-medium">{normalizedProduct.name}</span>
        </p>

        <div className="flex flex-col lg:flex-row gap-10 mb-16">
          <div className="flex flex-col-reverse sm:flex-row gap-4 lg:w-[45%]">
            <div className="flex sm:flex-col gap-3 shrink-0">
              {productImages.map((img, i) => (
                <button
                  key={`${img}-${i}`}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    selectedImage === i ? "border-black" : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            <div className="flex-1 bg-[#F2F0F1] rounded-2xl overflow-hidden">
              <img
                src={productImages[selectedImage] || productImages[0]}
                alt={normalizedProduct.name}
                className="w-full h-full min-h-[380px] object-cover"
              />
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            <h1 className="text-3xl sm:text-4xl font-black uppercase leading-tight tracking-tight mb-3">
              {normalizedProduct.name}
            </h1>

            <div className="flex items-center gap-2 mb-5">
              <StarRating rating={normalizedProduct.rating || 0} size="md" />
              <span className="text-sm text-gray-500">
                {normalizedProduct.rating || 0}/5 ({reviews.length} Reviews)
              </span>
            </div>

            <div className="flex items-center gap-3 mb-5">
              <span className="text-3xl font-bold">${normalizedProduct.price}</span>
              {normalizedProduct.originalPrice ? (
                <span className="text-xl text-gray-400 line-through">
                  ${normalizedProduct.originalPrice}
                </span>
              ) : null}
              {normalizedProduct.discount ? (
                <span className="bg-red-100 text-red-600 text-sm font-semibold px-3 py-1 rounded-full">
                  -{normalizedProduct.discount}%
                </span>
              ) : null}
            </div>

            <p className="text-gray-500 text-sm leading-relaxed mb-5 pb-5 border-b border-gray-200">
              {normalizedProduct.description}
            </p>

            <div className="mb-5 pb-5 border-b border-gray-200">
              <p className="text-sm text-gray-500 mb-3 font-medium">Select Colors</p>
              <div className="flex gap-3 flex-wrap">
                {availableColors.map((color) => (
                  <button
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

            <div className="mb-6 pb-6 border-b border-gray-200">
              <p className="text-sm text-gray-500 mb-3 font-medium">Choose Size</p>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map((size) => (
                  <button
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

            <div className="flex items-center gap-4">
              <div className="flex items-center bg-[#F0F0F0] rounded-full overflow-hidden">
                <button
                  onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                  className="w-11 h-11 flex items-center justify-center hover:bg-gray-200 transition text-xl font-bold"
                >
                  -
                </button>
                <span className="px-4 font-semibold text-base min-w-[2.5rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((current) => current + 1)}
                  className="w-11 h-11 flex items-center justify-center hover:bg-gray-200 transition text-xl font-bold"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className={`flex-1 py-4 rounded-full font-semibold text-base transition-all ${
                  added ? "bg-green-500 text-white" : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                {added ? "Added to Cart" : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-200 mb-10">
          <div className="flex gap-10 max-w-7xl">
            {[
              { label: "Product Details", id: "details" },
              { label: "Rating & Reviews", id: "reviews" },
              { label: "FAQs", id: "faqs" },
            ].map((tab) => (
              <button
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

        <div className="mb-16">
          {activeTab === "details" && (
            <div className="text-sm text-gray-600 leading-relaxed max-w-2xl space-y-3">
              <p>{normalizedProduct.description}</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>100% Premium Combed Cotton</li>
                <li>Machine washable at 30 C</li>
                <li>Regular / Slim fit depending on style</li>
                <li>Reinforced stitching at stress points</li>
              </ul>
            </div>
          )}

          {activeTab === "reviews" && (
            <div>
              <div className="flex items-center justify-between mb-6 gap-4">
                <h3 className="font-bold text-xl">
                  All Reviews{" "}
                  <span className="text-gray-400 font-normal text-base">({reviews.length})</span>
                </h3>
                <button
                  onClick={() => setShowReviewForm((current) => !current)}
                  className="bg-black text-white text-sm font-semibold px-6 py-3 rounded-full hover:bg-gray-800 transition"
                >
                  {showReviewForm ? "Close Form" : "Write a Review"}
                </button>
              </div>

              {showReviewForm && (
                <form
                  onSubmit={handleReviewSubmit}
                  className="border border-gray-200 rounded-2xl p-5 mb-8 grid gap-4 max-w-2xl"
                >
                  <div className="grid sm:grid-cols-2 gap-4">
                    <label className="grid gap-1 text-sm">
                      <span className="font-medium text-gray-600">Name</span>
                      <input
                        value={reviewDraft.name}
                        onChange={(event) =>
                          setReviewDraft((current) => ({ ...current, name: event.target.value }))
                        }
                        className="border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-black"
                        placeholder="Your name"
                      />
                    </label>
                    <label className="grid gap-1 text-sm">
                      <span className="font-medium text-gray-600">Rating</span>
                      <select
                        value={reviewDraft.rating}
                        onChange={(event) =>
                          setReviewDraft((current) => ({ ...current, rating: event.target.value }))
                        }
                        className="border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-black bg-white"
                      >
                        {[5, 4, 3, 2, 1].map((value) => (
                          <option key={value} value={value}>
                            {value} Star{value > 1 ? "s" : ""}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <label className="grid gap-1 text-sm">
                    <span className="font-medium text-gray-600">Comment</span>
                    <textarea
                      rows={4}
                      value={reviewDraft.comment}
                      onChange={(event) =>
                        setReviewDraft((current) => ({ ...current, comment: event.target.value }))
                      }
                      className="border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-black resize-none"
                      placeholder="Share your experience"
                    />
                  </label>

                  <div className="flex justify-end">
                    <button className="bg-black text-white rounded-full px-5 py-3 text-sm font-semibold">
                      Submit Review
                    </button>
                  </div>
                </form>
              )}

              <div className="grid sm:grid-cols-2 gap-5">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border border-gray-200 rounded-2xl p-6 flex flex-col gap-3"
                  >
                    <StarRating rating={review.rating} />
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm">{review.name}</span>
                      {review.verified ? (
                        <span className="text-green-500 text-xs font-medium">Verified</span>
                      ) : null}
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed">{review.comment}</p>
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
                  a: "Standard shipping takes 3-5 business days. Express shipping (1-2 days) is available at checkout.",
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
                    <span className="text-gray-400 group-open:rotate-180 transition-transform">
                      v
                    </span>
                  </summary>
                  <p className="mt-3 text-sm text-gray-500 leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
          )}
        </div>

        <section>
          <h2 className="text-3xl sm:text-4xl font-black uppercase text-center tracking-tight mb-10">
            You Might Also Like
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      </div>
      <NewsletterBanner />
    </>
  );
}
