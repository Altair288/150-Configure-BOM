import { getBom } from "@/features/bom/api/bom-api";
import { configurationRules } from "@/mocks/configuration";
import { demoFeatures } from "@/mocks/feature";
import { getProduct } from "@/features/product/api/product-api";
import type { Bom } from "@/types/bom";
import type { ConfigurationRule } from "@/types/configuration";
import type { Feature } from "@/types/feature";
import type { Product } from "@/types/product";

export interface ConfiguratorData {
  product: Product;
  bom: Bom;
  features: Feature[];
  rules: ConfigurationRule[];
}

export async function getConfiguratorData(productId: string): Promise<ConfiguratorData> {
  const product = await getProduct(productId);
  const bom = await getBom(product.bomId);

  return {
    product,
    bom,
    features: demoFeatures,
    rules: configurationRules,
  };
}