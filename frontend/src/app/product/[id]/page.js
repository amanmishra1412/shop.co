import { GetProductById, GetProductsAll  } from "@/utils/Products";
import { notFound } from "next/navigation";
import ProductDetailClient from "@/components/product/ProductDetailClient";

export async function generateStaticParams({params}) {
  const {id} = await params;
  const { product } = await GetProductById(id);
  return product;
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const { product } = await GetProductById(id);
  if (!product) return { title: "Product Not Found" };
  return {
    title: `${product.name} — SHOP.CO`,
    description: product.description,
  };
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  const { product } = await GetProductById(id);
  if (!product) notFound();
  return <ProductDetailClient product={product} />;
}
