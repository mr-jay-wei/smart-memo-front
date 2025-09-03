import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:5000",
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./frontend"), // 可选：用 @ 代表 frontend 目录
    },
  },
});
