'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Icons } from '@/components/ui/Icons';
import { useAppStore } from '@/store';
import { categories } from '@/data/categories';
import { MOROCCAN_CITIES } from '@/components/search/AdvancedSearch';

type TabType = 'listings' | 'users' | 'create';

export default function AdminPageClient() {
  const router = useRouter();
  const { user, listings, adminUsers, adminApproveListing, adminRejectListing, adminToggleFeatured, adminDeleteListing, adminCreateListing, addJob } = useAppStore();
  const [activeTab, setActiveTab] = useState<TabType>('listings');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  
  const isAdmin = user?.role === 'admin';

  const [createForm, setCreateForm] = useState({
    type: 'listing' as 'listing' | 'auction' | 'investment' | 'job',
    title: '',
    titleAr: '',
    description: '',
    descriptionAr: '',
    categorySlug: 'agricultural-lands',
    price: '',
    type2: 'sale' as 'sale' | 'rent',
    location: '',
    locationAr: '',
    contactName: user?.name || '',
    contactPhone: user?.phone || '',
    featured: false,
    auctionEndTime: '',
    startingPrice: '',
  });

  if (!isAdmin) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-xl p-12 text-center max-w-md shadow-lg">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icons.X className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">غير مصرح</h2>
          <p className="text-gray-500 mb-6">ليس لديك صلاحية للوصول إلى لوحة التحكم</p>
          <Link href="/" className="btn-primary">
            العودة للرئيسية
          </Link>
        </div>
      </div>
    );
  }

  const handleCreatePost = () => {
    if (!createForm.titleAr || !createForm.descriptionAr || !createForm.price) return;

    if (createForm.type === 'job') {
      addJob({
        title: createForm.titleAr,
        titleAr: createForm.titleAr,
        description: createForm.descriptionAr,
        descriptionAr: createForm.descriptionAr,
        location: createForm.locationAr,
        locationAr: createForm.locationAr,
        jobType: 'offer',
        category: 'farming',
        status: 'active',
        contactName: createForm.contactName,
        contactPhone: createForm.contactPhone,
      });
    } else {
      adminCreateListing({
        title: createForm.titleAr,
        titleAr: createForm.titleAr,
        description: createForm.descriptionAr,
        descriptionAr: createForm.descriptionAr,
        price: parseInt(createForm.price) || 0,
        categorySlug: createForm.categorySlug,
        subcategorySlug: 'general',
        location: createForm.locationAr,
        locationAr: createForm.locationAr,
        images: [],
        featured: createForm.featured,
        type: createForm.type2,
        status: 'active',
        contactName: createForm.contactName,
        contactPhone: createForm.contactPhone,
        views: 0,
        favorites: 0,
        isAuction: createForm.type === 'auction',
        startingPrice: createForm.type === 'auction' ? parseInt(createForm.startingPrice) : undefined,
        auctionEndTime: createForm.type === 'auction' ? createForm.auctionEndTime : undefined,
        requiredInvestment: createForm.type === 'investment' ? parseInt(createForm.price) : undefined,
        expectedReturn: createForm.type === 'investment' ? 15 : undefined,
        duration: createForm.type === 'investment' ? '3 years' : undefined,
      });
    }

    setCreateForm({
      type: 'listing',
      title: '',
      titleAr: '',
      description: '',
      descriptionAr: '',
      categorySlug: 'agricultural-lands',
      price: '',
      type2: 'sale',
      location: '',
      locationAr: '',
      contactName: user?.name || '',
      contactPhone: user?.phone || '',
      featured: false,
      auctionEndTime: '',
      startingPrice: '',
    });
    
    alert('تم إنشاء المنشور بنجاح!');
  };

  const pendingListings = listings.filter(l => l.status === 'pending');
  const activeListings = listings.filter(l => l.status === 'active');

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container-custom py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Icons.Chart className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">لوحة التحكم</h1>
              <p className="text-gray-500">إدارة المنصة والمحتوى</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('listings')}
              className={`flex-1 px-6 py-4 font-medium transition-colors ${
                activeTab === 'listings'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <Icons.Map className="w-5 h-5" />
                الإعلانات ({listings.length})
              </span>
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex-1 px-6 py-4 font-medium transition-colors ${
                activeTab === 'users'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <Icons.User className="w-5 h-5" />
                المستخدمين ({adminUsers.length})
              </span>
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`flex-1 px-6 py-4 font-medium transition-colors ${
                activeTab === 'create'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <Icons.Plus className="w-5 h-5" />
                إنشاء منشور
              </span>
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'listings' && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500">إجمالي الإعلانات</p>
                    <p className="text-2xl font-bold text-blue-600">{listings.length}</p>
                  </div>
                  <div className="bg-yellow-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500">بانتظار الموافقة</p>
                    <p className="text-2xl font-bold text-yellow-600">{pendingListings.length}</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500">نشطة</p>
                    <p className="text-2xl font-bold text-green-600">{activeListings.length}</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500">مميزة</p>
                    <p className="text-2xl font-bold text-purple-600">{listings.filter(l => l.featured).length}</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-start py-3 px-4 font-medium text-gray-500">العنوان</th>
                        <th className="text-start py-3 px-4 font-medium text-gray-500">الفئة</th>
                        <th className="text-start py-3 px-4 font-medium text-gray-500">الحالة</th>
                        <th className="text-start py-3 px-4 font-medium text-gray-500">مميز</th>
                        <th className="text-start py-3 px-4 font-medium text-gray-500">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listings.slice(0, 20).map((listing) => (
                        <tr key={listing.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <p className="font-medium text-gray-800 line-clamp-1">{listing.titleAr}</p>
                            <p className="text-sm text-gray-500">{listing.contactName}</p>
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {categories.find(c => c.slug === listing.categorySlug)?.nameAr || listing.categorySlug}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              listing.status === 'active' ? 'bg-green-100 text-green-700' :
                              listing.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                              listing.status === 'rejected' ? 'bg-red-100 text-red-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {listing.status === 'active' ? 'نشط' :
                               listing.status === 'pending' ? 'بانتظار' :
                               listing.status === 'rejected' ? 'مرفوض' : listing.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => adminToggleFeatured(listing.id)}
                              className={`p-2 rounded-lg transition-colors ${
                                listing.featured
                                  ? 'bg-yellow-100 text-yellow-600'
                                  : 'bg-gray-100 text-gray-400 hover:bg-yellow-50'
                              }`}
                            >
                              <Icons.Star className={`w-5 h-5 ${listing.featured ? 'fill-current' : ''}`} />
                            </button>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              {listing.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => adminApproveListing(listing.id)}
                                    className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-sm font-medium"
                                  >
                                    موافقة
                                  </button>
                                  <button
                                    onClick={() => adminRejectListing(listing.id, '')}
                                    className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm font-medium"
                                  >
                                    رفض
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => {
                                  if (confirm('هل تريد حذف هذا الإعلان؟')) {
                                    adminDeleteListing(listing.id);
                                  }
                                }}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              >
                                <Icons.X className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-start py-3 px-4 font-medium text-gray-500">الاسم</th>
                        <th className="text-start py-3 px-4 font-medium text-gray-500">البريد</th>
                        <th className="text-start py-3 px-4 font-medium text-gray-500">الدور</th>
                        <th className="text-start py-3 px-4 font-medium text-gray-500">الحالة</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminUsers.map((u) => (
                        <tr key={u.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                <span className="text-primary font-bold">{u.name.charAt(0)}</span>
                              </div>
                              <span className="font-medium text-gray-800">{u.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-600">{u.email}</td>
                          <td className="py-3 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                              u.role === 'seller' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {u.role === 'admin' ? 'مدير' :
                               u.role === 'seller' ? 'بائع' :
                               u.role === 'buyer' ? 'مشتري' : u.role}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              u.verified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {u.verified ? 'موثق' : 'غير موثق'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'create' && (
              <div className="max-w-2xl">
                <h2 className="text-xl font-bold text-gray-800 mb-6">إنشاء منشور جديد</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">نوع المنشور</label>
                    <select
                      value={createForm.type}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, type: e.target.value as any }))}
                      className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="listing">إعلان عادي</option>
                      <option value="auction">مزاد</option>
                      <option value="investment">استثمار</option>
                      <option value="job">وظيفة</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">العنوان (عربي)</label>
                      <input
                        type="text"
                        value={createForm.titleAr}
                        onChange={(e) => setCreateForm(prev => ({ ...prev, titleAr: e.target.value }))}
                        className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="عنوان الإعلان"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">الفئة</label>
                      <select
                        value={createForm.categorySlug}
                        onChange={(e) => setCreateForm(prev => ({ ...prev, categorySlug: e.target.value }))}
                        className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        {categories.map(cat => (
                          <option key={cat.slug} value={cat.slug}>{cat.nameAr}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">الوصف</label>
                    <textarea
                      value={createForm.descriptionAr}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, descriptionAr: e.target.value }))}
                      rows={4}
                      className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                      placeholder="وصف الإعلان..."
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">السعر</label>
                      <input
                        type="number"
                        value={createForm.price}
                        onChange={(e) => setCreateForm(prev => ({ ...prev, price: e.target.value }))}
                        className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="السعر"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">النوع</label>
                      <select
                        value={createForm.type2}
                        onChange={(e) => setCreateForm(prev => ({ ...prev, type2: e.target.value as any }))}
                        className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="sale">للبيع</option>
                        <option value="rent">للإيجار</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">الموقع</label>
                      <select
                        value={createForm.locationAr}
                        onChange={(e) => setCreateForm(prev => ({ ...prev, locationAr: e.target.value }))}
                        className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="">اختر المدينة</option>
                        {MOROCCAN_CITIES.map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {createForm.type === 'auction' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">السعر الابتدائي</label>
                        <input
                          type="number"
                          value={createForm.startingPrice}
                          onChange={(e) => setCreateForm(prev => ({ ...prev, startingPrice: e.target.value }))}
                          className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
                          placeholder="السعر الابتدائي"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ نهاية المزاد</label>
                        <input
                          type="datetime-local"
                          value={createForm.auctionEndTime}
                          onChange={(e) => setCreateForm(prev => ({ ...prev, auctionEndTime: e.target.value }))}
                          className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={createForm.featured}
                        onChange={(e) => setCreateForm(prev => ({ ...prev, featured: e.target.checked }))}
                        className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="text-sm font-medium text-gray-700">إعلان مميز</span>
                    </label>
                  </div>

                  <button
                    onClick={handleCreatePost}
                    className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                  >
                    إنشاء المنشور
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
