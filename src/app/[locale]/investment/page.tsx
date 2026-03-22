import InvestmentPageClient from './InvestmentPageClient';

export default async function InvestmentPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <InvestmentPageClient locale={locale} />;
}
