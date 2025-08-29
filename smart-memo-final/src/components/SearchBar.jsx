import React from 'react';

function SearchBar({ searchTerm, onSearchChange }) {
  return (
    <div className="mb-6">
      <input type="text" placeholder="搜索备忘录..." value={searchTerm} onChange={(e) => onSearchChange(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
    </div>
  );
}
export default SearchBar;