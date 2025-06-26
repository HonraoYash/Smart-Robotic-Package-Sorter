
import React, { useState, useRef } from 'react';
import { Upload, FileImage, X } from 'lucide-react';

interface UploadModeProps {
  onFileUpload: (file: File) => void;
}

export const UploadMode: React.FC<UploadModeProps> = ({ onFileUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
      }
    }
  };

  const handleAnalyze = () => {
    if (selectedFile) {
      onFileUpload(selectedFile);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        📤 Upload Package Image
      </h3>
      
      {!selectedFile ? (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer
                     ${dragActive 
                       ? 'border-blue-500 bg-blue-500/10' 
                       : 'border-slate-600 hover:border-slate-500 hover:bg-slate-700/50'
                     }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="mx-auto mb-4 text-slate-400" size={48} />
          <p className="text-slate-300 mb-2">
            <span className="font-medium">Click to upload</span> or drag and drop
          </p>
          <p className="text-slate-500 text-sm">JPEG, PNG files only</p>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-slate-700 rounded-lg p-4 relative">
            <button
              onClick={clearFile}
              className="absolute top-2 right-2 text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
            
            <div className="flex items-center gap-3">
              <FileImage className="text-blue-400" size={24} />
              <div className="flex-1">
                <div className="text-white font-medium truncate">{selectedFile.name}</div>
                <div className="text-slate-400 text-sm">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </div>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleAnalyze}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg
                     transition-colors duration-200 flex items-center justify-center gap-2"
          >
            🔍 Analyze Package
          </button>
        </div>
      )}
    </div>
  );
};
