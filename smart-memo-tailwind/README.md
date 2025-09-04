---

```markdown
# 📝 Smart Memo

Smart Memo 是一个桌面端的智能备忘录应用，基于 **Electron + React + Vite** 构建，支持：

- 桌面端运行（Windows / macOS）
- 快速创建、编辑、删除备忘录
- 搜索功能
- 重要备忘录标记
- 本地存储备忘录数据
- 获取当前应用版本

---

## 项目结构

```

smart-memo-tailwind/
├── backend # 后端服务 (Express)
├── electron # Electron 主进程和 preload 文件
├── frontend # 前端 React 页面
├── public # 静态资源
├── eslint.config.js # ESLint 配置
├── index.html # 前端入口 HTML
├── package.json # 项目配置及依赖
├── postcss.config.js # PostCSS 配置
├── README.md # 项目说明文档
├── tailwind.config.js # Tailwind CSS 配置
└── vite.config.js # Vite 配置

```

---

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发环境

#### 前端 + 后端 + Electron

```bash
npm run start
```

- `frontend` 会运行 Vite 开发服务器
- `backend` 会运行 Express API 服务器
- `electron` 会加载桌面端应用

#### 只启动前端开发服务器

```bash
npm run dev
```

#### 只启动后端服务

```bash
npm run server
```

---

### 构建桌面应用

```bash
npm run electron:build
```

- 打包后的应用会输出在 `dist_electron/` 文件夹中
- Windows 使用 NSIS 安装器，macOS 使用 DMG

---

## 前端功能说明

- **新建备忘录**：填写标题和内容，点击添加
- **编辑备忘录**：点击备忘录列表中的编辑按钮
- **删除备忘录**：点击删除按钮
- **标记重要**：点击星星图标切换重要标记
- **搜索备忘录**：顶部搜索框实时过滤备忘录
- **保存数据**：所有备忘录会自动保存到本地 `localStorage`

---

## 后端功能说明

- 简单 Express 服务，用于提供项目版本号
- API 示例：

```bash
GET /api/version
```

返回 JSON：

```json
{ "version": "1.0.4" }
```

---

## 技术栈

- **Electron**：桌面端框架
- **React 19**：前端 UI
- **Vite**：前端构建工具
- **Tailwind CSS**：样式
- **Express**：后端服务
- **ESLint**：代码规范检查

---

## 项目概览

项目概览文件 `generated_project_overview.md` 可自动生成，包含：

- 项目目录树
- 源码文件内容
- 忽略构建产物和依赖文件

生成命令：

```bash
python generate_project_overview.py
```

---

## 开发注意事项

- Electron 主进程代码在 `electron/*.cjs`
- 前端 React 代码在 `frontend/` 下
- 后端 Express 代码在 `backend/` 下
- 构建产物（`dist_electron/`）不应被提交到版本控制

---

## 作者

Jay Wei
📧 [xiafeng.0209@gmail.com](mailto:your.email@example.com)

```

```
