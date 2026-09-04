"use client";

import { useQuery } from "@tanstack/react-query";
import { listProducts } from "@/features/product/api/product-api";
import type { Product } from "@/types/product";

export function useProducts(initialProducts?: Product[]) {
  return useQuery({
    queryKey: ["products"],
    queryFn: listProducts,
    initialData: initialProducts,
  });
}