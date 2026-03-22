'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store';
import { Icons } from '@/components/ui/Icons';

interface InvestmentPageClientProps {
  locale: string;
}

export default function InvestmentPageClient({ locale }: InvestmentPageClientProps) {
  const isRTL = locale === 'ar';
  const router = useRouter();
  const { getInvestmentListings, getOrCreateConversation, setCurrentConversation } = useAppStore();
  const [sortBy, setSortBy] = useState<'return' | 'investment' | 'duration'>('return');
  
  const investmentListings = useMemo(() => {
    const listings = getInvestmentListings();
    
    switch (sortBy) {
      case 'return':
        return [...listings].sort((a, b) => (b.expectedReturn || 0) - (a.expectedReturn || 0));
      case 'investment':
        return [...listings].sort((a, b) => (a.requiredInvestment || 0) - (b.requiredInvestment || 0));
      case 'duration':
        return [...listings].sort((a, b) => {
          const durationA = a.duration || '';
          const durationB = b.duration || '';
          const numA = parseInt(durationA.match(/\d+/)?.[0] || '999', 10);
          const numB = parseInt(durationB.match(/\d+/)?.[0] || '999', 10);
          return numA - numB;
        });
      default:
        return listings;
    }
  }, [getInvestmentListings, sortBy]);

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)}M`;
    }
    if (price >= 1000) {
      return `${(price / 1000).toFixed(0)}K`;
    }
    return price.toString();
  };

  const handleContactOwner = (listing: any) => {
    const conversation = getOrCreateConversation(listing.id, `seller_${listing.contactPhone}`);
    if (conversation) {
      setCurrentConversation(conversation.id);
      router.push(`/${locale}/messages?conversation=${conversation.id}`);
    }
  };

  const totalInvestment = investmentListings.reduce((sum, l) => sum + (l.requiredInvestment || 0), 0);
  const avgReturn = investmentListings.length > 0
    ? Math.round(investmentListings.reduce((sum, l) => sum + (l.expectedReturn || 0), 0) / investmentListings.length)
    : 0;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container-custom py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
              <Icons.Chart className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {isRTL ? 'الاستثمار الزراعي' : 'Agricultural Investment'}
              </h1>
              <p className="text-gray-500">
                {isRTL 
                  ? `${investmentListings.length} فرصة استثمارية` 
                  : `${investmentListings.length} opportunity(s)`}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  {isRTL ? 'إجمالي الفرص' : 'Total Opportunities'}
                </p>
                <p className="text-2xl font-bold text-gray-800">{investmentListings.length}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Icons.Chart className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  {isRTL ? 'متوسط العائد المتوقع' : 'Avg Expected Return'}
                </p>
                <p className="text-2xl font-bold text-green-600">{avgReturn}%</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Icons.TrendUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  {isRTL ? 'إجمالي رأس المال المطلوب' : 'Total Capital Required'}
                </p>
                <p className="text-2xl font-bold text-secondary">
                  {formatPrice(totalInvestment)} MAD
                </p>
              </div>
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                <Icons.Briefcase className="w-6 h-6 text-secondary" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800">
            {isRTL ? 'الفرص المتاحة' : 'Available Opportunities'}
          </h2>
          
          <div className="flex gap-2">
            <button
              onClick={() => setSortBy('return')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                sortBy === 'return'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border'
              }`}
            >
              {isRTL ? 'الأعلى عائداً' : 'Top Return'}
            </button>
            <button
              onClick={() => setSortBy('investment')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                sortBy === 'investment'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border'
              }`}
            >
              {isRTL ? 'أقل مبلغ' : 'Lowest Entry'}
            </button>
            <button
              onClick={() => setSortBy('duration')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                sortBy === 'duration'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border'
              }`}
            >
              {isRTL ? 'الأقصر مدة' : 'Shortest Term'}
            </button>
          </div>
        </div>

        {investmentListings.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <Icons.Chart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              {isRTL ? 'لا توجد فرص استثمارية حالياً' : 'No investment opportunities at the moment'}
            </h2>
            <p className="text-gray-500 mb-6">
              {isRTL ? 'تابعنا للحصول على إشعارات الفرص الجديدة' : 'Follow us for new opportunity alerts'}
            </p>
            <Link href={isRTL ? '/ar' : '/fr'} className="btn-primary">
              {isRTL ? 'العودة للرئيسية' : "Return to Home"}
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {investmentListings.map((listing) => (
              <div
                key={listing.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="lg:w-48 h-32 bg-gradient-to-br from-secondary/20 to-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icons.Chart className="w-16 h-16 text-secondary/40" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <Link 
                            href={`/${locale}/listing/${listing.id}`}
                            className="text-xl font-bold text-gray-800 hover:text-primary transition-colors"
                          >
                            {isRTL ? listing.titleAr : listing.title}
                          </Link>
                          <div className="flex items-center gap-2 mt-1 text-gray-500 text-sm">
                            <Icons.MapPin className="w-4 h-4" />
                            <span>{isRTL ? listing.locationAr : listing.location}</span>
                          </div>
                        </div>
                        <span className="bg-secondary/10 text-secondary text-xs px-3 py-1 rounded-full font-medium">
                          {isRTL ? 'استثمار' : 'Investment'}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {isRTL ? listing.descriptionAr : listing.description}
                      </p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-500 mb-1">
                            {isRTL ? 'المبلغ المطلوب' : 'Required Capital'}
                          </p>
                          <p className="text-lg font-bold text-primary">
                            {formatPrice(listing.requiredInvestment || 0)} MAD
                          </p>
                        </div>
                        
                        <div className="bg-green-50 rounded-lg p-3">
                          <p className="text-xs text-gray-500 mb-1">
                            {isRTL ? 'العائد المتوقع' : 'Expected Return'}
                          </p>
                          <p className="text-lg font-bold text-green-600">
                            +{listing.expectedReturn || 0}%
                          </p>
                        </div>
                        
                        <div className="bg-blue-50 rounded-lg p-3">
                          <p className="text-xs text-gray-500 mb-1">
                            {isRTL ? 'مدة الاستثمار' : 'Duration'}
                          </p>
                          <p className="text-lg font-bold text-blue-600">
                            {listing.duration || 'N/A'}
                          </p>
                        </div>
                        
                        <div className="bg-purple-50 rounded-lg p-3">
                          <p className="text-xs text-gray-500 mb-1">
                            {isRTL ? 'القيمة الإجمالية' : 'Total Value'}
                          </p>
                          <p className="text-lg font-bold text-purple-600">
                            {formatPrice(listing.price)} MAD
                          </p>
                        </div>
                      </div>
                      
                      <div className="div" />
                      
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-primary font-bold">
                              {listing.contactName?.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{listing.contactName}</p>
                            <p className="text-xs text-gray-500">
                              {isRTL ? 'مالك المشروع' : 'Project Owner'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex gap-3">
                          <Link 
                            href={`/${locale}/listing/${listing.id}`}
                            className="px-4 py-2 border border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-white transition-colors"
                          >
                            {isRTL ? 'عرض التفاصيل' : 'View Details'}
                          </Link>
                          <button
                            onClick={() => handleContactOwner(listing)}
                            className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
                          >
                            <Icons.ChatAlt className="w-4 h-4" />
                            {isRTL ? 'تواصل' : 'Contact'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
