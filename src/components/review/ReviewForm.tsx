'use client';

import { useState } from 'react';
import { useAppStore } from '@/store';
import StarRating from '@/components/ui/StarRating';

interface ReviewFormProps {
  sellerId: string;
  sellerName: string;
  listingId: string;
  isRTL?: boolean;
  onSuccess?: () => void;
}

export default function ReviewForm({
  sellerId,
  sellerName,
  listingId,
  isRTL = false,
  onSuccess,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const { addReview, user, hasReviewed } = useAppStore();
  
  const hasAlreadyReviewed = user ? hasReviewed(sellerId, user.id) : false;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (rating === 0) {
      setError(isRTL ? 'يرجى اختيار تقييم' : 'Veuillez sélectionner une note');
      return;
    }
    
    if (comment.trim().length < 10) {
      setError(isRTL ? 'التعليق قصير جداً (10 أحرف على الأقل)' : 'Commentaire trop court (minimum 10 caractères)');
      return;
    }
    
    if (!user) {
      setError(isRTL ? 'يجب تسجيل الدخول أولاً' : 'Vous devez être connecté');
      return;
    }
    
    if (hasAlreadyReviewed) {
      setError(isRTL ? 'لقد قمت بتقييم هذا البائع سابقاً' : 'Vous avez déjà évalué ce vendeur');
      return;
    }
    
    addReview({
      reviewerId: user.id,
      reviewerName: user.name,
      reviewerAvatar: user.avatar,
      sellerId,
      listingId,
      rating,
      comment: comment.trim(),
    });
    
    setSuccess(true);
    setRating(0);
    setComment('');
    
    if (onSuccess) {
      setTimeout(onSuccess, 2000);
    }
  };

  if (hasAlreadyReviewed) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
        <p className="text-green-700 font-medium">
          {isRTL ? '✓ شكراً لك! لقد قمت بتقييم هذا البائع.' : '✓ Merci! Vous avez déjà évalué ce vendeur.'}
        </p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
        <p className="text-green-700 font-medium">
          {isRTL ? '✓ شكراً لك! تم إضافة تقييمك بنجاح.' : '✓ Merci! Votre évaluation a été ajoutée avec succès.'}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 border">
      <h3 className="font-bold text-lg mb-4">
        {isRTL ? 'قيّم هذا البائع' : 'Évaluer ce vendeur'}
      </h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {isRTL ? 'التقييم' : 'Note'}
        </label>
        <div className={isRTL ? 'flex-row-reverse' : ''}>
          <StarRating
            rating={rating}
            size="lg"
            interactive
            onChange={setRating}
            isRTL={isRTL}
          />
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {isRTL ? 'تعليقك' : 'Votre commentaire'}
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={isRTL ? 'اكتب تعليقك هنا...' : 'Écrivez votre commentaire ici...'}
          className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
          rows={4}
        />
        <p className="text-xs text-gray-500 mt-1">
          {comment.length}/500
        </p>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}
      
      <button
        type="submit"
        className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors"
      >
        {isRTL ? 'إرسال التقييم' : 'Envoyer l\'évaluation'}
      </button>
    </form>
  );
}
