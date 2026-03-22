'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { categories } from '@/data/categories';

export default function Header() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isRTL = pathname.startsWith('/ar');
  const currentLang = pathname.startsWith('/ar') ? 'ar' : 'fr';

  const getLink = (path: string) => {
    if (path === '/') return `/${currentLang}`;
    return `/${currentLang}${path}`;
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const switchLanguage = (lang: string) => {
    const path = pathname.replace(/^\/(ar|fr)/, '');
    router.push(`/${lang}${path || '/'}`);
    setIsLangOpen(false);
  };

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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-lg shadow-lg py-2' : 'bg-white shadow-md py-4'
    }`}>
      <div className="container-custom">
        <div className="flex items-center justify-between">
          <Link href={getLink("/")} className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-light rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <span className="text-white font-bold text-2xl">ف</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary">سوق الفلاح</h1>
              <p className="text-xs text-gray-500">FellahSouq</p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-2">
            <Link 
              href={getLink("/")} 
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                pathname === '/' || pathname === '/ar' || pathname === '/fr'
                  ? 'bg-primary/10 text-primary' 
                  : 'text-gray-600 hover:text-primary hover:bg-gray-50'
              }`}
            >
              {t('home')}
            </Link>
            
            <div className="relative">
              <button 
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                  pathname.startsWith('/ar/category') || pathname.startsWith('/fr/category')
                    ? 'bg-primary/10 text-primary' 
                    : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                }`}
              >
                {t('categories')}
                <svg className={`w-4 h-4 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isCategoryOpen && (
                <div className="absolute top-full mt-2 bg-white shadow-2xl rounded-2xl py-2 min-w-72 border overflow-hidden animate-fade-in">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={getLink(`/category/${cat.slug}`)}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-primary hover:text-white transition-colors"
                      onClick={() => setIsCategoryOpen(false)}
                    >
                      <span className="text-xl">{categoryEmojis[cat.slug] || '🌱'}</span>
                      <span className="font-medium">{isRTL ? cat.nameAr : cat.nameFr}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link 
              href={getLink("/lands")} 
              className="px-4 py-2 rounded-xl font-medium text-gray-600 hover:text-primary hover:bg-gray-50 transition-all"
            >
              {t('lands')}
            </Link>
            <Link 
              href={getLink("/equipment")} 
              className="px-4 py-2 rounded-xl font-medium text-gray-600 hover:text-primary hover:bg-gray-50 transition-all"
            >
              {t('equipment')}
            </Link>
            <Link 
              href={getLink("/investment")} 
              className="px-4 py-2 rounded-xl font-medium text-gray-600 hover:text-primary hover:bg-gray-50 transition-all"
            >
              {t('investment')}
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button 
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl font-medium text-gray-600 hover:text-primary hover:bg-gray-50 transition-all"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                <span className="hidden sm:inline">{currentLang === 'ar' ? 'العربية' : 'Français'}</span>
              </button>
              {isLangOpen && (
                <div className="absolute end-0 mt-2 bg-white shadow-xl rounded-xl py-1 min-w-32 border overflow-hidden">
                  <button 
                    onClick={() => switchLanguage('ar')}
                    className={`w-full text-start px-4 py-2.5 font-medium transition-colors ${
                      currentLang === 'ar' ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    🇸🇦 العربية
                  </button>
                  <button 
                    onClick={() => switchLanguage('fr')}
                    className={`w-full text-start px-4 py-2.5 font-medium transition-colors ${
                      currentLang === 'fr' ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    🇫🇷 Français
                  </button>
                </div>
              )}
            </div>

            <Link href={getLink("/login")} className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-gray-600 hover:text-primary hover:bg-gray-50 transition-all">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {t('login')}
            </Link>
            
            <Link href={getLink("/register")} className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-primary-light text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
              {t('register')}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>

            <Link href={getLink("/dashboard?role=farmer")} className="hidden lg:flex items-center gap-2 px-4 py-2.5 bg-accent text-white rounded-xl font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              لوحة التحكم
            </Link>

            <button 
              className="lg:hidden p-2 rounded-xl text-gray-600 hover:text-primary hover:bg-gray-50"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
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
          <div className="lg:hidden border-t mt-4 py-4 animate-fade-in">
            <nav className="flex flex-col gap-2">
              <Link href={getLink("/")} className="px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 font-medium" onClick={() => setIsMenuOpen(false)}>
                {t('home')}
              </Link>
              <div className="border-t pt-2 mt-2">
                <p className="px-4 py-2 text-xs text-gray-500 font-medium uppercase">{t('categories')}</p>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={getLink(`/category/${cat.slug}`)}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="text-xl">{categoryEmojis[cat.slug] || '🌱'}</span>
                    <span>{isRTL ? cat.nameAr : cat.nameFr}</span>
                  </Link>
                ))}
              </div>
              <Link href={getLink("/login")} className="px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 font-medium mt-2" onClick={() => setIsMenuOpen(false)}>
                {t('login')}
              </Link>
              <Link href={getLink("/register")} className="btn-primary py-3 text-center mt-2" onClick={() => setIsMenuOpen(false)}>
                {t('register')}
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
