'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAppStore } from '@/store';
import { categories } from '@/data/categories';
import { Listing, Message, User } from '@/types';

type TabType = 'listings' | 'messages' | 'favorites' | 'profile' | 'settings';

const roleInfo: Record<string, { title: string; titleAr: string; color: string; icon: string }> = {
  farmer: { title: 'Farmer Dashboard', titleAr: 'لوحة تحكم الفلاح', color: 'from-green-500 to-green-600', icon: '🌾' },
  buyer: { title: 'Buyer Dashboard', titleAr: 'لوحة تحكم المشتري', color: 'from-blue-500 to-blue-600', icon: '🛒' },
  investor: { title: 'Investor Dashboard', titleAr: 'لوحة تحكم المستثمر', color: 'from-amber-500 to-amber-600', icon: '💰' },
  admin: { title: 'Admin Dashboard', titleAr: 'لوحة تحكم المدير', color: 'from-purple-500 to-purple-600', icon: '⚙️' },
};

const statusConfig = {
  active: { labelAr: 'نشط', labelFr: 'Actif', color: 'bg-green-100 text-green-700 border-green-200' },
  pending: { labelAr: 'قيد الانتظار', labelFr: 'En attente', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  sold: { labelAr: 'تم البيع', labelFr: 'Vendu', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  expired: { labelAr: 'منتهي', labelFr: 'Expiré', color: 'bg-gray-100 text-gray-700 border-gray-200' },
};

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role') || 'farmer';
  const info = roleInfo[role] || roleInfo.farmer;
  
  const [activeTab, setActiveTab] = useState<TabType>('listings');
  const [mounted, setMounted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  const {
    listings,
    favorites,
    messages,
    user,
    deleteListing,
    updateListing,
    toggleFavorite,
    markMessageAsRead,
    updateUserProfile,
    getUnreadMessagesCount,
  } = useAppStore();
  
  const locale = useMemo(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname.split('/')[1] || 'ar';
    }
    return 'ar';
  }, []);
  
  const isRTL = locale === 'ar';
  const unreadMessages = getUnreadMessagesCount();
  
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    setIsClient(true);
    return () => clearTimeout(timer);
  }, []);
  
  const userListings = useMemo(() => listings.slice(0, 10), [listings]);
  const favoriteListings = useMemo(() => 
    listings.filter(l => favorites.includes(l.id)),
    [listings, favorites]
  );
  
  const stats = useMemo(() => ({
    totalListings: userListings.length,
    activeListings: userListings.filter(l => l.status === 'active').length,
    totalViews: userListings.reduce((sum, l) => sum + (l.views || 0), 0),
    totalFavorites: userListings.reduce((sum, l) => sum + (l.favorites || 0), 0),
    favoritesCount: favorites.length,
    messagesCount: messages.length,
    unreadMessages: unreadMessages,
  }), [userListings, favorites, messages, unreadMessages]);
  
  const handleDelete = (id: string) => {
    if (typeof window !== 'undefined' && window.confirm(isRTL ? 'هل أنت متأكد من حذف هذا الإعلان؟' : 'Êtes-vous sûr de vouloir supprimer cette annonce?')) {
      deleteListing(id);
    }
  };
  
  const handleStatusChange = (id: string, status: 'active' | 'pending' | 'sold' | 'expired') => {
    updateListing(id, { status });
  };
  
  const getCategoryName = (slug: string, lang: 'ar' | 'fr') => {
    const cat = categories.find(c => c.slug === slug);
    if (!cat) return slug;
    return lang === 'ar' ? cat.nameAr : cat.nameFr;
  };
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(isRTL ? 'ar-MA' : 'fr-FR');
  };
  
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'listings' as const, labelAr: 'إعلاناتي', labelFr: 'Mes annonces', icon: '📋', count: stats.totalListings },
    { id: 'messages' as const, labelAr: 'الرسائل', labelFr: 'Messages', icon: '💬', count: unreadMessages, showBadge: unreadMessages > 0 },
    { id: 'favorites' as const, labelAr: 'المفضلة', labelFr: 'Favoris', icon: '❤️', count: stats.favoritesCount },
    { id: 'profile' as const, labelAr: 'الملف الشخصي', labelFr: 'Profil', icon: '👤', count: null },
    { id: 'settings' as const, labelAr: 'الإعدادات', labelFr: 'Paramètres', icon: '⚙️', count: null },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className={`bg-gradient-to-r ${info.color} text-white py-12`}>
        <div className="container-custom">
          <div className="flex items-center gap-4 animate-fade-in">
            <span className="text-5xl">{info.icon}</span>
            <div>
              <h1 className="text-3xl font-bold">{info.titleAr}</h1>
              <p className="text-white/80">{info.title}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom -mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon="📋" label={isRTL ? 'إجمالي الإعلانات' : 'Total annonces'} value={stats.totalListings} color="bg-white" />
          <StatCard icon="✅" label={isRTL ? 'إعلانات نشطة' : 'Annonces actives'} value={stats.activeListings} color="bg-white" />
          <StatCard icon="👁️" label={isRTL ? 'إجمالي المشاهدات' : 'Total vues'} value={stats.totalViews} color="bg-white" />
          <StatCard icon="❤️" label={isRTL ? 'إجمالي المفضلة' : 'Total favoris'} value={stats.totalFavorites} color="bg-white" />
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-100">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap transition-all relative ${
                    activeTab === tab.id
                      ? 'text-primary border-b-2 border-primary bg-primary/5'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{isRTL ? tab.labelAr : tab.labelFr}</span>
                  {tab.count !== null && tab.count > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      tab.showBadge ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'listings' && (
              <ListingsTab
                listings={userListings}
                locale={locale}
                isRTL={isRTL}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
                getCategoryName={getCategoryName}
                formatDate={formatDate}
                statusConfig={statusConfig}
              />
            )}
            
            {activeTab === 'messages' && (
              <MessagesTab
                messages={messages}
                locale={locale}
                isRTL={isRTL}
                onMarkRead={markMessageAsRead}
              />
            )}
            
            {activeTab === 'favorites' && (
              <FavoritesTab
                listings={favoriteListings}
                locale={locale}
                isRTL={isRTL}
                onToggleFavorite={toggleFavorite}
                getCategoryName={getCategoryName}
              />
            )}
            
            {activeTab === 'profile' && (
              <ProfileTab
                user={user}
                locale={locale}
                isRTL={isRTL}
                onUpdateProfile={updateUserProfile}
                stats={stats}
              />
            )}
            
            {activeTab === 'settings' && (
              <SettingsTab locale={locale} isRTL={isRTL} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: string; label: string; value: number; color: string }) {
  return (
    <div className={`${color} rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        <span className="text-2xl font-bold text-gray-800">{value.toLocaleString()}</span>
      </div>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

interface ListingsTabProps {
  listings: Listing[];
  locale: string;
  isRTL: boolean;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: 'active' | 'pending' | 'sold' | 'expired') => void;
  getCategoryName: (slug: string, lang: 'ar' | 'fr') => string;
  formatDate: (dateStr: string) => string;
  statusConfig: Record<string, { labelAr: string; labelFr: string; color: string }>;
}

function ListingsTab({ listings, locale, isRTL, onDelete, onStatusChange, getCategoryName, formatDate, statusConfig }: ListingsTabProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          {isRTL ? 'إعلاناتي' : 'Mes annonces'}
        </h2>
        <Link
          href={`/${locale}/create-listing`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-primary-light text-white rounded-xl font-medium text-sm shadow-lg hover:shadow-xl transition-all"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {isRTL ? 'إضافة إعلان جديد' : 'Nouvelle annonce'}
        </Link>
      </div>

      {listings.length > 0 ? (
        <div className="space-y-4">
          {listings.map((listing) => {
            const status = listing.status || 'active';
            const statusInfo = statusConfig[status];
            return (
              <div key={listing.id} className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:border-primary/30 hover:bg-primary/5 transition-all">
                <div className="w-20 h-20 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden">
                  {listing.images[0] ? (
                    <img src={listing.images[0]} alt={listing.titleAr} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">🌱</div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-800 truncate">{listing.titleAr}</h3>
                      <p className="text-sm text-gray-500">{getCategoryName(listing.categorySlug, 'ar')}</p>
                      <p className="text-sm text-gray-400">{listing.locationAr}</p>
                    </div>
                    <div className="text-left">
                      <span className="text-lg font-bold text-primary block">
                        {listing.price.toLocaleString()} MAD
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}>
                        {isRTL ? statusInfo.labelAr : statusInfo.labelFr}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {listing.views || 0} {isRTL ? 'مشاهدة' : 'vues'}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {listing.favorites || 0} {isRTL ? 'مفضل' : 'favoris'}
                    </span>
                    <span>{formatDate(listing.createdAt)}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <select
                    value={status}
                    onChange={(e) => onStatusChange(listing.id, e.target.value as any)}
                    className="px-2 py-1 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  >
                    <option value="active">{isRTL ? 'نشط' : 'Actif'}</option>
                    <option value="pending">{isRTL ? 'قيد الانتظار' : 'En attente'}</option>
                    <option value="sold">{isRTL ? 'تم البيع' : 'Vendu'}</option>
                    <option value="expired">{isRTL ? 'منتهي' : 'Expiré'}</option>
                  </select>
                  
                  <Link
                    href={`/${locale}/edit-listing/${listing.id}`}
                    className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                    title={isRTL ? 'تعديل' : 'Modifier'}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </Link>
                  
                  <Link
                    href={`/${locale}/listing/${listing.id}`}
                    className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                    title={isRTL ? 'عرض' : 'Voir'}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </Link>
                  
                  <button
                    onClick={() => onDelete(listing.id)}
                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    title={isRTL ? 'حذف' : 'Supprimer'}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">📋</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {isRTL ? 'لا توجد إعلانات' : 'Aucune annonce'}
          </h3>
          <p className="text-gray-500 mb-4">
            {isRTL ? 'ابدأ بإضافة أول إعلان لك' : 'Commencez par ajouter votre première annonce'}
          </p>
          <Link
            href={`/${locale}/create-listing`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {isRTL ? 'إضافة إعلان جديد' : 'Créer une annonce'}
          </Link>
        </div>
      )}
    </div>
  );
}

interface MessagesTabProps {
  messages: Message[];
  locale: string;
  isRTL: boolean;
  onMarkRead: (messageId: string) => void;
}

function MessagesTab({ messages, locale, isRTL, onMarkRead }: MessagesTabProps) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        {isRTL ? 'الرسائل' : 'Messages'}
      </h2>

      {messages.length > 0 ? (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-4 rounded-xl border transition-all ${
                msg.read
                  ? 'border-gray-100 bg-gray-50'
                  : 'border-primary/30 bg-primary/5'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  {msg.senderAvatar ? (
                    <img src={msg.senderAvatar} alt={msg.senderName} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span className="text-xl">👤</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className={`font-semibold ${msg.read ? 'text-gray-600' : 'text-gray-800'}`}>
                      {msg.senderName}
                    </h4>
                    <span className="text-xs text-gray-400">
                      {new Date(msg.createdAt).toLocaleString(isRTL ? 'ar-MA' : 'fr-FR')}
                    </span>
                  </div>
                  <p className={`text-sm ${msg.read ? 'text-gray-500' : 'text-gray-700'}`}>
                    {msg.content}
                  </p>
                  {!msg.read && (
                    <button
                      onClick={() => onMarkRead(msg.id)}
                      className="mt-2 text-sm text-primary hover:underline"
                    >
                      {isRTL ? 'تحديد كمقروء' : 'Marquer comme lu'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">💬</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {isRTL ? 'لا توجد رسائل' : 'Aucun message'}
          </h3>
          <p className="text-gray-500">
            {isRTL ? 'ستظهر رسائل جديدة هنا' : 'Les nouveaux messages apparaîtront ici'}
          </p>
        </div>
      )}
    </div>
  );
}

interface FavoritesTabProps {
  listings: Listing[];
  locale: string;
  isRTL: boolean;
  onToggleFavorite: (listingId: string) => void;
  getCategoryName: (slug: string, lang: 'ar' | 'fr') => string;
}

function FavoritesTab({ listings, locale, isRTL, onToggleFavorite, getCategoryName }: FavoritesTabProps) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        {isRTL ? 'إعلاناتي المفضلة' : 'Mes annonces favorites'}
      </h2>

      {listings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {listings.map((listing) => (
            <div key={listing.id} className="flex gap-4 p-4 border border-gray-100 rounded-xl hover:shadow-lg transition-all">
              <div className="w-24 h-24 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden">
                {listing.images[0] ? (
                  <img src={listing.images[0]} alt={listing.titleAr} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">🌱</div>
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 truncate">{listing.titleAr}</h4>
                <p className="text-sm text-gray-500">{getCategoryName(listing.categorySlug, 'ar')}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-bold text-primary">
                    {listing.price.toLocaleString()} MAD
                  </span>
                  <button
                    onClick={() => onToggleFavorite(listing.id)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded-full transition-all"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">❤️</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {isRTL ? 'لا توجد مفضلات' : 'Aucun favori'}
          </h3>
          <p className="text-gray-500">
            {isRTL ? 'احفظ الإعلانات المفضلة للوصول إليها لاحقاً' : 'Sauvegardez vos annonces favorites pour y accéder plus tard'}
          </p>
        </div>
      )}
    </div>
  );
}

interface ProfileTabProps {
  user: User | null;
  locale: string;
  isRTL: boolean;
  onUpdateProfile: (profile: Partial<User>) => void;
  stats: {
    totalListings: number;
    activeListings: number;
    totalViews: number;
    totalFavorites: number;
    favoritesCount: number;
    messagesCount: number;
    unreadMessages: number;
  };
}

function ProfileTab({ user, locale, isRTL, onUpdateProfile, stats }: ProfileTabProps) {
  const [name, setName] = useState(user?.name || 'مستخدم تجريبي');
  const [email, setEmail] = useState(user?.email || 'user@fellahsouq.ma');
  const [phone, setPhone] = useState(user?.phone || '+212 6XX XXX XXX');
  const [bio, setBio] = useState(user?.bio || '');
  const [location, setLocation] = useState(user?.location || 'المغرب');

  const handleSave = () => {
    onUpdateProfile({ name, email, phone, bio, location });
    alert(isRTL ? 'تم تحديث الملف الشخصي بنجاح!' : 'Profil mis à jour avec succès!');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        {isRTL ? 'الملف الشخصي' : 'Profil'}
      </h2>

      <div className="flex items-center gap-6 mb-8">
        <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center">
          <span className="text-4xl text-white font-bold">ف</span>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">{name}</h3>
          <p className="text-gray-500">{email}</p>
          <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            {isRTL ? 'فلاح' : 'Fermier'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-primary">{stats.totalListings}</div>
          <div className="text-sm text-gray-500">{isRTL ? 'إعلانات' : 'Annonces'}</div>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-primary">{stats.totalViews}</div>
          <div className="text-sm text-gray-500">{isRTL ? 'مشاهدات' : 'Vues'}</div>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-primary">{stats.favoritesCount}</div>
          <div className="text-sm text-gray-500">{isRTL ? 'مفضلات' : 'Favoris'}</div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {isRTL ? 'الاسم' : 'Nom'}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {isRTL ? 'البريد الإلكتروني' : 'Email'}
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {isRTL ? 'رقم الهاتف' : 'Téléphone'}
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {isRTL ? 'الموقع' : 'Localisation'}
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {isRTL ? 'نبذة' : 'Bio'}
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
          />
        </div>
        
        <button
          onClick={handleSave}
          className="w-full py-3 bg-gradient-to-r from-primary to-primary-light text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          {isRTL ? 'حفظ التغييرات' : 'Enregistrer les modifications'}
        </button>
      </div>
    </div>
  );
}

function SettingsTab({ locale, isRTL }: { locale: string; isRTL: boolean }) {
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        {isRTL ? 'الإعدادات' : 'Paramètres'}
      </h2>

      <div className="space-y-6">
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="font-semibold text-gray-800 mb-4">
            {isRTL ? 'اللغة' : 'Langue'}
          </h3>
          <div className="flex gap-4">
            <Link
              href={`/ar${window?.location?.pathname?.replace(/^\/(ar|fr)/, '') || ''}`}
              className={`flex-1 py-3 rounded-xl font-medium text-center transition-all ${
                isRTL
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-primary'
              }`}
            >
              🇸🇦 العربية
            </Link>
            <Link
              href={`/fr${window?.location?.pathname?.replace(/^\/(ar|fr)/, '') || ''}`}
              className={`flex-1 py-3 rounded-xl font-medium text-center transition-all ${
                !isRTL
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-primary'
              }`}
            >
              🇫🇷 Français
            </Link>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="font-semibold text-gray-800 mb-4">
            {isRTL ? 'الإشعارات' : 'Notifications'}
          </h3>
          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-gray-600">
                {isRTL ? 'إشعارات الرسائل الجديدة' : 'Nouveaux messages'}
              </span>
              <input type="checkbox" defaultChecked className="w-5 h-5 text-primary rounded" />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-gray-600">
                {isRTL ? 'إشعارات المفضلات الجديدة' : 'Nouveaux favoris'}
              </span>
              <input type="checkbox" defaultChecked className="w-5 h-5 text-primary rounded" />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-gray-600">
                {isRTL ? 'تقارير المشاهدات' : 'Rapports de vues'}
              </span>
              <input type="checkbox" className="w-5 h-5 text-primary rounded" />
            </label>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="font-semibold text-gray-800 mb-4">
            {isRTL ? 'الخصوصية' : 'Confidentialité'}
          </h3>
          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-gray-600">
                {isRTL ? 'إظهار رقم الهاتف' : 'Afficher le téléphone'}
              </span>
              <input type="checkbox" defaultChecked className="w-5 h-5 text-primary rounded" />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-gray-600">
                {isRTL ? 'إظهار الموقع' : 'Afficher la localisation'}
              </span>
              <input type="checkbox" defaultChecked className="w-5 h-5 text-primary rounded" />
            </label>
          </div>
        </div>

        <div className="bg-red-50 rounded-xl p-6">
          <h3 className="font-semibold text-red-600 mb-4">
            {isRTL ? 'خطر' : 'Danger'}
          </h3>
          <button className="w-full py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors">
            {isRTL ? 'حذف الحساب' : 'Supprimer le compte'}
          </button>
        </div>
      </div>
    </div>
  );
}
