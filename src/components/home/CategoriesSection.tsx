'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { categories } from '@/data/categories';

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

const categoryColors: Record<string, string> = {
  'agricultural-lands': 'from-amber-500 to-orange-600',
  'farm-equipment': 'from-blue-500 to-blue-600',
  'farm-supplies': 'from-purple-500 to-purple-600',
  'livestock': 'from-rose-500 to-pink-600',
  'agricultural-investment': 'from-emerald-500 to-teal-600',
  'farm-services': 'from-cyan-500 to-sky-600',
  'farm-products': 'from-lime-500 to-green-600',
  'auctions': 'from-red-500 to-rose-600',
  'agri-jobs': 'from-indigo-500 to-violet-600',
};

export default function CategoriesSection() {
  const t = useTranslations('categories');

  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            {t('title')}
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            اكتشف جميع الفئات المتاحة على منصة سوق الفلاح
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {categories.map((category, index) => (
            <Link 
              key={category.id}
              href={`/category/${category.slug}`}
              className="group relative bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${categoryColors[category.slug]} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              
              <div className="relative z-10 text-center">
                <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${categoryColors[category.slug]} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-3xl">{categoryEmojis[category.slug] || '🌱'}</span>
                </div>
                <h3 className="font-bold text-gray-800 mb-1 group-hover:text-white transition-colors">
                  {category.nameAr}
                </h3>
                <p className="text-xs text-gray-500 group-hover:text-white/80 transition-colors line-clamp-2">
                  {category.descriptionAr}
                </p>
              </div>

              <div className="absolute top-2 end-2 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/listings" className="btn-outline inline-flex items-center gap-2">
            عرض جميع الإعلانات
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
