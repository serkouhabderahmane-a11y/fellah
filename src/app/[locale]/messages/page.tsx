import MessagesPageClient from './MessagesPageClient';

export default async function MessagesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <MessagesPageClient locale={locale} />;
}
