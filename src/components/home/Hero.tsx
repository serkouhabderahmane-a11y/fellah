'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';

export default function Hero() {
  const t = useTranslations('hero');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <section className="relative bg-gradient-to-br from-primary via-primary-light to-primary-dark min-h-[600px] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-3xl"></div>
      </div>

      <div className="absolute inset-0 bg-pattern opacity-5"></div>
      
      <div className="container-custom relative z-10 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 animate-fade-in">
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
            <span className="text-white/90 text-sm font-medium">أضخم منصة زراعية في المغرب</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight animate-slide-up text-shadow">
            {t('title')}
            <span className="block text-accent mt-2">سوق الفلاح</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto animate-slide-up stagger-1">
            {t('subtitle')}
          </p>
          
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-3 shadow-2xl animate-scale-in stagger-2">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 flex items-center bg-gray-100 rounded-2xl px-5">
                <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent px-4 py-4 outline-none text-gray-700 text-lg"
                />
              </div>
              <Link 
                href={`/search?q=${encodeURIComponent(searchQuery)}`}
                className="btn-primary py-4 px-10 rounded-2xl text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {t('search')}
              </Link>
            </div>
          </div>

          <p className="text-white/70 mt-8 text-lg animate-fade-in stagger-3">
            {t('searchSubtitle')}
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-10 animate-fade-in stagger-4">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="text-xl">🌾</span>
              <span className="text-white/90">أراضي زراعية</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="text-xl">🚜</span>
              <span className="text-white/90">معدات</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="text-xl">🍊</span>
              <span className="text-white/90">منتجات</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="text-xl">🐄</span>
              <span className="text-white/90">ماشية</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 to-transparent"></div>
    </section>
  );
}
