'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { categories } from '@/data/categories';
import { Icons } from '@/components/ui/Icons';

type Locale = 'ar' | 'fr';

interface HeaderProps {
  locale: Locale;
}

export default function Header({ locale }: HeaderProps) {
  const t = useTranslations('nav');
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isRTL = locale === 'ar';

  const getLink = useCallback((path: string) => {
    if (path === '/') return `/${locale}`;
    return `/${locale}${path}`;
  }, [locale]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const switchLanguage = useCallback((newLocale: Locale) => {
    const path = pathname.replace(/^\/(ar|fr)/, '');
    router.push(`/${newLocale}${path || '/'}`);
    setIsLangOpen(false);
  }, [pathname, router]);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsCategoryOpen(false);
    setIsLangOpen(false);
  }, [pathname]);

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

  const navLinks = [
    { href: getLink("/"), label: t('home'), key: 'home' },
    { href: getLink("/listings"), label: isRTL ? 'الإعلانات' : 'Annonces', key: 'listings' },
    { href: getLink("/investment"), label: isRTL ? 'الاستثمار' : 'Investissement', key: 'investment' },
    { href: getLink("/jobs"), label: isRTL ? 'الوظائف' : 'Emplois', key: 'jobs' },
    { href: getLink("/admin"), label: isRTL ? 'الإدارة' : 'Admin', key: 'admin', highlight: true },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-lg shadow-sm py-2' 
        : 'bg-white shadow-sm py-3'
    }`}>
      <div className="container-custom">
        <div className="flex items-center justify-between gap-4">
          <Link href={getLink("/")} className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-primary to-primary-light rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <span className="text-white font-bold text-lg sm:text-xl">ف</span>
            </div>
            <div className="hidden xs:block">
              <h1 className="text-lg sm:text-xl font-bold text-primary leading-tight">سوق الفلاح</h1>
              <p className="text-xs text-gray-500">FellahSouq</p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link 
                key={link.key}
                href={link.href} 
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  link.highlight
                    ? 'bg-accent/10 text-accent hover:bg-accent/20'
                    : pathname === link.href || (link.key === 'home' && (pathname === '/' || pathname === '/ar' || pathname === '/fr'))
                    ? 'bg-primary/10 text-primary' 
                    : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            <div className="relative">
              <button 
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all text-gray-600 hover:text-primary hover:bg-gray-50"
              >
                {t('categories')}
                <svg className={`w-4 h-4 transition-transform ${isRTL ? 'rtl:rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isCategoryOpen && (
                <div className={`absolute top-full mt-2 ${isRTL ? 'left-0' : 'right-0'} bg-white shadow-2xl rounded-2xl py-2 min-w-64 border overflow-hidden animate-fade-in`}>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={getLink(`/category/${cat.slug}`)}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-primary hover:text-white transition-colors"
                      onClick={() => setIsCategoryOpen(false)}
                    >
                      <span className="text-lg">{categoryEmojis[cat.slug] || '🌱'}</span>
                      <span className="font-medium">{isRTL ? cat.nameAr : cat.nameFr}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link href={getLink("/favorites")} className="relative p-2 rounded-lg text-gray-600 hover:text-primary hover:bg-gray-50 transition-all" title={isRTL ? 'المفضلة' : 'Favoris'}>
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </Link>

            <div className="relative">
              <button 
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-gray-600 hover:text-primary hover:bg-gray-50 transition-all text-sm"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                <span className="hidden sm:inline font-medium">{locale === 'ar' ? 'ع' : 'Fr'}</span>
              </button>
              {isLangOpen && (
                <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} top-full mt-2 bg-white shadow-xl rounded-xl py-1 min-w-32 border overflow-hidden`}>
                  <button 
                    onClick={() => switchLanguage('ar')}
                    className={`w-full flex items-center gap-2.5 px-4 py-2.5 font-medium transition-colors text-sm ${
                      locale === 'ar' ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span>🇸🇦</span>
                    <span>العربية</span>
                  </button>
                  <button 
                    onClick={() => switchLanguage('fr')}
                    className={`w-full flex items-center gap-2.5 px-4 py-2.5 font-medium transition-colors text-sm ${
                      locale === 'fr' ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span>🇫🇷</span>
                    <span>Français</span>
                  </button>
                </div>
              )}
            </div>

            <div className="hidden md:flex items-center gap-2">
              <Link href={getLink("/login")} className="px-4 py-2.5 rounded-xl font-medium text-gray-600 hover:text-primary hover:bg-gray-50 transition-all text-sm">
                {t('login')}
              </Link>
              <Link href={getLink("/register")} className="px-4 py-2.5 bg-gradient-to-r from-primary to-primary-light text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all text-sm">
                {t('register')}
              </Link>
            </div>

            <Link href={getLink("/create-listing")} className="hidden lg:inline-flex items-center gap-2 px-4 py-2.5 bg-accent text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all text-sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>{isRTL ? 'أضف إعلان' : 'Publier'}</span>
            </Link>

            <button 
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-primary hover:bg-gray-50"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 mt-3 pt-4 pb-2 animate-fade-in">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link 
                  key={link.key}
                  href={link.href} 
                  className="px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-primary font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              <button 
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="flex items-center justify-between px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition-colors"
              >
                <span>{t('categories')}</span>
                <svg className={`w-5 h-5 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isCategoryOpen && (
                <div className="px-4 py-2 space-y-1">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={getLink(`/category/${cat.slug}`)}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="text-lg">{categoryEmojis[cat.slug] || '🌱'}</span>
                      <span>{isRTL ? cat.nameAr : cat.nameFr}</span>
                    </Link>
                  ))}
                </div>
              )}
              
              <div className="border-t border-gray-100 pt-3 mt-2 px-4 space-y-2">
                <Link href={getLink("/login")} className="block w-full px-4 py-3 text-center rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition-colors" onClick={() => setIsMenuOpen(false)}>
                  {t('login')}
                </Link>
                <Link href={getLink("/register")} className="block w-full px-4 py-3 text-center bg-gradient-to-r from-primary to-primary-light text-white rounded-xl font-semibold" onClick={() => setIsMenuOpen(false)}>
                  {t('register')}
                </Link>
                <Link href={getLink("/create-listing")} className="block w-full px-4 py-3 text-center bg-accent text-white rounded-xl font-semibold" onClick={() => setIsMenuOpen(false)}>
                  {isRTL ? 'أضف إعلان جديد' : 'Publier une annonce'}
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
