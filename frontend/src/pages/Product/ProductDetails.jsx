import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart, openCart } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [activeImage, setActiveImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [zoomPos, setZoomPos] = useState("50% 50%");
  const [isZooming, setIsZooming] = useState(false);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`
      );
      const prod = res.data.product;
      setProduct(prod);
      setSelectedVariant(prod.variants?.[0]);
      setActiveImage(prod.images?.[0]?.url);
      setError(null);
    } catch (err) {
      setError("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadProduct();
  }, [id]);

  if (loading) return <p className="p-10 text-center">Loading...</p>;

  if (error)
    return (
      <div className="p-10 text-center text-red-500">
        <p>{error}</p>
        <Link to="/" className="text-green-600 underline">
          Go back to Home
        </Link>
      </div>
    );

  if (!product || !selectedVariant) return null;

  const hasDiscount =
    selectedVariant.mrp && selectedVariant.mrp > selectedVariant.price;
  const discountPercent = hasDiscount
    ? Math.round(((selectedVariant.mrp - selectedVariant.price) / selectedVariant.mrp) * 100)
    : 0;

  return (
    <div className="max-w-5xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* LEFT: IMAGE */}
      <div>
        <div
          className="border rounded-xl bg-white h-[420px] overflow-hidden relative"
          style={{
            backgroundImage: `url(${activeImage || "https://via.placeholder.com/400"})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: isZooming ? "200%" : "contain",
            backgroundPosition: zoomPos,
          }}
          onMouseEnter={() => setIsZooming(true)}
          onMouseLeave={() => {
            setIsZooming(false);
            setZoomPos("50% 50%");
          }}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            setZoomPos(`${x}% ${y}%`);
          }}
        >
          <img
            src={activeImage}
            alt={product.name}
            className="w-full h-full object-contain opacity-0"
          />
        </div>

        <div className="flex gap-3 mt-4">
          {product.images.map((img, index) => (
            <button
              key={index}
              onClick={() => setActiveImage(img.url)}
              className={`border rounded-lg p-2 h-20 w-20 flex items-center justify-center ${
                activeImage === img.url ? "border-green-600" : "border-gray-300"
              }`}
            >
              <img src={img.url} alt="thumb" className="object-contain max-h-full max-w-full" />
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT: INFO */}
      <div>
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-gray-500 mt-1">{product.brand}</p>
        <p className="mt-4 text-gray-700">{product.description || "No description available"}</p>

        {/* Variant Selector */}
        {product.variants.length > 1 && (
          <div className="mt-5">
            <p className="text-sm font-semibold mb-1">Select Pack Size</p>
            <select
              value={selectedVariant.label}
              onChange={(e) =>
                setSelectedVariant(
                  product.variants.find((v) => v.label === e.target.value)
                )
              }
              className="border rounded px-3 py-2 text-sm w-full"
            >
              {product.variants.map((v) => (
                <option key={v.label} value={v.label}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Price */}
        <div className="mt-6 flex items-center gap-4">
          {hasDiscount && (
            <>
              <p className="text-gray-400 text-lg line-through">₹{selectedVariant.mrp}</p>
              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                {discountPercent}% OFF
              </span>
            </>
          )}
          <p className="text-3xl font-bold text-green-600">₹{selectedVariant.price}</p>
        </div>

        {/* ADD TO CART */}
        <button
          onClick={() => {
            addToCart({
              productId: product._id,
              name: product.name,
              image: selectedVariant.image || product.images?.[0]?.url,
              variant: selectedVariant,
            });
            openCart();
          }}
          className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
        >
          ADD TO CART
        </button>
      </div>
    </div>
  );
}
