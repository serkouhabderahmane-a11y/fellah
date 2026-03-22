import EditListingFormClient from '@/components/listing/EditListingFormClient';

interface EditListingPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function EditListingPage({ params }: EditListingPageProps) {
  const { locale, id } = await params;
  const isRTL = locale === 'ar';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {isRTL ? 'تعديل الإعلان' : "Modifier l'annonce"}
          </h1>
          <p className="text-gray-600">
            {isRTL 
              ? 'عدّل إعلانك وأبقه محدّثاً'
              : 'Modifiez votre annonce et gardez-la à jour'
            }
          </p>
        </div>

        <EditListingFormClient locale={locale as 'ar' | 'fr'} listingId={id} />
      </div>
    </div>
  );
}
