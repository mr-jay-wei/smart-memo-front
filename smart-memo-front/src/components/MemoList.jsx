import React from 'react';
import MemoItem from './MemoItem';

function MemoList({ memos, onDelete, onEdit, onToggleImportant }) {
  if (memos.length === 0) {
    return <div className="empty-state">暂无备忘录，快来创建第一个吧！</div>;
  }

  return (
    <div className="memo-list">
      {memos.map(memo => (
        <MemoItem
          key={memo.id}
          memo={memo}
          onDelete={onDelete}
          onEdit={onEdit}
          onToggleImportant={onToggleImportant}
        />
      ))}
    </div>
  );
}

export default MemoList;