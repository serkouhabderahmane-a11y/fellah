'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { Icons } from '@/components/ui/Icons';
import { categories } from '@/data/categories';
import { usePathname } from 'next/navigation';

const categoryColors: Record<string, { bg: string; text: string; hover: string }> = {
  'agricultural-lands': { bg: 'bg-amber-50', text: 'text-amber-600', hover: 'group-hover:bg-amber-100' },
  'farm-equipment': { bg: 'bg-blue-50', text: 'text-blue-600', hover: 'group-hover:bg-blue-100' },
  'farm-supplies': { bg: 'bg-purple-50', text: 'text-purple-600', hover: 'group-hover:bg-purple-100' },
  'livestock': { bg: 'bg-rose-50', text: 'text-rose-600', hover: 'group-hover:bg-rose-100' },
  'agricultural-investment': { bg: 'bg-emerald-50', text: 'text-emerald-600', hover: 'group-hover:bg-emerald-100' },
  'farm-services': { bg: 'bg-cyan-50', text: 'text-cyan-600', hover: 'group-hover:bg-cyan-100' },
  'farm-products': { bg: 'bg-lime-50', text: 'text-lime-600', hover: 'group-hover:bg-lime-100' },
  'auctions': { bg: 'bg-red-50', text: 'text-red-600', hover: 'group-hover:bg-red-100' },
  'agri-jobs': { bg: 'bg-indigo-50', text: 'text-indigo-600', hover: 'group-hover:bg-indigo-100' },
};

const categoryIcons: Record<string, ReactNode> = {
  'agricultural-lands': <Icons.Map className="w-6 h-6 sm:w-7 sm:h-7" />,
  'farm-equipment': <Icons.Truck className="w-6 h-6 sm:w-7 sm:h-7" />,
  'farm-supplies': <Icons.Beaker className="w-6 h-6 sm:w-7 sm:h-7" />,
  'livestock': <Icons.Paw className="w-6 h-6 sm:w-7 sm:h-7" />,
  'agricultural-investment': <Icons.TrendUp className="w-6 h-6 sm:w-7 sm:h-7" />,
  'farm-services': <Icons.Wrench className="w-6 h-6 sm:w-7 sm:h-7" />,
  'farm-products': <Icons.Fruit className="w-6 h-6 sm:w-7 sm:h-7" />,
  'auctions': <Icons.Fire className="w-6 h-6 sm:w-7 sm:h-7" />,
  'agri-jobs': <Icons.Briefcase className="w-6 h-6 sm:w-7 sm:h-7" />,
};

export default function CategoriesSection() {
  const pathname = usePathname();
  const isRTL = pathname.startsWith('/ar');

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gray-50/50">
      <div className="container-custom">
        <div className="text-center mb-8 sm:mb-12">
          <span className="inline-block bg-primary/10 text-primary text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full mb-3 sm:mb-4">
            {isRTL ? 'اكتشف' : 'Découvrir'}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3">
            {isRTL ? 'جميع الفئات الزراعية' : 'Toutes les catégories agricoles'}
          </h2>
          <p className="text-gray-500 text-sm sm:text-base max-w-2xl mx-auto">
            {isRTL 
              ? 'اكتشف مجموعة واسعة من المنتجات والخدمات الزراعية في مكان واحد'
              : 'Découvrez une large gamme de produits et services agricoles en un seul endroit'}
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {categories.map((category) => {
            const colors = categoryColors[category.slug] || { bg: 'bg-primary/5', text: 'text-primary', hover: 'group-hover:bg-primary/10' };
            const IconComponent = categoryIcons[category.slug];
            
            return (
              <Link 
                key={category.id}
                href={`/category/${category.slug}`}
                className={`group bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 ${colors.hover} transition-all duration-300 hover:shadow-md hover:-translate-y-0.5`}
              >
                <div className={`w-11 h-11 sm:w-14 sm:h-14 ${colors.bg} rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-105 transition-transform duration-300`}>
                  <div className={colors.text}>
                    {IconComponent}
                  </div>
                </div>
                
                <h3 className="font-semibold sm:font-bold text-gray-800 text-sm sm:text-base mb-1 group-hover:text-primary transition-colors line-clamp-1">
                  {isRTL ? category.nameAr : category.nameFr}
                </h3>
                
                <p className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
                  {isRTL ? 'استكشف' : 'Explorer'} →
                </p>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-8 sm:mt-12">
          <Link href="/listings" className="inline-flex items-center gap-2 bg-primary text-white py-3 px-6 sm:px-8 rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-md hover:shadow-lg text-sm sm:text-base">
            {isRTL ? 'عرض جميع الإعلانات' : 'Voir toutes les annonces'}
            <Icons.ArrowRight className={`w-4 h-4 ${isRTL ? '' : 'rotate-180'}`} />
          </Link>
        </div>
      </div>
    </section>
  );
}
