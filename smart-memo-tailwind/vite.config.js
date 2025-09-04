import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  base: "./", // 告诉 Vite 使用相对路径
  plugins: [react()],
  define: {
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./frontend"), // 可选：用 @ 代表 frontend 目录
    },
  },
});
