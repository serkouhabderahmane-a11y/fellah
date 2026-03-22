import type { Metadata } from "next";
import { Cairo, Montserrat } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const cairo = Cairo({
  subsets: ["arabic"],
  variable: "--font-cairo",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "FellahSouq - سوق الفلاح | أكبر منصة زراعية في المغرب",
  description: "منصة سوق الفلاح هي أكبر منصة زراعية في المغرب، نربط المزارعين والمستثمرين والمشترين. شراء وبيع الأراضي الزراعية، المعدات، المنتجات، والماشية.",
  keywords: "agriculture, Morocco, farming, marketplace, فلاحة, المغرب, زراعة",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  if (!routing.locales.includes(locale as typeof routing.locales[number])) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body className={`${cairo.variable} ${montserrat.variable} font-arabic min-h-screen flex flex-col`}>
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="flex-1 pt-20">
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
