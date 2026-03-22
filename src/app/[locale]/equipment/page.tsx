import { sampleListings } from '@/data/listings';
import ListingCard from '@/components/home/ListingCard';
import Link from 'next/link';
import { Icons } from '@/components/ui/Icons';

export default async function EquipmentPage() {
  const equipmentListings = sampleListings.filter(l => 
    l.categorySlug === 'farm-equipment'
  );

  return (
    <div className="bg-gray-50 py-8">
      <div className="container-custom">
        <div className="mb-6">
          <Link href="/" className="text-primary hover:underline flex items-center gap-1">
            <Icons.ArrowRight className="w-4 h-4" />
            العودة للرئيسية
          </Link>
        </div>
        
        <div className="bg-white rounded-xl p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            المعدات الزراعية
          </h1>
          <p className="text-gray-600">
            تصفح جميع المعدات الزراعية المتاحة للبيع أو الإيجار
          </p>
        </div>

        <div className="mb-4">
          <p className="text-gray-600">
            {equipmentListings.length} إعلان متاح
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {equipmentListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </div>
    </div>
  );
}
