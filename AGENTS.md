# Super BOM Configurator Agent 指南

## 项目概览

这是 SAPUI5 1.152 + TypeScript 的 Super BOM 配置管理原型。应用使用 UI5 Component、XML View/Fragment、Router、MVC Controller、JSONModel 和 ResourceModel；CAD Viewer 通过独立的 Chili3D/Three.js/OCCT WASM bundle 集成。功能实现应沿用当前 SAP Fiori 企业工作台的紧凑布局和交互风格。

开始任务前，先读取相关 View/Fragment、Controller、Model、Service 和附近测试。不要只根据截图或需求描述推断现有行为；从页面入口跟到实际拥有状态和行为的模块。

## 目录与职责

- `webapp/Component.ts` 注册应用模型、i18n ResourceModel 并初始化 Router；不要把业务规则放进 Component。
- `webapp/view/` 与 `webapp/view/fragment/` 定义 XML 页面壳、导航和布局；保持现有 XML 组合方式。
- `webapp/controller/` 协调路由、页面状态和业务动作。较复杂的工作区界面放在 `webapp/controller/configuration/*View.ts` 等已有角色化文件中，不要把大型交互继续堆进单一 Controller。
- `webapp/model/` 保存配置上下文、产品、Feature Model 和 Constraint AST 的领域类型及纯校验逻辑。
- `webapp/service/` 放持久化、规则仓库和可替换服务边界。Mock 服务必须是本地确定性实现，不得暗中请求网络。
- `webapp/css/` 保存工作台样式；复用当前 SAP Horizon 主题变量和局部 class，不覆盖 UI5 全局样式。
- `viewer/` 是 Chili3D Viewer bundle 入口；`webapp/blueprint/` 是 Rete 蓝图 bundle 入口。UI5 通过 Host/handle 与独立 bundle 通信，保持两者边界。
- `webapp/vendor/` 是构建输出，不手工编辑生成的 JS/WASM 文件。
- 根 `.copilot-instructions.md` 提供 Rete.js 专项参考；涉及蓝图时按需遵循，不在这里复制整份 Rete API 指南。

## UI5 开发流程

1. 查明页面所属的 Component、XML Fragment、Controller 和子视图生命周期。模式切换、路由变化或 `destroyItems()` 会影响动态创建控件；清理 Rete/DOM/事件监听时使用对应的 `dispose`/`destroy` 路径。
2. 先选择合适的交互语义，再选择 SAPUI5 控件。项目没有固定控件白名单：可按任务使用 `sap.m`、`sap.f`、`sap.ui.table`、`sap.ui.layout` 或已安装库中的合适控件。不要为了遵守示例列表强行使用某个控件，也不要用普通文本框替代已有的结构化选择能力。
3. 新增或不熟悉的 UI5 API 前，使用 UI5 API Reference/MCP 核对当前项目版本 1.152 的属性、aggregation、事件和可用性。优先参考本项目中已经存在的构造方式。
4. 控件和数据通过模型绑定或明确的事件回调连接；不要让 DOM 文本成为业务状态。新 TypeScript 控件事件处理器优先使用控件导出的 `<Control>$<Event>Event` 类型；继承事件应使用其实际声明模块中的事件类型。
5. 标签、说明、校验状态和键盘可达性应与控件一并实现。异步操作要有明确的忙碌、成功、空状态和错误状态；AI 生成内容不得自动保存或生效。
6. 用户可见文案沿用现有中文/英文用语和 i18n 约定。新增本地化文案时更新 `webapp/i18n/` 中对应的所有现有 locale 文件，不把业务文案硬编码到共享通用控件中。
7. 样式保持克制、紧凑、可扫描并适配窄视口。优先布局约束和 SAP 主题变量；避免大面积装饰卡片、渐变、过度圆角和抢占业务内容的 AI 视觉。

## 数据与领域约定

- `webapp/model/configuration.ts` 是 Feature Model 的来源；规则编辑器只能使用当前 Configuration Context 实际引用的 Feature Definition 和其活动 Value Domain，不允许把自由输入的 Feature 名称当成有效引用。
- 修改本地配置状态时遵循 `ConfigurationController.commit()` 的 copy → validate → persist → update 流程。尊重现有 `storageKey`、数据校验和向后兼容迁移，不覆盖用户已保存的有效定义。
- 约束功能以 `webapp/model/constraintRules.ts` 的 `ConstraintRuleAst` 为单一规则语义来源。表达式文本是 AST 的格式化视图；蓝图布局是 AST 的可视化投影；Mock AI 只生成待审核的 AST 草稿。三者不得各自建立互不相干的规则副本。
- 规则按 Configuration Context 隔离。修改 AST 后实时验证 Feature、Value、Operator、关系和循环依赖；保存时重新执行完整校验。
- AI 本阶段只能使用 `MockConstraintAIService`。不得添加真实模型 SDK、外部 API 请求或遥测上报。生成结果只有用户选择“应用”后才可进入 `ConstraintRuleRepository`。
- 规则执行引擎和生产后端未在本阶段实现；不要把 UI 原型校验描述为生产规则执行。

## 蓝图与 Viewer 边界

- 保留现有 Rete/Lit 节点、连线、Scopes、网格、右键菜单和 socket-position watcher 行为；规则编辑通过 `loadConstraintAST`、`exportConstraintAST` 和变更回调与统一 AST 同步。
- 节点渲染、Area transform、context menu 和 Shadow DOM 有各自定位/样式边界；新增 CSS 选择器应限定到专属 Host/Area class，避免覆盖 Rete 插件或 UI5 overlay。
- 不要从 UI5 Controller 直接操作 Three.js 内部对象；通过现有 ChiliPreview Host 与独立 Viewer 接口通信。
- 依赖新增或升级前检查包的版本、peer dependency 和许可证；尤其不要绕过 Rete 插件自身的许可限制。

## 构建与验证

```bash
npm start                 # 构建 Viewer/Blueprint 并启动 UI5 开发服务器
npm run build:viewer       # 构建 Chili3D Viewer bundle
npm run build:blueprint    # 构建 Rete Blueprint bundle
npm run typecheck          # TypeScript 检查
npm run lint               # ESLint
npm run test:configuration # Configuration、Feature Model、Constraint AST/Service 测试
npm test                   # typecheck + lint + test:configuration
npm run build              # Viewer + Blueprint + UI5 生产构建
npm run format:check       # 全仓 Prettier 检查
```

改动后先运行最窄的测试/构建，再运行 `npm test` 和 `npm run build`。UI 交互变化还需在 `http://localhost:<port>/index.html` 的实际页面验证：页签切换、键盘/列表操作、Feature 值域、规则保存、表达式与蓝图双向同步、AI 审核/应用，以及浏览器控制台错误。全仓格式检查若报告未触及文件，不要顺手重排；对本次修改文件做定向 Prettier 检查即可。
