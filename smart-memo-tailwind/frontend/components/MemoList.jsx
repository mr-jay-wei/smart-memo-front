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