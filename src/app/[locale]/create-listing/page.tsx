import ListingForm from '@/components/listing/ListingForm';

interface CreateListingPageProps {
  params: Promise<{ locale: string }>;
}

export default async function CreateListingPage({ params }: CreateListingPageProps) {
  const { locale } = await params;
  const isRTL = locale === 'ar';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {isRTL ? 'إنشاء إعلان جديد' : 'Créer une nouvelle annonce'}
          </h1>
          <p className="text-gray-600">
            {isRTL 
              ? 'أنشئ إعلانك وابدأ البيع على سوق الفلاح'
              : 'Créez votre annonce et commencez à vendre sur FellahSouq'
            }
          </p>
        </div>

        <ListingForm locale={locale as 'ar' | 'fr'} />
      </div>
    </div>
  );
}
