import React, { useState, useEffect } from 'react';

function MemoForm({ onFormSubmit, editingMemo, onCancel }) { // 接收 onFormSubmit
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
      if (editingMemo) {
        onFormSubmit(editingMemo.id, { title, content }); // 调用 onFormSubmit
      } else {
        onFormSubmit({ title, content }); // 调用 onFormSubmit
      }
      setTitle('');
      setContent('');
    }
  };

  return (
    <form className="memo-form" onSubmit={handleSubmit}>
      <h2>{editingMemo ? '编辑备忘录' : '新建备忘录'}</h2>
      <input
        type="text"
        placeholder="标题"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="form-input"
      />
      <textarea
        placeholder="内容"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="form-textarea"
        rows="4"
      />
      <div className="form-buttons">
        <button type="submit" className="btn btn-primary">
          {editingMemo ? '更新' : '添加'}
        </button>
        {editingMemo && (
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            取消
          </button>
        )}
      </div>
    </form>
  );
}

export default MemoForm;