import React from 'react';
import { List, LayoutGrid } from 'lucide-react';

export interface ViewToggleProps {
  view: 'list' | 'kanban';
  onViewChange?: (view: 'list' | 'kanban') => void;
  onChange?: (view: 'list' | 'kanban') => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ view, onViewChange, onChange }) => {
  const handleChange = (newView: 'list' | 'kanban') => {
    if (onViewChange) onViewChange(newView);
    if (onChange) onChange(newView);
  };
  return (
    <div className="flex bg-gray-100 p-1 rounded-md border border-gray-200">
      <button
        type="button"
        onClick={() => handleChange('list')}
        className={`p-1.5 rounded-sm transition-colors ${
          view === 'list'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        }`}
        title="List View"
      >
        <List className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={() => handleChange('kanban')}
        className={`p-1.5 rounded-sm transition-colors ${
          view === 'kanban'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        }`}
        title="Kanban View"
      >
        <LayoutGrid className="w-5 h-5" />
      </button>
    </div>
  );
};
