'use client';

import { useMemo, useCallback, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store';
import { Icons } from '@/components/ui/Icons';
import { Listing } from '@/types';

interface ListingPageClientProps {
  id: string;
  isRTL: boolean;
}

export default function ListingPageClient({ id, isRTL }: ListingPageClientProps) {
  const router = useRouter();
  const { listings, toggleFavorite, favorites, getOrCreateConversation, setCurrentConversation } = useAppStore();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const listing = useMemo(() => listings.find(l => l.id === id), [listings, id]);
  const isFavorite = mounted && favorites.includes(id);
  
  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat('ar-MA', {
      style: 'currency',
      currency: 'MAD',
      maximumFractionDigits: 0
    }).format(price);
  }, []);
  
  const handleContactSeller = useCallback(() => {
    if (!listing) return;
    
    const conversation = getOrCreateConversation(listing.id, `seller_${listing.contactPhone}`);
    if (conversation) {
      setCurrentConversation(conversation.id);
      router.push(`/${isRTL ? 'ar' : 'fr'}/messages?conversation=${conversation.id}`);
    }
  }, [listing, getOrCreateConversation, setCurrentConversation, router, isRTL]);
  
  const handleToggleFavorite = useCallback(() => {
    toggleFavorite(id);
  }, [toggleFavorite, id]);
  
  if (!listing) {
    return (
      <div className="bg-gray-50 py-8">
        <div className="container-custom">
          <div className="bg-white rounded-xl p-12 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {isRTL ? 'الإعلان غير موجود' : 'Annonce non trouvée'}
            </h2>
            <Link href="/" className="btn-primary">
              {isRTL ? 'العودة للرئيسية' : 'Retour à l\'accueil'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-8">
      <div className="container-custom">
        <div className="mb-6">
          <Link href={isRTL ? '/ar/listings' : '/fr/listings'} className="text-primary hover:underline flex items-center gap-1">
            <Icons.ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            {isRTL ? 'العودة للإعلانات' : 'Retour aux annonces'}
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl overflow-hidden">
              <div className="h-80 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <Icons.Map className="w-32 h-32 text-primary/30" />
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="bg-primary text-white text-xs px-3 py-1 rounded-full">
                      {listing.type === 'sale' ? (isRTL ? 'للبيع' : 'À vendre') : (isRTL ? 'للإيجار' : 'À louer')}
                    </span>
                    {listing.featured && (
                      <span className="bg-accent text-white text-xs px-3 py-1 rounded-full ms-2">
                        {isRTL ? 'مميز' : 'Featured'}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={handleToggleFavorite}
                      className={`p-2 rounded-full transition-colors ${
                        isFavorite 
                          ? 'text-red-500 bg-red-50 hover:bg-red-100' 
                          : 'text-gray-500 hover:text-red-500 hover:bg-red-50'
                      }`}
                    >
                      <Icons.Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>

                <h1 className="text-2xl font-bold text-gray-800 mb-4">
                  {isRTL ? listing.titleAr : listing.title}
                </h1>

                <div className="flex items-center gap-2 text-gray-600 mb-6">
                  <Icons.MapPin className="w-5 h-5" />
                  <span>{isRTL ? listing.locationAr : listing.location}</span>
                </div>

                <div className="border-t pt-6">
                  <h2 className="font-bold text-lg mb-4">
                    {isRTL ? 'الوصف' : 'Description'}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {isRTL ? listing.descriptionAr : listing.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-xl p-6 sticky top-24">
              <div className="text-3xl font-bold text-primary mb-4">
                {formatPrice(listing.price)}
                {listing.type === 'rent' && (
                  <span className="text-sm text-gray-500"> / {isRTL ? 'شهر' : 'mois'}</span>
                )}
              </div>

              <div className="border-t border-b py-4 mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold">{listing.contactName.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-gray-700 font-medium">{listing.contactName}</p>
                    <p className="text-xs text-gray-500">{isRTL ? 'البائع' : 'Vendeur'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Icons.Phone className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{listing.contactPhone}</span>
                </div>
              </div>

              <button 
                onClick={handleContactSeller}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-primary to-primary-light text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all mb-3"
              >
                <Icons.ChatAlt className="w-5 h-5" />
                {isRTL ? 'تواصل مع البائع' : 'Contacter le vendeur'}
              </button>
              <a 
                href={`tel:${listing.contactPhone}`}
                className="w-full flex items-center justify-center gap-2 py-3 border-2 border-primary text-primary rounded-xl font-semibold hover:bg-primary hover:text-white transition-all"
              >
                <Icons.Phone className="w-5 h-5" />
                {isRTL ? 'اتصل الآن' : 'Appeler maintenant'}
              </a>

              <div className="mt-6 pt-4 border-t text-sm text-gray-500 space-y-2">
                <p>{isRTL ? 'تاريخ النشر:' : 'Publié le:'} {listing.createdAt}</p>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Icons.Eye className="w-4 h-4" />
                    {listing.views} {isRTL ? 'مشاهدة' : 'vues'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icons.Heart className="w-4 h-4 fill-red-400" />
                    {listing.favorites}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
