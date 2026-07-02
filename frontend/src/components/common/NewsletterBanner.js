"use client";
import { useState } from "react";
import { CheckIcon, MailIcon } from "@/components/common/Icons";

export default function NewsletterBanner() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section className="relative z-10 mx-4 mt-12 mb-[-72px] max-w-7xl rounded-[20px] bg-black px-6 py-8 text-white sm:mx-6 sm:px-10 lg:mx-auto lg:px-16 lg:py-9">
      <div className="flex flex-col items-stretch justify-between gap-6 md:flex-row md:items-center lg:gap-16">
        {/* Heading */}
        <h2 className="max-w-[560px] text-[28px] font-black uppercase leading-[1.05] tracking-tight sm:text-4xl lg:text-[40px]">
          Stay Upto Date About Our Latest Offers
        </h2>

        {/* Form */}
        {submitted ? (
          <p className="flex items-center gap-2 text-green-400 font-semibold text-lg">
            <CheckIcon className="h-5 w-5" /> You&apos;re subscribed! Thank you.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex w-full flex-col gap-3 md:w-[350px] lg:w-[390px]"
          >
            <div className="relative">
              <MailIcon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 w-full rounded-full bg-white pl-10 pr-4 text-sm text-black outline-none"
              />
            </div>
            <button
              type="submit"
              className="h-11 w-full rounded-full bg-white text-sm font-semibold text-black transition hover:bg-gray-100"
            >
              Subscribe to Newsletter
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
