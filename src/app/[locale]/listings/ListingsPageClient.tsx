'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Icons } from '@/components/ui/Icons';
import ListingCard from '@/components/home/ListingCard';
import AdvancedSearch from '@/components/search/AdvancedSearch';
import { useAppStore } from '@/store';
import { Listing } from '@/types';

interface ListingsPageClientProps {
  locale: string;
}

export default function ListingsPageClient({ locale }: ListingsPageClientProps) {
  const isRTL = locale === 'ar';
  const { listings } = useAppStore();
  const [filteredListings, setFilteredListings] = useState<Listing[]>(listings);
  
  const sortedListings = useMemo(() => {
    return [...filteredListings].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [filteredListings]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container-custom py-8">
        <div className="mb-6">
          <Link href="/" className="text-primary hover:underline flex items-center gap-1">
            <Icons.ArrowRight className={`w-4 h-4 ${isRTL ? '' : 'rotate-180'}`} />
            {isRTL ? 'العودة للرئيسية' : "Retour à l'accueil"}
          </Link>
        </div>
        
        <div className="bg-white rounded-xl p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {isRTL ? 'جميع الإعلانات' : 'Toutes les annonces'}
          </h1>
          <p className="text-gray-500">
            {isRTL 
              ? `${listings.length} إعلان متاح` 
              : `${listings.length} annonce(s) disponible(s)`}
          </p>
        </div>

        <AdvancedSearch 
          listings={listings}
          onFilterChange={setFilteredListings}
          isRTL={isRTL}
        />

        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-600">
            {isRTL 
              ? `عرض ${sortedListings.length} من ${listings.length} إعلان` 
              : `${sortedListings.length} sur ${listings.length} annonce(s)`}
          </p>
        </div>

        {sortedListings.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <Icons.Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              {isRTL ? 'لم يتم العثور على نتائج' : 'Aucun résultat trouvé'}
            </h2>
            <p className="text-gray-500 mb-6">
              {isRTL 
                ? 'جرب تغيير الفلاتر أو كلمات البحث' 
                : 'Essayez de modifier les filtres ou la recherche'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
