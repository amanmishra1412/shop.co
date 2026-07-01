import Link from "next/link";
import ProductCard from "@/components/common/ProductCard";

export default function ProductSection({ title, products, viewAllHref = "/shop" }) {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <h2 className="text-4xl sm:text-5xl font-black uppercase text-center tracking-tight mb-12">
          {title}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href={viewAllHref}
            className="inline-block border border-black text-black font-semibold px-16 py-4 rounded-full hover:bg-black hover:text-white transition text-sm"
          >
            View All
          </Link>
        </div>
      </div>
    </section>
  );
}
