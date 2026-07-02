"use client";

import { useState } from "react";
import StarRating from "@/components/common/StarRating";
import { testimonials } from "@/data/categories";
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon } from "@/components/common/Icons";

export default function TestimonialsSlider() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => Math.max(0, c - 1));
  const next = () => setCurrent((c) => Math.min(testimonials.length - 1, c + 1));

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tight">
            Our Happy Customers
          </h2>
          <div className="flex gap-2 shrink-0">
            <button suppressHydrationWarning
              onClick={prev}
              disabled={current === 0}
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 transition text-lg"
              aria-label="Previous"
            >
              <ArrowLeftIcon className="h-4 w-4" />
            </button>
            <button suppressHydrationWarning
              onClick={next}
              disabled={current >= testimonials.length - 1}
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 transition text-lg"
              aria-label="Next"
            >
              <ArrowRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="overflow-hidden">
          <div
            className="testimonial-track transition-transform duration-500 ease-in-out"
            style={{ "--testimonial-index": current }}
          >
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="testimonial-card border border-gray-200 rounded-2xl p-7 flex flex-col gap-3"
              >
                <StarRating rating={t.rating} size="md" />
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base">{t.name}</span>
                  <CheckIcon className="h-4 w-4 text-green-500" />
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">&quot;{t.comment}&quot;</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
