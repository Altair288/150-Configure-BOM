import { products } from "@/mocks/product";
import type { Product } from "@/types/product";

export async function listProducts(): Promise<Product[]> {
  return products;
}

export async function getProduct(productId: string): Promise<Product> {
  const product = products.find((candidate) => candidate.id === productId);

  if (!product) {
    throw new Error(`Product ${productId} was not found.`);
  }

  return product;
}