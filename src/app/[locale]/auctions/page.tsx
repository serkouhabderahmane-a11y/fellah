import AuctionsPageClient from './AuctionsPageClient';

export default async function AuctionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <AuctionsPageClient locale={locale} />;
}
