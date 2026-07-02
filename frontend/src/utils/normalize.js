const asArray = (value) => {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined || value === "") return [];
  return [value];
};

const pick = (...values) =>
  values.find((value) => value !== undefined && value !== null && value !== "");

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toId = (value) => {
  const resolved = pick(value);
  if (resolved === undefined || resolved === null) return "";
  return String(resolved);
};

const normalizeStringArray = (value) =>
  asArray(value)
    .map((item) => {
      if (typeof item === "string") return item;
      if (typeof item === "number") return String(item);
      return (
        item?.name ||
        item?.label ||
        item?.title ||
        item?.value ||
        item?.hex ||
        item?.code ||
        item?.url ||
        item?.src ||
        ""
      );
    })
    .filter(Boolean);

const normalizeImageArray = (value) =>
  asArray(value)
    .map((item) => {
      if (typeof item === "string") return item;
      if (typeof item === "number") return String(item);
      return item?.url || item?.src || item?.image || item?.path || item?.file || "";
    })
    .filter(Boolean);

const normalizeReviewItem = (review = {}) => ({
  id: toId(pick(review._id, review.id, review.reviewId, review.key, review.createdAt)),
  productId: toId(pick(review.productId, review.product, review.product_id)),
  name: pick(review.name, review.user?.name, review.author?.name, review.userName, "Anonymous"),
  verified: Boolean(pick(review.verified, review.isVerified, review.verifiedPurchase)),
  rating: toNumber(pick(review.rating, review.stars, review.score), 0),
  comment: pick(review.comment, review.review, review.message, review.text, ""),
  date: pick(review.date, review.createdAt, review.postedAt, review.updatedAt, ""),
});

export const normalizeUser = (user = {}) => {
  const resolved = user?.user || user?.data?.user || user?.profile || user;

  return {
    id: toId(pick(resolved?._id, resolved?.id, resolved?.userId)),
    name: pick(
      resolved?.name,
      [resolved?.firstName, resolved?.lastName].filter(Boolean).join(" ").trim(),
      resolved?.fullName,
      resolved?.username,
      resolved?.email?.split("@")?.[0],
      "User"
    ),
    email: pick(resolved?.email, resolved?.mail, resolved?.username, ""),
    avatar: pick(resolved?.avatar, resolved?.photoURL, resolved?.image, ""),
    role: pick(resolved?.role, resolved?.type, "customer"),
    provider: pick(resolved?.provider, resolved?.oauthProvider, "email"),
    raw: resolved,
  };
};

export const normalizeProduct = (product = {}) => {
  const resolved = product?.product || product?.data?.product || product;
  const price = toNumber(pick(resolved?.price, resolved?.salePrice, resolved?.currentPrice));
  const originalPrice = toNumber(
    pick(resolved?.originalPrice, resolved?.compareAtPrice, resolved?.mrp),
    0
  );
  const rating = toNumber(pick(resolved?.rating, resolved?.avgRating, resolved?.averageRating), 0);
  const reviews = normalizeReviews(
    resolved?.reviews || resolved?.reviewList || resolved?.ratings || resolved?.feedback || []
  );

  return {
    id: toId(pick(resolved?._id, resolved?.id, resolved?.productId, resolved?.slug)),
    name: pick(
      resolved?.name,
      resolved?.title,
      resolved?.productName,
      resolved?.displayName,
      "Unnamed product"
    ),
    price,
    originalPrice: originalPrice > 0 ? originalPrice : null,
    discount:
      resolved?.discount ??
      (originalPrice > 0 && price > 0 && originalPrice > price
        ? Math.round(((originalPrice - price) / originalPrice) * 100)
        : null),
    rating,
    reviewCount: toNumber(
      pick(
        resolved?.reviewCount,
        resolved?.reviewsCount,
        resolved?.ratingsCount,
        resolved?.review_total,
        reviews.length
      )
    ),
    category: pick(
      resolved?.category?.slug,
      resolved?.category?.name,
      resolved?.category,
      resolved?.type,
      ""
    ),
    dressStyle: pick(resolved?.dressStyle, resolved?.style, resolved?.collection, ""),
    colors: normalizeStringArray(resolved?.colors || resolved?.colorOptions || resolved?.variants?.colors),
    sizes: normalizeStringArray(resolved?.sizes || resolved?.sizeOptions || resolved?.variants?.sizes),
    images: normalizeImageArray(
      resolved?.images ||
        resolved?.gallery ||
        resolved?.media ||
        resolved?.photos ||
        resolved?.thumbnail ||
        resolved?.image
    ),
    description: pick(
      resolved?.description,
      resolved?.shortDescription,
      resolved?.summary,
      resolved?.details,
      ""
    ),
    badge: pick(resolved?.badge, resolved?.tag, resolved?.label, null),
    inStock:
      typeof resolved?.inStock === "boolean"
        ? resolved.inStock
        : typeof resolved?.stock === "number"
        ? resolved.stock > 0
        : typeof resolved?.quantity === "number"
        ? resolved.quantity > 0
        : true,
    stock: toNumber(pick(resolved?.stock, resolved?.quantity, 0), 0),
    reviews,
    raw: resolved,
  };
};

export const normalizeProducts = (products = []) => asArray(products).map((product) => normalizeProduct(product));

export const normalizeReview = (review) => normalizeReviewItem(review);

export const normalizeReviews = (reviews = []) => asArray(reviews).map((review) => normalizeReviewItem(review));

export const normalizeCartItem = (item = {}) => {
  const resolved = item?.item || item?.cartItem || item;
  const product = normalizeProduct(resolved?.product || resolved);

  return {
    ...product,
    productId: product.id,
    cartItemId: toId(pick(resolved?._id, resolved?.id, resolved?.cartItemId)),
    quantity: Math.max(1, toNumber(pick(resolved?.quantity, resolved?.count, 1), 1)),
    size: pick(resolved?.size, resolved?.selectedSize, ""),
    color: pick(resolved?.color, resolved?.selectedColor, ""),
  };
};

export const normalizeCartItems = (items = []) => asArray(items).map((item) => normalizeCartItem(item));
