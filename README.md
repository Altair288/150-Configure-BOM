# Super BOM Configurator

这是一个 SAPUI5 + TypeScript 的可视化 Super BOM 原型，右侧 CAD 预览复用 Chili3D 的真实 Three.js 渲染链路和 OCCT WASM 转换器，不使用 `sap.ui.vk`、React 或 Next.js。

## 技术基线

- SAPUI5 1.152.0
- UI5 Tooling 4
- TypeScript + XML View + MVC + Component
- UI5 Router、JSONModel、ResourceModel
- Chili3D `@chili3d/core`、`@chili3d/three`、`@chili3d/wasm` 源码 bundle
- Three.js 0.184.0
- QUnit 测试入口

## 当前 Viewer 能力

- 加载 STEP、STP、IGES、IGS、STL、BREP
- BOM 装配树与 Chili3D 场景节点映射
- Part 选择与 BOM 双向同步
- 对面、边、顶点选择模式的 Chili3D 事件入口
- Chili3D 高亮
- 节点隐藏/显示
- 爆炸视图
- 拖拽旋转与滚轮缩放
- Fit / Zoom In / Zoom Out
- Section 剖切平面
- 选中节点包围盒测量

演示 BOM 首次加载的是由 Chili3D `MeshNode` 构成的预览装配；通过“加载模型”可以切换到真实 CAD 文件，STEP/IGES/STL/BREP 转换由 OCCT WASM 完成。

## 启动

当前工程默认依赖同级目录中的 Chili3D 源码仓库：

```text
D:/Github/
├── 150-Configure-BOM/
└── chili3d/
```

如果 Chili3D 在其他位置，可以设置 `CHILI3D_ROOT`：

```powershell
$env:CHILI3D_ROOT = "D:\path\to\chili3d"
npm install
npm start
```

默认入口：<http://localhost:8080/index.html>。如果 8080 已被占用，UI5 CLI 会选择其他端口。

## 开发命令

```bash
npm install
npm start
npm run build:viewer
npm run typecheck
npm run lint
npm run format:check
npm run test
npm run build
```

`npm start` 和 `npm run build` 会先执行 `build:viewer`，将 bundle 和 OCCT WASM 输出到 `webapp/vendor/`。

## 目录边界

```text
viewer/
└── chili-preview.ts       # Chili3D viewer bundle 入口

webapp/
├── component/             # ChiliPreview Host 与 UI5 组件边界
├── controller/            # BOM、Viewer 事件协调
├── view/                  # XML View
├── model/                 # BOM 与 UI 状态
├── service/               # 后端服务边界
├── domain/                # 配置规则
├── types/                 # Host 类型声明
└── vendor/                # build:viewer 生成的静态 bundle/WASM
```

- `viewer/chili-preview.ts` 只复用 Chili3D 的 `ThreeVisual`、`ThreeView`、`ThreeVisualContext`、`ThreeHighlighter`、`CameraController` 和 WASM converter。
- UI5 Controller 不直接操作 Three.js 内部对象，只调用 `ChiliPreviewHost`。
- `webapp/component/VKViewer.ts` 已删除，项目代码和运行时 manifest 不再依赖 `sap.ui.vk`。
- `webapp/view/Bom.view.xml` 是 Windchill 风格的主要工作台：对象标题、结构页签、命令栏、BOM TreeTable、CAD 视图和属性区。

## 验证

```text
npm run build:viewer       PASS
npm run typecheck          PASS
npm run lint               PASS
npm run format:check       PASS
npm run test               PASS
npm run build              PASS
```
