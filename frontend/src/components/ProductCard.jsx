import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const [selectedVariant, setSelectedVariant] = useState(
    product?.variants?.[0] || null
  );

  if (!product || !selectedVariant) return null;

  const hasDiscount =
    selectedVariant.mrp && selectedVariant.mrp > selectedVariant.price;

  const discountPercent = hasDiscount
    ? Math.round(
        ((selectedVariant.mrp - selectedVariant.price) /
          selectedVariant.mrp) *
          100
      )
    : 0;

  const isOutOfStock =
    selectedVariant.stock === 0 || !selectedVariant.isAvailable;

  const isLowStock =
    selectedVariant.stock > 0 && selectedVariant.stock <= 5;

  return (
    <div className="p-3 sm:p-4 border rounded-xl hover:shadow-md transition flex flex-col h-full relative bg-white">
      
      {/* 🔖 Discount Badge */}
      {hasDiscount && (
        <span className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded">
          {discountPercent}% OFF
        </span>
      )}

      {/* ⏱ Delivery Time */}
      <span className="absolute top-2 right-2 bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
        {product.deliveryTime || "8 mins"}
      </span>

      {/* 🖼 Image + Name */}
      <Link to={`/product/${product._id}`}>
        <img
          src={
            selectedVariant.image ||
            product.images?.[0]?.url ||
            "https://via.placeholder.com/150"
          }
          alt={product.name}
          className="rounded-lg w-full h-40 sm:h-48 md:h-52 object-contain"
        />

        <h3 className="mt-2 font-semibold text-sm sm:text-base line-clamp-2">
          {product.name}
        </h3>

        {/* 📝 Product Description */}
        {product.description && (
          <p className="mt-1 text-gray-500 text-xs sm:text-sm line-clamp-2">
            {product.description}
          </p>
        )}
      </Link>

      {/* 📦 Variant Selector */}
      {product.variants?.length > 1 && (
        <select
          value={selectedVariant.label}
          onChange={(e) =>
            setSelectedVariant(
              product.variants.find(
                (v) => v.label === e.target.value
              )
            )
          }
          className="mt-2 border rounded px-2 py-1 text-xs w-full"
        >
          {product.variants.map((v) => (
            <option key={v.label} value={v.label}>
              {v.label}
            </option>
          ))}
        </select>
      )}

      {/* ⚠️ Stock Info */}
      {isOutOfStock ? (
        <p className="mt-2 text-xs text-red-600 font-semibold">
          Out of stocks
        </p>
      ) : isLowStock ? (
        <p className="mt-2 text-xs text-orange-600 font-semibold">
          Only {selectedVariant.stock} left
        </p>
      ) : null}

      {/* 💰 Price + ADD */}
      <div className="flex items-center justify-between mt-3">
        <div>
          {hasDiscount && (
            <p className="text-gray-400 text-xs line-through">
              ₹{selectedVariant.mrp}
            </p>
          )}
          <p className="text-green-600 font-bold text-sm sm:text-base">
            ₹{selectedVariant.price}
          </p>
        </div>

        <button
          disabled={isOutOfStock}
          onClick={() =>
            addToCart({
              productId: product._id,
              name: product.name,
              image:
                selectedVariant.image ||
                product.images?.[0]?.url,
              variant: selectedVariant,
            })
          }
          className={`w-20 text-xs sm:text-sm py-1.5 rounded-lg font-semibold
            ${
              isOutOfStock
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "border border-green-600 text-green-600 hover:bg-green-50"
            }`}
        >
          {isOutOfStock ? "SOLD" : "ADD"}
        </button>
      </div>
    </div>
  );
};

export default React.memo(ProductCard);
