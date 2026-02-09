
import React, { useMemo, useState } from 'react';
import { EstimateCategory, PropertyDetails } from '../types';
import { exportToPDF } from '../pdfService';

interface EstimatorProps {
  property: PropertyDetails;
  categories: EstimateCategory[];
  onUpdateItem: (catId: string, itemId: string, field: 'unitPrice' | 'qty' | 'conditions', value: any) => void;
  onBack: () => void;
  onAnalyze: () => void;
}

const Estimator: React.FC<EstimatorProps> = ({ property, categories, onUpdateItem, onBack, onAnalyze }) => {
  const [isExporting, setIsExporting] = useState(false);
  
  const subtotal = useMemo(() => {
    return Math.round(categories.reduce((acc, cat) => 
      acc + cat.items.reduce((sum, item) => sum + (item.unitPrice * item.qty), 0)
    , 0));
  }, [categories]);

  const contingency = Math.round(subtotal * 0.15);
  const grandTotal = subtotal + contingency;

  const handleExport = () => {
    setIsExporting(true);
    try {
      exportToPDF(property, categories);
    } catch (err) {
      console.error("PDF Export failed", err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-64 text-slate-900 dark:text-slate-100">
      <header className="sticky top-0 z-30 bg-background-light/80 dark:bg-background-dark/80 ios-blur border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
            <span className="material-icons-round text-slate-600 dark:text-slate-400 text-xl">arrow_back</span>
          </button>
          <span className="material-symbols-outlined text-amber-500 text-2xl">payments</span>
          <h1 className="text-lg font-bold tracking-tight">Cost Estimator</h1>
        </div>
        <div className="flex gap-1">
          <button 
            onClick={handleExport}
            disabled={isExporting}
            className={`p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ${isExporting ? 'opacity-50 cursor-not-allowed' : ''}`}
            title="Export PDF Report"
          >
            <span className={`material-symbols-outlined ${isExporting ? 'animate-pulse text-blue-500' : 'text-slate-500'}`}>
              picture_as_pdf
            </span>
          </button>
          <button 
            onClick={onAnalyze}
            className="p-2 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition-colors"
            title="AI Analysis"
          >
            <span className="material-symbols-outlined">auto_awesome</span>
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto w-full p-4 space-y-6">
        {categories.map((cat) => (
          <section key={cat.id} className="space-y-3">
            <div 
              style={{ backgroundColor: cat.colorVar }}
              className="px-3 py-2 rounded-lg flex items-center justify-between shadow-sm"
            >
              <h2 
                style={{ color: cat.textVar }}
                className="text-[10px] font-black uppercase tracking-widest"
              >
                {cat.name}
              </h2>
              <span 
                style={{ color: cat.textVar }}
                className="text-sm font-bold"
              >
                ${Math.round(cat.items.reduce((sum, item) => sum + (item.unitPrice * item.qty), 0)).toLocaleString()}
              </span>
            </div>

            <div className="space-y-2">
              {cat.items.map((item) => (
                <div 
                  key={item.id}
                  className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700/50 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-slate-800 dark:text-slate-200">{item.name}</span>
                    <div className="flex items-center gap-1.5">
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Total:</span>
                       <span className="text-sm font-black text-slate-700 dark:text-slate-300">
                         ${Math.round(item.unitPrice * item.qty).toLocaleString()}
                       </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-400 font-black uppercase tracking-wider">Unit Price ($)</label>
                        <input 
                          type="number"
                          className="w-full bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 font-medium"
                          value={Math.round(item.unitPrice) || ''}
                          onChange={(e) => onUpdateItem(cat.id, item.id, 'unitPrice', Math.round(parseFloat(e.target.value)) || 0)}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-400 font-black uppercase tracking-wider">Quantity</label>
                        <input 
                          type="number"
                          className="w-full bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 font-medium"
                          value={Math.round(item.qty) || ''}
                          onChange={(e) => onUpdateItem(cat.id, item.id, 'qty', Math.round(parseFloat(e.target.value)) || 0)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[9px] text-slate-400 font-black uppercase tracking-wider">Conditions</label>
                      <input 
                        type="text"
                        placeholder="Current condition notes..."
                        className="w-full bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 placeholder:text-slate-300 dark:placeholder:text-slate-600"
                        value={item.conditions}
                        onChange={(e) => onUpdateItem(cat.id, item.id, 'conditions', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 ios-blur border-t border-slate-200 dark:border-slate-800 shadow-[0_-8px_30px_rgb(0,0,0,0.08)]">
        <div className="max-w-md mx-auto px-4 py-6 space-y-3">
          <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
            <span className="text-[10px] font-black uppercase tracking-wide">Grand Subtotal</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 text-lg">${subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wide">Contingency</span>
              <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full text-[10px] font-black text-slate-600 dark:text-slate-300">15%</span>
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-200">${contingency.toLocaleString()}</span>
          </div>
          <div 
            onClick={onAnalyze}
            className="mt-4 bg-estimate p-5 rounded-2xl flex justify-between items-center shadow-lg active:scale-[0.98] transition-all cursor-pointer group"
          >
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase text-amber-900/50 leading-none tracking-widest">Investment Summary</span>
              <span className="text-2xl font-black text-amber-950 tracking-tight leading-none mt-1.5 uppercase">Total Budget</span>
            </div>
            <div className="text-3xl font-black text-amber-950">
              ${grandTotal.toLocaleString()}
            </div>
          </div>
        </div>
        <div className="h-6 bg-white dark:bg-slate-900"></div>
      </footer>
    </div>
  );
};

export default Estimator;
