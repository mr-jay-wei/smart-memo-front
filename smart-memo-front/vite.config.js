import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  server: {
    port: 5174,  // 指定端口为 5174
    host: true,  // 允许外部访问
    open: true,  // 启动时自动打开浏览器
    proxy: {
      // 将所有 /api 开头的请求代理到后端的 9000 端口
      '/api': {
        target: 'http://localhost:9000',
        changeOrigin: true,
      },
    },
  }
})
