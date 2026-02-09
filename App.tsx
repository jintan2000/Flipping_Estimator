
import React, { useState, useCallback, useEffect } from 'react';
import { PropertyDetails, EstimateCategory, ViewState } from './types';
import PropertyForm from './components/PropertyForm';
import Estimator from './components/Estimator';
import AIAnalysis from './components/AIAnalysis';

const STORAGE_KEYS = {
  PROPERTY: 'propertypro_details',
  CATEGORIES: 'propertypro_categories'
};

const INITIAL_PROPERTY: PropertyDetails = {
  address: '',
  type: 'single-family',
  yearBuilt: '',
  sqft: '',
  lotSize: '',
  beds: '',
  baths: '',
  estimatedARV: '',
  garageType: 'none',
  inspectionDate: new Date().toLocaleDateString(),
};

const INITIAL_CATEGORIES: EstimateCategory[] = [
  {
    id: 'exterior',
    name: 'Exterior',
    colorVar: 'var(--cat-exterior)',
    textVar: 'var(--cat-exterior-text)',
    items: [
      { id: 'ext-1', name: 'Roof', unitPrice: 4, qty: 1500, conditions: '' },
      { id: 'ext-2', name: 'Gutter', unitPrice: 1, qty: 100, conditions: '' },
      { id: 'ext-3', name: 'Foundation', unitPrice: 0, qty: 0, conditions: '' },
      { id: 'ext-4', name: 'Siding', unitPrice: 0, qty: 0, conditions: '' },
      { id: 'ext-5', name: 'Exterior Painting', unitPrice: 2, qty: 1700, conditions: '' }
    ],
  },
  {
    id: 'interior',
    name: 'Interior',
    colorVar: 'var(--cat-interior)',
    textVar: 'var(--cat-interior-text)',
    items: [
      { id: 'int-1', name: 'Interior Painting', unitPrice: 3, qty: 1500, conditions: '' },
      { id: 'int-2', name: 'Floor', unitPrice: 4, qty: 1000, conditions: '' },
      { id: 'int-3', name: 'Windows', unitPrice: 350, qty: 9, conditions: '' },
      { id: 'int-4', name: 'Interior Door', unitPrice: 150, qty: 9, conditions: '' },
      { id: 'int-5', name: 'Entry Door', unitPrice: 1000, qty: 1, conditions: '' },
      { id: 'int-6', name: 'Back Door', unitPrice: 400, qty: 1, conditions: '' }
    ],
  },
  {
    id: 'kitchen-bath',
    name: 'Kitchen & Bath',
    colorVar: 'var(--cat-kitchen)',
    textVar: 'var(--cat-kitchen-text)',
    items: [
      { id: 'kb-1', name: 'Kitchen Cabinet', unitPrice: 200, qty: 22, conditions: '' },
      { id: 'kb-2', name: 'Kitchen countertop', unitPrice: 45, qty: 50, conditions: '' },
      { id: 'kb-3', name: 'Appliances', unitPrice: 5000, qty: 1, conditions: '' },
      { id: 'kb-4', name: 'Bathroom-Master', unitPrice: 1000, qty: 1, conditions: '' },
      { id: 'kb-5', name: 'Bathroom 2', unitPrice: 500, qty: 1, conditions: '' },
      { id: 'kb-6', name: 'Bathroom 3', unitPrice: 0, qty: 0, conditions: '' }
    ],
  },
  {
    id: 'system',
    name: 'System',
    colorVar: 'var(--cat-system)',
    textVar: 'var(--cat-system-text)',
    items: [
      { id: 'sys-1', name: 'HVAC', unitPrice: 0, qty: 0, conditions: '' },
      { id: 'sys-2', name: 'Water Heater', unitPrice: 1000, qty: 1, conditions: '' },
      { id: 'sys-3', name: 'Electricity', unitPrice: 1000, qty: 1, conditions: '' },
      { id: 'sys-4', name: 'Plumbing', unitPrice: 1000, qty: 1, conditions: '' },
      { id: 'sys-5', name: 'Lights & Hardware', unitPrice: 2000, qty: 1, conditions: '' },
      { id: 'sys-6', name: 'Garage Door', unitPrice: 1500, qty: 0, conditions: '' }
    ],
  },
  {
    id: 'landscaping',
    name: 'Landscaping',
    colorVar: 'var(--cat-landscaping)',
    textVar: 'var(--cat-landscaping-text)',
    items: [
      { id: 'land-1', name: 'Deck', unitPrice: 5000, qty: 0, conditions: '' },
      { id: 'land-2', name: 'Fence', unitPrice: 10, qty: 0, conditions: '' },
      { id: 'land-3', name: 'Cut Tree', unitPrice: 800, qty: 0, conditions: '' },
      { id: 'land-4', name: 'Sod-grass', unitPrice: 100, qty: 0, conditions: '' },
      { id: 'land-5', name: 'Pine Straw', unitPrice: 12, qty: 20, conditions: '' }
    ],
  },
  {
    id: 'others',
    name: 'Others',
    colorVar: 'var(--cat-others)',
    textVar: 'var(--cat-others-text)',
    items: [
      { id: 'oth-1', name: 'Dumpster', unitPrice: 500, qty: 2, conditions: '' },
      { id: 'oth-2', name: 'Other 1', unitPrice: 0, qty: 0, conditions: '' },
      { id: 'oth-3', name: 'Other 2', unitPrice: 0, qty: 0, conditions: '' },
      { id: 'oth-4', name: 'Other 3', unitPrice: 0, qty: 0, conditions: '' }
    ],
  },
];

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('intake');
  
  // 初始化数据：优先从 LocalStorage 读取
  const [property, setProperty] = useState<PropertyDetails>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROPERTY);
    return saved ? JSON.parse(saved) : INITIAL_PROPERTY;
  });

  const [categories, setCategories] = useState<EstimateCategory[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  // 当房产信息改变时保存
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROPERTY, JSON.stringify(property));
  }, [property]);

  // 当估算项改变时保存
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  const handleUpdateItem = useCallback((catId: string, itemId: string, field: 'unitPrice' | 'qty' | 'conditions', value: any) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id !== catId) return cat;
      return {
        ...cat,
        items: cat.items.map(item => {
          if (item.id !== itemId) return item;
          return { ...item, [field]: value };
        })
      };
    }));
  }, []);

  const resetData = useCallback(() => {
    if (window.confirm('确定要清除所有数据并开始新项目吗？')) {
      setProperty(INITIAL_PROPERTY);
      setCategories(INITIAL_CATEGORIES);
      localStorage.removeItem(STORAGE_KEYS.PROPERTY);
      localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
      window.location.reload(); // 强制刷新以重置内部状态
    }
  }, []);

  const navigateBack = () => {
    if (view === 'estimate') setView('intake');
    if (view === 'ai-analysis') setView('estimate');
  };

  return (
    <div className="min-h-screen">
      {view === 'intake' && (
        <PropertyForm 
          data={property} 
          onChange={setProperty} 
          onProceed={() => setView('estimate')}
          onReset={resetData}
        />
      )}
      {view === 'estimate' && (
        <Estimator 
          property={property}
          categories={categories} 
          onUpdateItem={handleUpdateItem}
          onBack={navigateBack}
          onAnalyze={() => setView('ai-analysis')}
        />
      )}
      {view === 'ai-analysis' && (
        <AIAnalysis 
          property={property} 
          categories={categories} 
          onBack={navigateBack} 
        />
      )}
    </div>
  );
};

export default App;
