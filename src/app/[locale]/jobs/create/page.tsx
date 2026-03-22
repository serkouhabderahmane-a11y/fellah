import CreateJobPageClient from './CreateJobPageClient';

export default async function CreateJobPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <CreateJobPageClient locale={locale} />;
}
