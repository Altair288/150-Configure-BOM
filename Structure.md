# Super BOM Configurator 项目初始化与技术架构要求

你是一名资深前端架构师。请从零创建一个新的 **Super BOM Configurator（超级 BOM 产品配置器）** 项目。

## 一、项目定位

这是一个独立的企业级 Web 应用，核心用于：

* 超级 BOM 展示
* BOM 多层级树形结构浏览
* BOM Item 管理
* 产品 Feature / Option 管理
* 技术选配
* 营销选配
* 配置规则
* Variant 管理
* 用户选择配置
* 根据配置结果生成最终 BOM

这是一个典型的 **PLM / Product Configuration / Variant Configuration** 类应用。

项目 UI 不使用 Ant Design。

整个前端 UI 统一采用 SAP Fiori / UI5 风格。

---

# 二、技术栈

请优先使用当前最新稳定版本，不要主动使用 RC、Beta、Canary 或 deprecated 版本。

核心技术：

* Next.js
* React
* TypeScript
* ESLint
* UI5 Web Components
* @ui5/webcomponents-react
* UI5 Web Components Fiori
* TanStack Query
* Zustand
* Zod
* Vitest
* Testing Library
* Playwright

要求：

1. 使用 Next.js App Router。
2. 使用 TypeScript strict mode。
3. 使用 React Server Components + Client Components 的 Next.js 推荐架构。
4. UI 层统一使用 `@ui5/webcomponents-react`。
5. 不安装 Ant Design。
6. 不安装 Material UI。
7. 不安装 Chakra UI。
8. 不引入其他大型 UI Framework。
9. UI5 Web Components 使用当前最新稳定 2.x。
10. `@ui5/webcomponents-react` 使用当前最新稳定版本。
11. UI5 相关 package 必须尽量保持兼容的稳定版本。
12. 所有依赖安装完成后执行版本检查。
13. 如果最新版本之间存在 peer dependency 冲突，应选择官方兼容的稳定版本，而不是强制覆盖 peer dependency。

UI5 Web Components 官方当前推荐 2.x，当前稳定版本为 2.26.0；不要主动安装 2.27.0-rc 等预发布版本。

---

# 三、推荐项目结构

创建类似下面的目录结构：

```text
super-bom-configurator/
│
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   │
│   ├── (app)/
│   │   ├── layout.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   │
│   │   ├── products/
│   │   │   └── page.tsx
│   │   │
│   │   ├── bom/
│   │   │   ├── page.tsx
│   │   │   └── [bomId]/
│   │   │       └── page.tsx
│   │   │
│   │   ├── configurator/
│   │   │   ├── page.tsx
│   │   │   └── [productId]/
│   │   │       └── page.tsx
│   │   │
│   │   ├── features/
│   │   │   └── page.tsx
│   │   │
│   │   ├── variants/
│   │   │   └── page.tsx
│   │   │
│   │   └── rules/
│   │       └── page.tsx
│   │
│   └── api/
│       └── health/
│           └── route.ts
│
├── components/
│   ├── ui/
│   │   ├── AppShell/
│   │   ├── PageHeader/
│   │   ├── DataTable/
│   │   ├── TreeTable/
│   │   ├── PropertyPanel/
│   │   ├── EmptyState/
│   │   ├── LoadingState/
│   │   └── ErrorState/
│   │
│   ├── bom/
│   │   ├── BomTree/
│   │   ├── BomTable/
│   │   ├── BomItemRow/
│   │   ├── BomToolbar/
│   │   └── BomProperties/
│   │
│   ├── configurator/
│   │   ├── FeaturePanel/
│   │   ├── FeatureGroup/
│   │   ├── OptionList/
│   │   ├── ConfigurationSummary/
│   │   ├── ConfigurationResult/
│   │   └── ConfigurationToolbar/
│   │
│   ├── product/
│   │   ├── ProductHeader/
│   │   └── ProductInfo/
│   │
│   └── layout/
│       ├── AppShell/
│       ├── SideNavigation/
│       └── Header/
│
├── features/
│   ├── bom/
│   │   ├── api/
│   │   ├── hooks/
│   │   ├── types/
│   │   ├── utils/
│   │   └── store/
│   │
│   ├── configurator/
│   │   ├── api/
│   │   ├── hooks/
│   │   ├── types/
│   │   ├── engine/
│   │   ├── store/
│   │   └── utils/
│   │
│   ├── product/
│   ├── feature/
│   ├── variant/
│   └── rule/
│
├── lib/
│   ├── api/
│   ├── query/
│   ├── validation/
│   ├── ui5/
│   └── utils/
│
├── stores/
│   ├── app-store.ts
│   ├── bom-store.ts
│   └── configurator-store.ts
│
├── types/
│   ├── bom.ts
│   ├── product.ts
│   ├── feature.ts
│   ├── variant.ts
│   └── configuration.ts
│
├── mocks/
│   ├── bom.ts
│   ├── product.ts
│   ├── feature.ts
│   └── configuration.ts
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── public/
│
├── .env.example
├── .gitignore
├── eslint.config.mjs
├── next.config.ts
├── tsconfig.json
├── vitest.config.ts
├── playwright.config.ts
├── package.json
└── README.md
```

如果某个目录当前没有实际用途，可以暂时不创建，但整体架构必须保持 feature-oriented，而不是把所有业务逻辑全部堆进 `components`。

---

# 四、UI5 使用原则

整个应用的视觉体系统一采用 UI5 / SAP Fiori。

优先使用：

* Button
* Input
* TextArea
* Select
* MultiComboBox
* ComboBox
* CheckBox
* RadioButton
* Switch
* DatePicker
* Dialog
* MessageBox
* Toast
* List
* Table
* Tree
* TreeTable
* Toolbar
* Breadcrumbs
* TabContainer
* SideNavigation
* ShellBar
* ObjectPage
* DynamicPage
* Form
* Label
* Icon
* Avatar
* Tag
* BusyIndicator

如果 UI5 Web Components React 中存在对应组件，优先使用 React wrapper。

不要自己重新实现 UI5 已经提供的基础组件。

---

# 五、UI5 Provider / 初始化

创建统一的 UI5 Provider / Theme 初始化机制。

例如：

```text
components/ui5/
```

或者：

```text
lib/ui5/
```

负责：

* UI5 theme
* language
* RTL
* density
* icon initialization
* global UI5 configuration

默认使用：

```text
Quartz
```

主题。

确保：

* Next.js development 正常
* production build 正常
* SSR 不报错
* Client Component 不产生 hydration mismatch
* UI5 Web Components 正常加载

---

# 六、Next.js 架构要求

使用 App Router。

严格区分：

### Server Component

用于：

* 页面布局
* metadata
* 服务端数据获取
* 服务端 API
* 不依赖浏览器 API 的逻辑

### Client Component

用于：

* UI5 Web Components
* Zustand
* React state
* 用户交互
* BOM Tree
* BOM Table
* Configurator
* Dialog
* Drag & Drop
* Selection

不要无意义地给整个 `app` 添加：

```tsx
"use client";
```

尽量缩小 Client Component 边界。

---

# 七、状态管理

使用 Zustand。

状态至少包括：

```text
AppState
ProductState
BomState
ConfiguratorState
SelectionState
```

例如：

```text
ConfiguratorState

selectedProduct
selectedFeatures
selectedOptions
disabledOptions
configurationErrors
configurationWarnings
configurationResult
```

不要把所有状态放在一个巨大 store 中。

---

# 八、服务端数据

使用 TanStack Query。

要求：

* query key 类型安全
* loading state
* error state
* stale time
* mutation
* optimistic update（需要时）
* query invalidation

后端 API 暂时不存在时，使用 mock API。

未来后端预计为：

```text
REST API
```

因此 API 层必须独立于 UI。

禁止在 UI Component 中直接大量编写 fetch。

---
