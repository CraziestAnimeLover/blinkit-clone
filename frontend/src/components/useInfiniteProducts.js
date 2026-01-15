import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchProducts = async ({ pageParam = 1 }) => {
  const res = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/api/products?page=${pageParam}&limit=10`
  );
  return res.data;
};

export const useInfiniteProducts = () => {
  return useInfiniteQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextPage : undefined,
  });
};
