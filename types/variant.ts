export type VariantStatus = "Active" | "Draft" | "Archived";

export interface Variant {
  id: string;
  name: string;
  code: string;
  productId: string;
  status: VariantStatus;
  createdBy: string;
  updatedAt: string;
  selections: Record<string, string[]>;
}