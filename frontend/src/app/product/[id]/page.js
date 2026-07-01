import { GetProductById, GetProductsAll } from "@/utils/Products";
import { notFound } from "next/navigation";
import ProductDetailClient from "@/components/product/ProductDetailClient";

// Pre-generate paths for all products at build time
export async function generateStaticParams() {
  const { products, success } = await GetProductsAll();
  if (!success || !products?.length) return [];
  return products.map((product) => ({
    id: String(product._id || product.id),
  }));
}

// Generate SEO metadata per product
export async function generateMetadata({ params }) {
  const { id } = await params;
  const { product } = await GetProductById(id);
  if (!product) return { title: "Product Not Found" };
  return {
    title: `${product.name} — SHOP.CO`,
    description: product.description || `Buy ${product.name} at SHOP.CO`,
  };
}

// Product detail page (Server Component)
export default async function ProductPage({ params }) {
  const { id } = await params;
  const { product } = await GetProductById(id);
  if (!product) notFound();
  return <ProductDetailClient product={product} />;
}
