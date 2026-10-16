import { resolve } from "node:path";
import process from "node:process";
import { defineConfig } from "@rspack/cli";

const projectRoot = import.meta.dirname;

export default defineConfig({
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
  entry: resolve(projectRoot, "webapp/blueprint/constraint-blueprint.ts"),
  devtool: false,
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: "builtin:swc-loader",
        options: {
          jsc: {
            parser: { syntax: "typescript" },
            target: "es2020"
          }
        }
      }
    ]
  },
  resolve: { extensions: [".ts", ".js", ".json"] },
  output: {
    path: resolve(projectRoot, "webapp/vendor"),
    filename: "constraint-blueprint.js",
    clean: false,
    iife: true,
    library: { name: "ConfigurationBlueprint", type: "window" }
  },
  optimization: { minimize: false }
});
