
import React, { useState, useEffect } from 'react';
import { PropertyDetails, EstimateCategory } from '../types';
import { getAIAnalysis } from '../geminiService';
import { exportToPDF } from '../pdfService';

interface AIAnalysisProps {
  property: PropertyDetails;
  categories: EstimateCategory[];
  onBack: () => void;
}

const AIAnalysis: React.FC<AIAnalysisProps> = ({ property, categories, onBack }) => {
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const fetchAnalysis = async () => {
      setLoading(true);
      const result = await getAIAnalysis(property, categories);
      setAnalysis(result || "No analysis available.");
      setLoading(false);
    };

    fetchAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleExport = () => {
    setIsExporting(true);
    try {
      exportToPDF(property, categories, analysis || undefined);
    } catch (err) {
      console.error("PDF Export failed", err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 ios-blur border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <span className="material-icons-round text-slate-600 dark:text-slate-400">arrow_back</span>
          </button>
          <h1 className="text-lg font-bold tracking-tight">AI Investment Insight</h1>
        </div>
        <button 
          onClick={handleExport}
          disabled={loading || isExporting}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-md transition-all active:scale-95 ${ (loading || isExporting) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
        >
          <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
          {isExporting ? 'Exporting...' : 'Export Report'}
        </button>
      </header>

      <main className="max-w-md mx-auto p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium animate-pulse">Gemini is analyzing your project...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-blue-500">auto_awesome</span>
                <h2 className="font-bold text-xl">Property Analysis</h2>
              </div>
              <div className="prose dark:prose-invert prose-sm max-w-none whitespace-pre-wrap text-slate-600 dark:text-slate-300">
                {analysis}
              </div>
            </div>

            <div className="bg-blue-600 text-white p-6 rounded-3xl shadow-lg shadow-blue-500/20">
              <h3 className="font-bold text-lg mb-2">Investment Strategy</h3>
              <p className="text-blue-100 text-sm">
                Based on your ARV of {property.estimatedARV || 'N/A'}, the current budget accounts for about {
                  property.estimatedARV ? 
                  Math.round((categories.reduce((acc, cat) => acc + cat.items.reduce((s, i) => s + (i.unitPrice * i.qty), 0), 0) / parseFloat(property.estimatedARV.replace(/[^0-9.]/g, '') || '1')) * 100)
                  : 'X'
                }% of the total value.
              </p>
            </div>

            <button 
              onClick={onBack}
              className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-4 rounded-2xl active:scale-[0.98] transition-transform shadow-lg"
            >
              Return to Estimator
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default AIAnalysis;
