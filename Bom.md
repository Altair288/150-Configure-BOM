---

# 九、数据模型

至少建立下面的数据类型。

## Product

```text
Product
├── id
├── number
├── name
├── revision
└── status
```

## BOM

```text
Bom
├── id
├── productId
├── revision
├── name
└── rootItem
```

## BOM Item

```text
BomItem
├── id
├── materialId
├── materialNumber
├── name
├── quantity
├── unit
├── level
├── parentId
├── children
└── selectionCondition
```

## Feature

```text
Feature
├── id
├── code
├── name
├── type
├── required
└── options
```

## Option

```text
Option
├── id
├── code
├── name
├── featureId
└── compatible
```

## Configuration Rule

```text
ConfigurationRule
├── id
├── name
├── type
├── condition
└── action
```

---

# 十、首页 / Demo 页面

初始化完成后，不要只生成一个 Hello World。

必须生成一个可以实际操作的 Demo。

首页展示：

```text
Super BOM Configurator
```

并提供：

* Dashboard
* Product
* Super BOM
* Configurator
* Features
* Variants
* Rules

---

# 十一、Super BOM Demo

创建一个完整的 Demo BOM：

```text
整车
│
├── 动力系统
│   ├── 发动机
│   │   ├── 1.5T
│   │   └── 2.0T
│   │
│   ├── 变速箱
│   │   ├── 7DCT
│   │   └── 8AT
│   │
│   └── 排气系统
│
├── 底盘系统
│   ├── 前悬架
│   ├── 后悬架
│   └── 制动系统
│
└── 内饰系统
    ├── 普通座椅
    ├── 真皮座椅
    ├── 座椅加热
    └── 座椅通风
```

使用 UI5 Tree / TreeTable 展示。

必须支持：

* 展开
* 折叠
* 节点选择
* 当前节点高亮
* 层级显示
* BOM Item 属性查看
* 数量
* 单位
* 物料编号
* 状态

---

# 十二、超级 BOM 配置器页面

重点创建：

```text
/configurator/[productId]
```

页面采用典型企业级三栏布局：

```text
┌─────────────────────────────────────────────────────────────┐
│ Product / BOM Header                         Save  Publish  │
├────────────────┬──────────────────────────────┬─────────────┤
│                │                              │             │
│ BOM Structure  │ Configuration / BOM         │ Properties  │
│                │                              │             │
│ ▼ 整车         │ BOM Items                   │ Material    │
│   ▼ 动力系统    │                              │             │
│     发动机     │ Engine       2.0T            │ Number      │
│     变速箱     │ Gearbox      8AT             │ Name        │
│   ▼ 底盘       │ Exhaust      Performance     │ Quantity    │
│   ▼ 内饰       │                              │ Unit        │
│                │                              │             │
└────────────────┴──────────────────────────────┴─────────────┘
```

要求：

* 左侧 BOM Tree
* 中间配置内容
* 右侧 Property Panel
* 可调整三栏宽度
* 响应式布局
* UI5 风格
* 不使用 Ant Design Layout

---

# 十三、配置逻辑 Demo

实现最基本的产品配置规则。

例如：

```text
Feature: Engine

○ 1.5T
○ 2.0T
```

当选择：

```text
2.0T
```

自动：

```text
Gearbox

○ 7DCT   disabled
● 8AT    enabled
```

并且：

```text
Exhaust
→ Performance Exhaust
```

自动加入最终 BOM。

再增加：

```text
Seat

○ Fabric
○ Leather
```

选择：

```text
Leather
```

后：

```text
Seat Heating
Seat Ventilation
```

可以继续选择。

---

# 十四、最终 BOM

增加：

```text
Configuration Result
```

展示：

```text
Selected Configuration
        ↓
Resolved Rules
        ↓
Generated BOM
```

显示最终 BOM：

```text
001 Vehicle
├── 010 Powertrain
│   ├── Engine 2.0T
│   ├── Gearbox 8AT
│   └── Performance Exhaust
│
├── 020 Chassis
│   ├── Front Suspension
│   └── Rear Suspension
│
└── 030 Interior
    ├── Leather Seat
    ├── Seat Heating
    └── Seat Ventilation
```

---

# 十五、测试要求

初始化完成后必须自动执行：

```bash
npm install
npm run lint
npm run typecheck
npm run test
npm run build
```

如果 package.json 没有对应 script，请补充。

增加：

```text
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run build
```

---

# 十六、UI5 专项测试

必须验证以下组件至少能够正常渲染和交互：

### 基础组件

* Button
* Input
* Select
* CheckBox
* Switch
* Dialog
* MessageStrip

### 企业应用组件

* Table
* Tree
* TreeTable
* Toolbar
* SideNavigation
* ShellBar
* ObjectPage / DynamicPage
* Form

### 交互

至少测试：

1. Button click
2. Input change
3. Select change
4. Tree node selection
5. Tree expand/collapse
6. Table row selection
7. Dialog open/close
8. BOM node selection
9. Feature selection
10. Option disabled state
11. Configuration result更新

---

# 十七、Playwright E2E

至少建立：

```text
tests/e2e/
├── smoke.spec.ts
├── bom.spec.ts
└── configurator.spec.ts
```

Smoke Test：

```text
打开首页
↓
页面正常加载
↓
导航到 Super BOM
↓
BOM Tree 正常显示
↓
点击节点
↓
Properties 正常显示
```

Configurator Test：

```text
打开 Configurator
↓
选择 2.0T
↓
7DCT disabled
↓
8AT available
↓
选择 Leather
↓
Seat Heating available
↓
生成最终 BOM
↓
检查最终 BOM 内容
```

---

# 十八、ESLint

使用现代 ESLint Flat Config。

不要使用已经废弃的 `.eslintrc`。

配置：

* Next.js
* React
* TypeScript

要求：

* no unused variables
* no unused imports
* no explicit any（除非有明确理由）
* React hooks rules
* TypeScript strict rules

---

# 十九、TypeScript

启用：

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

尽可能避免：

```typescript
any
```

业务数据必须定义明确 interface / type。

---

# 二十、CSS

不要引入第三方 UI Framework。

优先：

* CSS Modules
* global CSS
* UI5 CSS custom properties
* CSS variables

允许使用：

```css
var(...)
```

利用 UI5/Fiori 的设计 token。

不要大量写固定颜色。

---

# 二十一、响应式设计

重点保证桌面端：

```text
1280 × 720
1440 × 900
1920 × 1080
```

正常。

Super BOM Configurator 是桌面优先的工程应用。

移动端不需要优先适配，但不能完全崩坏。

---

# 二十二、可访问性

遵循 UI5 / Fiori 的 accessibility 思路。

重点检查：

* keyboard navigation
* focus
* aria
* accessible name
* button semantics
* table semantics

不要通过 div + click 自己模拟 UI5 控件。

---

# 二十三、代码质量

要求：

* 不重复代码
* 组件职责单一
* 页面不直接承担复杂业务逻辑
* BOM engine 与 UI 分离
* Configuration engine 与 UI 分离
* API 与 UI 分离
* Store 与 UI 分离

推荐：

```text
UI
 ↓
Feature Hook
 ↓
Store / Query
 ↓
Domain Logic
 ↓
API
```

而不是：

```text
Page
 └── 1000 lines of everything
```

---

# 二十四、最终验收

项目生成完成后，请不要只告诉我“项目创建成功”。

必须实际执行：

```bash
npm install
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run build
```

并检查：

### Framework

* [ ] Next.js 正常
* [ ] React 正常
* [ ] TypeScript 正常
* [ ] ESLint 正常
* [ ] production build 正常

### UI5

* [ ] UI5 Web Components 正常加载
* [ ] @ui5/webcomponents-react 正常
* [ ] UI5 Theme 正常
* [ ] UI5 icons 正常
* [ ] UI5 Table 正常
* [ ] UI5 Tree / TreeTable 正常
* [ ] UI5 Dialog 正常
* [ ] UI5 Form 正常
* [ ] UI5 SideNavigation 正常
* [ ] UI5 ShellBar 正常

### Application

* [ ] Dashboard
* [ ] Product
* [ ] Super BOM
* [ ] Configurator
* [ ] Feature
* [ ] Variant
* [ ] Rule

### BOM

* [ ] Tree 展开
* [ ] Tree 折叠
* [ ] BOM 节点选择
* [ ] Property Panel
* [ ] BOM Item 展示

### Configuration

* [ ] Feature 选择
* [ ] Option 选择
* [ ] Option disable
* [ ] Configuration Rule
* [ ] Configuration Result
* [ ] Final BOM

### Testing

* [ ] Unit Test
* [ ] Integration Test
* [ ] E2E Test
* [ ] Build Test

---

# 二十五、重要原则

如果某个技术选择存在多个方案：

1. 优先官方推荐方案。
2. 优先当前稳定版本。
3. 优先 TypeScript 支持完整的方案。
4. 优先 Next.js App Router 原生方案。
5. 优先 UI5 官方 React integration。
6. 不为了“方便”引入 Ant Design。
7. 不为了“方便”引入第二套 UI Framework。
8. 不要自行实现 UI5 已经存在的组件。
9. 不要使用 RC / Beta 版本。
10. 遇到 UI5 与 Next.js SSR / hydration 问题，应优先解决架构边界，而不是关闭检查或大量使用 hack。

---

# 二十六、完成后的输出

完成项目后，请向我汇报：

1. 实际安装的 Node.js 版本
2. 实际安装的 Next.js 版本
3. React 版本
4. TypeScript 版本
5. UI5 Web Components 版本
6. @ui5/webcomponents-react 版本
7. TanStack Query 版本
8. Zustand 版本
9. 测试框架版本

以及：

```text
npm run lint       → PASS/FAIL
npm run typecheck  → PASS/FAIL
npm run test       → PASS/FAIL
npm run test:e2e   → PASS/FAIL
npm run build      → PASS/FAIL
```

如果任何一项失败：

* 不要隐藏错误
* 分析原因
* 修复
* 重新执行
* 最终确保项目处于可运行状态

最后给出完整项目目录树以及启动命令。
