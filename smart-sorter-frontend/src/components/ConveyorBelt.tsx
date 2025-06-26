import React, { useState, useEffect } from 'react';
import { Package, BinData, SortingResult } from '../types/package';

interface ConveyorBeltProps {
  sortingPackage: Package | null;
  sortingResult: SortingResult | null;
  bins: BinData[];
}

export const ConveyorBelt: React.FC<ConveyorBeltProps> = ({ 
  sortingPackage, 
  sortingResult, 
  bins 
}) => {
  const [packagePosition, setPackagePosition] = useState(0);
  const [sortingPhase, setSortingPhase] = useState<'idle' | 'moving' | 'analyzing' | 'sorting'>('idle');
  const [armPosition, setArmPosition] = useState({ rotation: 0, extended: false });

  useEffect(() => {
    if (sortingPackage) {
      setSortingPhase('moving');
      setPackagePosition(0);
      setArmPosition({ rotation: 0, extended: false });
      
      // Move package to center
      const moveTimer = setTimeout(() => {
        setPackagePosition(50);
        setSortingPhase('analyzing');
      }, 100);

      return () => clearTimeout(moveTimer);
    }
  }, [sortingPackage]);

  useEffect(() => {
    if (sortingResult && sortingPhase === 'analyzing') {
      setSortingPhase('sorting');
      
      // Calculate arm rotation based on bin
      const armRotation = sortingResult.bin_id === 1 ? -45 : 
                         sortingResult.bin_id === 2 ? 0 : 45;
      
      // Extend arm first
      setTimeout(() => {
        setArmPosition({ rotation: 0, extended: true });
      }, 200);
      
      // Rotate and swipe
      setTimeout(() => {
        setArmPosition({ rotation: armRotation, extended: true });
        
        // Move package to bin
        const binPosition = sortingResult.bin_id === 1 ? 20 : 
                           sortingResult.bin_id === 2 ? 50 : 80;
        setPackagePosition(binPosition);
      }, 800);
      
      // Retract arm
      setTimeout(() => {
        setArmPosition({ rotation: 0, extended: false });
      }, 1500);
    }
  }, [sortingResult, sortingPhase]);

  // Helper function to render package content
  const renderPackageContent = () => {
    if (!sortingPackage) return null;

    if (sortingPackage.isUpload) {
      // For uploaded packages (using base64 from sortingResult)
      return (
        <>
          <div className="text-2xl mb-1">
            {sortingResult?.annotated_image ? (
              <img 
                src={sortingResult.annotated_image} 
                alt="Annotated package" 
                className="w-16 h-16 object-contain"
              />
            ) : '📦'}
          </div>
          <div className="text-xs text-slate-300 font-medium">
            Package
          </div>
          <div className="text-[10px] text-slate-400">
            IMG-UPL001
          </div>
        </>
      );
    } else {
      // For simulation packages (using image URL)
      return (
        <>
          <div className="text-2xl mb-1">
            {sortingPackage.image}
          </div>
          <div className="text-xs text-slate-300 font-medium">
            {sortingPackage.description}
          </div>
          <div className="text-[10px] text-slate-400">
            {sortingPackage.barcode || sortingPackage.id}
          </div>
        </>
      );
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
        🏭 Conveyor Belt System
      </h3>
      
      {/* Conveyor Belt */}
      <div className="relative bg-slate-900 rounded-lg p-6 mb-6 overflow-hidden">
        {/* Belt Animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 opacity-50">
          <div className="h-full w-full bg-repeating-linear-gradient bg-stripe animate-pulse"></div>
        </div>
        
        {/* Conveyor Track */}
        <div className="relative h-24 border-2 border-slate-600 rounded-lg bg-slate-800/50">
          {/* Package on conveyor */}
          {sortingPackage && (
            <div
              className="absolute top-1/2 transform -translate-y-1/2 transition-all duration-1000 ease-in-out z-10"
              style={{ 
                left: `${packagePosition}%`,
                transform: `translateY(-50%) ${sortingPhase === 'sorting' ? 'translateY(-80px)' : ''}`
              }}
            >
              <div className="bg-slate-700 rounded-lg p-3 border-2 border-slate-500 min-w-16 text-center">
                {renderPackageContent()}
              </div>
            </div>
          )}
          
          {/* Scanning Area */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-full border-2 border-dashed border-blue-500/50 rounded-lg flex items-center justify-center">
            {sortingPhase === 'analyzing' && (
              <div className="text-blue-400 animate-pulse">
                🔍 Scanning...
              </div>
            )}
          </div>
          
          {/* Robotic Arm Base */}
          <div className="absolute top-0 right-1/4 transform translate-x-1/2 w-8 h-full flex items-end justify-center">
            <div className="bg-slate-600 w-6 h-6 rounded-full border-2 border-slate-400 relative">
              {/* Arm Extension */}
              <div 
                className={`absolute bottom-full left-1/2 transform -translate-x-1/2 origin-bottom transition-all duration-500 ${
                  armPosition.extended ? 'h-16' : 'h-8'
                }`}
                style={{ 
                  transform: `translateX(-50%) rotate(${armPosition.rotation}deg)`,
                  transformOrigin: 'bottom center'
                }}
              >
                <div className="w-2 h-full bg-orange-500 rounded-t-full relative">
                  {/* Arm Joint */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-orange-600 rounded-full border border-orange-400"></div>
                  {/* Gripper */}
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
                    <div className="flex gap-1">
                      <div className="w-1 h-3 bg-orange-400 rounded"></div>
                      <div className="w-1 h-3 bg-orange-400 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Arm Status Indicator */}
              {sortingPhase === 'sorting' && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-orange-400 animate-bounce text-xs whitespace-nowrap">
                  🦾 Sorting
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Bin Drop Zones */}
        <div className="absolute -bottom-2 left-0 w-full h-8 flex justify-between px-4">
          {bins.map((bin) => (
            <div 
              key={bin.id} 
              className={`w-16 h-8 ${bin.color} opacity-30 rounded-t-lg border-2 border-dashed border-slate-400`}
            ></div>
          ))}
        </div>
      </div>
      
      {/* Sorting Results */}
      {sortingResult && (
        <div className="bg-slate-700 rounded-lg p-4 mb-6">
          <h4 className="text-white font-medium mb-3">📋 Analysis Results</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-400">Label:</span>
              <span className="text-white ml-2 font-medium uppercase">{sortingResult.label}</span>
            </div>
            <div>
              <span className="text-slate-400">Confidence:</span>
              <span className="text-green-400 ml-2 font-medium">
                {(sortingResult.confidence * 100).toFixed(1)}%
              </span>
            </div>
            <div>
              <span className="text-slate-400">Target Bin:</span>
              <span className="text-blue-400 ml-2 font-medium">Bin {sortingResult.bin_id}</span>
            </div>
            <div>
              <span className="text-slate-400">Status:</span>
              <span className="text-green-400 ml-2 font-medium">✅ Sorted</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Sorting Bins */}
      <div className="grid grid-cols-3 gap-4">
        {bins.map((bin) => (
          <div key={bin.id} className="bg-slate-700 rounded-lg p-4 text-center">
            <div className={`w-16 h-16 ${bin.color} rounded-lg mx-auto mb-3 flex items-center justify-center`}>
              <span className="text-white font-bold text-xl">{bin.id}</span>
            </div>
            <div className="text-white font-medium">{bin.name}</div>
            <div className="text-slate-400 text-sm">{bin.count} packages</div>
          </div>
        ))}
      </div>
    </div>
  );
};