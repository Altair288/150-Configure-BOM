import { useMemo, useState, useSyncExternalStore } from "react";
import { product, features, marketingFeatures, materials, templates } from "../mock/catalog";
import { store } from "../model/store";
import { resolveConfiguration } from "../engine/resolve";
import {
  Badge,
  MatchSummary,
  TraceDialog,
  LivePreview,
  valueLabel,
  statusLabel
} from "../components/ResolutionPanels";
import type { ConfiguredBom, DomainId, WorkspacePage } from "../model/types";

export interface WorkspaceOptions {
  onNavigate: (page: WorkspacePage) => void;
  onOpenBom: (bom: ConfiguredBom) => void;
}
export default function Workspace({ onNavigate, onOpenBom }: WorkspaceOptions) {
  const state = useSyncExternalStore(store.subscribe, store.getSnapshot);
  const resolution = useMemo(
    () => resolveConfiguration(state.configuration),
    [state.configuration]
  );
  const [tab, setTab] = useState<"marketing" | "technical">("marketing");
  const [domain, setDomain] = useState<DomainId | "ALL">("ALL");
  const [reviewTab, setReviewTab] = useState("match");
  const [explain, setExplain] = useState<string>();
  const [ackRevision, setAckRevision] = useState(0);
  const [error, setError] = useState("");
  const warnings = resolution.rules.filter((r) => r.status === "Warning");
  const conflicts = resolution.rules.filter((r) => r.status === "Conflict");
  const navigate = (page: WorkspacePage) => {
    onNavigate(page);
    setError("");
  };
  const openBom = () => {
    if (state.generated) onOpenBom(state.generated);
  };
  const generate = () => {
    try {
      store.generate(ackRevision === state.configuration.revision);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };
  return (
    <div className="fc-app">
      <header className="fc-header">
        <div>
          <div className="fc-eyebrow">产品配置工作台 / FEATURE-DRIVEN CONFIGURATION</div>
          <h1>
            URBAN <span>/ 城市探索自行车</span>
          </h1>
        </div>
        <div className="fc-header-meta">
          <Badge tone="info">{product.revision}</Badge>
          <span>草稿 R{state.configuration.revision}</span>
          <span className="fc-muted">会话内保存</span>
        </div>
      </header>
      <nav className="fc-steps" aria-label="配置流程">
        {(["products", "configure", "review"] as WorkspacePage[]).map((page, i) => (
          <button
            key={page}
            className={state.page === page ? "active" : ""}
            aria-current={state.page === page ? "step" : undefined}
            onClick={() => navigate(page)}
          >
            <b>0{i + 1}</b>
            {["选择产品", "产品选配", "解析与确认"][i]}
          </button>
        ))}
        <button disabled={!state.generated} onClick={openBom}>
          <b>04</b>Configured BOM
        </button>
      </nav>
      {state.page === "products" ? (
        <main className="fc-home fc-scroll">
          <section className="fc-product">
            <div>
              <Badge tone="success">可配置产品</Badge>
              <h2>URBAN / 城市探索自行车</h2>
              <p>从使用意图出发，定义车架、轮组、传动与附件需求，解析匹配的物料并生成产品装配。</p>
              <p className="fc-muted">
                产品编号 URBAN · 版本 A.01 · 4 个配置域 · {features.length} 个特征
              </p>
            </div>
            <button className="fc-primary" onClick={() => navigate("configure")}>
              开始配置 →
            </button>
          </section>
          <div className="fc-home-grid">
            <section className="fc-panel">
              <div className="fc-section-title">
                产品架构 <span>Configuration Domains</span>
              </div>
              {product.domains.map((d) => (
                <details key={d.id} className="fc-domain-detail">
                  <summary>
                    <b>{d.id}</b> {d.name}
                    <span>{features.filter((f) => f.domain === d.id).length} 个特征</span>
                  </summary>
                  <p>{d.description}</p>
                  <table>
                    <thead>
                      <tr>
                        <th>Feature</th>
                        <th>名称</th>
                        <th>合法取值</th>
                      </tr>
                    </thead>
                    <tbody>
                      {features
                        .filter((f) => f.domain === d.id)
                        .map((f) => (
                          <tr key={f.id}>
                            <td className="fc-code">{f.id}</td>
                            <td>{f.name}</td>
                            <td>{f.options.map((o) => String(o.value)).join(" / ")}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </details>
              ))}
            </section>
            <section className="fc-panel">
              <div className="fc-section-title">
                典型配置 <span>从模板开始，可继续修改</span>
              </div>
              {templates.map((t) => (
                <div className="fc-template" key={t.id}>
                  <div>
                    <h3>{t.name}</h3>
                    <p>{t.description}</p>
                  </div>
                  <button
                    onClick={() => {
                      store.template(t.id);
                      setTab("marketing");
                      setDomain("ALL");
                      navigate("configure");
                    }}
                  >
                    使用此配置
                  </button>
                </div>
              ))}
            </section>
          </div>
          <section className="fc-method">
            <b>配置解析链路</b>
            <span>营销意图 → 技术需求 → 规格解析 → 物料匹配 → 物料 BOM 装配 → 100% BOM</span>
          </section>
        </main>
      ) : state.page === "configure" ? (
        <div className="fc-workbench">
          <aside className="fc-domains">
            <div className="fc-section-title">产品模块</div>
            <button className={domain === "ALL" ? "active" : ""} onClick={() => setDomain("ALL")}>
              整车配置
            </button>
            {product.domains.map((d) => (
              <button
                key={d.id}
                className={domain === d.id ? "active" : ""}
                onClick={() => {
                  setDomain(d.id);
                  setTab("technical");
                }}
              >
                <small>{d.id}</small>
                {d.name}
              </button>
            ))}
            <div className="fc-side-note">配置域定义需求问题。物料在规格解析后确定。</div>
          </aside>
          <main className="fc-editor fc-scroll">
            <div className="fc-tabs" role="tablist" aria-label="选配方式">
              <button
                role="tab"
                aria-selected={tab === "marketing"}
                className={tab === "marketing" ? "active" : ""}
                onClick={() => setTab("marketing")}
              >
                营销配置
              </button>
              <button
                role="tab"
                aria-selected={tab === "technical"}
                className={tab === "technical" ? "active" : ""}
                onClick={() => setTab("technical")}
              >
                技术配置 <Badge>{Object.keys(state.configuration.overrides).length} 项覆盖</Badge>
              </button>
            </div>
            {tab === "marketing" ? (
              <div className="fc-fields">
                <div className="fc-intro">
                  <h2>客户想买什么？</h2>
                  <p>营销选择生成技术推荐；显式修改过的技术参数保留，冲突将在右侧提示。</p>
                </div>
                {marketingFeatures.map((feature) => (
                  <fieldset key={feature.id}>
                    <legend>{feature.name}</legend>
                    {feature.options.map((option) => (
                      <label
                        key={option.value}
                        className={`fc-choice ${state.configuration.marketing[feature.id] === option.value ? "selected" : ""}`}
                      >
                        <input
                          type="radio"
                          name={feature.id}
                          checked={state.configuration.marketing[feature.id] === option.value}
                          onChange={() => store.marketing({ [feature.id]: option.value })}
                        />
                        <span>
                          <b>{option.label}</b>
                          <small>{option.description}</small>
                        </span>
                      </label>
                    ))}
                  </fieldset>
                ))}
                <fieldset>
                  <legend>舒适配置</legend>
                  {features
                    .filter((f) => f.domain === "ACCESSORY")
                    .map((f) => (
                      <label className="fc-check" key={f.id}>
                        <input
                          type="checkbox"
                          checked={
                            state.configuration.marketing[f.id as "FENDER" | "REAR_RACK" | "LIGHT"]
                          }
                          onChange={(e) => store.marketing({ [f.id]: e.target.checked })}
                        />
                        {f.name}
                      </label>
                    ))}
                </fieldset>
                <button
                  onClick={() => {
                    setTab("technical");
                    setDomain("ALL");
                  }}
                >
                  查看推荐的技术配置 →
                </button>
              </div>
            ) : (
              <div className="fc-fields">
                <div className="fc-line">
                  <div>
                    <h2>技术需求</h2>
                    <p className="fc-muted">调整特征值后重新运行规则与物料匹配。</p>
                  </div>
                  <button
                    disabled={!Object.keys(state.configuration.overrides).length}
                    onClick={() => store.resetOverride()}
                  >
                    全部恢复营销推荐
                  </button>
                </div>
                {product.domains
                  .filter((d) => domain === "ALL" || d.id === domain)
                  .map((d) => (
                    <section className="fc-feature-group" key={d.id}>
                      <h3>
                        {d.name} <small>{d.id}</small>
                      </h3>
                      {features
                        .filter((f) => f.domain === d.id)
                        .map((f) => {
                          const r = resolution.requirements.find((r) => r.feature === f.id)!;
                          return (
                            <div className="fc-feature-row" key={f.id}>
                              <label htmlFor={`feature-${f.id}`}>
                                <b>{f.name}</b>
                                <small>{f.id}</small>
                              </label>
                              <div>
                                <select
                                  id={`feature-${f.id}`}
                                  value={String(r.value)}
                                  onChange={(e) =>
                                    store.technical(
                                      f.id,
                                      f.options.find((o) => String(o.value) === e.target.value)!
                                        .value
                                    )
                                  }
                                >
                                  {f.options.map((o) => (
                                    <option key={String(o.value)} value={String(o.value)}>
                                      {o.label}
                                    </option>
                                  ))}
                                </select>
                                <small className="fc-source">{r.sourceLabel}</small>
                              </div>
                              <div>
                                <Badge tone={r.source === "technical" ? "warning" : "info"}>
                                  {r.source === "technical" ? "技术覆盖" : "营销推荐"}
                                </Badge>
                                {r.source === "technical" && (
                                  <button
                                    className="fc-link"
                                    onClick={() => store.resetOverride(f.id)}
                                  >
                                    恢复推荐
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                    </section>
                  ))}
                <p className="fc-muted">
                  样例覆盖：铝合金＋舒适车架有多个候选；钢车架暂无满足规格的物料。
                </p>
              </div>
            )}
            <div className="fc-editor-footer">
              <span>
                {resolution.valid
                  ? "规格已解析，可进入确认"
                  : `${resolution.blockers.length} 项待处理，可查看解析详情`}
              </span>
              <button className="fc-primary" onClick={() => navigate("review")}>
                应用配置 · 查看解析 →
              </button>
            </div>
          </main>
          <aside className="fc-status fc-scroll">
            <div className="fc-section-title">
              实时配置状态{" "}
              <Badge tone={resolution.valid ? "success" : "danger"}>
                {resolution.valid ? "可生成" : "待处理"}
              </Badge>
            </div>
            <div className="fc-status-counts">
              <b>{resolution.matches.filter((m) => m.status === "MATCHED").length}</b> 已匹配{" "}
              <span>
                {conflicts.length} 冲突 / {warnings.length} 警告
              </span>
            </div>
            {resolution.rules
              .filter((r) => !r.passed)
              .map((r) => (
                <div
                  className={`fc-rule-alert ${r.status === "Conflict" ? "danger" : "warning"}`}
                  key={r.rule.id}
                >
                  <b>
                    {r.status === "Conflict" ? "配置冲突" : "配置警告"} · {r.rule.id}
                  </b>
                  <p>{r.rule.message}</p>
                  <button onClick={() => store.applyFix(r.rule.fix)}>采用推荐配置</button>
                </div>
              ))}
            {resolution.matches.map((match) => (
              <MatchSummary key={match.specification.id} match={match} onExplain={setExplain} />
            ))}
            <LivePreview resolution={resolution} />
          </aside>
        </div>
      ) : (
        <main className="fc-review fc-scroll">
          <div className="fc-review-head">
            <div>
              <h2>配置解析与确认</h2>
              <p className="fc-muted">检查需求来源、解析规格与物料决策，再组合物料自身的 BOM。</p>
            </div>
            <Badge tone={resolution.valid ? "success" : "danger"}>
              {resolution.valid ? "解析完成" : `${resolution.blockers.length} 项待处理`}
            </Badge>
          </div>
          <div className="fc-tabs" role="tablist" aria-label="解析详情">
            {[
              ["requirements", "Requirement"],
              ["specifications", "Specification"],
              ["match", "Material Match"],
              ["trace", "Rule Trace"]
            ].map(([key, name]) => (
              <button
                role="tab"
                aria-selected={reviewTab === key}
                key={key}
                className={reviewTab === key ? "active" : ""}
                onClick={() => setReviewTab(key)}
              >
                {name}
              </button>
            ))}
          </div>
          {reviewTab === "requirements" && (
            <section className="fc-panel">
              <table>
                <thead>
                  <tr>
                    <th>Feature</th>
                    <th>技术需求</th>
                    <th>来源</th>
                    <th>映射规则</th>
                  </tr>
                </thead>
                <tbody>
                  {resolution.requirements.map((r) => (
                    <tr key={r.feature}>
                      <td className="fc-code">{r.feature}</td>
                      <td>
                        {valueLabel(r)} <small>{String(r.value)}</small>
                      </td>
                      <td>{r.sourceLabel}</td>
                      <td className="fc-code">{r.ruleId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}
          {reviewTab === "specifications" && (
            <div className="fc-spec-grid">
              {resolution.specifications.map((s) => (
                <section className="fc-panel" key={s.id}>
                  <div className="fc-section-title">
                    {s.label}
                    <Badge>{s.id}</Badge>
                  </div>
                  <p className="fc-code">
                    {s.requirements.map((r) => `${r.feature} = ${r.value}`).join("\n")}
                  </p>
                  <p className="fc-muted">
                    {s.required
                      ? "全部特征精确匹配后，确定模块物料。"
                      : "无此附件需求，不发起物料匹配。"}
                  </p>
                </section>
              ))}
            </div>
          )}
          {reviewTab === "match" && (
            <section className="fc-panel">
              <table className="fc-match-table">
                <thead>
                  <tr>
                    <th>规格 / Requirement</th>
                    <th>Material Match / 候选决策</th>
                    <th>物料自身 BOM</th>
                    <th>状态 / 解释</th>
                  </tr>
                </thead>
                <tbody>
                  {resolution.matches.map((m) => (
                    <tr key={m.specification.id}>
                      <td>
                        <b>{m.specification.label}</b>
                        <div className="fc-code">
                          {m.specification.requirements
                            .map((r) => `${r.feature}=${r.value}`)
                            .join("\n")}
                        </div>
                      </td>
                      <td>
                        {m.candidates.length > 1 ? (
                          <fieldset>
                            <legend>发现多个候选，请明确选择</legend>
                            {m.candidates.map((c) => (
                              <label className="fc-candidate" key={c.code}>
                                <input
                                  type="radio"
                                  name={`candidate-${m.specification.id}`}
                                  checked={m.selected?.code === c.code}
                                  onChange={() => store.decide(m.specification.id, c.code)}
                                />
                                <span>
                                  <b>{c.code}</b> {c.name}
                                </span>
                              </label>
                            ))}
                          </fieldset>
                        ) : m.selected ? (
                          <>
                            <b>{m.selected.code}</b>
                            <p>{m.selected.name}</p>
                          </>
                        ) : (
                          <p>{m.status === "NO_MATCH" ? "未找到满足当前规格的物料" : "无需匹配"}</p>
                        )}
                      </td>
                      <td>
                        {m.selected?.bom
                          ? m.selected.bom.lines.map((l) => (
                              <div key={l.materialCode}>
                                <code>{l.materialCode}</code> × {l.quantity}
                                <small>
                                  {materials.find((c) => c.code === l.materialCode)?.name}
                                </small>
                              </div>
                            ))
                          : m.selected
                            ? "独立物料"
                            : "—"}
                      </td>
                      <td>
                        <Badge
                          tone={
                            m.status === "MATCHED"
                              ? "success"
                              : m.status === "NOT_REQUIRED"
                                ? "neutral"
                                : "warning"
                          }
                        >
                          {statusLabel[m.status]}
                        </Badge>
                        <button className="fc-link" onClick={() => setExplain(m.specification.id)}>
                          为什么选择？
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}
          {reviewTab === "trace" && (
            <section className="fc-panel">
              <table>
                <thead>
                  <tr>
                    <th>规则</th>
                    <th>条件 → 约束</th>
                    <th>执行状态</th>
                    <th>说明 / 推荐</th>
                  </tr>
                </thead>
                <tbody>
                  {resolution.rules.map((r) => (
                    <tr key={r.rule.id}>
                      <td>
                        <code>{r.rule.id}</code>
                        <small>{r.rule.type}</small>
                      </td>
                      <td className="fc-code">
                        {r.rule.when.feature} = {String(r.rule.when.value)}
                        <br />↓<br />
                        {r.rule.then.feature} {r.rule.then.operator} {String(r.rule.then.value)}
                      </td>
                      <td>
                        <Badge
                          tone={
                            r.status === "Conflict"
                              ? "danger"
                              : r.status === "Warning"
                                ? "warning"
                                : "success"
                          }
                        >
                          {r.status}
                        </Badge>
                        <small>{r.triggered ? "已触发" : "条件未触发"}</small>
                      </td>
                      <td>
                        {r.rule.message}
                        {!r.passed && (
                          <button className="fc-link" onClick={() => store.applyFix(r.rule.fix)}>
                            采用推荐配置
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}
          <section className="fc-confirm">
            <div>
              <h3>配置确认</h3>
              {resolution.blockers.length > 0 ? (
                <ul className="fc-blockers">
                  {resolution.blockers.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              ) : (
                <p>全部必需规格已确定物料。生成时展开模块物料自身的 BOM，组合为整车装配。</p>
              )}
              {warnings.length > 0 && (
                <label className="fc-check">
                  <input
                    type="checkbox"
                    checked={ackRevision === state.configuration.revision}
                    onChange={(e) =>
                      setAckRevision(e.target.checked ? state.configuration.revision : 0)
                    }
                  />
                  <span>
                    已知悉 {warnings.length} 项警告：
                    {warnings.map((w) => w.rule.message).join("；")}
                  </span>
                </label>
              )}
              {error && (
                <p role="alert" className="fc-error">
                  {error}
                </p>
              )}
              {state.generated && (
                <p role="status" className="fc-success">
                  已生成 {state.generated.id} · {state.generated.partCount} 件零件 · 当前 R
                  {state.generated.revision}
                </p>
              )}
            </div>
            <div className="fc-actions">
              <button onClick={() => navigate("configure")}>返回修改配置</button>
              <button
                className="fc-primary"
                disabled={
                  !resolution.valid ||
                  (warnings.length > 0 && ackRevision !== state.configuration.revision)
                }
                onClick={generate}
              >
                生成 Configured BOM
              </button>
              <button disabled={!state.generated} onClick={openBom}>
                查看最终 BOM →
              </button>
            </div>
          </section>
        </main>
      )}
      <footer className="fc-footer">
        <span>URBAN · Feature → Requirement → Specification → Material → BOM</span>
        <span>{state.generated ? "当前配置已有生成结果" : "配置变更后需重新生成 BOM"}</span>
      </footer>
      {explain && (
        <TraceDialog
          resolution={resolution}
          specId={explain}
          onClose={() => setExplain(undefined)}
        />
      )}
    </div>
  );
}
