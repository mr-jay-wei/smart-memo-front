/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // 恢复扫描 src 目录
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}