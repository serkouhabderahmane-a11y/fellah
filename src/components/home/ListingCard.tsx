'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, memo } from 'react';
import { Listing } from '@/types';
import { useAppStore } from '@/store';

interface ListingCardProps {
  listing: Listing;
}

function ListingCardComponent({ listing }: ListingCardProps) {
  const pathname = usePathname();
  const isRTL = pathname.startsWith('/ar');
  const { favorites, toggleFavorite } = useAppStore();
  const isFavorite = favorites.includes(listing.id);

  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat('ar-MA', {
      style: 'currency',
      currency: 'MAD',
      maximumFractionDigits: 0
    }).format(price);
  }, []);

  const handleFavoriteClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(listing.id);
  }, [listing.id, toggleFavorite]);

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
    <Link href={`/listing/${listing.id}`} className="card group">
      <div className="relative h-52 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        <div className="absolute top-3 start-3 z-10 flex gap-2">
          <span className="bg-primary text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-lg">
            {listing.type === 'sale' 
              ? (isRTL ? 'للبيع' : 'À vendre')
              : (isRTL ? 'للإيجار' : 'À louer')}
          </span>
        </div>
        
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-3 end-3 z-10 p-2 rounded-full shadow-lg transition-all duration-200 ${
            isFavorite 
              ? 'bg-red-500 text-white hover:bg-red-600' 
              : 'bg-white/90 text-gray-400 hover:text-red-500 hover:bg-white'
          }`}
          aria-label={isRTL ? 'إضافة للمفضلة' : 'Ajouter aux favoris'}
        >
          <svg 
            className="w-5 h-5" 
            fill={isFavorite ? 'currentColor' : 'none'} 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {listing.featured && (
          <div className="absolute bottom-12 start-3 z-10 bg-accent text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-lg flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {isRTL ? 'مميز' : 'Featured'}
          </div>
        )}
        
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/20 to-transparent">
          <span className="text-6xl transform group-hover:scale-110 transition-transform duration-300">
            {categoryEmojis[listing.categorySlug] || '🌱'}
          </span>
        </div>
        <div className="absolute bottom-3 start-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-gray-600">
          {listing.createdAt}
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="font-bold text-lg text-gray-800 line-clamp-1 group-hover:text-primary transition-colors">
            {isRTL ? listing.titleAr : listing.title}
          </h3>
        </div>
        
        <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
          <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="line-clamp-1">{isRTL ? listing.locationAr : listing.location}</span>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t">
          <div>
            <span className="text-2xl font-bold text-primary">
              {formatPrice(listing.price)}
            </span>
            {listing.type === 'rent' && (
              <span className="text-xs text-gray-500 block">/ شهر</span>
            )}
          </div>
          
          {listing.favorites > 0 && (
            <div className="flex items-center gap-1 text-gray-400 text-sm">
              <svg className="w-4 h-4 fill-red-400 text-red-400" viewBox="0 0 24 24">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{listing.favorites}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export default memo(ListingCardComponent);
