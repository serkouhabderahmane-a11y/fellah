import CreateListingPageClient from './CreateListingPageClient';

interface CreateListingPageProps {
  params: Promise<{ locale: string }>;
}

export default async function CreateListingPage({ params }: CreateListingPageProps) {
  const { locale } = await params;
  return <CreateListingPageClient locale={locale} />;
}
