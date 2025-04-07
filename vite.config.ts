import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import path from "path";

export default defineConfig({
  plugins: [react(), dts()],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/components.ts"),
      name: "CntrlSDK",
      fileName: (format) => `index.${format}.js`,
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      // input: {
      //   main: path.resolve(__dirname, 'src/components.ts')
      // },
      external: ["react", "react-dom", "classnames"],
      output: {
        preserveModules: false,
        manualChunks: undefined
      }
    },
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
  },
  css: {
    modules: {
      generateScopedName: "[name]__[local]___[hash:base64:5]",
    },
  },
});