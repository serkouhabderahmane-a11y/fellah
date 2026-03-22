import AdminPageClient from './AdminPageClient';

export default async function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <AdminPageClient />;
}
