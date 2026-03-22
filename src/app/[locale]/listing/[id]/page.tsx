import { sampleListings } from '@/data/listings';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Icons } from '@/components/ui/Icons';

export default async function ListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listing = sampleListings.find(l => l.id === id);
  
  if (!listing) {
    notFound();
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-MA', {
      style: 'currency',
      currency: 'MAD',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="bg-gray-50 py-8">
      <div className="container-custom">
        <div className="mb-6">
          <Link href="/" className="text-primary hover:underline flex items-center gap-1">
            <Icons.ArrowRight className="w-4 h-4" />
            العودة للرئيسية
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
                      {listing.type === 'sale' ? 'للبيع' : 'للإيجار'}
                    </span>
                    {listing.featured && (
                      <span className="bg-accent text-white text-xs px-3 py-1 rounded-full me-2">
                        مميز
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-gray-500 hover:text-primary">
                      <Icons.Heart className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <h1 className="text-2xl font-bold text-gray-800 mb-4">
                  {listing.titleAr}
                </h1>

                <div className="flex items-center gap-2 text-gray-600 mb-6">
                  <Icons.MapPin className="w-5 h-5" />
                  <span>{listing.locationAr}</span>
                </div>

                <div className="border-t pt-6">
                  <h2 className="font-bold text-lg mb-4">الوصف</h2>
                  <p className="text-gray-600 leading-relaxed">
                    {listing.descriptionAr}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-xl p-6 sticky top-24">
              <div className="text-3xl font-bold text-primary mb-4">
                {formatPrice(listing.price)}
              </div>

              <div className="border-t border-b py-4 mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <Icons.User className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{listing.contactName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Icons.Phone className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{listing.contactPhone}</span>
                </div>
              </div>

              <button className="btn-primary w-full mb-3">
                اتصال بالبائع
              </button>
              <button className="btn-outline w-full">
                إرسال رسالة
              </button>

              <div className="mt-6 pt-4 border-t text-sm text-gray-500">
                <p>تاريخ النشر: {listing.createdAt}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
