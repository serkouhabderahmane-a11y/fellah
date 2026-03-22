'use client';

import { useState, useMemo, useCallback } from 'react';
import { Icons } from '@/components/ui/Icons';
import { categories } from '@/data/categories';
import { Listing } from '@/types';

interface AdvancedSearchProps {
  listings: Listing[];
  onFilterChange: (filteredListings: Listing[]) => void;
  isRTL?: boolean;
  initialFilters?: SearchFilters;
}

export interface SearchFilters {
  query: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  city: string;
  type: string;
}

export const MOROCCAN_CITIES = [
  'Casablanca', 'Rabat', 'Marrakech', 'Fes', 'Tangier',
  'Agadir', 'Meknes', 'Oujda', 'Kenitra', 'Tetouan',
  'Safi', 'El Jadida', 'Beni Mellal', 'Nador', 'Khouribga',
  'Taza', 'Settat', 'Ifrane', 'Essaouira', 'Ouarzazate',
  'Errachidia', ' Zagora', 'Taliouine', 'Azrou', 'Berrechid',
  'Khémisset', 'Kénitra'
];

export default function AdvancedSearch({ 
  listings, 
  onFilterChange, 
  isRTL = false,
  initialFilters 
}: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: initialFilters?.query || '',
    category: initialFilters?.category || '',
    minPrice: initialFilters?.minPrice || '',
    maxPrice: initialFilters?.maxPrice || '',
    city: initialFilters?.city || '',
    type: initialFilters?.type || '',
  });
  
  const [showFilters, setShowFilters] = useState(false);

  const applyFilters = useCallback((newFilters: SearchFilters) => {
    let filtered = [...listings];
    
    if (newFilters.query.trim()) {
      const query = newFilters.query.toLowerCase();
      filtered = filtered.filter(l => 
        l.title.toLowerCase().includes(query) ||
        l.titleAr.includes(query) ||
        l.description.toLowerCase().includes(query) ||
        l.descriptionAr.includes(query)
      );
    }
    
    if (newFilters.category) {
      filtered = filtered.filter(l => l.categorySlug === newFilters.category);
    }
    
    if (newFilters.type) {
      filtered = filtered.filter(l => l.type === newFilters.type);
    }
    
    if (newFilters.city) {
      const cityLower = newFilters.city.toLowerCase();
      filtered = filtered.filter(l => 
        l.location.toLowerCase().includes(cityLower) ||
        l.locationAr.includes(newFilters.city)
      );
    }
    
    if (newFilters.minPrice) {
      const min = parseInt(newFilters.minPrice, 10);
      if (!isNaN(min)) {
        filtered = filtered.filter(l => l.price >= min);
      }
    }
    
    if (newFilters.maxPrice) {
      const max = parseInt(newFilters.maxPrice, 10);
      if (!isNaN(max)) {
        filtered = filtered.filter(l => l.price <= max);
      }
    }
    
    onFilterChange(filtered);
  }, [listings, onFilterChange]);

  const handleFilterChange = useCallback((field: keyof SearchFilters, value: string) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    applyFilters(newFilters);
  }, [filters, applyFilters]);

  const clearFilters = useCallback(() => {
    const resetFilters: SearchFilters = {
      query: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      city: '',
      type: '',
    };
    setFilters(resetFilters);
    onFilterChange(listings);
  }, [listings, onFilterChange]);

  const activeFiltersCount = useMemo(() => {
    return Object.entries(filters).filter(([key, value]) => {
      if (key === 'query') return value.trim() !== '';
      return value !== '';
    }).length;
  }, [filters]);

  const hasActiveFilters = activeFiltersCount > 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Icons.Search className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={filters.query}
            onChange={(e) => handleFilterChange('query', e.target.value)}
            placeholder={isRTL ? 'ابحث عن...' : 'Rechercher...'}
            className="w-full ps-12 pe-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-3 rounded-xl border font-medium transition-colors flex items-center gap-2 ${
              showFilters || hasActiveFilters
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Icons.Funnel className="w-5 h-5" />
            {isRTL ? 'الفلاتر' : 'Filtres'}
            {hasActiveFilters && (
              <span className={`w-5 h-5 rounded-full text-xs flex items-center justify-center ${
                showFilters ? 'bg-white text-primary' : 'bg-accent text-white'
              }`}>
                {activeFiltersCount}
              </span>
            )}
          </button>
          
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-4 py-3 text-gray-500 hover:text-red-500 transition-colors"
            >
              <Icons.X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isRTL ? 'الفئة' : 'Catégorie'}
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="">
                {isRTL ? 'الكل' : 'Tous'}
              </option>
              {categories.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {isRTL ? cat.nameAr : cat.nameFr}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isRTL ? 'النوع' : 'Type'}
            </label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="">
                {isRTL ? 'الكل' : 'Tous'}
              </option>
              <option value="sale">
                {isRTL ? 'للبيع' : 'À vendre'}
              </option>
              <option value="rent">
                {isRTL ? 'للإيجار' : 'À louer'}
              </option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isRTL ? 'المدينة' : 'Ville'}
            </label>
            <select
              value={filters.city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="">
                {isRTL ? 'الكل' : 'Tous'}
              </option>
              {MOROCCAN_CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isRTL ? 'السعر (درهم)' : 'Prix (MAD)'}
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                placeholder={isRTL ? 'من' : 'Min'}
                className="flex-1 rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                placeholder={isRTL ? 'إلى' : 'Max'}
                className="flex-1 rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>
        </div>
      )}

      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t flex flex-wrap gap-2">
          {filters.category && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
              {categories.find(c => c.slug === filters.category)?.[isRTL ? 'nameAr' : 'nameFr']}
              <button onClick={() => handleFilterChange('category', '')}>
                <Icons.X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.type && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
              {filters.type === 'sale' ? (isRTL ? 'للبيع' : 'À vendre') : (isRTL ? 'للإيجار' : 'À louer')}
              <button onClick={() => handleFilterChange('type', '')}>
                <Icons.X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.city && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
              {filters.city}
              <button onClick={() => handleFilterChange('city', '')}>
                <Icons.X className="w-3 h-3" />
              </button>
            </span>
          )}
          {(filters.minPrice || filters.maxPrice) && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
              {filters.minPrice && `${isRTL ? 'من' : 'De'} ${parseInt(filters.minPrice).toLocaleString()}`}
              {filters.minPrice && filters.maxPrice && ' - '}
              {filters.maxPrice && `${isRTL ? 'إلى' : 'À'} ${parseInt(filters.maxPrice).toLocaleString()}`} MAD
              <button onClick={() => { handleFilterChange('minPrice', ''); handleFilterChange('maxPrice', ''); }}>
                <Icons.X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
