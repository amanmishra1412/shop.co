import { getProductById, products } from "@/data/products";
import { notFound } from "next/navigation";
import ProductDetailClient from "@/components/product/ProductDetailClient";

export async function generateStaticParams() {
  return products.map((p) => ({ id: String(p.id) }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) return { title: "Product Not Found" };
  return {
    title: `${product.name} — SHOP.CO`,
    description: product.description,
  };
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();
  return <ProductDetailClient product={product} />;
}
