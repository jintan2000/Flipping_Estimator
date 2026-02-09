
import React from 'react';
import { PropertyDetails, PropertyType, GarageType } from '../types';

interface PropertyFormProps {
  data: PropertyDetails;
  onChange: (data: PropertyDetails) => void;
  onProceed: () => void;
  onReset?: () => void;
}

const PropertyForm: React.FC<PropertyFormProps> = ({ data, onChange, onProceed, onReset }) => {
  const handleChange = (field: keyof PropertyDetails, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-32">
      <header className="px-6 py-4 flex items-center justify-between sticky top-0 bg-background-light/80 dark:bg-background-dark/80 ios-blur z-20">
        <button className="p-2 -ml-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
          <span className="material-icons-round align-middle text-slate-600 dark:text-slate-400 text-xl">arrow_back_ios_new</span>
        </button>
        <h1 className="text-lg font-semibold tracking-tight">Project Setup</h1>
        <button 
          onClick={onReset}
          className="p-2 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
          title="Reset Project"
        >
          <span className="material-icons-round text-xl">delete_sweep</span>
        </button>
      </header>

      <main className="px-6">
        <div className="mt-8 mb-8">
          <h2 className="text-3xl font-bold mb-2 tracking-tight">Property Details</h2>
          <p className="text-slate-500 dark:text-slate-400">Comprehensive property intake for investors</p>
        </div>

        <form className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Property Address</label>
            <div className="relative">
              <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">location_on</span>
              <input 
                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border-none rounded-2xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-primary transition-all text-base"
                placeholder="123 Investment St, City, State"
                value={data.address}
                onChange={(e) => handleChange('address', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Property Type</label>
              <div className="relative">
                <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">domain</span>
                <select 
                  className="w-full pl-12 pr-10 py-4 bg-white dark:bg-slate-800 border-none rounded-2xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-primary transition-all text-base appearance-none"
                  value={data.type}
                  onChange={(e) => handleChange('type', e.target.value as PropertyType)}
                >
                  <option value="single-family">Single Family</option>
                  <option value="multi-family">Multi-Family</option>
                  <option value="condo">Condo / Townhome</option>
                  <option value="commercial">Commercial</option>
                </select>
                <span className="material-icons-round absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">unfold_more</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Year Built</label>
              <div className="relative">
                <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">event_available</span>
                <input 
                  type="number"
                  className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border-none rounded-2xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-primary transition-all text-base"
                  placeholder="e.g. 1985"
                  value={data.yearBuilt}
                  onChange={(e) => handleChange('yearBuilt', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Square Footage</label>
              <div className="relative">
                <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">straighten</span>
                <input 
                  type="number"
                  className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border-none rounded-2xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-primary transition-all text-base"
                  placeholder="e.g. 2,400"
                  value={data.sqft}
                  onChange={(e) => handleChange('sqft', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Lot Size (Acres)</label>
              <div className="relative">
                <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">landscape</span>
                <input 
                  type="number"
                  step="0.01"
                  className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border-none rounded-2xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-primary transition-all text-base"
                  placeholder="0.25"
                  value={data.lotSize}
                  onChange={(e) => handleChange('lotSize', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Configuration</label>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">king_bed</span>
                <select 
                  className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border-none rounded-2xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-primary transition-all text-base appearance-none"
                  value={data.beds}
                  onChange={(e) => handleChange('beds', e.target.value)}
                >
                  <option value="">Beds</option>
                  {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} Bed{n>1?'s':''}</option>)}
                </select>
                <span className="material-icons-round absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">unfold_more</span>
              </div>
              <div className="relative">
                <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">hot_tub</span>
                <select 
                  className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border-none rounded-2xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-primary transition-all text-base appearance-none"
                  value={data.baths}
                  onChange={(e) => handleChange('baths', e.target.value)}
                >
                  <option value="">Baths</option>
                  {[1,1.5,2,2.5,3,4].map(n => <option key={n} value={n}>{n} Bath{n>1?'s':''}</option>)}
                </select>
                <span className="material-icons-round absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">unfold_more</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Estimated ARV</label>
              <div className="relative">
                <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">payments</span>
                <input 
                  className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border-none rounded-2xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-primary transition-all text-base"
                  placeholder="$0.00"
                  value={data.estimatedARV}
                  onChange={(e) => handleChange('estimatedARV', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Garage Type</label>
              <div className="relative">
                <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">directions_car</span>
                <select 
                  className="w-full pl-12 pr-10 py-4 bg-white dark:bg-slate-800 border-none rounded-2xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-primary transition-all text-base appearance-none"
                  value={data.garageType}
                  onChange={(e) => handleChange('garageType', e.target.value as GarageType)}
                >
                  <option value="none">None</option>
                  <option value="1-car">1-Car Attached</option>
                  <option value="2-car">2-Car Attached</option>
                  <option value="3-car">3-Car Attached</option>
                  <option value="detached">Detached</option>
                  <option value="carport">Carport</option>
                </select>
                <span className="material-icons-round absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">unfold_more</span>
              </div>
            </div>
          </div>

          <div className="pt-4 space-y-4">
            <div className="flex items-center justify-between ml-1">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Property Photos</label>
              <span className="text-xs text-slate-400">Optional</span>
            </div>
            <button className="w-full flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl bg-slate-50/50 dark:bg-slate-900/30 hover:border-primary/50 hover:bg-primary/5 transition-all group" type="button">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl">add_a_photo</span>
              </div>
              <div className="text-center">
                <span className="block text-sm font-semibold text-slate-800 dark:text-slate-200">Add Site Photos</span>
                <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1">Capture exterior and interior conditions</span>
              </div>
            </button>
          </div>
        </form>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background-light dark:from-background-dark via-background-light dark:via-background-dark to-transparent z-10">
        <button 
          onClick={onProceed}
          className="w-full bg-primary text-white font-bold py-5 rounded-2xl shadow-lg shadow-primary/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
        >
          Proceed to Estimate
          <span className="material-icons-round group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </button>
      </footer>
    </div>
  );
};

export default PropertyForm;
