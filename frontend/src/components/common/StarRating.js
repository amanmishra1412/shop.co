// Reusable star rating display component
export default function StarRating({ rating, size = "sm" }) {
  const starSize = size === "sm" ? "text-sm" : "text-base";

  return (
    <div className={`flex items-center gap-0.5 ${starSize}`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = rating >= star;
        const half = !filled && rating >= star - 0.5;
        return (
          <span
            key={star}
            className={filled ? "text-yellow-400" : half ? "text-yellow-300" : "text-gray-300"}
          >
            ★
          </span>
        );
      })}
    </div>
  );
}
