import { NextIntlClientProvider, useMessages } from 'next-intl';
import Hero from '@/components/home/Hero';
import CategoriesSection from '@/components/home/CategoriesSection';
import ListingsSection from '@/components/home/ListingsSection';
import HowItWorks from '@/components/home/HowItWorks';
import CTASection from '@/components/home/CTASection';

export default function Home() {
  const messages = useMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <Hero />
      <CategoriesSection />
      <ListingsSection type="featured" />
      <ListingsSection type="latest" />
      <HowItWorks />
      <CTASection />
    </NextIntlClientProvider>
  );
}
