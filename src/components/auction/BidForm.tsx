'use client';

import { useState } from 'react';
import { useAppStore } from '@/store';
import { Icons } from '@/components/ui/Icons';

interface BidFormProps {
  listingId: string;
  startingPrice: number;
  currentBid: number;
  isRTL?: boolean;
  disabled?: boolean;
}

export default function BidForm({
  listingId,
  startingPrice,
  currentBid,
  isRTL = false,
  disabled = false,
}: BidFormProps) {
  const [bidAmount, setBidAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const { placeBid, user } = useAppStore();
  
  const minBid = currentBid > 0 ? currentBid + 100 : startingPrice + 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    
    const amount = parseInt(bidAmount.replace(/,/g, ''), 10);
    
    if (isNaN(amount)) {
      setError(isRTL ? 'يرجى إدخال مبلغ صحيح' : 'Veuillez entrer un montant valide');
      return;
    }
    
    if (amount < minBid) {
      setError(isRTL 
        ? `يجب أن يكون المبلغ على الأقل ${minBid.toLocaleString()} درهم` 
        : `Le montant minimum est ${minBid.toLocaleString()} MAD`);
      return;
    }
    
    if (!user) {
      setError(isRTL ? 'يجب تسجيل الدخول أولاً' : 'Vous devez être connecté');
      return;
    }
    
    const success = placeBid(listingId, amount);
    
    if (success) {
      setSuccess(true);
      setBidAmount('');
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(isRTL ? 'فشل في تسجيل المزايدة' : 'Échec de l\'enchère');
    }
  };

  const handleQuickBid = (extra: number) => {
    const quickAmount = minBid + extra;
    setBidAmount(quickAmount.toString());
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-MA', {
      style: 'currency',
      currency: 'MAD',
      maximumFractionDigits: 0
    }).format(price);
  };

  if (disabled) {
    return (
      <div className="bg-gray-100 rounded-xl p-4 text-center">
        <p className="text-gray-500 font-medium">
          {isRTL ? 'انتهت فترة المزاد' : 'La période d\'enchère est terminée'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl p-4 border border-primary/20">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-600">
          {isRTL ? 'أقل مبلغ للمزايدة:' : 'Montant minimum:'}
        </span>
        <span className="font-bold text-primary">
          {formatPrice(minBid)}
        </span>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder={minBid.toString()}
            className="flex-1 rounded-lg border border-gray-200 px-4 py-3 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            dir="ltr"
          />
          <button
            type="submit"
            disabled={!bidAmount || disabled}
            className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRTL ? 'زايد' : 'Enchérir'}
          </button>
        </div>
        
        <div className="flex gap-2 mb-3">
          <button
            type="button"
            onClick={() => handleQuickBid(100)}
            className="flex-1 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:border-primary hover:text-primary transition-colors"
          >
            +100
          </button>
          <button
            type="button"
            onClick={() => handleQuickBid(500)}
            className="flex-1 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:border-primary hover:text-primary transition-colors"
          >
            +500
          </button>
          <button
            type="button"
            onClick={() => handleQuickBid(1000)}
            className="flex-1 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:border-primary hover:text-primary transition-colors"
          >
            +1000
          </button>
        </div>
        
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}
        
        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm font-medium">
            {isRTL ? '✓ تمت المزايدة بنجاح!' : '✓ Enchère réussie!'}
          </div>
        )}
      </form>
    </div>
  );
}
