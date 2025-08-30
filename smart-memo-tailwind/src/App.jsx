import { useState, useEffect, useRef } from 'react';
import MemoForm from './components/MemoForm';
import MemoList from './components/MemoList';
import SearchBar from './components/SearchBar';

function App() {
  const [memos, setMemos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingMemo, setEditingMemo] = useState(null);
  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      try {
        const savedMemos = localStorage.getItem('smart-memos');
        if (savedMemos) setMemos(JSON.parse(savedMemos));
      } catch (error) {
        console.error("Failed to load memos:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (isMounted.current) {
      localStorage.setItem('smart-memos', JSON.stringify(memos));
    }
  }, [memos]);

  const handleFormSubmit = (memoData) => {
    if (editingMemo) {
      setMemos(memos.map(memo => memo.id === editingMemo.id ? { ...memo, ...memoData } : memo));
      setEditingMemo(null);
    } else {
      const newMemo = { id: crypto.randomUUID(), ...memoData, createdAt: new Date().toLocaleString(), isImportant: false };
      setMemos([newMemo, ...memos]);
    }
  };

  const deleteMemo = (id) => setMemos(memos.filter(memo => memo.id !== id));
  const toggleImportant = (id) => setMemos(memos.map(memo => memo.id === id ? { ...memo, isImportant: !memo.isImportant } : memo));
  const filteredMemos = memos.filter(memo =>
    (memo.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (memo.content?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-blue-400 p-1 shadow-md">
        <h1 className="text-3xl font-bold text-white text-center">📝 Smart Memo</h1>
      </header>
      <main className="max-w-4xl mx-auto p-4 md:p-6">
        <MemoForm onFormSubmit={handleFormSubmit} editingMemo={editingMemo} onCancel={() => setEditingMemo(null)} />
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <MemoList memos={filteredMemos} onDelete={deleteMemo} onEdit={setEditingMemo} onToggleImportant={toggleImportant} />
      </main>
    </div>
  );
}
export default App;