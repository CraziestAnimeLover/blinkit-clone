const API_BASE = `${import.meta.env.VITE_BACKEND_URL}/api/products`;

export const fetchProducts = async () => {
  const res = await fetch(API_BASE);
  const data = await res.json();
  return data.products;
};
