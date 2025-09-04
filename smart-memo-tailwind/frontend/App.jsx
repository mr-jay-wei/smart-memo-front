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
