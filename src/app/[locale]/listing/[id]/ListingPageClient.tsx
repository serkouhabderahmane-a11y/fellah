'use client';

import { useMemo, useCallback, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store';
import { Icons } from '@/components/ui/Icons';
import StarRating from '@/components/ui/StarRating';
import ReviewForm from '@/components/review/ReviewForm';
import CountdownTimer from '@/components/auction/CountdownTimer';
import BidForm from '@/components/auction/BidForm';

interface ListingPageClientProps {
  id: string;
  isRTL: boolean;
}

const categoryIcons: Record<string, string> = {
  'agricultural-lands': '🌾',
  'farm-equipment': '🚜',
  'farm-supplies': '🧪',
  'livestock': '🐄',
  'agricultural-investment': '💰',
  'farm-services': '🔧',
  'farm-products': '🍊',
  'auctions': '🔥',
  'agri-jobs': '👨‍🌾',
};

export default function ListingPageClient({ id, isRTL }: ListingPageClientProps) {
  const router = useRouter();
  const { listings, toggleFavorite, favorites, getOrCreateConversation, setCurrentConversation, getSellerRating, getSellerReviews, isAuctionEnded, getHighestBid, getListingBids } = useAppStore();
  const [mounted, setMounted] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  
  const listing = useMemo(() => listings.find(l => l.id === id), [listings, id]);
  const isFavorite = mounted && favorites.includes(id);
  const auctionEnded = listing ? isAuctionEnded(listing.id) : false;
  const currentBid = listing ? getHighestBid(listing.id) : 0;
  const bids = listing ? getListingBids(listing.id) : [];
  
  const sellerId = listing ? `seller_${listing.contactPhone}` : '';
  const sellerRating = sellerId ? getSellerRating(sellerId) : { average: 0, count: 0 };
  const sellerReviews = sellerId ? getSellerReviews(sellerId).filter(r => r.listingId === id) : [];
  
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
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!listing) {
    return (
      <div className="bg-gray-50 py-8 sm:py-12">
        <div className="container-custom">
          <div className="bg-white rounded-xl sm:rounded-2xl p-8 sm:p-12 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icons.Map className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
              {isRTL ? 'الإعلان غير موجود' : 'Annonce non trouvée'}
            </h2>
            <Link href="/" className="inline-flex items-center gap-2 btn-primary">
              <Icons.ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
              {isRTL ? 'العودة للرئيسية' : 'Retour à l\'accueil'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50/50 py-6 sm:py-10">
      <div className="container-custom">
        <div className="mb-4 sm:mb-6">
          <Link href={isRTL ? '/ar/listings' : '/fr/listings'} className="text-primary hover:underline flex items-center gap-1.5 text-sm">
            <Icons.ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            {isRTL ? 'العودة للإعلانات' : 'Retour aux annonces'}
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 order-1">
            <div className="bg-white rounded-xl sm:rounded-2xl overflow-hidden">
              <div className="relative aspect-[16/10] sm:aspect-[16/9] bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                {listing.images[0] ? (
                  <Image
                    src={listing.images[0]}
                    alt={listing.titleAr}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    priority
                  />
                ) : (
                  <span className="text-7xl sm:text-8xl">
                    {categoryIcons[listing.categorySlug] || '🌱'}
                  </span>
                )}
                
                <div className="absolute top-3 start-3 flex gap-2">
                  {listing.isAuction ? (
                    <span className="bg-accent text-white text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-semibold shadow-lg flex items-center gap-1.5">
                      <Icons.Fire className="w-3.5 h-3.5" />
                      {isRTL ? 'مزاد' : 'Enchère'}
                    </span>
                  ) : (
                    <span className="bg-primary text-white text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-semibold shadow-lg">
                      {listing.type === 'sale' ? (isRTL ? 'للبيع' : 'À vendre') : (isRTL ? 'للإيجار' : 'À louer')}
                    </span>
                  )}
                  {listing.featured && (
                    <span className="bg-accent text-white text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-semibold shadow-lg flex items-center gap-1">
                      <Icons.Star className="w-3.5 h-3.5 fill-white" />
                      {isRTL ? 'مميز' : 'Featured'}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="p-4 sm:p-6 lg:p-8">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                      {isRTL ? listing.titleAr : listing.title}
                    </h1>
                    <div className="flex items-center gap-1.5 text-gray-600 text-sm">
                      <Icons.MapPin className="w-4 h-4 text-primary/60" />
                      <span>{isRTL ? listing.locationAr : listing.location}</span>
                    </div>
                  </div>
                  <button 
                    onClick={handleToggleFavorite}
                    className={`p-2 sm:p-2.5 rounded-full transition-all flex-shrink-0 ${
                      isFavorite 
                        ? 'text-red-500 bg-red-50 hover:bg-red-100' 
                        : 'text-gray-500 hover:text-red-500 hover:bg-red-50'
                    }`}
                  >
                    <Icons.Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <h2 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">
                    {isRTL ? 'الوصف' : 'Description'}
                  </h2>
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                    {isRTL ? listing.descriptionAr : listing.description}
                  </p>
                </div>

                {sellerRating.count > 0 && (
                  <div className="border-t border-gray-100 pt-6 mt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-bold text-base sm:text-lg">
                        {isRTL ? 'التقييمات' : 'Évaluations'}
                      </h2>
                      <div className="flex items-center gap-2">
                        <StarRating rating={sellerRating.average} size="sm" showValue isRTL={isRTL} />
                        <span className="text-sm text-gray-500">
                          ({sellerRating.count})
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-3 sm:space-y-4">
                      {sellerReviews.slice(0, 3).map((review) => (
                        <div key={review.id} className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                <span className="text-primary text-sm font-bold">
                                  {review.reviewerName.charAt(0)}
                                </span>
                              </div>
                              <span className="font-medium text-gray-800 text-sm">
                                {review.reviewerName}
                              </span>
                            </div>
                            <StarRating rating={review.rating} size="sm" isRTL={isRTL} />
                          </div>
                          <p className="text-gray-600 text-sm">{review.comment}</p>
                          <p className="text-xs text-gray-400 mt-2">
                            {new Date(review.createdAt).toLocaleDateString(isRTL ? 'ar-MA' : 'fr-MA')}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="order-2 lg:order-2">
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:sticky lg:top-28">
              {listing.isAuction ? (
                <>
                  <div className="bg-gradient-to-r from-accent/10 to-primary/10 rounded-xl p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Icons.Fire className="w-5 h-5 text-accent" />
                      <span className="font-bold text-accent">
                        {isRTL ? 'مزاد!' : 'Enchère!'}
                      </span>
                    </div>
                    <CountdownTimer endTime={listing.auctionEndTime!} isRTL={isRTL} />
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">
                      {isRTL ? 'أعلى مزايدة:' : 'Meilleure offre:'}
                    </p>
                    <div className="text-2xl sm:text-3xl font-bold text-primary">
                      {formatPrice(currentBid)}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {isRTL 
                        ? `ابتدائي: ${formatPrice(listing.startingPrice || listing.price)}` 
                        : `Initial: ${formatPrice(listing.startingPrice || listing.price)}`}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {(listing.bidCount || 0)} {isRTL ? 'مزايدة' : 'enchère(s)'}
                    </p>
                  </div>
                  
                  <BidForm 
                    listingId={listing.id}
                    startingPrice={listing.startingPrice || listing.price}
                    currentBid={currentBid}
                    isRTL={isRTL}
                    disabled={auctionEnded}
                  />
                  
                  {bids.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        {isRTL ? 'أعلى المزايدات:' : 'Meilleures offres:'}
                      </p>
                      <div className="space-y-2">
                        {bids.slice(0, 3).map((bid) => (
                          <div key={bid.id} className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">{bid.bidderName}</span>
                            <span className="font-semibold text-primary">{formatPrice(bid.amount)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="text-2xl sm:text-3xl font-bold text-primary mb-4">
                    {formatPrice(listing.price)}
                    {listing.type === 'rent' && (
                      <span className="text-sm text-gray-500"> / {isRTL ? 'شهر' : 'mois'}</span>
                    )}
                  </div>
                </>
              )}

              <div className="border-t border-b border-gray-100 py-4 mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">{listing.contactName.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-700 font-medium text-sm sm:text-base">{listing.contactName}</p>
                    <p className="text-xs text-gray-500">{isRTL ? 'البائع' : 'Vendeur'}</p>
                  </div>
                  {sellerRating.count > 0 && (
                    <div className="text-start flex-shrink-0">
                      <div className="flex items-center gap-1">
                        <Icons.Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="font-bold text-gray-800">{sellerRating.average}</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {sellerRating.count}
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2.5">
                  <Icons.Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{listing.contactPhone}</span>
                </div>
              </div>

              <div className="space-y-2.5">
                <button 
                  onClick={handleContactSeller}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-primary to-primary-light text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
                >
                  <Icons.ChatAlt className="w-5 h-5" />
                  {isRTL ? 'تواصل مع البائع' : 'Contacter'}
                </button>
                <a 
                  href={`tel:${listing.contactPhone}`}
                  className="w-full flex items-center justify-center gap-2 py-3 border-2 border-primary text-primary rounded-xl font-semibold hover:bg-primary hover:text-white transition-all"
                >
                  <Icons.Phone className="w-5 h-5" />
                  {isRTL ? 'اتصل الآن' : 'Appeler'}
                </a>
                <button 
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="w-full flex items-center justify-center gap-2 py-2 text-gray-600 hover:text-primary transition-colors text-sm"
                >
                  <Icons.Star className="w-4 h-4" />
                  {isRTL ? 'قيّم البائع' : 'Évaluer'}
                </button>
              </div>
              
              {showReviewForm && (
                <div className="mt-4 pt-4 border-t">
                  <ReviewForm 
                    sellerId={sellerId}
                    sellerName={listing.contactName}
                    listingId={listing.id}
                    isRTL={isRTL}
                    onSuccess={() => setShowReviewForm(false)}
                  />
                </div>
              )}

              <div className="mt-6 pt-4 border-t text-xs sm:text-sm text-gray-500 space-y-2">
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
