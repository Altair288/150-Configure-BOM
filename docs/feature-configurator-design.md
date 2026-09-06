# URBAN 特征驱动配置工作台

## 设计依据

产品架构定义要解决的配置问题；Feature Schema 定义合法特征和值；营销配置表达意图；技术覆盖表达工程人员的显式选择。Requirement 保留来源，Specification 按配置域聚合需求，Material Matcher 只匹配这些规格，Bom Assembler 只展开已确定物料自身的 BOM。没有预先构建或裁剪 150% BOM 的步骤。

## 页面与流程

1. 产品配置首页：URBAN 产品、四个配置域及其 Feature Schema、三套可操作配置模板。
2. 产品选配器：左侧配置域，中间营销／技术两个 Tab，右侧实时解析状态和规则问题。营销推荐与技术覆盖分开保存，覆盖项可还原推荐。
3. 配置解析与确认：Requirement 来源、分域 Specification、物料匹配、候选决策、规则执行记录。无匹配、未决多候选和冲突阻止生成；警告可确认后继续。
4. Configured BOM：既有 BOM＋Chili3D 工作台。只展示当前生成结果及配置来源，提供返回配置与解析页的入口，保留已完成的三维交互。

流程：产品 → 营销／技术配置 → 规则校验 → 规格与物料解析 → 确认 → 生成 100% BOM → 三维查看。修改配置会使已生成结果失效，不能查看过期结果。页面跳转保留内存草稿，刷新重置，不持久化。

## 领域模型

- Product / ConfigurationDomain：URBAN 包含 FRAME、WHEEL、DRIVETRAIN、ACCESSORY。
- FeatureDefinition / FeatureOption：材质 ALUMINUM/CARBON/STEEL；样式 CITY/SPORT/COMFORT；轮胎尺寸 28/35/45C；类型 ROAD/CITY/GRAVEL；传动类型、速数；三个独立附件布尔值。
- MarketingFeature / MarketingOption：使用场景、配置等级和舒适附件。数据映射生成推荐技术需求。
- Configuration：营销选择、技术覆盖、候选物料决策、修订号。
- TechnicalRequirement：特征、值、来源类型、来源说明、映射规则 ID。
- ConfigurationRule：条件、断言、严重性、解释、推荐修复；算法集中执行，不放在组件里。
- ResolvedSpecification：配置域及需要满足的特征集合。
- Material / MaterialFeatureValue：物料分类及 schema 实例；可具有 MaterialBom / MaterialBomLine。
- MaterialMatchResult：唯一匹配、无匹配、多候选待决、无需附件；不自动选择多个候选中的第一项。
- ConfigurationTrace：意图 → 映射 → Requirement → Specification → 物料 → 物料自身 BOM。
- ConfiguredBom / ConfiguredBomLine：已解析物料的装配结果、数量、来源及三维 geometryKey。

## Mock 策略与计算边界

车架物料含铝合金 CITY、碳纤维 SPORT、铝合金 SPORT；COMFORT 下提供两个相同规格的铝合金物料用于候选演示。STEEL 暂无物料，作为无匹配状态。轮组包括 28C ROAD、35C CITY、35C/45C GRAVEL。传动包含 8 速、11 速和单速；部分 schema 合法值暂未入物料库。附件通过各自布尔 Requirement 独立解析。

营销模板：Standard（铝／28C／8速／挡泥板）、Commuter（增加货架和灯）、Explore（碳／45C Gravel／11速／无货架）。Gravel 场景配 ROAD 或 28C 产生 Conflict；SPORT 配货架产生 Conflict；通勤无灯产生 Warning，并给出 Recommended 修复。

五个纯函数边界：marketingResolver → ruleEngine → specificationResolver → materialMatcher → bomAssembler。生成前重新计算并检查全部决策，不信任 UI 按钮状态。

## React 组件与现有系统接入

frontend/features/product-configurator/{model,mock,engine,components,pages}。React 页面嵌入现有 SAPUI5 路由容器；UI5 保留外壳及结果页，Rspack 打包 React，浏览器内存 store 用 useSyncExternalStore 订阅。结果经明确的 UI5 适配器写入 bom JSONModel。没有后端接口或数据库。

```text
产品首页：产品信息 | 产品架构与特征字典 | 三套配置模板 → 开始配置

选配器：URBAN / 草稿修订                    01 产品 → 02 选配 → 03 解析 → 04 BOM
        配置域       营销配置 | 技术配置             实时解析
        整车         使用场景、等级 / 特征编辑        Requirement → Material
        FRAME        来源与覆盖标记                  冲突及推荐修复
        WHEEL                                       为什么选择？
        DRIVETRAIN   恢复推荐                        查看解析详情
        ACCESSORY

解析页：需求与规格 | 物料匹配与手动决策 | 规则与来源追溯
        配置确认（警告确认） → 生成 Configured BOM → 查看最终 BOM

结果页：产品 / A.01 / 100% Configured BOM / 返回配置
        BOM Tree（物料、来源、数量、状态） | 既有三维预览
```
