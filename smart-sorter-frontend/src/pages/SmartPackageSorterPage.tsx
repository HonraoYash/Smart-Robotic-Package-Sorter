import React, { useState, useEffect } from 'react';
import { PackageRack } from '../components/PackageRack';
import { ConveyorBelt } from '../components/ConveyorBelt';
import { BinDashboard } from '../components/BinDashboard';
import { UploadMode } from '../components/UploadMode';
import { ModeToggle } from '../components/ModeToggle';
import { Package, BinData, SortingResult } from '../types/package';

const SmartPackageSorterPage = () => {
  const [mode, setMode] = useState<'upload' | 'simulation'>('simulation');
  const [binData, setBinData] = useState<BinData[]>([
    { id: 1, name: 'Fragile', count: 0, color: 'bg-red-500' },
    { id: 2, name: 'Urgent', count: 0, color: 'bg-yellow-500' },
    { id: 3, name: 'Heavy', count: 0, color: 'bg-blue-500' }
  ]);
  const [sortingPackage, setSortingPackage] = useState<Package | null>(null);
  const [sortingResult, setSortingResult] = useState<SortingResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const classifyPackage = async (packageData: Package | File): Promise<SortingResult> => {
    if (packageData instanceof File) {
      const formData = new FormData();
      formData.append("file", packageData);

      const res = await fetch("http://localhost:8000/classify", {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        throw new Error(`API Error: ${res.statusText}`);
      }

      const data = await res.json();
      return {
        label: data.label,
        confidence: data.confidence,
        bin_id: data.bin_id,
        annotated_image: data.annotated_image // Base64 string from backend
      };

    } else {
      // Simulation mode - unchanged
      const label = packageData.label;
      const confidence = 0.90 + Math.random() * 0.05;
      const binId = label === 'fragile' ? 1 : label === 'urgent' ? 2 : 3;

      return {
        label,
        confidence,
        bin_id: binId,
        annotated_image: packageData.image // URL for simulation packages
      };
    }
  };

  const handlePackageSort = async (packageData: Package | File) => {
    setIsLoading(true);
    try {
      // Set visual package for animation
      if (packageData instanceof File) {
        setSortingPackage({
          id: 'uploaded_pkg',
          label: '',
          barcode: 'IMG-UPL001',
          description: 'Uploaded Package',
          image: '', // No blob URL created
          weight: '',
          isUpload: true
        });
      } else {
        setSortingPackage(packageData);
      }

      // Classify package
      const result = await classifyPackage(packageData);
      setSortingResult(result);

      // Update bin counts
      setBinData(prev =>
        prev.map(bin =>
          bin.id === result.bin_id
            ? { ...bin, count: bin.count + 1 }
            : bin
        )
      );

      // Clear animation after delay
      setTimeout(() => {
        setSortingPackage(null);
        setSortingResult(null);
      }, 3000);

    } catch (error) {
      console.error('Error classifying package:', error);
      // Optionally show error to user
    } finally {
      setIsLoading(false);
    }
  };

  // Cleanup any blob URLs when component unmounts
  useEffect(() => {
    return () => {
      if (sortingPackage?.isUpload && sortingPackage.image) {
        URL.revokeObjectURL(sortingPackage.image);
      }
    };
  }, [sortingPackage]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                🏭 Smart Package Sorting System
              </h1>
              <p className="text-slate-300 mt-1">Automated warehouse package classification</p>
            </div>
            <ModeToggle mode={mode} onModeChange={setMode} disabled={isLoading} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <BinDashboard bins={binData} />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            {mode === 'simulation' ? (
              <PackageRack onPackageSelect={handlePackageSort} disabled={isLoading} />
            ) : (
              <UploadMode onFileUpload={handlePackageSort} disabled={isLoading} />
            )}
          </div>

          <div className="lg:col-span-2">
            <ConveyorBelt 
              sortingPackage={sortingPackage}
              sortingResult={sortingResult}
              bins={binData}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartPackageSorterPage;