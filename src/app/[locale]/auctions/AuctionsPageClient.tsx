'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/store';
import { Icons } from '@/components/ui/Icons';
import CountdownTimer from '@/components/auction/CountdownTimer';

interface AuctionsPageClientProps {
  locale: string;
}

export default function AuctionsPageClient({ locale }: AuctionsPageClientProps) {
  const isRTL = locale === 'ar';
  const { getAuctionListings, getHighestBid, favorites, toggleFavorite } = useAppStore();
  const [filter, setFilter] = useState<'all' | 'ending' | 'new'>('all');
  
  const auctionListings = useMemo(() => {
    const listings = getAuctionListings();
    
    switch (filter) {
      case 'ending':
        return listings
          .filter(l => {
            const endTime = new Date(l.auctionEndTime || '');
            const hoursLeft = (endTime.getTime() - Date.now()) / (1000 * 60 * 60);
            return hoursLeft <= 24 && hoursLeft > 0;
          })
          .sort((a, b) => new Date(a.auctionEndTime!).getTime() - new Date(b.auctionEndTime!).getTime());
      case 'new':
        return [...listings].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      default:
        return listings.sort((a, b) => new Date(a.auctionEndTime!).getTime() - new Date(b.auctionEndTime!).getTime());
    }
  }, [getAuctionListings, filter]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-MA', {
      style: 'currency',
      currency: 'MAD',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container-custom py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
              <Icons.Fire className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {isRTL ? 'المزادات' : 'Enchères'}
              </h1>
              <p className="text-gray-500">
                {isRTL 
                  ? `${auctionListings.length} مزاد نشط` 
                  : `${auctionListings.length} enchère(s) active(s)`}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {isRTL ? 'الكل' : 'Tous'}
          </button>
          <button
            onClick={() => setFilter('ending')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'ending'
                ? 'bg-red-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {isRTL ? 'تنتهي قريباً' : 'Bientôt terminés'}
          </button>
          <button
            onClick={() => setFilter('new')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'new'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {isRTL ? 'جديد' : 'Nouveau'}
          </button>
        </div>

        {auctionListings.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <Icons.Fire className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              {isRTL ? 'لا توجد مزادات حالياً' : 'Aucune enchère pour le moment'}
            </h2>
            <p className="text-gray-500 mb-6">
              {isRTL ? 'تابعنا للحصول على إشعارات المزادات الجديدة' : 'Suivez-nous pour être notifié des nouvelles enchères'}
            </p>
            <Link href={isRTL ? '/ar' : '/fr'} className="btn-primary">
              {isRTL ? 'العودة للرئيسية' : "Retour à l'accueil"}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {auctionListings.map((listing) => {
              const currentBid = getHighestBid(listing.id);
              const isFavorite = favorites.includes(listing.id);
              
              return (
                <Link
                  key={listing.id}
                  href={`/${locale}/listing/${listing.id}`}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group"
                >
                  <div className="relative h-48 bg-gradient-to-br from-accent/20 to-primary/10 flex items-center justify-center">
                    <Icons.Map className="w-20 h-20 text-accent/30" />
                    <div className="absolute top-3 start-3">
                      <span className="bg-accent text-white text-xs px-3 py-1 rounded-full font-medium">
                        {isRTL ? 'مزاد' : 'Enchère'}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleFavorite(listing.id);
                      }}
                      className={`absolute top-3 end-3 p-2 rounded-full transition-colors ${
                        isFavorite
                          ? 'bg-red-100 text-red-500'
                          : 'bg-white/80 text-gray-500 hover:text-red-500'
                      }`}
                    >
                      <Icons.Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-lg font-bold text-gray-800 group-hover:text-primary transition-colors line-clamp-1">
                        {isRTL ? listing.titleAr : listing.title}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                      <Icons.MapPin className="w-4 h-4" />
                      <span>{isRTL ? listing.locationAr : listing.location}</span>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500">
                          {isRTL ? 'أعلى مزايدة:' : 'Meilleure offre:'}
                        </span>
                        <span className="text-xl font-bold text-primary">
                          {formatPrice(currentBid)}
                        </span>
                      </div>
                      <CountdownTimer endTime={listing.auctionEndTime!} isRTL={isRTL} />
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        {listing.bidCount || 0} {isRTL ? 'مزايدة' : 'enchères'}
                      </span>
                      <span className="text-gray-500">
                        {isRTL ? 'السعر الابتدائي:' : 'Prix initial:'} {formatPrice(listing.startingPrice || listing.price)}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
