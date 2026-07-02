const asArray = (value) => {
    if (Array.isArray(value)) return value;
    if (value === null || value === undefined || value === "") return [];
    return [value];
};

const pick = (...values) => values.find((value) => value !== undefined && value !== null && value !== "");

const toId = (value) => {
    const resolved = pick(value);
    return resolved === undefined || resolved === null ? "" : String(resolved);
};

const toNumber = (value, fallback = 0) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeStringArray = (value) =>
    asArray(value)
        .map((item) => {
            if (typeof item === "string") return item;
            if (typeof item === "number") return String(item);
            return item?.name || item?.label || item?.title || item?.value || item?.hex || item?.code || "";
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

export const normalizeUser = (user = {}) => {
    const resolved = user?.user || user?.userData || user?.userDetail || user?.data?.user || user;

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
        provider: pick(resolved?.authProvider, resolved?.provider, resolved?.oauthProvider, "local"),
        raw: resolved,
    };
};

export const normalizeProduct = (product = {}) => {
    const resolved = product?.product || product?.data?.product || product;
    const price = toNumber(pick(resolved?.price, resolved?.salePrice, resolved?.currentPrice));
    const discount = toNumber(pick(resolved?.discount, 0));
    const rating = toNumber(pick(resolved?.rating, resolved?.avgRating, resolved?.averageRating), 0);
    const reviewCount = toNumber(pick(resolved?.reviews, resolved?.reviewCount, resolved?.reviewTotal), 0);

    return {
        id: toId(pick(resolved?._id, resolved?.id, resolved?.productId, resolved?.slug)),
        name: pick(resolved?.name, resolved?.title, resolved?.productName, "Unnamed product"),
        price,
        originalPrice: null,
        discount: discount > 0 ? discount : null,
        rating,
        reviewCount,
        category: pick(resolved?.category?.slug, resolved?.category?.name, resolved?.category, resolved?.type, ""),
        dressStyle: pick(resolved?.dressStyle, resolved?.style, resolved?.collection, ""),
        colors: normalizeStringArray(resolved?.colors || resolved?.colorOptions || resolved?.variants?.colors),
        sizes: normalizeStringArray(resolved?.sizes || resolved?.sizeOptions || resolved?.variants?.sizes),
        images: normalizeImageArray(resolved?.images || resolved?.gallery || resolved?.media || resolved?.photos),
        description: pick(resolved?.description, resolved?.shortDescription, resolved?.summary, ""),
        badge: pick(resolved?.badge, resolved?.tag, resolved?.label, null),
        inStock:
            typeof resolved?.stock === "number" ? resolved.stock > 0 : typeof resolved?.inStock === "boolean" ? resolved.inStock : true,
        stock: toNumber(pick(resolved?.stock, 0), 0),
        raw: resolved,
    };
};

export const normalizeProducts = (products = []) => asArray(products).map((product) => normalizeProduct(product));

export const normalizeReviews = (reviews = []) =>
    asArray(reviews).map((review) => ({
        id: toId(pick(review._id, review.id, review.reviewId, review.key)),
        name: pick(review.name, review.user?.name, review.author?.name, "Anonymous"),
        verified: Boolean(pick(review.verified, review.isVerified, review.verifiedPurchase)),
        rating: toNumber(pick(review.rating, review.stars, review.score), 0),
        comment: pick(review.comment, review.review, review.message, review.text, ""),
        date: pick(review.date, review.createdAt, review.postedAt, review.updatedAt, ""),
    }));

export const normalizeCartItem = (item = {}) => {
    const resolved = item?.item || item?.cartItem || item;
    const productSource =
        resolved?.productId && typeof resolved.productId === "object"
            ? resolved.productId
            : resolved?.product || resolved;
    const product = normalizeProduct(productSource);
    const cartItemId = toId(pick(resolved?._id, resolved?.id, resolved?.cartItemId, resolved?.itemId));

    return {
        id: product.id,
        cartItemId: cartItemId || `${product.id}-${resolved?.size || ""}-${resolved?.color || ""}`,
        productId: product.id,
        name: product.name,
        price: toNumber(pick(resolved?.price, product.price), product.price),
        images: product.images,
        rating: product.rating,
        reviewCount: product.reviewCount,
        quantity: Math.max(1, toNumber(pick(resolved?.quantity, resolved?.count, 1), 1)),
        size: pick(resolved?.size, resolved?.selectedSize, ""),
        color: pick(resolved?.color, resolved?.selectedColor, ""),
        raw: resolved,
    };
};

export const normalizeCartItems = (items = []) => asArray(items).map((item) => normalizeCartItem(item));

export const normalizeCart = (cart = {}) => {
    const resolved = cart?.cart || cart?.data?.cart || cart;

    return {
        id: toId(pick(resolved?._id, resolved?.id)),
        items: normalizeCartItems(resolved?.items || []),
        subtotal: toNumber(resolved?.subtotal, 0),
        discountAmount: toNumber(resolved?.discountAmount, 0),
        deliveryFee: toNumber(resolved?.deliveryFee, 0),
        total: toNumber(resolved?.total, 0),
        raw: resolved,
    };
};