'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Icons } from '@/components/ui/Icons';
import { categories } from '@/data/categories';

export default function Hero() {
  const router = useRouter();
  const pathname = usePathname();
  const isRTL = pathname.startsWith('/ar');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedCategory) params.set('category', selectedCategory);
    router.push(`/${isRTL ? 'ar' : 'fr'}/listings?${params.toString()}`);
  };

  const quickLinks = [
    { label: isRTL ? 'الأراضي' : 'Terrains', labelFr: 'Terrains', href: '/lands', icon: '🌾' },
    { label: isRTL ? 'المعدات' : 'Équipements', labelFr: 'Équipements', href: '/equipment', icon: '🚜' },
    { label: isRTL ? 'المزادات' : 'Enchères', labelFr: 'Enchères', href: '/auctions', icon: '🔥' },
    { label: isRTL ? 'الاستثمار' : 'Invest', labelFr: 'Invest', href: '/investment', icon: '💰' },
  ];

  return (
    <section className="relative bg-gradient-to-br from-primary via-primary-light to-primary-dark min-h-[85vh] sm:min-h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-16 sm:top-20 left-4 sm:left-10 w-48 h-48 sm:w-72 sm:h-72 bg-accent/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 sm:bottom-32 right-4 sm:right-10 w-56 h-56 sm:w-96 sm:h-96 bg-white/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] bg-primary/20 rounded-full blur-3xl"></div>
      </div>

      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
      
      <div className="container-custom relative z-10 py-16 sm:py-20 lg:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6 animate-fade-in">
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
            <span className="text-white/90 text-xs sm:text-sm font-medium">
              {isRTL ? 'أضخم منصة زراعية في المغرب' : 'La plus grande plateforme agricole du Maroc'}
            </span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight animate-slide-up">
            {isRTL ? 'سوق الفلاح' : 'FellahSouq'}
            <span className="block text-accent mt-1 sm:mt-2">{isRTL ? 'FellahSouq' : 'سوق الفلاح'}</span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-white/90 mb-8 sm:mb-10 max-w-2xl mx-auto animate-slide-up stagger-1 px-4">
            {isRTL 
              ? 'اربط نفسك بالفلاحة الحديثة - اكتشف أفضل المنتجات والخدمات الزراعية في المغرب'
              : 'Connectez-vous à l\'agriculture moderne - Découvrez les meilleurs produits et services agricoles au Maroc'}
          </p>
          
          <form onSubmit={handleSearch} className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-2 sm:p-3 shadow-2xl animate-scale-in stagger-2 mx-4 sm:mx-0 max-w-3xl">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="sm:w-40 px-4 py-3 sm:py-4 rounded-xl sm:rounded-2xl border-0 bg-gray-100 text-gray-700 outline-none cursor-pointer text-sm"
              >
                <option value="">{isRTL ? 'الكل' : 'Tous'}</option>
                {categories.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>{isRTL ? cat.nameAr : cat.nameFr}</option>
                ))}
              </select>
              
              <div className="flex-1 flex items-center bg-gray-100 rounded-xl sm:rounded-2xl px-4 sm:px-5">
                <Icons.Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder={isRTL ? 'ابحث عن...' : 'Rechercher...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent px-3 sm:px-4 py-3 sm:py-4 outline-none text-gray-700 text-sm sm:text-base"
                />
              </div>
              
              <button 
                type="submit"
                className="py-3 sm:py-4 px-6 sm:px-10 bg-primary text-white rounded-xl sm:rounded-2xl text-sm sm:text-base font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <Icons.Search className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden xs:inline">{isRTL ? 'بحث' : 'Rechercher'}</span>
              </button>
            </div>
          </form>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-6 sm:mt-8 animate-fade-in stagger-3">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full hover:bg-white/20 transition-colors text-sm"
              >
                <span>{link.icon}</span>
                <span className="text-white/90">{isRTL ? link.label : link.labelFr}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-24 bg-gradient-to-t from-gray-50 to-transparent"></div>
    </section>
  );
}
