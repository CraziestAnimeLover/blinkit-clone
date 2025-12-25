import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../../components/ProductCard";

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products`);
      setProducts(res.data.products);
    })();
  }, []);

  return (
    <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {products?.map((p) => (
        <ProductCard key={p._id} productId={p._id} />
      ))}
    </div>
  );
};

export default Products;
