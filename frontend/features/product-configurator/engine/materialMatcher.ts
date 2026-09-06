import { materials } from "../mock/catalog";
import type { ResolvedSpecification, MaterialMatchResult, Material } from "../model/types";

export function materialMatcher(
  spec: ResolvedSpecification,
  decisions: Record<string, string>,
  catalog: Material[] = materials
): MaterialMatchResult {
  if (!spec.required) return { specification: spec, candidates: [], status: "NOT_REQUIRED" };
  const candidates = catalog.filter(
    (material) =>
      material.category === spec.domain &&
      spec.requirements.length > 0 &&
      spec.requirements.every((requirement) =>
        material.features.some(
          (feature) =>
            feature.feature === requirement.feature && feature.value === requirement.value
        )
      )
  );
  const selected =
    candidates.length === 1
      ? candidates[0]
      : candidates.find((candidate) => candidate.code === decisions[spec.id]);
  return {
    specification: spec,
    candidates,
    selected,
    status: selected ? "MATCHED" : candidates.length ? "AMBIGUOUS" : "NO_MATCH"
  };
}
