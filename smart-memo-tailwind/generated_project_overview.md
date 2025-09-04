# 项目概览: smart-memo-tailwind

本文档由`generate_project_overview.py`自动生成，包含了项目的结构树和所有可读文件的内容。

## 项目结构

```
smart-memo-tailwind/
├── backend
│   └── server.js
├── electron
│   ├── main.cjs
│   └── preload.cjs
├── frontend
│   ├── assets
│   ├── components
│   │   ├── MemoForm.jsx
│   │   ├── MemoItem.jsx
│   │   ├── MemoList.jsx
│   │   └── SearchBar.jsx
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── public
├── eslint.config.js
├── index.html
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.js
└── vite.config.js
```

---

# 文件内容

## `backend/server.js`

```javascript
// server.js
import express from "express";
import fs from "fs";

const app = express();
const PORT = 5000; // 后端监听端口

// API: 返回项目版本号
app.get("/api/version", (req, res) => {
  const pkg = JSON.parse(fs.readFileSync("./package.json", "utf-8"));
  res.json({ version: pkg.version });
});

app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});

```

## `electron/main.cjs`

```
// electron/main.cjs

// 使用 CommonJS 的 "require" 语法，这对于 .cjs 文件是100%正确的
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

// 从应用自身获取版本号 (专业方式)
const appVersion = app.getVersion();

function createWindow() {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      // __dirname 在 .cjs 文件中可以直接使用，非常可靠
      preload: path.join(__dirname, "preload.cjs"),
    },
    // icon: path.join(__dirname, 'icon.ico') // 同样，图标路径也是安全的
  });

  const devUrl = "http://localhost:5173";
  const isDev = process.defaultApp;

  if (isDev) {
    win.loadURL(devUrl);
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  }

  win.setMenu(null);
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.handle("get-version", () => {
  console.log("主进程收到请求，正在返回版本号...");
  return appVersion;
});

```

## `electron/preload.cjs`

```
// electron/preload.cjs
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  getVersion: () => ipcRenderer.invoke("get-version"),
});

```

## `eslint.config.js`

```javascript
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
])

```

## `frontend/App.jsx`

```
import { useState, useEffect, useRef } from "react";
import MemoForm from "./components/MemoForm";
import MemoList from "./components/MemoList";
import SearchBar from "./components/SearchBar";

function App() {
  const [memos, setMemos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingMemo, setEditingMemo] = useState(null);
  // 1. 初始状态设为 null，表示还没有获取版本号
  const [version, setVersion] = useState(null);
  const isMounted = useRef(false);

  // 这个 useEffect 现在只负责从 localStorage 加载备忘录，职责更单一
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      try {
        const savedMemos = localStorage.getItem("smart-memos");
        if (savedMemos) setMemos(JSON.parse(savedMemos));
      } catch (error) {
        console.error("加载备忘录失败:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (isMounted.current) {
      localStorage.setItem("smart-memos", JSON.stringify(memos));
    }
  }, [memos]);

  // 2. 创建一个专门用于处理按钮点击的函数
  const handleFetchVersion = async () => {
    // 3. 把获取版本的逻辑从 useEffect 移动到这里
    if (window.api && typeof window.api.getVersion === "function") {
      try {
        setVersion("加载中..."); // 可以在点击后给一个即时反馈
        const appVersion = await window.api.getVersion();
        setVersion(appVersion);
      } catch (error) {
        console.error("获取版本号失败:", error);
        setVersion("获取失败");
      }
    } else {
      setVersion("非桌面版");
    }
  };

  // ... App.jsx 中其他的函数 (handleFormSubmit, deleteMemo 等) 保持不变 ...
  const handleFormSubmit = (memoData) => {
    if (editingMemo) {
      setMemos(
        memos.map((memo) =>
          memo.id === editingMemo.id ? { ...memo, ...memoData } : memo
        )
      );
      setEditingMemo(null);
    } else {
      const newMemo = {
        id: crypto.randomUUID(),
        ...memoData,
        createdAt: new Date().toLocaleString(),
        isImportant: false,
      };
      setMemos([newMemo, ...memos]);
    }
  };
  const deleteMemo = (id) => setMemos(memos.filter((memo) => memo.id !== id));
  const toggleImportant = (id) =>
    setMemos(
      memos.map((memo) =>
        memo.id === id ? { ...memo, isImportant: !memo.isImportant } : memo
      )
    );
  const filteredMemos = memos.filter(
    (memo) =>
      (memo.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (memo.content?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-blue-400 p-1 shadow-md">
        <h1 className="text-3xl font-bold text-white text-center">
          📝 Smart Memo
        </h1>
      </header>
      <main className="max-w-4xl mx-auto p-4 md:p-6">
        {/* 4. 重新添加按钮，并添加条件渲染来显示版本号 */}
        <div className="mb-6 flex gap-4 items-center">
          <button
            onClick={handleFetchVersion}
            className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition"
          >
            获取项目版本
          </button>
          {/* 这个语法的意思是：当 version 有值 (不为 null) 时，才渲染后面的 <span> */}
          {version && (
            <span className="text-gray-700">当前版本：{version}</span>
          )}
        </div>

        <MemoForm
          onFormSubmit={handleFormSubmit}
          editingMemo={editingMemo}
          onCancel={() => setEditingMemo(null)}
        />
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <MemoList
          memos={filteredMemos}
          onDelete={deleteMemo}
          onEdit={setEditingMemo}
          onToggleImportant={toggleImportant}
        />
      </main>
    </div>
  );
}

export default App;

```

## `frontend/components/MemoForm.jsx`

```
import React, { useState, useEffect } from 'react';

function MemoForm({ onFormSubmit, editingMemo, onCancel }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (editingMemo) {
      setTitle(editingMemo.title);
      setContent(editingMemo.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [editingMemo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      onFormSubmit({ title, content });
      setTitle('');
      setContent('');
    }
  };

  return (
    <form className="bg-white p-6 rounded-lg shadow-md mb-6" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">{editingMemo ? '编辑备忘录' : '新建备忘录'}</h2>
      <input type="text" placeholder="标题" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 transition" />
      <textarea placeholder="内容" value={content} onChange={(e) => setContent(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 transition" rows="4" />
      <div className="flex gap-4">
        <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition">{editingMemo ? '更新' : '添加'}</button>
        {editingMemo && (<button type="button" onClick={onCancel} className="px-6 py-2 bg-gray-500 text-white font-semibold rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transition">取消</button>)}
      </div>
    </form>
  );
}
export default MemoForm;
```

## `frontend/components/MemoItem.jsx`

```
import React from 'react';

function MemoItem({ memo, onDelete, onEdit, onToggleImportant }) {
  const itemClasses = 'bg-white p-5 rounded-lg shadow-md transition-transform transform hover:-translate-y-1 hover:shadow-lg flex flex-col h-full';
  const importantClasses = memo.isImportant ? 'border-l-4 border-yellow-400' : '';

  return (
    <div className={`${itemClasses} ${importantClasses}`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-bold text-gray-800 break-words mr-2">{memo.title}</h3>
        <button onClick={() => onToggleImportant(memo.id)} className="text-2xl text-gray-300 hover:text-yellow-500 transition-colors focus:outline-none flex-shrink-0" title={memo.isImportant ? '取消标记' : '标记为重要'}>
          {memo.isImportant ? '⭐' : '☆'}
        </button>
      </div>
      <p className="text-gray-600 mb-4 whitespace-pre-wrap break-words flex-grow">{memo.content}</p>
      <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
        <span className="text-xs text-gray-400">{memo.createdAt}</span>
        <div className="flex gap-2">
          <button onClick={() => onEdit(memo)} className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition">编辑</button>
          <button onClick={() => onDelete(memo.id)} className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition">删除</button>
        </div>
      </div>
    </div>
  );
}
export default MemoItem;
```

## `frontend/components/MemoList.jsx`

```
import React from 'react';
import MemoItem from './MemoItem';

function MemoList({ memos, onDelete, onEdit, onToggleImportant }) {
  if (memos.length === 0) {
    return (
      <div className="text-center py-10 px-6 bg-white rounded-lg shadow-md">
        <p className="text-gray-500">暂无备忘录，快来创建第一个吧！</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {memos.map(memo => (
        <MemoItem key={memo.id} memo={memo} onDelete={onDelete} onEdit={onEdit} onToggleImportant={onToggleImportant} />
      ))}
    </div>
  );
}
export default MemoList;
```

## `frontend/components/SearchBar.jsx`

```
import React from 'react';

function SearchBar({ searchTerm, onSearchChange }) {
  return (
    <div className="mb-6">
      <input type="text" placeholder="搜索备忘录..." value={searchTerm} onChange={(e) => onSearchChange(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
    </div>
  );
}
export default SearchBar;
```

## `frontend/index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## `frontend/main.jsx`

```
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);

```

## `index.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>📝 Smart Memo</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/frontend/main.jsx"></script>
  </body>
</html>

```

## `package.json`

```json
{
  "name": "smart-memo-desktop",
  "private": true,
  "version": "1.0.4",
  "description": "A smart memo application for your desktop.",
  "author": "Your Name",
  "homepage": "./",
  "main": "electron/main.cjs",
  "type": "module",
  "scripts": {
    "start": "concurrently \"npm run server\" \"npm run dev\"",
    "dev": "vite",
    "server": "node backend/server.cjs",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "electron:dev": "vite",
    "electron:build": "vite build && electron-builder",
    "app:dev": "wait-on tcp:5173 && electron ."
  },
  "dependencies": {
    "express": "^4.19.2",
    "react": "^19.1.1",
    "react-dom": "^19.1.1"
  },
  "devDependencies": {
    "@eslint/js": "^9.33.0",
    "@types/react": "^19.1.10",
    "@types/react-dom": "^19.1.7",
    "@vitejs/plugin-react": "^5.0.0",
    "autoprefixer": "^10.4.17",
    "concurrently": "^9.2.1",
    "electron": "^38.0.0",
    "electron-builder": "^26.0.12",
    "eslint": "^9.33.0",
    "eslint-plugin-react-hooks": "^5.2.0",
    "eslint-plugin-react-refresh": "^0.4.20",
    "globals": "^16.3.0",
    "postcss": "^8.4.31",
    "tailwindcss": "^3.4.1",
    "vite": "^4.5.2",
    "wait-on": "^8.0.4"
  },
  "build": {
    "appId": "com.smartmemo.app",
    "productName": "Smart Memo",
    "files": [
      "dist/**/*",
      "electron/**/*"
    ],
    "directories": {
      "buildResources": "assets",
      "output": "dist_electron"
    },
    "win": {
      "target": "nsis"
    },
    "mac": {
      "target": "dmg"
    },
    "publish": null
  }
}

```

## `postcss.config.js`

```javascript
export default {
  plugins: {
    'tailwindcss/nesting': {},
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

## `README.md`

````text
\# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

#\# Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

````

## `tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./frontend/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};

```

## `vite.config.js`

```javascript
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

```

