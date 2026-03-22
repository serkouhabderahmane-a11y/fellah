'use client';

import { useTranslations } from 'next-intl';

const steps = [
  {
    emoji: '📱',
    color: 'from-blue-500 to-blue-600',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    emoji: '🔍',
    color: 'from-purple-500 to-purple-600',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    emoji: '💬',
    color: 'from-emerald-500 to-emerald-600',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    emoji: '🤝',
    color: 'from-amber-500 to-amber-600',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

const stepsAr = [
  { title: 'أنشئ حسابك', description: 'سجل في المنصة ووصف نفسك كمزارع أو مشتري' },
  { title: 'تصفح أو أنشئ إعلانات', description: 'اعثر على ما تبحث عنه أو اعلن عن منتجاتك' },
  { title: 'تواصل مع البائعين', description: 'تواصل مباشرة مع المزارعين والبائعين' },
  { title: 'أكمل صفقتك', description: 'اتفق على التفاصيل وأتم صفقتك بأمان' },
];

const stepsFr = [
  { title: 'Créez votre compte', description: 'Inscrivez-vous et décrivez votre profil' },
  { title: 'Parcourez ou créez des annonces', description: 'Trouvez ce que vous cherchez ou vendez vos produits' },
  { title: 'Contactez les vendeurs', description: 'Communiquez directement avec les fermiers' },
  { title: 'Finalisez votre transaction', description: 'Accordz-vous sur les détails et concluez votre affaire' },
];

export default function HowItWorks() {
  const t = useTranslations('home');
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
  const isRTL = pathname.startsWith('/ar');
  const stepData = isRTL ? stepsAr : stepsFr;

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-pattern opacity-5"></div>
      
      <div className="container-custom relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            📋 {t('howItWorks')}
          </div>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            {isRTL ? 'كيف يعمل المنصة' : 'Comment ça marche'}
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            {isRTL 
              ? 'خطوات بسيطة untuk memulainya' 
              : 'Des étapes simples pour commencer'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="relative group"
            >
              <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center h-full">
                <div className="relative mb-6">
                  <div className={`w-20 h-20 mx-auto bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-white">{step.icon}</span>
                  </div>
                  <div className="absolute -top-2 -end-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {index + 1}
                  </div>
                </div>
                
                <h3 className="font-bold text-xl text-gray-800 mb-3">
                  {stepData[index].title}
                </h3>
                <p className="text-gray-500">
                  {stepData[index].description}
                </p>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -end-6 transform -translate-y-1/2 z-10">
                  <div className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
                    <svg className={`w-6 h-6 text-primary ${isRTL ? 'rotate-0' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
