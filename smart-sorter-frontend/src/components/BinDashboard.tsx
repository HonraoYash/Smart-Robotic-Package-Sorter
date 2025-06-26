
import React from 'react';
import { BinData } from '../types/package';

interface BinDashboardProps {
  bins: BinData[];
}

export const BinDashboard: React.FC<BinDashboardProps> = ({ bins }) => {
  const totalPackages = bins.reduce((sum, bin) => sum + bin.count, 0);

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        📊 Sorting Dashboard
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Counter */}
        <div className="bg-slate-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-white">{totalPackages}</div>
          <div className="text-slate-300 text-sm">Total Sorted</div>
        </div>

        {/* Individual Bin Counters */}
        {bins.map((bin) => (
          <div key={bin.id} className="bg-slate-700 rounded-lg p-4 text-center">
            <div className={`w-4 h-4 rounded-full ${bin.color} mx-auto mb-2`}></div>
            <div className="text-2xl font-bold text-white">{bin.count}</div>
            <div className="text-slate-300 text-sm">{bin.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
