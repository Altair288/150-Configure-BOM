import { materials } from "../mock/catalog";
import type {
  Configuration,
  ConfiguredBom,
  ConfiguredBomLine,
  Material,
  ResolvedSpecification
} from "../model/types";
import { resolveConfiguration } from "./resolve";

export function bomAssembler(
  configuration: Configuration,
  warningsAccepted = false
): ConfiguredBom {
  const resolution = resolveConfiguration(configuration);
  if (!resolution.valid) throw new Error("配置尚未完成，请解决冲突和物料匹配问题。");
  if (!warningsAccepted && resolution.rules.some((r) => r.status === "Warning"))
    throw new Error("请确认配置警告后再生成 BOM。");
  const expand = (
    material: Material,
    spec: ResolvedSpecification,
    path: string,
    quantity = 1,
    ancestors: string[] = []
  ): ConfiguredBomLine => {
    if (ancestors.includes(material.code)) throw new Error(`物料 BOM 循环：${material.code}`);
    const children = material.bom?.lines.map((line, index) => {
      const child = materials.find((m) => m.code === line.materialCode);
      if (!child) throw new Error(`物料 BOM 缺少 ${line.materialCode}`);
      return expand(child, spec, `${path}/${index}`, line.quantity, [...ancestors, material.code]);
    });
    return {
      id: path,
      number: material.code,
      name: material.name,
      materialId: material.code,
      quantity,
      unit: "EA",
      lifecycle: "Released",
      changeStatus: "",
      state: "已解析",
      kind: children ? "Assembly" : "Part",
      visible: true,
      visualState: "Loaded",
      geometryKey: material.geometryKey,
      color: material.color,
      sourceSpecification: spec.id,
      rule: spec.requirements.map((r) => `${r.feature}=${r.value}`).join(" · "),
      ...(children ? { children } : {})
    };
  };
  const modules = resolution.matches
    .filter((m) => m.selected)
    .map((m) => expand(m.selected!, m.specification, `bike/${m.specification.id}`));
  const core = modules.filter(
    (m) =>
      m.sourceSpecification !== "LIGHT" &&
      m.sourceSpecification !== "FENDER" &&
      m.sourceSpecification !== "REAR_RACK"
  );
  const accessories = modules.filter((m) => !core.includes(m));
  const root: ConfiguredBomLine = {
    id: "bike",
    number: "BIKE-100",
    name: "URBAN / 城市探索自行车",
    materialId: "URBAN",
    quantity: 1,
    unit: "SET",
    lifecycle: "Released",
    changeStatus: "",
    state: "配置完成",
    kind: "Product",
    visualState: "Loaded",
    visible: true,
    rule: `配置草稿 R${configuration.revision} · 规格解析与物料装配`,
    children: core
  };
  if (accessories.length)
    core.push({
      ...root,
      id: "bike/accessories",
      number: "AC-400",
      name: "通勤附件",
      kind: "Assembly",
      rule: "附件独立需求",
      children: accessories
    });
  const count = (nodes: ConfiguredBomLine[]): number =>
    nodes.reduce((n, node) => n + (node.children ? count(node.children) : node.quantity), 0);
  return {
    id: `CFG-URBAN-R${configuration.revision}`,
    revision: configuration.revision,
    nodes: [root],
    partCount: count([root]),
    moduleCount: modules.length
  };
}
