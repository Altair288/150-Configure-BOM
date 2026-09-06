import { features, product } from "../mock/catalog";
import type { TechnicalRequirement, ResolvedSpecification } from "../model/types";

export function specificationResolver(
  requirements: TechnicalRequirement[]
): ResolvedSpecification[] {
  return product.domains.flatMap<ResolvedSpecification>((domain) => {
    const domainRequirements = requirements.filter((r) =>
      features.some((f) => f.id === r.feature && f.domain === domain.id)
    );
    if (domain.id === "ACCESSORY") {
      return domainRequirements
        .filter((r) => ["FENDER", "REAR_RACK", "LIGHT"].includes(r.feature))
        .map((r) => {
          const style =
            r.feature === "FENDER"
              ? domainRequirements.find((candidate) => candidate.feature === "FENDER_STYLE")
              : undefined;
          return {
            id: r.feature,
            domain: domain.id,
            label: features.find((f) => f.id === r.feature)!.name,
            required: r.value === true,
            requirements: style && r.value === true ? [r, style] : [r]
          };
        });
    }
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
