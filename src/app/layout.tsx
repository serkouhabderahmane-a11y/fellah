import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FellahSouq - سوق الفلاح | أكبر منصة زراعية في المغرب",
  description: "منصة سوق الفلاح هي أكبر منصة زراعية في المغرب، نربط المزارعين والمستثمرين والمشترين. شراء وبيع الأراضي الزراعية، المعدات، المنتجات، والماشية.",
  keywords: "agriculture, Morocco, farming, marketplace, فلاحة, المغرب, زراعة",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
