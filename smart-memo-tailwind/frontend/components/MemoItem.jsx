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