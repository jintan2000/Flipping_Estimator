
export type PropertyType = 'single-family' | 'multi-family' | 'condo' | 'commercial';
export type GarageType = 'none' | '1-car' | '2-car' | '3-car' | 'detached' | 'carport';

export interface PropertyDetails {
  address: string;
  type: PropertyType;
  yearBuilt: string;
  sqft: string;
  lotSize: string;
  beds: string;
  baths: string;
  estimatedARV: string;
  garageType: GarageType;
  inspectionDate: string;
}

export interface EstimateItem {
  id: string;
  name: string;
  unitPrice: number;
  qty: number;
  conditions: string;
  note?: string;
}

export interface EstimateCategory {
  id: string;
  name: string;
  colorVar: string;
  textVar: string;
  items: EstimateItem[];
}

export type ViewState = 'intake' | 'estimate' | 'ai-analysis';
