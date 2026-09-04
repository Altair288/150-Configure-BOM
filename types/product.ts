export type ProductStatus = "Released" | "In Configuration" | "Draft";

export interface Product {
  id: string;
  number: string;
  name: string;
  revision: string;
  status: ProductStatus;
  description: string;
  bomId: string;
}