import type { ConfigurationStore } from "../../model/configuration";
import { tr } from "../../util/configurationUi";

export type ContextTreeRow = {
  kind: "category" | "context";
  id: string;
  name: string;
  code: string;
  nodeText: string;
  icon: string;
  statusText: string;
  statusState: string;
  children: ContextTreeRow[];
};

const contextCategories = [
  "Automotive",
  "Bicycle",
  "Aircraft",
  "High-speed Rail",
  "Industrial Equipment",
  "HVAC",
  "Automation",
  "Energy Equipment",
  "Electronics",
  "Medical Equipment",
  "Construction Equipment"
];

export function buildContextTreeRows(
  store: ConfigurationStore,
  search: string,
  category: string,
  contextStatus: string
): ContextTreeRow[] {
  const normalizedSearch = search.toLowerCase();
  const matches = store.contexts.filter(
    (context) =>
      (category === "All Categories" || context.category === category) &&
      (contextStatus === "All Statuses" || context.status === contextStatus) &&
      `${context.name} ${context.code}`.toLowerCase().includes(normalizedSearch)
  );
  return contextCategories.flatMap((categoryName) => {
    const contexts = matches.filter((context) => context.category === categoryName);
    if (!contexts.length) return [];
    return [
      {
        kind: "category" as const,
        id: `category-${categoryName}`,
        name: tr(categoryName),
        code: `${contexts.length}`,
        nodeText: `${tr(categoryName)} (${contexts.length})`,
        icon: "sap-icon://folder-blank",
        statusText: "",
        statusState: "None",
        children: contexts.map((context) => ({
          kind: "context" as const,
          id: context.id,
          name: context.name,
          code: `${context.code} · V${String(context.version).padStart(2, "0")}`,
          nodeText: `${context.name} · ${context.code} · V${String(context.version).padStart(2, "0")}`,
          icon: "sap-icon://product",
          statusText: tr(context.status),
          statusState:
            context.status === "Released"
              ? "Success"
              : context.status === "Draft"
                ? "Information"
                : "None",
          children: []
        }))
      }
    ];
  });
}
