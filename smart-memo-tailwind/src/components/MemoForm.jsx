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