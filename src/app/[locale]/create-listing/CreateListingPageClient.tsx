'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppStore } from '@/store';
import { Icons } from '@/components/ui/Icons';
import ListingForm from '@/components/listing/ListingForm';

interface CreateListingPageClientProps {
  locale: string;
}

export default function CreateListingPageClient({ locale }: CreateListingPageClientProps) {
  const router = useRouter();
  const isRTL = locale === 'ar';
  const { user, canCreateListing, updateUserPlan } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const { allowed, remaining, limit } = canCreateListing();
  const plan = user?.plan || 'free';

  const planColors = {
    free: 'bg-gray-100 text-gray-700 border-gray-300',
    pro: 'bg-blue-100 text-blue-700 border-blue-300',
    enterprise: 'bg-purple-100 text-purple-700 border-purple-300',
  };

  const planNames = {
    free: isRTL ? 'مجاني' : 'Gratuit',
    pro: isRTL ? 'احترافي' : 'Pro',
    enterprise: isRTL ? 'مؤسسات' : 'Entreprise',
  };

  if (!allowed) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icons.X className="w-10 h-10 text-red-500" />
              </div>
              
              <h1 className="text-2xl font-bold text-gray-800 mb-4">
                {isRTL ? 'تم الوصول للحد الأقصى' : 'Limite atteinte'}
              </h1>
              
              <p className="text-gray-600 mb-6">
                {isRTL 
                  ? `لقد وصلت للحد الأقصى من الإعلانات المسموحة (${limit}) لخطة ${planNames[plan]}.` 
                  : `Vous avez atteint la limite de ${limit} annonces pour le plan ${planNames[plan]}.`}
              </p>

              <div className={`p-4 rounded-xl mb-6 ${planColors[plan]}`}>
                <p className="font-semibold mb-2">
                  {isRTL ? 'خطة сейчас:' : 'Plan actuel:'} {planNames[plan]}
                </p>
                <p className="text-sm">
                  {isRTL ? 'الإعلانات المستخدمة:' : 'Annonces utilisées:'} {limit} / {limit}
                </p>
              </div>

              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                {isRTL ? 'قم بالترقية للخطة الاحترافية:' : 'Passez au plan Pro:'}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="border-2 rounded-xl p-6 hover:border-blue-500 transition-colors cursor-pointer" onClick={() => updateUserPlan('pro')}>
                  <div className="text-xl font-bold text-blue-600 mb-2">{isRTL ? 'احترافي' : 'Pro'}</div>
                  <div className="text-3xl font-bold text-gray-800 mb-2">199 <span className="text-sm font-normal text-gray-500">MAD/{isRTL ? 'شهر' : 'mois'}</span></div>
                  <ul className="text-sm text-gray-600 text-start space-y-1">
                    <li>✓ {isRTL ? '20 إعلان' : '20 annonces'}</li>
                    <li>✓ {isRTL ? 'إعلانات مميزة' : 'Annonces en vedette'}</li>
                    <li>✓ {isRTL ? 'دعم متقدم' : 'Support avancé'}</li>
                  </ul>
                </div>
                
                <div className="border-2 rounded-xl p-6 hover:border-purple-500 transition-colors cursor-pointer" onClick={() => updateUserPlan('enterprise')}>
                  <div className="text-xl font-bold text-purple-600 mb-2">{isRTL ? 'مؤسسات' : 'Entreprise'}</div>
                  <div className="text-3xl font-bold text-gray-800 mb-2">499 <span className="text-sm font-normal text-gray-500">MAD/{isRTL ? 'شهر' : 'mois'}</span></div>
                  <ul className="text-sm text-gray-600 text-start space-y-1">
                    <li>✓ {isRTL ? 'إعلانات غير محدودة' : 'Annonces illimitées'}</li>
                    <li>✓ {isRTL ? 'كل المميزات' : 'Toutes les fonctionnalités'}</li>
                    <li>✓ {isRTL ? 'دعم متميز' : 'Support premium'}</li>
                  </ul>
                </div>
              </div>

              <Link href="/dashboard" className="text-primary hover:underline">
                {isRTL ? 'العودة للوحة التحكم' : 'Retour au tableau de bord'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {isRTL ? 'إنشاء إعلان جديد' : 'Créer une nouvelle annonce'}
            </h1>
            <p className="text-gray-600">
              {isRTL 
                ? `لديك ${remaining} ${remaining === 1 ? 'إعلان' : 'إعلانات'} متبقية`
                : `Il vous reste ${remaining} annonce(s)`}
            </p>
          </div>
          
          <div className={`px-4 py-2 rounded-xl border ${planColors[plan]}`}>
            <span className="font-semibold">{planNames[plan]}</span>
          </div>
        </div>

        <ListingForm locale={locale as 'ar' | 'fr'} />
      </div>
    </div>
  );
}
