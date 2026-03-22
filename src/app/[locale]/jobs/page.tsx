import JobsPageClient from './JobsPageClient';

export default async function JobsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <JobsPageClient locale={locale} />;
}
