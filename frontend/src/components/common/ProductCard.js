import Link from "next/link";
import StarRating from "./StarRating";
import { normalizeProduct } from "@/utils/normalize";

export default function ProductCard({ product }) {
  const normalized = normalizeProduct(product);
  const { id, name, price, originalPrice, discount, rating, reviewCount, images } = normalized;
  const imageSrc = images?.[0] || "/file.svg";

  return (
    <Link href={`/product/${id}`} className="group block">
      {/* Image */}
      <div className="relative bg-[#F0F0F0] rounded-2xl overflow-hidden aspect-square mb-3">
        <img
          src={imageSrc}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {discount && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
            -{discount}%
          </span>
        )}
      </div>

      {/* Info */}
      <div>
        <h3 className="font-semibold text-sm sm:text-base text-black leading-tight mb-1 truncate">
          {name}
        </h3>
        <div className="flex items-center gap-1 mb-1">
          <StarRating rating={rating} />
          <span className="text-xs text-gray-500">
            {rating}/5 {reviewCount ? `(${reviewCount})` : ""}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-base">${price}</span>
          {originalPrice && (
            <span className="text-sm text-gray-400 line-through">${originalPrice}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
