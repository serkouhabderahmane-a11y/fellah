'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function CTASection() {
  const t = useTranslations('home');
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
  const isRTL = pathname.startsWith('/ar');

  return (
    <section className="py-20 bg-gradient-to-r from-primary via-primary-light to-primary-dark relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-2xl mb-8">
            <span className="text-4xl">🌾</span>
            <span className="text-white text-lg font-medium">
              {isRTL ? 'انضم لآلاف المزارعين' : 'Rejoignez des milliers de fermiers'}
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {t('ctaTitle')}
          </h2>
          
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            {t('ctaDesc')}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/register"
              className="btn-secondary py-4 px-10 text-lg inline-flex items-center gap-2 shadow-2xl hover:shadow-3xl hover:-translate-y-1"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              {t('ctaButton')}
            </Link>
            
            <Link 
              href="/listings"
              className="bg-white/10 backdrop-blur-sm text-white py-4 px-10 rounded-xl font-semibold inline-flex items-center gap-2 hover:bg-white/20 transition-all hover:-translate-y-1"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {isRTL ? 'تصفح الإعلانات' : 'Parcourir les annonces'}
            </Link>
          </div>

          <div className="flex items-center justify-center gap-8 mt-12 pt-8 border-t border-white/20">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">50K+</div>
              <div className="text-white/60 text-sm">{isRTL ? 'مستخدم نشط' : 'Utilisateurs actifs'}</div>
            </div>
            <div className="w-px h-12 bg-white/20"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">10K+</div>
              <div className="text-white/60 text-sm">{isRTL ? 'إعلان' : 'Annonces'}</div>
            </div>
            <div className="w-px h-12 bg-white/20"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">5K+</div>
              <div className="text-white/60 text-sm">{isRTL ? 'تاجر' : 'Commerçants'}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
