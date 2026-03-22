import ListingsPageClient from './ListingsPageClient';

export default async function ListingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <ListingsPageClient locale={locale} />;
}
