import { features, product } from "../mock/catalog";
import type { TechnicalRequirement, ResolvedSpecification } from "../model/types";

export function specificationResolver(
  requirements: TechnicalRequirement[]
): ResolvedSpecification[] {
  return product.domains.flatMap<ResolvedSpecification>((domain) => {
    const domainRequirements = requirements.filter((r) =>
      features.some((f) => f.id === r.feature && f.domain === domain.id)
    );
    if (domain.id === "ACCESSORY")
      return domainRequirements.map((r) => ({
        id: r.feature,
        domain: domain.id,
        label: features.find((f) => f.id === r.feature)!.name,
        required: r.value === true,
        requirements: [r]
      }));
    return [
      {
        id: domain.id,
        domain: domain.id,
        label: domain.name,
        required: true,
        requirements: domainRequirements
      }
    ];
  });
}
