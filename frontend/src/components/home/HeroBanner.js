import Link from "next/link";

function Sparkle({ className }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute z-20 block bg-black ${className}`}
      style={{
        clipPath:
          "polygon(50% 0%, 61% 35%, 100% 50%, 61% 65%, 50% 100%, 39% 65%, 0% 50%, 39% 35%)",
      }}
    />
  );
}

export default function HeroBanner() {
  return (
    <section className="overflow-hidden bg-[#F2F0F1]">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid min-h-[600px] items-end gap-4 pt-12 lg:grid-cols-[0.88fr_1.12fr] lg:gap-0 lg:pt-0">
          <div className="z-10 flex flex-col justify-center pb-6 lg:py-16">
            <h1 className="max-w-[610px] text-[42px] font-black uppercase leading-[0.96] tracking-tight sm:text-6xl lg:text-[62px] xl:text-[68px]">
              Find Clothes
              <br />
              That Matches
              <br />
              Your Style
            </h1>
            <p className="mt-5 max-w-[535px] text-sm leading-relaxed text-gray-500 sm:text-base">
              Browse through our diverse range of meticulously crafted garments,
              designed to bring out your individuality and cater to your sense
              of style.
            </p>
            <Link
              href="/shop"
              className="mt-8 inline-flex h-[52px] w-full items-center justify-center rounded-full bg-black px-10 text-sm font-semibold text-white transition hover:bg-gray-900 sm:w-auto sm:min-w-[210px] sm:text-base"
            >
              Shop Now
            </Link>

            <div className="mt-9 grid grid-cols-2 gap-x-8 gap-y-5 border-t border-gray-300 pt-7 sm:flex sm:flex-wrap sm:gap-x-10">
              {[
                { value: "200+", label: "International Brands" },
                { value: "2,000+", label: "High-Quality Products" },
                { value: "30,000+", label: "Happy Customers" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className={stat.value === "30,000+" ? "col-span-2 sm:col-span-1" : ""}
                >
                  <p className="text-[28px] font-black leading-none sm:text-3xl">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-xs text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex min-h-[450px] w-full items-end justify-center self-end sm:min-h-[580px] lg:min-h-[640px]">
            <Sparkle className="right-[7%] top-[12%] h-16 w-16 sm:h-20 sm:w-20 lg:right-[7%] lg:top-[22%] lg:h-[74px] lg:w-[74px]" />
            <Sparkle className="left-[6%] top-[48%] h-9 w-9 sm:h-12 sm:w-12 lg:left-[20%] lg:top-[53%] lg:h-12 lg:w-12" />
            <img
              src="/images/HeroBannerPic.jpg"
              alt="Fashion hero"
              className="h-[430px] w-auto max-w-none object-contain object-bottom sm:h-[585px] lg:h-[700px] lg:translate-x-16"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
