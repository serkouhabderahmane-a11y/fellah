'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { Icons } from '@/components/ui/Icons';
import ListingCard from './ListingCard';
import { useAppStore } from '@/store';

interface ListingsSectionProps {
  type: 'featured' | 'latest';
}

export default function ListingsSection({ type }: ListingsSectionProps) {
  const pathname = usePathname();
  const isRTL = pathname.startsWith('/ar');
  const { listings } = useAppStore();

  const displayListings = useMemo(() => {
    const filtered = type === 'featured' 
      ? listings.filter(l => l.featured)
      : listings;
    return filtered.slice(0, 8);
  }, [listings, type]);

  const title = type === 'featured' 
    ? (isRTL ? 'الإعلانات المميزة' : 'Annonces en vedette')
    : (isRTL ? 'أحدث الإعلانات' : 'Dernières annonces');
  
  const subtitle = type === 'featured' 
    ? (isRTL ? 'أفضل الإعلانات من المزارعين والموزعين' : 'Les meilleures annonces des agriculteurs')
    : (isRTL ? 'أحدث الإعلانات من المنتجات والخدمات' : 'Les dernières annonces de produits et services');

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="container-custom">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2 sm:mb-3">
              {type === 'featured' ? (
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-accent/10 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <Icons.Star className="w-4 h-4 sm:w-5 sm:h-5 text-accent fill-accent" />
                </div>
              ) : (
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary/10 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <Icons.Fire className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </div>
              )}
              <span className={`text-xs sm:text-sm font-medium ${type === 'featured' ? 'text-accent' : 'text-primary'}`}>
                {type === 'featured' ? (isRTL ? 'مميز' : 'En vedette') : (isRTL ? 'جديد' : 'Nouveau')}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-1">{title}</h2>
            <p className="text-gray-500 text-sm sm:text-base">{subtitle}</p>
          </div>
          <Link 
            href="/listings" 
            className="flex items-center gap-2 text-primary hover:text-primary-light font-semibold transition-colors text-sm sm:text-base self-start sm:self-auto"
          >
            {isRTL ? 'عرض الكل' : 'Voir tout'}
            <Icons.ArrowRight className={`w-4 h-4 ${isRTL ? '' : 'rotate-180'}`} />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {displayListings.map((listing, index) => (
            <div 
              key={listing.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <ListingCard listing={listing} />
            </div>
          ))}
        </div>

        {displayListings.length === 0 && (
          <div className="text-center py-12 sm:py-16">
            <Icons.Map className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">
              {isRTL 
                ? `لا توجد إعلانات ${type === 'featured' ? 'مميزة' : 'حالية'}`
                : `Aucune annonce ${type === 'featured' ? 'en vedette' : 'actuelle'}`}
            </p>
          </div>
        )}

        <div className="text-center mt-8 sm:mt-12 block sm:hidden">
          <Link href="/listings" className="inline-flex items-center gap-2 bg-primary text-white py-3 px-8 rounded-xl font-semibold">
            {isRTL ? 'عرض جميع الإعلانات' : 'Voir toutes les annonces'}
            <Icons.ArrowRight className={`w-4 h-4 ${isRTL ? '' : 'rotate-180'}`} />
          </Link>
        </div>
      </div>
    </section>
  );
}
