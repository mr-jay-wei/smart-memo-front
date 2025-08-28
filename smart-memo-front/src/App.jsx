import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import MemoForm from './components/MemoForm';
import MemoList from './components/MemoList';
import SearchBar from './components/SearchBar';

function App() {
  const [memos, setMemos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingMemo, setEditingMemo] = useState(null);

  const isMounted = useRef(false); // 添加这行

  // 从localStorage加载数据
  useEffect(() => {
    if (!isMounted.current) { // 添加这行条件判断
      isMounted.current = true; // 添加这行
      const savedMemos = localStorage.getItem('smart-memos');
      if (savedMemos) {
        setMemos(JSON.parse(savedMemos));
      }
    }
  }, []); // 依赖项保持为空数组

  // 保存到localStorage
  useEffect(() => {
    localStorage.setItem('smart-memos', JSON.stringify(memos));
  }, [memos]);

  // 添加备忘录
  const addMemo = (memo) => {
    const newMemo = {
      id: Date.now(),
      ...memo,
      createdAt: new Date().toLocaleString(),
      isImportant: false
    };
    setMemos([newMemo, ...memos]);
  };

  // 更新备忘录
  const updateMemo = (id, updatedMemo) => {
    setMemos(memos.map(memo => 
      memo.id === id ? { ...memo, ...updatedMemo } : memo
    ));
    setEditingMemo(null);
  };

  // 删除备忘录
  const deleteMemo = (id) => {
    setMemos(memos.filter(memo => memo.id !== id));
  };

  // 切换重要标记
  const toggleImportant = (id) => {
    setMemos(memos.map(memo =>
      memo.id === id ? { ...memo, isImportant: !memo.isImportant } : memo
    ));
  };

  // 过滤备忘录
  const filteredMemos = memos.filter(memo =>
    memo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    memo.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="App">
      <header className="App-header">
        <h1>📝 Smart Memo</h1>
      </header>
      
      <div className="container">
        <MemoForm 
          onFormSubmit={editingMemo ? updateMemo : addMemo} // 将 onSubmit 改为 onFormSubmit
          editingMemo={editingMemo}
          onCancel={() => setEditingMemo(null)}
        />
        
        <SearchBar 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        
        <MemoList 
          memos={filteredMemos}
          onDelete={deleteMemo}
          onEdit={setEditingMemo}
          onToggleImportant={toggleImportant}
        />
      </div>
    </div>
  );
}

export default App;