import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";

const ProductDetails = () => {
  const { id } = useParams();
  const { cart, addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    // Fetch product by ID
    const fetchProduct = async () => {
      const res = await fetch(`http://localhost:8000/api/products/${id}`);
      const data = await res.json();
      setProduct(data);

      // Fetch some random related products (for carousel)
      const relatedRes = await fetch("http://localhost:8000/api/products");
      const relatedData = await relatedRes.json();
      setSuggestions(relatedData.slice(0, 10)); // show top 10 suggestions
    };
    fetchProduct();
  }, [id]);

  if (!product) return <p className="text-center mt-10">Loading...</p>;

  const inCart = cart.some((item) => item._id === product._id);

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Product Details */}
      <div className="flex flex-col md:flex-row gap-8">
        <img
          src={product.image}
          alt={product.name}
          className="w-full md:w-1/2 rounded-lg shadow-md"
        />

        <div className="flex-1 space-y-3">
          <h2 className="text-3xl font-semibold">{product.name}</h2>
          <p className="text-gray-500 text-sm">{product.quantity}</p>
          <p className="text-green-600 font-bold text-2xl">₹{product.price}</p>
          <p className="text-sm text-gray-600">🚚 Delivery in 8 minutes</p>

          {inCart ? (
            <Link
              to="/cart"
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg inline-block"
            >
              Go to Cart
            </Link>
          ) : (
            <button
              onClick={() => addToCart(product)}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
            >
              Add to Cart
            </button>
          )}

          <div className="mt-6">
            <h3 className="font-semibold text-lg mb-2">Product Description</h3>
            <p className="text-gray-700 text-sm">{product.description}</p>
          </div>
        </div>
      </div>

      {/* You May Also Like */}
      <div className="mt-12">
        <h3 className="text-xl font-semibold mb-4">You may also like</h3>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide">
          {suggestions.map((item) => (
            <Link
              key={item._id}
              to={`/product/${item._id}`}
              className="min-w-[150px] border rounded-lg p-3 hover:shadow-md transition bg-white"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-28 object-contain mb-2"
              />
              <h4 className="text-sm font-semibold">{item.name}</h4>
              <p className="text-xs text-gray-500">{item.quantity}</p>
              <p className="text-green-600 font-bold text-sm">₹{item.price}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
