'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icons } from '@/components/ui/Icons';

export default function CTASection() {
  const pathname = usePathname();
  const isRTL = pathname.startsWith('/ar');

  const stats = [
    { value: '10,000+', label: 'إعلان', labelFr: 'Annonces', icon: Icons.Map },
    { value: '5,000+', label: 'مستخدم نشط', labelFr: 'Utilisateurs actifs', icon: Icons.User },
    { value: '50+', label: 'مدينة', labelFr: 'Villes', icon: Icons.MapPin },
  ];

  const features = [
    {
      icon: '🔒',
      title: 'آمن وموثوق',
      titleFr: 'Sécurisé & Fiable',
      desc: 'حماية بياناتك ومعلوماتك الشخصية',
      descFr: 'Protection de vos données personnelles',
    },
    {
      icon: '🌐',
      title: 'دعم اللغات',
      titleFr: 'Support Multilingue',
      desc: 'عربي وفرنسي',
      descFr: 'Arabe & Français',
    },
    {
      icon: '📱',
      title: 'سهل الاستخدام',
      titleFr: 'Facile à Utiliser',
      desc: 'واجهة بسيطة ومريحة',
      descFr: 'Interface simple et intuitive',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-primary via-primary-light to-primary-dark relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CjxyZWN0IHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgZmlsbD0ibm9uZSIvPgo8Y2lyY2xlIGN4PSI0MCIgY3k9IjQwIiByPSIyIiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-10"></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
              <span className="text-white/90 text-sm font-medium">
                {isRTL ? 'انضم لآلاف المزارعين' : 'Rejoignez des milliers de fermiers'}
              </span>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              {isRTL 
                ? 'هل أنت فلاح أو تبحث عن منتجات زراعية؟' 
                : 'Êtes-vous fermier ou recherchez-vous des produits agricoles?'}
            </h2>
            
            <p className="text-xl text-white/80 mb-8 max-w-lg">
              {isRTL 
                ? 'انضم إلى آلاف المزارعين والمشترين على منصة سوق الفلاح'
                : 'Rejoignez des milliers de fermiers et acheteurs sur FellahSouq'}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/register"
                className="inline-flex items-center justify-center gap-2 bg-white text-primary py-4 px-8 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-xl"
              >
                <Icons.User className="w-5 h-5" />
                {isRTL ? 'سجل الآن مجاناً' : 'Inscrivez-vous gratuitement'}
              </Link>
              
              <Link 
                href="/create-listing"
                className="inline-flex items-center justify-center gap-2 bg-accent text-white py-4 px-8 rounded-xl font-semibold hover:bg-accent/90 transition-colors shadow-xl"
              >
                <Icons.Plus className="w-5 h-5" />
                {isRTL ? 'أنشئ إعلانك' : 'Créez votre annonce'}
              </Link>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                  <stat.icon className="w-8 h-8 text-white/80 mx-auto mb-3" />
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-white/60 text-sm">{isRTL ? stat.label : stat.labelFr}</div>
                </div>
              ))}
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <h3 className="text-white font-bold mb-4">
                {isRTL ? 'مميزات المنصة' : 'Fonctionnalités'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl mb-2">{feature.icon}</div>
                    <div className="text-white font-medium text-sm">
                      {isRTL ? feature.title : feature.titleFr}
                    </div>
                    <div className="text-white/60 text-xs mt-1">
                      {isRTL ? feature.desc : feature.descFr}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
