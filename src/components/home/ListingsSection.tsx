'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getFeaturedListings, getLatestListings } from '@/data/listings';
import ListingCard from './ListingCard';

interface ListingsSectionProps {
  type: 'featured' | 'latest';
}

export default function ListingsSection({ type }: ListingsSectionProps) {
  const t = useTranslations('home');
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
  const isRTL = pathname.startsWith('/ar');

  const listings = type === 'featured' ? getFeaturedListings() : getLatestListings();
  const title = type === 'featured' ? t('featuredListings') : t('latestListings');
  const subtitle = type === 'featured' 
    ? 'أفضل الإعلانات المميزة من المزارعين والموزعين'
    : 'أحدث الإضافة من المنتجات والخدمات';

  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-3">
              {type === 'featured' ? '⭐' : '🆕'}
              {type === 'featured' ? 'مميز' : 'جديد'}
            </div>
            <h2 className="text-4xl font-bold text-gray-800 mb-2">{title}</h2>
            <p className="text-gray-500 text-lg">{subtitle}</p>
          </div>
          <Link 
            href="/listings" 
            className="hidden md:flex items-center gap-2 text-primary hover:text-primary-light font-semibold transition-colors"
          >
            {t('viewAll') || 'عرض الكل'}
            <svg className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {listings.slice(0, 8).map((listing, index) => (
            <div 
              key={listing.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <ListingCard listing={listing} />
            </div>
          ))}
        </div>

        <div className="text-center mt-10 md:hidden">
          <Link href="/listings" className="btn-outline">
            عرض كل الإعلانات
          </Link>
        </div>
      </div>
    </section>
  );
}
