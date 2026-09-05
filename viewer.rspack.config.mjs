import { resolve } from "node:path";
import process from "node:process";
import { defineConfig } from "@rspack/cli";
import rspack from "@rspack/core";

const projectRoot = import.meta.dirname;
const chiliRoot = process.env.CHILI3D_ROOT
  ? resolve(process.env.CHILI3D_ROOT)
  : resolve(projectRoot, "..", "chili3d");
const outputPath = resolve(projectRoot, "webapp/vendor");

export default defineConfig({
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
  entry: resolve(projectRoot, "viewer/chili-preview.ts"),
  devtool: false,
  experiments: {
    css: true
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: "builtin:swc-loader",
        options: {
          jsc: {
            parser: {
              syntax: "typescript",
              decorators: true
            },
            target: "es2020"
          }
        }
      },
      {
        test: /\.module\.css$/,
        type: "css/module"
      },
      {
        test: /\.css$/,
        type: "css/auto"
      },
      {
        test: /\.wasm$/,
        type: "asset/resource",
        generator: {
          filename: "chili-wasm.wasm"
        }
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".js", ".json", ".wasm"],
    alias: {
      three: resolve(projectRoot, "node_modules/three"),
      "@chili3d/core$": resolve(chiliRoot, "packages/core/src/index.ts"),
      "@chili3d/element$": resolve(chiliRoot, "packages/element/src/index.ts"),
      "@chili3d/app-document$": resolve(chiliRoot, "packages/app/src/document.ts"),
      "@chili3d/three-factory$": resolve(chiliRoot, "packages/three/src/threeVisualFactory.ts"),
      "@chili3d/three-view$": resolve(chiliRoot, "packages/three/src/threeView.ts"),
      "@chili3d/three-visual$": resolve(chiliRoot, "packages/three/src/threeVisual.ts"),
      "@chili3d/wasm$": resolve(chiliRoot, "packages/wasm/src/index.ts")
    }
  },
  plugins: [
    new rspack.DefinePlugin({
      global: "globalThis",
      __APP_VERSION__: JSON.stringify("0.7.0"),
      __DOCUMENT_VERSION__: JSON.stringify("0.7.1"),
      __IS_PRODUCTION__: JSON.stringify(process.env.NODE_ENV === "production")
    }),
    new rspack.NormalModuleReplacementPlugin(
      /\.module\.css$/,
      resolve(projectRoot, "viewer/empty-css.js")
    ),
    new rspack.CopyRspackPlugin({
      patterns: [
        {
          from: resolve(chiliRoot, "packages/wasm/lib/chili-wasm.wasm"),
          to: "chili-wasm.wasm"
        }
      ]
    })
  ],
  output: {
    path: outputPath,
    filename: "chili-preview.js",
    clean: true,
    iife: true
  },
  optimization: {
    minimize: false
  }
});
