'use client';

import { useAppStore } from '@/store';
import ListingForm from '@/components/listing/ListingForm';

interface ListingFormClientProps {
  locale: 'ar' | 'fr';
  listingId: string;
}

export default function ListingFormClient({ locale, listingId }: ListingFormClientProps) {
  const { getListingById } = useAppStore();
  const listing = getListingById(listingId);

  if (!listing) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
        <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Annonce non trouvée
        </h2>
        <p className="text-gray-600">
          Cette annonce n&apos;existe pas ou a été supprimée.
        </p>
      </div>
    );
  }

  return <ListingForm locale={locale} initialData={listing} listingId={listingId} />;
}
