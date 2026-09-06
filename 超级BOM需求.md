# 特征驱动自行车产品配置器——纯前端实现提示词

你是一名熟悉 PLM、PDM、BOM、产品配置、Variant Configuration、CPQ、复杂装备制造，以及现代企业级前端交互设计的高级前端架构师。

请为我设计并实现一个**纯前端的“特征驱动产品配置器”原型**。

产品案例统一使用：

> **城市探索自行车 / Urban Bicycle**

本项目不是传统的 Windchill / Teamcenter Super BOM 配置方式。

不要采用：

```text
先建立 150% Super BOM
        ↓
在 BOM 行绑定配置条件
        ↓
选择 Option / Choice
        ↓
过滤 BOM 节点
        ↓
得到 100% BOM
```

本项目采用：

```text
产品架构
    ↓
配置域 / 功能模块
    ↓
特征模型
    ↓
营销选配 + 技术选配
    ↓
规格 Requirement / Specification
    ↓
匹配具体物料
    ↓
组合各物料自身 BOM
    ↓
生成最终 100% BOM
    ↓
BOM + 3D 联动可视化
```

注意：

**不构建完整的 150% Super BOM。**

最终 BOM 是配置计算产生的结果，而不是从超级 BOM 中裁剪出来的结果。

---

# 一、项目范围

本次只实现：

```text
React 前端
+
静态 Mock Data
+
前端状态管理
+
前端规则计算
+
前端 BOM 生成
+
前端交互
```

不要实现：

```text
Java
Spring Boot
Node Backend
Database
PostgreSQL
MySQL
REST API
GraphQL
服务器
持久化
登录鉴权
```

所有数据均使用：

```text
TypeScript interfaces
+
Mock JSON / TS objects
```

实现。

所有配置规则暂时全部在浏览器内执行。

目标是首先验证：

> **产品配置业务模型和 UI 交互是否成立。**

---

# 二、现有页面定位

目前系统已经存在一个类似如下页面：

```text
最终 Configured BOM
+
三维模型 Viewer
```

页面结构大致为：

```text
┌─────────────────────────────────────────────┐
│ 产品：URBAN / 城市探索自行车                │
├──────────────────────┬──────────────────────┤
│                      │                      │
│       BOM 结构       │      3D Viewer       │
│                      │                      │
│  BIKE-150            │                      │
│   ├─ FR-100          │       自行车模型      │
│   ├─ WH-200          │                      │
│   ├─ DR-300          │                      │
│   └─ AC-400          │                      │
│                      │                      │
└──────────────────────┴──────────────────────┘
```

该页面负责：

> **查看最终 BOM 和三维结构之间的联动关系。**

例如：

点击：

```text
FR-101 铝合金车架
```

则三维模型：

```text
高亮对应车架
```

反过来点击三维零件：

```text
前轮
```

则 BOM Tree 自动定位：

```text
WH-201 前轮组
```

注意：

### 这个页面不是配置器本身。

它是整个配置流程的：

> **最终结果页面。**

请在此前新增完整的“配置过程 UI”。

---

# 三、整体前端业务流程

完整流程设计为：

```text
选择产品
   ↓
产品配置
   ↓
营销配置
   ↓
技术配置
   ↓
规则校验
   ↓
规格解析
   ↓
物料匹配
   ↓
配置确认
   ↓
生成 Configured BOM
   ↓
BOM + 3D 可视化
```

建议形成以下主要页面：

```text
01 产品配置首页

02 产品选配器
   ├─ 营销选配
   ├─ 技术选配
   └─ 实时配置状态

03 配置解析结果
   ├─ Requirement
   ├─ Specification
   ├─ Material Match
   └─ Rule Trace

04 Configured BOM
   ├─ 最终 BOM Tree
   └─ 3D Viewer
```

其中：

**04 就对应我目前已经做出的页面。**

---

# 四、核心产品架构

以：

```text
URBAN
城市探索自行车
```

为例。

首先定义产品架构，而不是超级 BOM：

```text
城市探索自行车
│
├── FRAME
│   车架系统
│
├── WHEEL
│   轮组系统
│
├── DRIVETRAIN
│   传动系统
│
└── ACCESSORY
    通勤附件
```

这些不是候选零件列表。

它们是：

> Product Architecture / Configuration Domain

也就是说：

```text
城市自行车
```

需要解决：

```text
什么车架？
什么轮组？
什么传动系统？
需要哪些附件？
```

而不是提前把全部候选物料挂到 BOM 中。

---

# 五、Feature Schema —— 属性先于物料

整个系统必须体现：

> **不是先创建物料，再临时给物料填写属性。**

而是：

```text
Configuration Domain
        ↓
Feature Schema
        ↓
Specification
        ↓
Material
```

例如：

## FRAME / 车架

提前定义：

```text
FRAME_MATERIAL
车架材质

枚举：
ALUMINUM
CARBON
STEEL
```

以及：

```text
FRAME_STYLE

CITY
SPORT
COMFORT
```

---

## WHEEL / 轮组

```text
WHEEL_SIZE

700x28C
700x35C
700x45C
```

```text
WHEEL_TYPE

ROAD
GRAVEL
CITY
```

---

## DRIVETRAIN / 传动

```text
GEAR_TYPE

DERAILLEUR
INTERNAL_GEAR
SINGLE_SPEED
```

```text
GEAR_COUNT

1
7
8
9
11
```

---

## ACCESSORY / 附件

```text
FENDER

TRUE
FALSE
```

```text
REAR_RACK

TRUE
FALSE
```

```text
LIGHT

TRUE
FALSE
```

---

# 六、具体物料只是 Feature Schema 的实例

Mock 数据中创建具体物料。

例如车架：

```text
FR-101
铝合金车架

Category:
FRAME

Features:

FRAME_MATERIAL = ALUMINUM
FRAME_STYLE = CITY
```

```text
FR-102
碳纤维车架

FRAME_MATERIAL = CARBON
FRAME_STYLE = SPORT
```

---

轮组：

```text
WH-211
前公路胎 700×28C

WHEEL_SIZE = 700x28C
WHEEL_TYPE = ROAD
```

```text
WH-221
前砾石胎 700×45C

WHEEL_SIZE = 700x45C
WHEEL_TYPE = GRAVEL
```

---

附件：

```text
AC-401
后货架
```

```text
AC-402
前后挡泥板
```

---

# 七、营销配置和技术配置必须分开

配置页面顶部提供两个 Tab：

```text
[ 自行车配置 ]

[ 营销配置 ] [ 技术配置 ]
```

---

# 八、营销配置

营销配置回答：

> 客户想买什么？

例如：

### 使用场景

```text
○ 城市通勤

○ 运动骑行

○ 周末轻度 Gravel
```

### 配置等级

```text
○ 标准版

○ 运动版

○ 探索版
```

### 舒适配置

```text
□ 后货架

□ 挡泥板

□ 通勤灯组
```

例如用户选择：

```text
使用场景 = 城市通勤
配置等级 = 标准版
通勤附件 = 开启
```

不要直接指定：

```text
FR-101
WH-211
AC-401
```

而应该首先转换为技术需求：

```text
FRAME_STYLE = CITY

FRAME_MATERIAL = ALUMINUM

WHEEL_SIZE = 700x28C

WHEEL_TYPE = ROAD

REAR_RACK = TRUE

FENDER = TRUE
```

即：

```text
Marketing Choice
        ↓
Mapping
        ↓
Technical Requirement
```

---

# 九、技术配置

技术配置回答：

> 产品具体应该满足什么技术规格？

例如页面：

```text
车架
────────────────

材质

● 铝合金
○ 碳纤维


轮组
────────────────

规格

● 700×28C
○ 700×45C


传动

● 8速
○ 11速


附件

☑ 后货架

☑ 挡泥板
```

技术配置直接产生：

```text
Technical Requirement
```

---

# 十、营销配置和技术配置之间的关系

必须支持：

```text
营销选项
        ↓
自动推荐技术配置
```

例如：

```text
城市通勤
```

自动得到：

```text
FRAME_STYLE = CITY

WHEEL_SIZE = 700x28C

WHEEL_TYPE = ROAD

REAR_RACK = TRUE
```

但用户仍可以进入：

```text
技术配置
```

查看具体结果。

允许部分技术参数修改。

修改后重新运行规则校验。

---

# 十一、规则系统

前端实现一个简单但结构化的 Rule Engine。

禁止写成：

```javascript
if (...)
if (...)
if (...)
```

散落在组件里。

规则必须使用数据对象定义。

例如：

```ts
{
  id: "RULE-001",
  type: "requires",

  when: {
    feature: "WHEEL_TYPE",
    operator: "eq",
    value: "GRAVEL"
  },

  then: {
    feature: "WHEEL_SIZE",
    operator: "in",
    value: [
      "700x35C",
      "700x45C"
    ]
  }
}
```

例如：

```text
IF

WHEEL_TYPE = GRAVEL

THEN

WHEEL_SIZE != 700x28C
```

---

再例如：

```text
IF

FRAME_STYLE = SPORT

THEN

REAR_RACK = FALSE
```

---

规则状态至少支持：

```text
Valid

Warning

Conflict

Recommended
```

---

# 十二、配置器页面布局

重点设计这一页。

推荐采用：

```text
┌─────────────────────────────────────────────────────────┐
│ URBAN / 城市探索自行车                                 │
│ Configuration                                          │
├───────────────┬─────────────────────┬───────────────────┤
│               │                     │                   │
│ 产品模块      │ 当前选配内容        │ 配置状态          │
│               │                     │                   │
│ ● 整车配置    │ 车架                │ ✓ 规则通过        │
│               │                     │                   │
│ ○ 车架        │ 材质                │ ✓ 已解析车架      │
│               │ ● 铝合金            │   FR-101          │
│ ○ 轮组        │ ○ 碳纤维            │                   │
│               │                     │ ✓ 已解析轮组      │
│ ○ 传动        │ 轮胎规格            │                   │
│               │ ● 700×28C           │ ⚠ 一个警告        │
│ ○ 附件        │ ○ 700×45C           │                   │
│               │                     │                   │
│               │ [应用配置]          │ [查看解析详情]    │
│               │                     │                   │
└───────────────┴─────────────────────┴───────────────────┘
```

整体设计语言参考：

```text
SAP Fiori
Teamcenter
Windchill
现代企业级 PLM
```

不要设计成：

```text
电商购物网站
```

而应该表现成：

> **工程产品配置工作台。**

---

# 十三、配置状态面板

右侧必须实时显示 Configuration Resolution。

例如：

```text
配置状态
──────────────────

✓ 车架

Requirement

FRAME_MATERIAL =
ALUMINUM

Matched Material

FR-101
铝合金车架
```

---

```text
✓ 轮组

Requirement

WHEEL_SIZE =
700x28C

WHEEL_TYPE =
ROAD

Matched Material

WH-211
WH-212
```

---

用户点击：

```text
为什么选择？
```

打开详情：

```text
需求来源

营销配置：
城市通勤

↓

转换规则：

MARKETING_RULE_003

↓

技术需求：

WHEEL_TYPE = ROAD
WHEEL_SIZE = 700x28C

↓

匹配物料：

WH-211
WH-212
```

这叫：

```text
Explain Configuration
```

---

# 十四、Specification Resolver

前端中模拟：

```text
Configuration
      ↓
Specification Resolver
```

例如：

```text
用户：

车架材质 = ALUMINUM
车架样式 = CITY
```

产生：

```ts
{
  category: "FRAME",

  requirements: {
    FRAME_MATERIAL: "ALUMINUM",
    FRAME_STYLE: "CITY"
  }
}
```

然后进入：

```text
Material Matcher
```

---

# 十五、Material Matcher

根据：

```text
Specification
```

匹配 Mock Materials。

例如：

```text
Required:

FRAME_MATERIAL = ALUMINUM
FRAME_STYLE = CITY
```

Mock Material：

```text
FR-101

ALUMINUM
CITY
```

结果：

```text
MATCHED
FR-101
```

---

如果：

```text
0 个物料
```

显示：

```text
未找到满足当前规格的物料
```

---

如果：

```text
2 个物料
```

显示：

```text
发现多个候选物料

○ FR-101

○ FR-105
```

允许用户选择。

不要随机匹配。

---

# 十六、Material 自身允许拥有 BOM

这是非常重要的一层。

例如匹配：

```text
WH-200
轮组总成
```

WH-200 自己可以拥有：

```text
WH-200
轮组总成

├── WH-201 前轮
│
├── WH-202 后轮
│
├── WH-211 前轮胎
│
└── WH-212 后轮胎
```

再比如：

```text
DR-300
传动总成

├── DR-301 牙盘
├── DR-302 链条
└── DR-310 后拨
```

因此配置器真正做的是：

```text
匹配模块级物料
        ↓
读取物料自身 BOM
        ↓
组合
```

而不是一个个把最底层零件全部选择出来。

---

# 十七、动态生成最终 BOM

用户完成配置以后点击：

```text
生成 BOM
```

前端执行：

```text
Configuration
        ↓
Resolve Specification
        ↓
Match Material
        ↓
Load Material BOM
        ↓
Assemble
        ↓
Configured BOM
```

例如生成：

```text
BIKE-100
URBAN / 城市探索自行车

├── FR-100
│   车架总成
│
│   ├── FR-101
│   │   铝合金车架
│   │
│   └── FR-110
│       前叉
│
├── WH-200
│   轮组总成
│
│   ├── WH-201
│   │   前轮组
│   │
│   ├── WH-202
│   │   后轮组
│   │
│   ├── WH-211
│   │   前公路胎 700×28C
│   │
│   └── WH-212
│       后公路胎 700×28C
│
├── DR-300
│   传动与制动
│
│   ├── DR-301
│   ├── DR-302
│   └── DR-310
│
└── AC-400
    通勤附件

    ├── AC-401
    │   后货架
    │
    └── AC-402
        前后挡泥板
```

---

# 十八、进入现有 BOM + 3D Viewer 页面

生成成功后：

```text
[ 查看最终 BOM ]
```

进入：

```text
Configured BOM Viewer
```

也就是目前已经实现的页面。

页面顶部显示：

```text
URBAN / 城市探索自行车

A.01

100% Configured BOM

✓ 配置完成
```

而不要再显示：

```text
150% Super BOM
```

因为本方案不存在：

```text
150% → Filter → 100%
```

应该显示：

```text
Configured BOM
```

或者：

```text
100% BOM
```

---

# 十九、最终 BOM 页仍保留配置来源

最终 BOM 表格建议增加：

```text
物料

来源

数量

状态
```

例如：

```text
FR-101
铝合金车架

来源：
车架 = 铝合金

1 EA
```

---

```text
WH-211
前公路胎 700×28C

来源：
轮胎 = 公路
尺寸 = 700×28C

1 EA
```

---

```text
AC-401
后货架

来源：
通勤附件 = 开启

1 EA
```

让最终 BOM 可以解释：

> **为什么这个零件存在。**

---

# 二十、BOM 与三维联动

继续保留目前的左右结构：

```text
┌───────────────────────┬─────────────────────────┐
│ BOM                   │ 3D Viewer               │
│                       │                         │
│ BIKE                  │                         │
│ ├ FRAME               │        🚲               │
│ ├ WHEEL               │                         │
│ ├ DRIVE               │                         │
│ └ ACCESSORY           │                         │
│                       │                         │
└───────────────────────┴─────────────────────────┘
```

交互：

```text
BOM Node
        ↓
3D Object
```

以及：

```text
3D Object
        ↓
BOM Node
```

双向联动。

---

# 二十一、配置过程最好也支持 3D Preview

除了最终页面之外，配置器可以提供：

```text
实时 Preview
```

例如用户：

```text
铝合金车架
```

则自行车模型：

```text
显示铝合金车架
```

选择：

```text
后货架 = 开启
```

则：

```text
显示后货架
```

关闭：

```text
后货架
```

则隐藏对应节点。

这只是前端状态与三维节点之间的映射。

Mock：

```ts
materialCode -> viewerNodeId
```

例如：

```ts
{
  "FR-101": "frame_aluminum",
  "WH-211": "front_tire_road",
  "WH-212": "rear_tire_road",
  "AC-401": "rear_rack",
  "AC-402": "fender"
}
```

---

# 二十二、建议的前端 TypeScript 模型

至少定义：

```ts
Product
```

```ts
ConfigurationDomain
```

```ts
FeatureDefinition
```

```ts
FeatureOption
```

```ts
MarketingFeature
```

```ts
MarketingOption
```

```ts
TechnicalRequirement
```

```ts
ConfigurationRule
```

```ts
Material
```

```ts
MaterialFeatureValue
```

```ts
MaterialBom
```

```ts
MaterialBomLine
```

```ts
Configuration
```

```ts
ResolvedSpecification
```

```ts
MaterialMatchResult
```

```ts
ConfigurationTrace
```

```ts
ConfiguredBom
```

```ts
ConfiguredBomLine
```

不要为了快速实现而把全部数据结构写成：

```ts
any
```

或者：

```ts
Record<string, any>
```

核心领域对象必须有明确 TypeScript 类型。

---

# 二十三、建议前端模块划分

设计类似：

```text
src/

features/

    product-configurator/

        model/

        mock/

        engine/

            marketingResolver.ts

            ruleEngine.ts

            specificationResolver.ts

            materialMatcher.ts

            bomAssembler.ts

        components/

            ConfigurationSidebar

            MarketingConfigurator

            TechnicalConfigurator

            ConfigurationStatus

            RequirementPanel

            MaterialMatchPanel

            ConfigurationTrace

        pages/

            ProductConfiguratorPage

            ConfigurationReviewPage

            ConfiguredBomPage
```

业务算法不要直接写在 React Component 内部。

例如：

```text
ruleEngine
materialMatcher
bomAssembler
```

应该保持成：

> **纯 TypeScript domain functions**

方便以后替换为真正后端实现。

---

# 二十四、Mock Data 要完整

请创建一个可以真实演示完整业务流程的自行车样例。

至少包含：

### Frame

```text
铝合金车架

碳纤维车架
```

### Wheel

```text
700×28C 公路轮组

700×45C Gravel 轮组
```

### Drivetrain

```text
8速通勤传动

11速运动传动
```

### Accessories

```text
后货架

挡泥板

通勤灯组
```

---

至少设计三套典型配置：

### Urban Standard

```text
铝合金车架

700×28C

8速

挡泥板
```

---

### Urban Commuter

```text
铝合金车架

700×28C

8速

挡泥板

后货架

灯组
```

---

### Urban Explore

```text
碳纤维 / 铝合金运动车架

700×45C Gravel

11速

无后货架
```

---

# 二十五、需要重点展示一次冲突

例如用户选择：

```text
使用场景：
Gravel
```

同时：

```text
轮胎：
700×28C Road
```

则 UI 显示：

```text
⚠ 配置冲突

Gravel 配置要求：

WHEEL_TYPE = GRAVEL

当前选择：

WHEEL_TYPE = ROAD
```

提供：

```text
[采用推荐配置]
```

点击自动变为：

```text
700×45C Gravel
```

这样才能体现配置系统和普通表单的区别。

---

# 二十六、不要做成“属性过滤器”

这一点非常重要。

最终 UI 不应该只是：

```text
材质：铝合金

尺寸：700

类型：Road
```

然后筛选物料。

必须明确表达整个链路：

```text
用户选择
        ↓
配置意图
        ↓
技术 Requirement
        ↓
Specification
        ↓
Material Match
        ↓
BOM Assembly
```

UI 中应该能够查看：

```text
为什么选中这个物料？
```

而不是只看到最终结果。

---

# 二十七、关键概念

开发过程中始终区分以下概念：

```text
Product Architecture

Configuration Domain

Feature

Marketing Choice

Technical Requirement

Specification

Material

Material BOM

Configuration Rule

Material Match

Configured BOM
```

禁止将：

```text
Feature
Specification
Material
```

混成一个对象。

---

# 二十八、核心架构思想

请严格遵循：

```text
       Product Architecture

                 │

       Configuration Domain

                 │

              Feature

                 │

       ┌─────────┴─────────┐
       │                   │
Marketing Configuration   Technical Configuration

       │                   │
       └─────────┬─────────┘

                 ↓

          Requirement

                 ↓

          Specification

                 ↓

          Material Match

                 ↓

          Material BOM

                 ↓

           BOM Assembly

                 ↓

        Configured 100% BOM

                 ↓

           3D Visualization
```

---

# 二十九、与 Super BOM 模式的区别必须体现到 UI 中

不要出现：

```text
150% BOM 中：

✓ 已采用

✕ 未采用
```

这种核心交互。

因为这仍然是：

> Super BOM Filtering。

本系统配置阶段应该显示：

```text
需求：

FRAME_MATERIAL = ALUMINUM

↓

匹配：

FR-101 铝合金车架
```

而不是：

```text
FR-101 ✓

FR-102 ✕

FR-103 ✕
```

前者是：

> Requirement Driven。

后者仍然是：

> Super BOM Driven。

---

# 三十、但是最终结果页只显示最终结果

进入最终 BOM 页面以后：

```text
FR-102 碳纤维车架
```

如果没有被选择：

> 就根本不应该存在于这棵 BOM 中。

最终结果应该是真正的：

```text
100% BOM
```

而不是：

```text
150% BOM + 已采用/未采用状态
```

因此请调整现有演示数据的概念。

配置页面允许看到：

```text
候选物料
```

最终 BOM 页面只看到：

```text
Resolved Material
```

---

# 三十一、UI 风格要求

整体视觉风格：

```text
企业级 PLM

SAP Fiori 风格

紧凑型信息密度

工程数据表格

浅色背景

清晰边框

少阴影

少大圆角

少装饰

强调状态和信息结构
```

不要做成：

```text
大卡片 Dashboard

渐变背景

营销网站

大面积 Hero

消费级购物商城
```

参考我当前已有的：

```text
BOM + Viewer
```

页面风格。

新页面需要像同一个系统中的功能模块。

---

# 三十二、开发顺序

不要一开始就把全部功能塞在一个页面。

第一阶段：

```text
Feature Model
+
Material Mock
+
Material Matcher
```

完成：

```text
Feature
→ Requirement
→ Material
```

---

第二阶段：

```text
Technical Configurator
+
Rule Engine
```

完成：

```text
用户技术选配
→ Rule Validation
→ Material Match
```

---

第三阶段：

```text
Marketing Configurator
+
Marketing → Technical Mapping
```

完成：

```text
营销配置
→ 技术配置
```

---

第四阶段：

```text
Material BOM
+
BomAssembler
```

完成：

```text
Matched Material
→ Configured BOM
```

---

第五阶段：

接入：

```text
现有 BOM + 3D Viewer 页面
```

完成整个：

```text
Configure
→ Resolve
→ Generate BOM
→ Visualize
```

链路。

---

# 三十三、最终要求

首先完成架构设计和页面原型。

不要设计任何后端接口。

不要设计数据库。

不要讨论服务器。

所有逻辑均在浏览器本地完成。

请首先输出：

1. 前端领域模型；
2. 页面信息架构；
3. 页面之间的流程；
4. Mock 自行车产品架构；
5. Feature Definitions；
6. Material Mock Data；
7. Marketing Configuration Model；
8. Technical Configuration Model；
9. Rule Model；
10. Specification Resolver；
11. Material Matcher；
12. BOM Assembler；
13. React Component 结构；
14. 最终页面 Wireframe。

确认模型合理后，再开始实现代码。

最终需要形成一个完整可交互演示：

```text
选择 URBAN 自行车

        ↓

选择：

城市通勤

        ↓

系统推荐：

铝合金车架
700×28C
8速传动
挡泥板
后货架

        ↓

查看 Technical Requirement

        ↓

查看 Material Match

        ↓

生成 Configured BOM

        ↓

进入最终 BOM + 3D Viewer

        ↓

BOM 与三维模型双向联动
```

整个系统必须明确表达：

> **我们不是先创建一棵包含所有可能零件的超级 BOM，然后把不需要的节点过滤掉。**

而是：

> **我们先定义产品需要解决哪些配置问题，再通过特征、规则和规格确定具体物料，最后由这些具体物料及其 BOM 动态构建最终产品 BOM。**

---

这里我还建议你把你现在截图里的一个概念顺手改掉。

你当前页面左上是 **`150% Super BOM`**，并且 BOM 里同时出现：

```text
FR-101 铝合金车架    已选用
FR-102 碳纤维车架    未选用

WH-211 700×28C      已选用
WH-221 700×45C      未选用
```

这张页面本质上仍然是**传统 Super BOM 可视化**。

按你现在的新方案，应该拆成两个不同页面：

```text
配置阶段
────────────────

车架需求
ALUMINUM + CITY

候选：
FR-101
FR-105


轮组需求
ROAD + 700×28C

候选：
WH-211 / WH-212
```

解析完成以后进入你截图这种页面时，则只剩：

```text
100% Configured BOM
────────────────

FR-101
FR-110

WH-201
WH-202
WH-211
WH-212

DR-301
DR-302
DR-310

AC-401
AC-402
```

**不会再有“未选用”的 FR-102、WH-221。**

这样你的产品逻辑就彻底和 Windchill 那套 **150% BOM → Apply Options → 100% BOM** 分开了，而你现在做好的三维联动页面也正好成为这条新架构链路最后的 **Configured BOM Viewer**。