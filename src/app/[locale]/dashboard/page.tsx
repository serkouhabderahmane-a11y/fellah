'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { sampleListings } from '@/data/listings';

const roleInfo: Record<string, { title: string, titleAr: string, color: string, icon: string }> = {
  farmer: { title: 'Farmer Dashboard', titleAr: 'لوحة تحكم الفلاح', color: 'from-green-500 to-green-600', icon: '🌾' },
  buyer: { title: 'Buyer Dashboard', titleAr: 'لوحة تحكم المشتري', color: 'from-blue-500 to-blue-600', icon: '🛒' },
  investor: { title: 'Investor Dashboard', titleAr: 'لوحة تحكم المستثمر', color: 'from-amber-500 to-amber-600', icon: '💰' },
  admin: { title: 'Admin Dashboard', titleAr: 'لوحة تحكم المدير', color: 'from-purple-500 to-purple-600', icon: '⚙️' },
};

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role') || 'farmer';
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const info = roleInfo[role] || roleInfo.farmer;
  const userListings = sampleListings.slice(0, 4);

  const stats = [
    { label: 'الإعلانات', labelEn: 'Listings', value: '12', icon: '📋' },
    { label: 'الرسائل', labelEn: 'Messages', value: '5', icon: '💬' },
    { label: 'المحفوظات', labelEn: 'Saved', value: '8', icon: '❤️' },
    { label: 'المشاهدات', labelEn: 'Views', value: '1.2K', icon: '👁️' },
  ];

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className={`bg-gradient-to-r ${info.color} text-white py-16`}>
        <div className="container-custom">
          <div className="flex items-center gap-4 mb-4 animate-fade-in">
            <span className="text-5xl">{info.icon}</span>
            <div>
              <h1 className="text-4xl font-bold">{info.titleAr}</h1>
              <p className="text-white/80 text-lg">{info.title}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">{stat.icon}</span>
                <span className="text-3xl font-bold text-gray-800">{stat.value}</span>
              </div>
              <p className="text-gray-500 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">إعلاناتي</h2>
                <Link href="/dashboard/add-listing" className="btn-primary py-2 px-4 text-sm">
                  + إضافة إعلان
                </Link>
              </div>
              
              <div className="space-y-4">
                {userListings.map((listing) => (
                  <div key={listing.id} className="flex items-center gap-4 p-4 border rounded-xl hover:border-primary transition-colors">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">🌱</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{listing.titleAr}</h3>
                      <p className="text-sm text-gray-500">{listing.locationAr}</p>
                    </div>
                    <span className="text-primary font-bold">{listing.price.toLocaleString()} MAD</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">الملف الشخصي</h2>
              <div className="text-center mb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-3xl text-white font-bold">ف</span>
                </div>
                <h3 className="font-bold text-gray-800">المستخدم التجريبي</h3>
                <p className="text-gray-500 text-sm">user@fellahsouq.ma</p>
                <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  {info.titleAr}
                </span>
              </div>
              <Link href="/dashboard/profile" className="btn-outline w-full text-center block">
                تعديل الملف
              </Link>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-4">الإجراءات السريعة</h2>
              <div className="space-y-2">
                <Link href="/dashboard/listings" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <span>📋</span>
                  <span className="text-gray-700">إعلاناتي</span>
                </Link>
                <Link href="/dashboard/messages" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <span>💬</span>
                  <span className="text-gray-700">الرسائل</span>
                </Link>
                <Link href="/dashboard/saved" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <span>❤️</span>
                  <span className="text-gray-700">المحفوظات</span>
                </Link>
                <Link href="/dashboard/settings" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <span>⚙️</span>
                  <span className="text-gray-700">الإعدادات</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
