
import { Link } from 'react-router-dom';
import { Package, ArrowRight } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="text-center max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <Package className="mx-auto mb-4 text-blue-400" size={64} />
          <h1 className="text-4xl font-bold mb-4 text-white">Welcome to Your Smart Warehouse</h1>
          <p className="text-xl text-slate-300">Experience the future of automated package sorting</p>
        </div>
        
        <div className="space-y-4">
          <Link
            to="/package-sorter"
            className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-8 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
          >
            <Package size={24} />
            <span>Launch Package Sorting System</span>
            <ArrowRight size={20} />
          </Link>
          
          <p className="text-slate-400 text-sm">
            Upload real package images or play the interactive simulation game
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
