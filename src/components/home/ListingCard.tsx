'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCallback, memo } from 'react';
import { Listing } from '@/types';
import { useAppStore } from '@/store';
import { Icons } from '@/components/ui/Icons';
import CountdownTimer from '@/components/auction/CountdownTimer';

interface ListingCardProps {
  listing: Listing;
  variant?: 'default' | 'compact' | 'horizontal';
}

const categoryIcons: Record<string, string> = {
  'agricultural-lands': '🌾',
  'farm-equipment': '🚜',
  'farm-supplies': '🧪',
  'livestock': '🐄',
  'agricultural-investment': '💰',
  'farm-services': '🔧',
  'farm-products': '🍊',
  'auctions': '🔥',
  'agri-jobs': '👨‍🌾',
};

const categoryColors: Record<string, { bg: string; text: string }> = {
  'agricultural-lands': { bg: 'bg-amber-50', text: 'text-amber-600' },
  'farm-equipment': { bg: 'bg-blue-50', text: 'text-blue-600' },
  'farm-supplies': { bg: 'bg-purple-50', text: 'text-purple-600' },
  'livestock': { bg: 'bg-rose-50', text: 'text-rose-600' },
  'agricultural-investment': { bg: 'bg-emerald-50', text: 'text-emerald-600' },
  'farm-services': { bg: 'bg-cyan-50', text: 'text-cyan-600' },
  'farm-products': { bg: 'bg-lime-50', text: 'text-lime-600' },
  'auctions': { bg: 'bg-red-50', text: 'text-red-600' },
  'agri-jobs': { bg: 'bg-indigo-50', text: 'text-indigo-600' },
};

function ListingCardComponent({ listing, variant = 'default' }: ListingCardProps) {
  const pathname = usePathname();
  const isRTL = pathname.startsWith('/ar');
  const locale = isRTL ? 'ar' : 'fr';
  const { favorites, toggleFavorite } = useAppStore();
  const isFavorite = favorites.includes(listing.id);

  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat('ar-MA', {
      style: 'currency',
      currency: 'MAD',
      maximumFractionDigits: 0,
    }).format(price);
  }, []);

  const handleFavoriteClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(listing.id);
  }, [listing.id, toggleFavorite]);

  const isAuction = listing.isAuction && listing.auctionEndTime && new Date(listing.auctionEndTime) > new Date();
  const currentPrice = listing.currentBid || listing.price;
  const colors = categoryColors[listing.categorySlug] || { bg: 'bg-primary/5', text: 'text-primary' };

  if (variant === 'compact') {
    return (
      <Link href={`/${locale}/listing/${listing.id}`} className="group flex items-center gap-4 p-3 bg-white rounded-xl border border-gray-100 hover:border-primary/20 hover:shadow-md transition-all duration-200">
        <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
          {listing.images[0] ? (
            <Image
              src={listing.images[0]}
              alt={listing.titleAr}
              fill
              className="object-cover"
              sizes="80px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl">
              {categoryIcons[listing.categorySlug] || '🌱'}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 text-sm line-clamp-1 group-hover:text-primary transition-colors">
            {isRTL ? listing.titleAr : listing.title}
          </h3>
          <p className="text-xs text-gray-500 line-clamp-1">{isRTL ? listing.locationAr : listing.location}</p>
          <span className="text-sm font-bold text-primary">{formatPrice(currentPrice)}</span>
        </div>
      </Link>
    );
  }

  if (variant === 'horizontal') {
    return (
      <Link href={`/${locale}/listing/${listing.id}`} className="group flex gap-4 sm:gap-6 p-4 bg-white rounded-2xl border border-gray-100 hover:border-primary/20 hover:shadow-lg transition-all duration-200">
        <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
          {listing.images[0] ? (
            <Image
              src={listing.images[0]}
              alt={listing.titleAr}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 112px, 144px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
              <span className="text-4xl sm:text-5xl">{categoryIcons[listing.categorySlug] || '🌱'}</span>
            </div>
          )}
          {isAuction && (
            <div className="absolute top-2 start-2">
              <span className="bg-accent text-white text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1">
                <Icons.Fire className="w-3 h-3" />
                مزاد
              </span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-gray-800 line-clamp-2 group-hover:text-primary transition-colors">
                {isRTL ? listing.titleAr : listing.title}
              </h3>
              <button
                onClick={handleFavoriteClick}
                className={`p-1.5 rounded-full transition-all flex-shrink-0 ${
                  isFavorite 
                    ? 'bg-red-50 text-red-500' 
                    : 'bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50'
                }`}
              >
                <Icons.Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>
            <div className="flex items-center gap-1.5 text-gray-500 text-sm mt-1">
              <Icons.MapPin className="w-4 h-4 text-primary/60" />
              <span className="line-clamp-1">{isRTL ? listing.locationAr : listing.location}</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3">
            <div>
              <span className="text-lg sm:text-xl font-bold text-primary">
                {formatPrice(currentPrice)}
              </span>
              {listing.type === 'rent' && (
                <span className="text-xs text-gray-500"> / {isRTL ? 'شهر' : 'mois'}</span>
              )}
            </div>
            <div className="flex items-center gap-3 text-gray-400 text-xs">
              {listing.views > 0 && (
                <span className="flex items-center gap-1">
                  <Icons.Eye className="w-3.5 h-3.5" />
                  {listing.views}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/${locale}/listing/${listing.id}`} className="group block bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-primary/20 hover:shadow-xl transition-all duration-300">
      <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          {listing.images[0] ? (
            <Image
              src={listing.images[0]}
              alt={listing.titleAr}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
              <span className="text-6xl sm:text-7xl transform transition-transform duration-300 group-hover:scale-110">
                {categoryIcons[listing.categorySlug] || '🌱'}
              </span>
            </div>
          )}
        </div>
        
        <div className="absolute top-3 start-3 z-10 flex gap-2">
          {isAuction ? (
            <span className="bg-accent text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg flex items-center gap-1">
              <Icons.Fire className="w-3 h-3" />
              مزاد
            </span>
          ) : (
            <span className="bg-primary text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg">
              {listing.type === 'sale' 
                ? (isRTL ? 'للبيع' : 'À vendre')
                : (isRTL ? 'للإيجار' : 'À louer')}
            </span>
          )}
          {listing.featured && !isAuction && (
            <span className="bg-accent text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg flex items-center gap-1">
              <Icons.Star className="w-3 h-3 fill-white" />
              {isRTL ? 'مميز' : 'Featured'}
            </span>
          )}
        </div>
        
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-3 end-3 z-10 p-2 rounded-full shadow-lg transition-all duration-200 ${
            isFavorite 
              ? 'bg-red-500 text-white hover:bg-red-600' 
              : 'bg-white/90 backdrop-blur-sm text-gray-400 hover:text-red-500 hover:bg-white'
          }`}
          aria-label={isRTL ? 'إضافة للمفضلة' : 'Ajouter aux favoris'}
        >
          <Icons.Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {isAuction && listing.auctionEndTime && (
          <div className="absolute bottom-3 start-3 z-10">
            <CountdownTimer endTime={listing.auctionEndTime} isRTL={isRTL} />
          </div>
        )}
      </div>
      
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-gray-800 line-clamp-1 group-hover:text-primary transition-colors">
            {isRTL ? listing.titleAr : listing.title}
          </h3>
        </div>
        
        <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-4">
          <Icons.MapPin className="w-4 h-4 text-primary/60 flex-shrink-0" />
          <span className="line-clamp-1">{isRTL ? listing.locationAr : listing.location}</span>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <span className="text-lg sm:text-xl font-bold text-primary">
              {formatPrice(currentPrice)}
            </span>
            {listing.type === 'rent' && (
              <span className="text-xs text-gray-500 block">/ {isRTL ? 'شهر' : 'mois'}</span>
            )}
            {isAuction && (
              <span className="text-xs text-accent block">
                {isRTL ? `ابتدائي: ${formatPrice(listing.startingPrice || listing.price)}` : `Initial: ${formatPrice(listing.startingPrice || listing.price)}`}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-3 text-gray-400 text-xs">
            {listing.views > 0 && (
              <span className="flex items-center gap-1">
                <Icons.Eye className="w-4 h-4" />
                {listing.views}
              </span>
            )}
            {listing.favorites > 0 && (
              <span className="flex items-center gap-1">
                <Icons.Heart className="w-4 h-4 fill-red-400 text-red-400" />
                {listing.favorites}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default memo(ListingCardComponent);
