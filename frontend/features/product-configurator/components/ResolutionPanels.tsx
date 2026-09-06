import { useEffect, useRef } from "react";
import { product, features } from "../mock/catalog";
import { store } from "../model/store";
import { bomAssembler } from "../engine/bomAssembler";
import type {
  DomainId,
  MaterialMatchResult,
  Resolution,
  TechnicalRequirement
} from "../model/types";
export const domainName = (id: DomainId) => product.domains.find((d) => d.id === id)!.name;
export const valueLabel = (requirement: TechnicalRequirement) =>
  features
    .find((f) => f.id === requirement.feature)
    ?.options.find((o) => o.value === requirement.value)?.label ?? String(requirement.value);
export const statusLabel = {
  MATCHED: "已匹配",
  NO_MATCH: "无匹配",
  AMBIGUOUS: "待决策",
  NOT_REQUIRED: "无此需求"
};
export function Badge({
  tone = "neutral",
  children
}: {
  tone?: string;
  children: React.ReactNode;
}) {
  return <span className={`fc-badge ${tone}`}>{children}</span>;
}
export function MatchSummary({
  match,
  onExplain
}: {
  match: MaterialMatchResult;
  onExplain: (id: string) => void;
}) {
  return (
    <section className="fc-match-summary">
      <div className="fc-line">
        <strong>{match.specification.label}</strong>
        <Badge
          tone={
            match.status === "MATCHED"
              ? "success"
              : match.status === "NOT_REQUIRED"
                ? "neutral"
                : "warning"
          }
        >
          {statusLabel[match.status]}
        </Badge>
      </div>
      <div className="fc-code">
        {match.specification.requirements.map((r) => `${r.feature} = ${r.value}`).join("\n")}
      </div>
      {match.selected ? (
        <p>
          <b>{match.selected.code}</b> {match.selected.name}
        </p>
      ) : (
        <p className="fc-muted">
          {match.status === "NO_MATCH"
            ? "未找到满足当前规格的物料"
            : match.status === "AMBIGUOUS"
              ? `${match.candidates.length} 个候选，需手动选择`
              : "不装配此附件"}
        </p>
      )}
      <button className="fc-link" onClick={() => onExplain(match.specification.id)}>
        为什么{match.selected ? "选择" : "得到此结果"}？
      </button>
    </section>
  );
}
export function TraceDialog({
  resolution,
  specId,
  onClose
}: {
  resolution: Resolution;
  specId: string;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    ref.current?.showModal();
  }, []);
  const match = resolution.matches.find((m) => m.specification.id === specId)!;
  return (
    <dialog ref={ref} onCancel={onClose} className="fc-dialog" aria-labelledby="trace-title">
      <div className="fc-line">
        <h2 id="trace-title">配置来源 · {match.specification.label}</h2>
        <button aria-label="关闭来源详情" onClick={onClose}>
          关闭
        </button>
      </div>
      <ol className="fc-trace">
        <li>
          <h3>01 用户选择 / 配置意图</h3>
          {match.specification.requirements.map((r) => (
            <p key={r.feature}>
              {r.sourceLabel} → <b>{valueLabel(r)}</b>
              <small>{r.ruleId}</small>
            </p>
          ))}
        </li>
        <li>
          <h3>02 Technical Requirement</h3>
          {match.specification.requirements.map((r) => (
            <p className="fc-code" key={r.feature}>
              {r.feature} = {String(r.value)}
            </p>
          ))}
        </li>
        <li>
          <h3>03 Specification</h3>
          <p>
            {match.specification.id} · {domainName(match.specification.domain)} ·{" "}
            {match.specification.required ? "要求全部特征精确满足" : "布尔需求关闭，不请求物料"}
          </p>
        </li>
        <li>
          <h3>04 Material Match</h3>
          <p>
            {match.selected
              ? `${match.selected.code} / ${match.selected.name}`
              : statusLabel[match.status]}
          </p>
          <p>
            {match.candidates.length > 1
              ? "同规格多候选，由用户显式决策。"
              : "对照物料 Feature Schema 实例进行匹配。"}
          </p>
        </li>
        <li>
          <h3>05 Material BOM → Assembly</h3>
          <p>
            {match.selected?.bom?.lines
              .map((l) => `${l.materialCode} × ${l.quantity}`)
              .join(" / ") ||
              (match.selected ? "独立物料，直接进入最终装配" : "未确定物料，不产生 BOM 行")}
          </p>
        </li>
      </ol>
    </dialog>
  );
}
export function LivePreview({ resolution }: { resolution: Resolution }) {
  const ref = useRef<HTMLDivElement>(null);
  const configuration = store.getSnapshot().configuration;
  useEffect(() => {
    if (!ref.current || !resolution.valid || !window.ChiliCadPreview) return;
    const preview = new window.ChiliCadPreview(ref.current);
    preview.loadBom(bomAssembler(configuration, true).nodes);
    return () => preview.destroy();
  }, [configuration, resolution.valid]);
  return (
    <div>
      <div className="fc-section-title">
        配置预览 <small>示意模型</small>
      </div>
      <div ref={ref} className="fc-live-preview">
        {!resolution.valid && <p>完成规格匹配后显示三维预览</p>}
      </div>
    </div>
  );
}
