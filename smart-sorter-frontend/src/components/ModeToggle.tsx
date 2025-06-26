
import React from 'react';
import { Package, Upload } from 'lucide-react';

interface ModeToggleProps {
  mode: 'upload' | 'simulation';
  onModeChange: (mode: 'upload' | 'simulation') => void;
}

export const ModeToggle: React.FC<ModeToggleProps> = ({ mode, onModeChange }) => {
  return (
    <div className="flex bg-slate-700 rounded-lg p-1">
      <button
        onClick={() => onModeChange('simulation')}
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
          mode === 'simulation'
            ? 'bg-blue-600 text-white shadow-md'
            : 'text-slate-300 hover:text-white hover:bg-slate-600'
        }`}
      >
        <Package size={18} />
        <span className="font-medium">Simulation</span>
      </button>
      <button
        onClick={() => onModeChange('upload')}
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
          mode === 'upload'
            ? 'bg-blue-600 text-white shadow-md'
            : 'text-slate-300 hover:text-white hover:bg-slate-600'
        }`}
      >
        <Upload size={18} />
        <span className="font-medium">Upload</span>
      </button>
    </div>
  );
};
