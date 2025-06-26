
import React from 'react';
import { Package } from '../types/package';

interface PackageRackProps {
  onPackageSelect: (pkg: Package) => void;
}

const mockPackages: Package[] = [
  {
    id: 'pkg_01',
    image: '📦',
    label: 'fragile',
    weight: '2.5kg',
    barcode: 'FRG001',
    description: 'Glass Items'
  },
  {
    id: 'pkg_02',
    image: '📫',
    label: 'urgent',
    weight: '1.2kg',
    barcode: 'URG002',
    description: 'Express Delivery'
  },
  {
    id: 'pkg_03',
    image: '📦',
    label: 'heavy',
    weight: '15.8kg',
    barcode: 'HVY003',
    description: 'Machine Parts'
  },
  {
    id: 'pkg_04',
    image: '🎁',
    label: 'fragile',
    weight: '0.8kg',
    barcode: 'FRG004',
    description: 'Gift Box'
  },
  {
    id: 'pkg_05',
    image: '📋',
    label: 'urgent',
    weight: '0.5kg',
    barcode: 'URG005',
    description: 'Documents'
  },
  {
    id: 'pkg_06',
    image: '📦',
    label: 'heavy',
    weight: '12.3kg',
    barcode: 'HVY006',
    description: 'Equipment'
  },
  {
    id: 'pkg_07',
    image: '🍾',
    label: 'fragile',
    weight: '1.5kg',
    barcode: 'FRG007',
    description: 'Bottles'
  },
  {
    id: 'pkg_08',
    image: '⚡',
    label: 'urgent',
    weight: '3.2kg',
    barcode: 'URG008',
    description: 'Priority Mail'
  }
];

export const PackageRack: React.FC<PackageRackProps> = ({ onPackageSelect }) => {
  const getLabelColor = (label: string) => {
    switch (label) {
      case 'fragile': return 'border-red-500 bg-red-500/10';
      case 'urgent': return 'border-yellow-500 bg-yellow-500/10';
      case 'heavy': return 'border-blue-500 bg-blue-500/10';
      default: return 'border-slate-500 bg-slate-500/10';
    }
  };

  const getLabelEmoji = (label: string) => {
    switch (label) {
      case 'fragile': return '⚠️';
      case 'urgent': return '🚨';
      case 'heavy': return '⚖️';
      default: return '📋';
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        🏗️ Package Rack
      </h3>
      <p className="text-slate-300 text-sm mb-6">Click on packages to sort them</p>
      
      <div className="grid grid-cols-2 gap-3">
        {mockPackages.map((pkg) => (
          <div
            key={pkg.id}
            onClick={() => onPackageSelect(pkg)}
            className={`${getLabelColor(pkg.label)} border-2 rounded-lg p-4 cursor-pointer 
                       transition-all duration-200 hover:scale-105 hover:shadow-lg
                       active:scale-95 group`}
          >
            <div className="text-center">
              <div className="text-3xl mb-2">{pkg.image}</div>
              <div className="text-white font-medium text-sm mb-1">{pkg.description}</div>
              <div className="flex items-center justify-center gap-1 mb-2">
                <span className="text-xs">{getLabelEmoji(pkg.label)}</span>
                <span className="text-xs text-slate-300 uppercase font-bold">{pkg.label}</span>
              </div>
              <div className="text-xs text-slate-400">
                <div>{pkg.weight}</div>
                <div>{pkg.barcode}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
