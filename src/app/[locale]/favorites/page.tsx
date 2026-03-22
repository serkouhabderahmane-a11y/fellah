'use client';

import { useMemo, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/store';
import { categories } from '@/data/categories';
import { Listing } from '@/types';

export default function FavoritesPage() {
  const pathname = usePathname();
  const isRTL = pathname.startsWith('/ar');
  const locale = isRTL ? 'ar' : 'fr';
  
  const { favorites, listings, toggleFavorite } = useAppStore();
  
  const favoriteListings = useMemo(() => 
    listings.filter(l => favorites.includes(l.id)),
    [favorites, listings]
  );
  
  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat('ar-MA', {
      style: 'currency',
      currency: 'MAD',
      maximumFractionDigits: 0
    }).format(price);
  }, []);
  
  const getCategoryName = useCallback((slug: string) => {
    const cat = categories.find(c => c.slug === slug);
    if (!cat) return slug;
    return isRTL ? cat.nameAr : cat.nameFr;
  }, [isRTL]);
  
  const handleRemoveFavorite = useCallback((e: React.MouseEvent, listingId: string) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(listingId);
  }, [toggleFavorite]);
  
  const categoryEmojis: Record<string, string> = {
    'agricultural-lands': '🌾',
    'farm-equipment': '🚜',
    'farm-supplies': '🧪',
    'livestock': '🐄',
    'agricultural-investment': '💰',
    'farm-services': '🔧',
    'farm-products': '🍊',
    'auctions': '🔨',
    'agri-jobs': '👨‍🌾',
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {isRTL ? 'الإعلانات المحفوظة' : 'Annonces sauvegardées'}
          </h1>
          <p className="text-gray-500">
            {isRTL 
              ? `لديك ${favoriteListings.length} إعلان محفوظ`
              : `Vous avez ${favoriteListings.length} annonces sauvegardées`
            }
          </p>
        </div>

        {favoriteListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteListings.map((listing, index) => (
              <Link 
                key={listing.id} 
                href={`/${locale}/listing/${listing.id}`}
                className="card group animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                  <div className="absolute top-3 start-3 z-10">
                    <span className="bg-primary text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-lg">
                      {listing.type === 'sale' 
                        ? (isRTL ? 'للبيع' : 'À vendre')
                        : (isRTL ? 'للإيجار' : 'À louer')}
                    </span>
                  </div>
                  
                  <button
                    onClick={(e) => handleRemoveFavorite(e, listing.id)}
                    className="absolute top-3 end-3 z-10 p-2 rounded-full bg-red-500 text-white shadow-lg hover:bg-red-600 transition-colors"
                    title={isRTL ? 'إزالة من المفضلة' : 'Retirer des favoris'}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-5xl transform group-hover:scale-110 transition-transform">
                      {categoryEmojis[listing.categorySlug] || '🌱'}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-gray-800 line-clamp-1 group-hover:text-primary transition-colors">
                      {isRTL ? listing.titleAr : listing.title}
                    </h3>
                  </div>
                  
                  <p className="text-sm text-gray-500 mb-3">
                    {getCategoryName(listing.categorySlug)}
                  </p>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{isRTL ? listing.locationAr : listing.location}</span>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t">
                    <span className="text-xl font-bold text-primary">
                      {formatPrice(listing.price)}
                    </span>
                    {listing.favorites > 0 && (
                      <span className="flex items-center gap-1 text-sm text-gray-400">
                        <svg className="w-4 h-4 fill-red-400 text-red-400" viewBox="0 0 24 24">
                          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        {listing.favorites}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 shadow-lg text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              {isRTL ? 'لا توجد إعلانات محفوظة' : 'Aucune annonce sauvegardée'}
            </h2>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {isRTL 
                ? 'احفظ الإعلانات التي تعجبك للوصول إليها لاحقاً. انقر على أيقونة القلب على أي إعلان.'
                : 'Sauvegardez les annonces qui vous intéressent pour y accéder plus tard. Cliquez sur l\'icône en forme de cœur sur n\'importe quelle annonce.'
              }
            </p>
            <Link 
              href={`/${locale}/listings`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary-light text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {isRTL ? 'تصفح الإعلانات' : 'Parcourir les annonces'}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
