'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useCallback } from 'react';
import { Icons } from '@/components/ui/Icons';

type Locale = 'ar' | 'fr';

interface FooterProps {
  locale: Locale;
}

export default function Footer({ locale }: FooterProps) {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const isRTL = locale === 'ar';

  const getLink = useCallback((path: string) => {
    if (path === '/') return `/${locale}`;
    return `/${locale}${path}`;
  }, [locale]);

  return (
    <footer className="bg-primary text-white">
      <div className="container-custom py-10 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">ف</span>
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold">سوق الفلاح</h2>
                <p className="text-xs text-gray-300">FellahSouq</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              {t('aboutText')}
            </p>
          </div>

          <div>
            <h3 className="font-bold text-base sm:text-lg mb-4">{t('quickLinks')}</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href={getLink("/")} className="text-gray-300 hover:text-accent transition-colors text-sm">
                  {tNav('home')}
                </Link>
              </li>
              <li>
                <Link href={getLink("/listings")} className="text-gray-300 hover:text-accent transition-colors text-sm">
                  {isRTL ? 'الإعلانات' : 'Annonces'}
                </Link>
              </li>
              <li>
                <Link href={getLink("/investment")} className="text-gray-300 hover:text-accent transition-colors text-sm">
                  {tNav('investment')}
                </Link>
              </li>
              <li>
                <Link href={getLink("/jobs")} className="text-gray-300 hover:text-accent transition-colors text-sm">
                  {tNav('jobs')}
                </Link>
              </li>
              <li>
                <Link href={getLink("/create-listing")} className="text-gray-300 hover:text-accent transition-colors text-sm">
                  {isRTL ? 'أضف إعلانك' : 'Publier une annonce'}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-base sm:text-lg mb-4">{t('categories')}</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href={getLink("/category/agricultural-lands")} className="text-gray-300 hover:text-accent transition-colors text-sm">
                  {isRTL ? 'الأراضي الزراعية' : 'Terrains agricoles'}
                </Link>
              </li>
              <li>
                <Link href={getLink("/category/farm-equipment")} className="text-gray-300 hover:text-accent transition-colors text-sm">
                  {isRTL ? 'المعدات الزراعية' : 'Équipements'}
                </Link>
              </li>
              <li>
                <Link href={getLink("/category/farm-products")} className="text-gray-300 hover:text-accent transition-colors text-sm">
                  {isRTL ? 'منتجات الفلاح' : 'Produits'}
                </Link>
              </li>
              <li>
                <Link href={getLink("/category/livestock")} className="text-gray-300 hover:text-accent transition-colors text-sm">
                  {isRTL ? 'الماشية' : 'Bétail'}
                </Link>
              </li>
              <li>
                <Link href={getLink("/auctions")} className="text-gray-300 hover:text-accent transition-colors text-sm">
                  {isRTL ? 'المزادات' : 'Enchères'}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-base sm:text-lg mb-4">{t('contact')}</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2.5 text-gray-300 text-sm">
                <Icons.MapPin className="w-4 h-4 text-accent flex-shrink-0" />
                <span>{isRTL ? 'الدار البيضاء، المغرب' : 'Casablanca, Maroc'}</span>
              </li>
              <li className="flex items-center gap-2.5 text-gray-300 text-sm">
                <Icons.Phone className="w-4 h-4 text-accent flex-shrink-0" />
                <span>+212 522 123 456</span>
              </li>
              <li className="flex items-center gap-2.5 text-gray-300 text-sm">
                <svg className="w-4 h-4 text-accent flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                <span>contact@fellahsouq.ma</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 sm:mt-10 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-xs sm:text-sm">
            © 2026 {t('copyright')}
          </p>
          <div className="flex gap-4 sm:gap-6">
            <Link href={getLink("/privacy")} className="text-gray-400 hover:text-accent text-xs sm:text-sm">
              {t('privacy')}
            </Link>
            <Link href={getLink("/terms")} className="text-gray-400 hover:text-accent text-xs sm:text-sm">
              {t('terms')}
            </Link>
            <Link href={getLink("/faq")} className="text-gray-400 hover:text-accent text-xs sm:text-sm">
              {t('faq')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
