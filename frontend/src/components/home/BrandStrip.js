import { brands } from "@/data/categories";

export default function BrandStrip() {
  return (
    <section className="bg-black py-9 overflow-hidden">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex items-center justify-between gap-6 flex-wrap">
          {brands.map((brand) => (
            <span
              key={brand}
              className="text-white font-black text-xl sm:text-2xl lg:text-3xl tracking-tight whitespace-nowrap"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
