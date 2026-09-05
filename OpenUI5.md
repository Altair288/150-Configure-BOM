# SAPUI5 / OpenUI5 标准项目框架搭建规范

## 1. 项目定位

项目采用 **SAP 官方标准 SAPUI5/OpenUI5 应用架构**，不使用 React、Next.js、Ant Design、UI5 Web Components React 等 React 技术栈。

核心技术：

```text
SAPUI5 / OpenUI5
TypeScript
UI5 Tooling / UI5 CLI
XML View
MVC
Component
manifest.json
UI5 Router
UI5 Model / Binding
sap.m
sap.f
sap.ui.table
sap.ui.vk
```

官方 UI5 TypeScript 体系已经提供 `@openui5/types` / `@sapui5/types`，并且 UI5 官方推荐 TypeScript 用于提高开发效率。([UI5][1])

---

# 2. 核心架构

采用标准 UI5 MVC + Component 架构：

```text
Browser
   │
   ↓
index.html
   │
   ↓
Component
   │
   ├── manifest.json
   │
   ├── Router
   │
   ├── Models
   │
   └── Root View
          │
          ↓
      App Shell
          │
    ┌─────┴─────┐
    ↓           ↓
Navigation    Workspace
                │
       ┌────────┼────────┐
       ↓        ↓        ↓
      BOM    Config    3D VK
```

UI5 官方标准应用也是以 `Component` + `manifest.json` 为核心，manifest 负责集中描述应用、依赖、模型、路由等配置。([UI5][2])

---

# 3. 技术选型

## 3.1 UI Framework

优先：

```text
SAPUI5
```

如果项目不需要 SAP 专有控件，则：

```text
OpenUI5
```

但你的项目需要：

```text
sap.ui.vk
```

所以实际项目建议：

> **SAPUI5 + TypeScript**

而不是 OpenUI5。

---

# 4. 工程工具

使用：

```text
Node.js
npm
TypeScript
UI5 CLI
ESLint
Prettier
```

其中 UI5 CLI 是核心开发工具。

官方 UI5 教程目前也是通过：

```bash
npm install --save-dev @ui5/cli
```

然后：

```bash
ui5 init
```

建立 `ui5.yaml`。([UI5][3])

---

# 5. 项目目录

建议直接采用下面这个结构：

```text
super-bom/
│
├── webapp/
│   │
│   ├── index.html
│   ├── Component.ts
│   ├── manifest.json
│   │
│   ├── controller/
│   │   ├── BaseController.ts
│   │   ├── App.controller.ts
│   │   ├── Home.controller.ts
│   │   ├── Bom.controller.ts
│   │   ├── Configurator.controller.ts
│   │   ├── Product.controller.ts
│   │   ├── Rule.controller.ts
│   │   └── Viewer.controller.ts
│   │
│   ├── view/
│   │   ├── App.view.xml
│   │   ├── Home.view.xml
│   │   ├── Bom.view.xml
│   │   ├── Configurator.view.xml
│   │   ├── Product.view.xml
│   │   ├── Rule.view.xml
│   │   └── Viewer.view.xml
│   │
│   ├── model/
│   │   ├── models.ts
│   │   ├── formatter.ts
│   │   └── types.ts
│   │
│   ├── service/
│   │   ├── ApiService.ts
│   │   ├── BomService.ts
│   │   ├── ProductService.ts
│   │   ├── ConfiguratorService.ts
│   │   └── RuleService.ts
│   │
│   ├── component/
│   │   ├── VKViewer.ts
│   │   └── WorkspaceManager.ts
│   │
│   ├── fragment/
│   │   ├── BomFilter.fragment.xml
│   │   ├── Configurator.fragment.xml
│   │   └── ConfirmDialog.fragment.xml
│   │
│   ├── i18n/
│   │   ├── i18n.properties
│   │   ├── i18n_zh_CN.properties
│   │   ├── i18n_en.properties
│   │   └── i18n_ja.properties
│   │
│   ├── css/
│   │   └── style.css
│   │
│   ├── test/
│   │   ├── unit/
│   │   └── integration/
│   │
│   └── localService/
│       └── metadata.xml
│
├── test/
│   └── e2e/
│
├── package.json
├── package-lock.json
├── tsconfig.json
├── ui5.yaml
├── .eslintrc...
├── .prettierrc
└── README.md
```

其中 `webapp` 是 UI5 应用的核心源码目录，这是 UI5 官方教程的标准约定。([UI5][4])

---

# 6. `Component.ts`

整个应用的入口。

```text
index.html
    ↓
Component.ts
    ↓
manifest.json
    ↓
App.view.xml
```

示意：

```ts
import UIComponent from "sap/ui/core/UIComponent";

export default class Component extends UIComponent {
    public static metadata = {
        manifest: "json"
    };

    public init(): void {
        super.init();

        this.getRouter().initialize();
    }
}
```

不要在这里堆业务逻辑。

Component 只负责：

* Application lifecycle
* Router
* Global initialization
* Global model

---

# 7. `manifest.json`

这是整个应用的**核心配置中心**。

建议包含：

```json
{
  "_version": "2.8.0",

  "sap.app": {
    "id": "com.company.superbom",
    "type": "application",
    "title": "{{appTitle}}",
    "description": "{{appDescription}}",
    "applicationVersion": {
      "version": "1.0.0"
    }
  },

  "sap.ui": {
    "technology": "UI5",
    "deviceTypes": {
      "desktop": true,
      "tablet": true,
      "phone": false
    }
  },

  "sap.ui5": {
    "dependencies": {
      "minUI5Version": "..."
    },

    "models": {},

    "rootView": {},

    "routing": {}
  }
}
```

UI5 官方将 manifest 定义为应用描述文件，主要包含 `sap.app`、`sap.ui`、`sap.ui5` 等命名空间。([UI5][5])

---

# 8. MVC

严格遵循：

```text
View
 ↓
Controller
 ↓
Model / Service
 ↓
Backend
```

而不是：

```text
View
 ↓
直接调用 API
```

例如：

```text
Bom.view.xml
       ↓
Bom.controller.ts
       ↓
BomService.ts
       ↓
REST API
```

---

# 9. XML View

UI 优先使用 XML View。

例如：

```xml
<mvc:View
    controllerName="com.company.superbom.controller.Bom"
    xmlns:mvc="sap.ui.core.mvc"
    xmlns="sap.m"
    xmlns:t="sap.ui.table">

    <Page title="{i18n>bomTitle}">

        <content>

            <t:TreeTable
                rows="{bom>/nodes}"
                selectionMode="Single"
                selectionChange=".onSelectionChange">

                <t:columns>

                    <t:Column>
                        <Label text="{i18n>partNumber}" />
                        <t:template>
                            <Text text="{bom>number}" />
                        </t:template>
                    </t:Column>

                    <t:Column>
                        <Label text="{i18n>name}" />
                        <t:template>
                            <Text text="{bom>name}" />
                        </t:template>
                    </t:Column>

                </t:columns>

            </t:TreeTable>

        </content>

    </Page>

</mvc:View>
```

UI5 的优势之一就是这种**声明式 UI + Data Binding**。

---

# 10. Model

建议至少区分：

```text
JSONModel
ODataModel
ResourceModel
```

### UI 状态

```text
JSONModel
```

例如：

```text
/ui
/bom
/configuration
/workspace
```

### 后端业务数据

如果后端是 REST：

```text
JSONModel
+
Service Layer
```

如果以后接 SAP OData：

```text
ODataModel
```

### 国际化

```text
ResourceModel
```

---

# 11. 不建议把业务状态全部塞进 Controller

例如不要：

```ts
class BomController {

    private selectedBomId = "";
    private selectedNode = {};
    private configuration = {};
}
```

而应该：

```text
Model
 ↓
Controller
 ↓
View
```

这样 Workspace 切换、页面恢复、状态同步会容易很多。

---

# 12. Router

你之前提到的：

> code-server / VS Code 类似的多 Workspace

完全可以通过 UI5 Router 做。

例如：

```text
/
├── home
├── bom/{bomId}
├── product/{productId}
├── configurator/{configId}
├── rule/{ruleId}
└── viewer/{modelId}
```

manifest：

```json
{
  "sap.ui5": {
    "routing": {
      "config": {
        "routerClass": "sap.m.routing.Router",
        "viewType": "XML",
        "viewPath": "com.company.superbom.view",
        "controlId": "app",
        "controlAggregation": "pages"
      },

      "routes": [
        {
          "pattern": "",
          "name": "home",
          "target": "home"
        },
        {
          "pattern": "bom/{bomId}",
          "name": "bom",
          "target": "bom"
        }
      ],

      "targets": {
        "home": {
          "viewName": "Home"
        },
        "bom": {
          "viewName": "Bom"
        }
      }
    }
  }
}
```

---

# 13. Application Shell

你这个项目不要做成简单的：

```text
Page → Page → Page
```

而应该做：

```text
App
│
├── ShellBar
│
├── SideNavigation
│
└── Workspace
    │
    ├── Tab 1: BOM
    ├── Tab 2: Product
    ├── Tab 3: Configurator
    └── Tab 4: 3D Viewer
```

可以使用：

```text
sap.f.ShellBar
sap.tnt.SideNavigation
sap.m.TabContainer
sap.f.FlexibleColumnLayout
```

形成类似：

```text
┌──────────────────────────────────────────────┐
│ ShellBar                                     │
├──────────┬───────────────────────────────────┤
│          │ BOM-001 × | Configurator × | 3D ×│
│ Side     ├───────────────────────────────────┤
│ Nav      │                                   │
│          │         Workspace                 │
│          │                                   │
│          │                                   │
└──────────┴───────────────────────────────────┘
```

---

# 14. Super BOM 页面

建议采用：

```text
FlexibleColumnLayout
```

形成：

```text
┌──────────────┬───────────────────────┬──────────────┐
│              │                       │              │
│   BOM Tree   │     3D Viewer         │ Properties   │
│              │                       │              │
│              │     sap.ui.vk         │              │
│              │                       │              │
└──────────────┴───────────────────────┴──────────────┘
```

这是纯 SAPUI5 非常适合做的页面。

---

# 15. `sap.ui.vk`

这是本项目的特殊能力模块。

建议独立：

```text
component/
└── VKViewer.ts
```

不要让：

```text
Bom.controller.ts
Configurator.controller.ts
Product.controller.ts
```

直接操作 VK 内部对象。

统一：

```text
Viewer.controller
       ↓
VKViewer
       ↓
sap.ui.vk
```

这样以后更换：

```text
VDS4
Three.js
其他 3D 数据源
```

不会污染业务代码。

SAP 当前 UI5 文档也将 `sap.ui.vk` 用于 2D/3D 可视化，并推荐现代 Three.js 渲染路径；旧 DVL 路径已经属于过时方向。

---

# 16. Service Layer

不要让 Controller 直接写：

```ts
fetch("/api/bom/123")
```

统一：

```text
service/
├── ApiService.ts
├── BomService.ts
├── ProductService.ts
├── ConfiguratorService.ts
└── RuleService.ts
```

例如：

```ts
export class BomService {

    public async getBom(id: string): Promise<Bom> {
        const response = await fetch(`/api/bom/${id}`);

        if (!response.ok) {
            throw new Error("Failed to load BOM");
        }

        return response.json();
    }
}
```

Controller：

```ts
const bom = await BomService.getBom(id);
```

---

# 17. Super BOM Domain Model

建议从一开始就定义领域模型：

```text
Bom
├── BomNode
│   ├── Material
│   ├── Quantity
│   ├── Position
│   └── Children
│
├── Option
│
├── Feature
│
├── Rule
│
├── Variant
│
└── Configuration
```

例如：

```ts
interface BomNode {
    id: string;
    materialId: string;
    number: string;
    name: string;
    quantity: number;
    children?: BomNode[];
}
```

---

# 18. 配置规则

你的核心业务逻辑不要放在 UI Controller。

例如：

```text
Configurator
      ↓
ConfigurationService
      ↓
RuleEngine
```

例如：

```text
发动机 = 2.0T
        ↓
禁用 7DCT
        ↓
启用 8AT
```

而不是：

```ts
// Configurator.controller.ts

if (engine === "2.0T") {
    ...
}
```

应该独立成：

```text
domain/
└── configurator/
    ├── Configuration.ts
    ├── Option.ts
    ├── Rule.ts
    └── RuleEngine.ts
```

---

# 19. TypeScript

这个项目建议**直接 TypeScript**，不要因为 UI5 是传统框架就退回纯 JavaScript。

官方已经提供：

```text
@sapui5/types
@openui5/types
```

作为官方类型定义。([UI5][1])

SAPUI5：

```json
{
  "devDependencies": {
    "@sapui5/types": "..."
  }
}
```

OpenUI5：

```json
{
  "devDependencies": {
    "@openui5/types": "..."
  }
}
```

---

# 20. TypeScript 配置

基础：

```json
{
  "compilerOptions": {
    "target": "ES2023",
    "module": "ES2022",
    "moduleResolution": "Bundler",
    "strict": true,
    "skipLibCheck": true,
    "rootDir": "./webapp",
    "types": [
      "@sapui5/types"
    ],
    "paths": {
      "com/company/superbom/*": [
        "./webapp/*"
      ]
    }
  },

  "include": [
    "webapp/**/*.ts"
  ]
}
```

具体配置应以你最终选择的 UI5/SAPUI5 版本及官方 TypeScript 模板为准。官方 TypeScript 快速开始目前也是通过 UI5 类型包 + TypeScript + UI5 CLI 组合建立项目。([UI5][4])

---

# 21. ESLint

保留 ESLint，但不要像 React 项目一样使用：

```text
eslint-plugin-react
eslint-plugin-react-hooks
eslint-config-next
```

这些全部不需要。

重点检查：

```text
TypeScript
Unused variables
Unused imports
Explicit any
Promise issues
Import errors
Code quality
```

建议：

```text
ESLint
+
TypeScript
+
Prettier
```

形成：

```text
npm run lint
npm run typecheck
npm run format
```

---

# 22. 测试

项目必须从第一天就建立测试。

```text
test/
├── unit/
│   ├── RuleEngine.test.ts
│   ├── BomService.test.ts
│   └── Formatter.test.ts
│
└── integration/
    ├── Bom.test.ts
    ├── Configurator.test.ts
    └── Viewer.test.ts
```

重点测试：

```text
BOM Tree
    ↓
选择节点
    ↓
Properties 更新

Configuration
    ↓
Rule Engine
    ↓
BOM 更新

BOM
    ↓
VK Selection
    ↓
3D Highlight
```

---

# 23. UI5 官方测试体系

UI5 自己有成熟的测试体系：

```text
QUnit
OPA5
```

建议：

```text
Unit Test
    ↓
QUnit

Integration Test
    ↓
OPA5
```

而不是强行把 React Testing Library 那一套搬过来。

---

# 24. UI5 CLI

`ui5.yaml` 是核心工程配置。

大体：

```yaml
specVersion: "4.0"

metadata:
  name: "com.company.superbom"

type: application

framework:
  name: SAPUI5
  version: "你的目标版本"
  libraries:
    - name: sap.m
    - name: sap.ui.core
    - name: sap.ui.table
    - name: sap.f
    - name: sap.tnt
    - name: themelib_sap_horizon
    - name: sap.ui.vk
```

UI5 官方教程目前使用 `ui5.yaml` 定义 framework、version、libraries 以及构建/服务器扩展。([UI5][6])

---

# 25. 开发命令

最终至少应该有：

```bash
npm install
```

开发：

```bash
npm start
```

本质：

```bash
ui5 serve
```

类型检查：

```bash
npm run typecheck
```

Lint：

```bash
npm run lint
```

测试：

```bash
npm test
```

构建：

```bash
npm run build
```

UI5 官方生产构建使用：

```bash
ui5 build
```

构建结果可以直接部署到 Web Server；官方教程的生产构建步骤也是以 `ui5 build` 为核心。([UI5][7])

---

# 26. 最重要的 Bootstrap 验证机制

按照你之前对 Agent 的要求，这次同样不要：

```text
一次性生成整个项目
        ↓
最后才 npm build
        ↓
发现框架根本跑不起来
```

必须：

```text
Bootstrap
   ↓
Verify
   ↓
PASS
   ↓
Next Stage
```

---

## Stage 0：环境

检查：

```bash
node --version
npm --version
git --version
```

全部 PASS 才继续。

---

## Stage 1：UI5 CLI

安装：

```bash
npm install -D @ui5/cli
```

验证：

```bash
npx ui5 --version
```

PASS：

```text
UI5 CLI successfully starts
```

---

## Stage 2：SAPUI5 Framework

验证：

```bash
npx ui5 serve
```

浏览器能够加载：

```text
sap-ui-core.js
```

PASS 才继续。

---

## Stage 3：TypeScript

创建：

```text
Component.ts
```

执行：

```bash
npm run typecheck
```

必须 PASS。

---

## Stage 4：ESLint

**不能仅仅验证 ESLint 命令退出码为 0。**

故意制造：

```ts
const unusedVariable = 123;
```

运行：

```bash
npm run lint
```

必须：

```text
FAIL
```

然后删除：

```ts
unusedVariable
```

再次：

```bash
npm run lint
```

必须：

```text
PASS
```

这样才能证明 ESLint 真正工作。

---

# 27. Stage 5：MVC

验证：

```text
Component
 ↓
manifest
 ↓
App.view.xml
 ↓
App.controller.ts
```

必须能够启动。

---

# 28. Stage 6：Router

验证：

```text
/
↓
/bom
↓
/configurator
↓
/viewer
```

浏览器直接访问 URL 也必须能够正常进入对应页面。

---

# 29. Stage 7：Data Binding

建立：

```text
JSONModel
 ↓
TreeTable
```

验证：

```text
修改 Model
 ↓
UI 自动更新
```

---

# 30. Stage 8：VK

最后才接：

```text
sap.ui.vk
```

验证：

```text
VK Runtime
 ↓
Viewport
 ↓
Three.js
 ↓
加载测试模型
 ↓
Selection
 ↓
Highlight
```

这里通过以后，才开始开发真正的 Super BOM。

---

# 31. 最终业务页面

最终第一版建议：

```text
                    Application Shell
                           │
        ┌──────────────────┼──────────────────┐
        ↓                  ↓                  ↓
      Product             BOM            Configurator
                           │
                ┌──────────┼──────────┐
                ↓          ↓          ↓
              Tree       3D VK    Properties
                           │
                           ↓
                        Rule Engine
                           │
                           ↓
                       Final BOM
```

---

# 32. 最终技术栈

因此这次不再是：

```text
Next.js
React
UI5 Web Components React
TanStack Query
Zustand
```

而是：

```text
┌──────────────────────────────────────┐
│              SAPUI5                  │
├──────────────────────────────────────┤
│ MVC                                  │
│ Component                            │
│ XML View                             │
│ Router                               │
│ JSONModel / ODataModel               │
│ Data Binding                         │
│ sap.f                                │
│ sap.m                                │
│ sap.ui.table                         │
│ sap.tnt                              │
│ sap.ui.vk                            │
├──────────────────────────────────────┤
│ TypeScript                           │
│ UI5 CLI                              │
│ ESLint                               │
│ Prettier                             │
│ QUnit                                │
│ OPA5                                 │
└──────────────────────────────────────┘
```

**这套方案最大的优势就是：从 Shell、BOM Tree、Data Binding、Router，到 `sap.ui.vk`，全部处于同一个 SAPUI5 技术体系里。**

而且 UI5 官方当前的 TypeScript Tutorial 本身已经覆盖了从项目初始化、MVC、Data Binding、Navigation、Testing 到 Production Build 的完整路线，因此你这次完全可以把官方架构作为基线，而不是自己重新发明一套 React 风格架构。([UI5][1])

[1]: https://ui5.github.io/typescript/?utm_source=chatgpt.com "UI5-TypeScript | UI5 & TypeScript"
[2]: https://ui5.github.io/tutorials/walkthrough/steps/10/?utm_source=chatgpt.com "Step 10: Manifest (Descriptor for Applications) | tutorials"
[3]: https://ui5.github.io/tutorials/walkthrough/steps/01/?utm_source=chatgpt.com "Step 1: Hello World! | tutorials"
[4]: https://ui5.github.io/tutorials/quickstart/steps/01/?utm_source=chatgpt.com "Step 1: Ready… | tutorials"
[5]: https://ui5.github.io/docs/04_Essentials/manifest-descriptor-for-applications-components-and-libraries-be0cf40.html?utm_source=chatgpt.com "docs | OpenUI5 Markdown Documentation"
[6]: https://ui5.github.io/tutorials/databinding/steps/01/index.html?utm_source=chatgpt.com "Step 1: No Data Binding | tutorials"
[7]: https://ui5.github.io/tutorials/walkthrough/steps/38/?utm_source=chatgpt.com "Step 38: Build Your Application | tutorials"
