import { notFound } from 'next/navigation';
import ListingPageClient from './ListingPageClient';

export default async function ListingPage({ params }: { params: Promise<{ id: string; locale: string }> }) {
  const { id, locale } = await params;
  const isRTL = locale === 'ar';
  
  return <ListingPageClient id={id} isRTL={isRTL} />;
}
