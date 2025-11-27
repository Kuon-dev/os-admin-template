// Property type definitions
export type PropertyType =
  | 'apartment'
  | 'condo'
  | 'house'
  | 'villa'
  | 'townhouse'
  | 'studio'
  | 'penthouse'
  | 'land';

// Property status
export type PropertyStatus =
  | 'available'
  | 'sold'
  | 'rented'
  | 'under_offer'
  | 'maintenance';

// Price type (sale or rent)
export type PriceType = 'sale' | 'rent_monthly' | 'rent_yearly';

// Currency
export type Currency = 'USD' | 'EUR' | 'GBP';

// Area unit
export type AreaUnit = 'sqft' | 'sqm';

// Property facilities/amenities
export type Facility =
  | 'pool'
  | 'gym'
  | 'security'
  | 'garden'
  | 'balcony'
  | 'elevator'
  | 'air_conditioning'
  | 'heating'
  | 'furnished'
  | 'pet_friendly'
  | 'internet'
  | 'cable_tv'
  | 'laundry'
  | 'storage'
  | 'fireplace'
  | 'view'
  | 'playground'
  | 'bbq'
  | 'concierge'
  | 'guest_parking';

// Property image
export interface PropertyImage {
  id: string;
  url: string;
  caption?: string;
  order: number;
}

// Main Property interface
export interface Property {
  id: string;
  title: string;
  description: string;
  propertyType: PropertyType;
  status: PropertyStatus;
  price: number;
  currency: Currency;
  priceType: PriceType;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  latitude?: number;
  longitude?: number;
  totalArea: number;
  builtUpArea: number;
  landArea?: number;
  areaUnit: AreaUnit;
  bedrooms: number;
  bathrooms: number;
  halfBathrooms: number;
  livingRooms: number;
  kitchens: number;
  parkingSpaces: number;
  floorNumber?: number;
  totalFloors?: number;
  yearBuilt?: number;
  facilities: Facility[];
  images: PropertyImage[];
  mainImageIndex: number;
  availableFrom?: string;
  createdAt: string;
  updatedAt: string;
  agentId?: string;
  featured: boolean;
  virtualTourUrl?: string;
}

// Property filter options
export interface PropertyFilters {
  search: string;
  propertyType: PropertyType | 'all';
  status: PropertyStatus | 'all';
  priceMin?: number;
  priceMax?: number;
  bedroomsMin: number;
  bathroomsMin: number;
  areaMin?: number;
  areaMax?: number;
  facilities: Facility[];
  sortBy: 'price' | 'date' | 'area' | 'bedrooms';
  sortDirection: 'asc' | 'desc';
}

// Property statistics
export interface PropertyStats {
  total: number;
  available: number;
  sold: number;
  rented: number;
  averagePrice: number;
  totalRevenue: number;
  featured: number;
}

// Form data for creating/editing properties
export interface PropertyFormData {
  title: string;
  description: string;
  propertyType: PropertyType;
  status: PropertyStatus;
  price: number;
  currency: Currency;
  priceType: PriceType;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  latitude?: number;
  longitude?: number;
  totalArea: number;
  builtUpArea: number;
  landArea?: number;
  areaUnit: AreaUnit;
  bedrooms: number;
  bathrooms: number;
  halfBathrooms: number;
  livingRooms: number;
  kitchens: number;
  parkingSpaces: number;
  floorNumber?: number;
  totalFloors?: number;
  yearBuilt?: number;
  facilities: Facility[];
  images: PropertyImage[];
  mainImageIndex: number;
  availableFrom?: string;
  featured: boolean;
  virtualTourUrl?: string;
}

// Default filter values
export const DEFAULT_PROPERTY_FILTERS: PropertyFilters = {
  search: '',
  propertyType: 'all',
  status: 'all',
  bedroomsMin: 0,
  bathroomsMin: 0,
  facilities: [],
  sortBy: 'date',
  sortDirection: 'desc',
};
