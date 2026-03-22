import { getCategoryBySlug } from '@/data/categories';
import { sampleListings } from '@/data/listings';
import ListingCard from '@/components/home/ListingCard';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Icons } from '@/components/ui/Icons';

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  
  if (!category) {
    notFound();
  }

  const listings = sampleListings.filter(l => l.categorySlug === slug);

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
            {category.nameAr}
          </h1>
          <p className="text-gray-600">
            {category.descriptionAr}
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">الفئات الفرعية</h2>
          <div className="flex flex-wrap gap-2">
            {category.subcategories.map((sub) => (
              <Link
                key={sub.id}
                href={`/category/${slug}/${sub.slug}`}
                className="bg-white px-4 py-2 rounded-lg text-sm text-gray-700 hover:bg-primary hover:text-white transition-colors"
              >
                {sub.nameAr}
              </Link>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <p className="text-gray-600">
            {listings.length} نتيجة
          </p>
        </div>

        {listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl">
            <Icons.Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">لا توجد إعلانات في هذه الفئة حالياً</p>
          </div>
        )}
      </div>
    </div>
  );
}
