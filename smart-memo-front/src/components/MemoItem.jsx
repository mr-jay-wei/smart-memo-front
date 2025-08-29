import React from 'react';

function MemoItem({ memo, onDelete, onEdit, onToggleImportant }) {
  return (
    <div className={`memo-item ${memo.isImportant ? 'important' : ''}`}>
      <div className="memo-header">
        <h3>{memo.title}</h3>
        <button 
          onClick={() => onToggleImportant(memo.id)}
          className="btn-icon"
          title={memo.isImportant ? '取消标记' : '标记为重要'}
        >
          {memo.isImportant ? '⭐' : '☆'}
        </button>
      </div>
      <p className="memo-content">{memo.content}</p>
      <div className="memo-footer">
        <span className="memo-date">{memo.createdAt}</span>
        <div className="memo-actions">
          <button onClick={() => onEdit(memo)} className="btn btn-small">
            编辑
          </button>
          <button onClick={() => onDelete(memo.id)} className="btn btn-small btn-danger">
            删除
          </button>
        </div>
      </div>
    </div>
  );
}

export default MemoItem;