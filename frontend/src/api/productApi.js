const API_BASE = "http://localhost:8000/api/products";

export const fetchProducts = async () => {
  const res = await fetch(API_BASE);
  const data = await res.json();
  return data.products;
};
