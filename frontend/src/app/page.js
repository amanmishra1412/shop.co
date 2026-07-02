import HeroBanner from "@/components/home/HeroBanner";
import BrandStrip from "@/components/home/BrandStrip";
import ProductSection from "@/components/home/ProductSection";
import DressStyleGrid from "@/components/home/DressStyleGrid";
import TestimonialsSlider from "@/components/home/TestimonialsSlider";
import NewsletterBanner from "@/components/common/NewsletterBanner";
import { GetProductsAll } from "@/utils/Products";

export const metadata = {
  title: "SHOP.CO - Find Clothes That Match Your Style",
  description:
    "Shop the latest fashion trends. From casual wear to formal outfits, find your perfect style at SHOP.CO.",
};

export default async function HomePage() {
  const { products } = await GetProductsAll();
  const catalog = products.length ? products : [];
  const newArrivals = catalog.slice(0, 4);
  const topSelling = catalog.slice(4, 8);

  return (
    <>
      <HeroBanner />
      <BrandStrip />
      <ProductSection title="New Arrivals" products={newArrivals} viewAllHref="/shop?filter=new" />
      <div className="border-t border-gray-200 max-w-7xl mx-auto" />
      <ProductSection title="Top Selling" products={topSelling} viewAllHref="/shop?sort=top" />
      <DressStyleGrid />
      <TestimonialsSlider />
      <NewsletterBanner />
    </>
  );
}

