'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store';
import { Icons } from '@/components/ui/Icons';
import { Job } from '@/types';

interface JobsPageClientProps {
  locale: string;
}

const JOB_CATEGORIES = {
  farming: { ar: 'الفلاحة', fr: 'Agriculture' },
  livestock: { ar: 'تربية الماشية', fr: 'Élevage' },
  equipment: { ar: 'المعدات', fr: 'Équipement' },
  management: { ar: 'الإدارة', fr: 'Management' },
  processing: { ar: 'المعالجة', fr: 'Transformation' },
  other: { ar: 'أخرى', fr: 'Autre' },
};

export default function JobsPageClient({ locale }: JobsPageClientProps) {
  const isRTL = locale === 'ar';
  const router = useRouter();
  const { getJobs, getOrCreateConversation, setCurrentConversation } = useAppStore();
  const [filter, setFilter] = useState<'all' | 'offer' | 'request'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  const jobs = useMemo(() => {
    let filtered = getJobs();
    
    if (filter !== 'all') {
      filtered = filtered.filter(j => j.jobType === filter);
    }
    
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(j => j.category === categoryFilter);
    }
    
    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [getJobs, filter, categoryFilter]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-MA', {
      style: 'currency',
      currency: 'MAD',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleContact = (job: Job) => {
    const conversation = getOrCreateConversation(job.id, `job_${job.contactPhone}`);
    if (conversation) {
      setCurrentConversation(conversation.id);
      router.push(`/${locale}/messages?conversation=${conversation.id}`);
    }
  };

  const stats = useMemo(() => {
    const allJobs = getJobs();
    return {
      offers: allJobs.filter(j => j.jobType === 'offer').length,
      requests: allJobs.filter(j => j.jobType === 'request').length,
      total: allJobs.length,
    };
  }, [getJobs]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container-custom py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Icons.Briefcase className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {isRTL ? 'الوظائف الزراعية' : 'Agricultural Jobs'}
              </h1>
              <p className="text-gray-500">
                {isRTL 
                  ? `${stats.total} وظيفة متاحة` 
                  : `${stats.total} offre(s) disponible(s)`}
              </p>
            </div>
          </div>
          <Link 
            href={`/${locale}/jobs/create`}
            className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <Icons.Plus className="w-5 h-5" />
            {isRTL ? 'إضافة وظيفة' : 'Publier une offre'}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div 
            onClick={() => setFilter('all')}
            className={`bg-white rounded-xl p-4 shadow-sm border cursor-pointer transition-all ${filter === 'all' ? 'border-primary ring-2 ring-primary/20' : 'hover:border-gray-300'}`}
          >
            <p className="text-sm text-gray-500">{isRTL ? 'الكل' : 'Tous'}</p>
            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          </div>
          
          <div 
            onClick={() => setFilter('offer')}
            className={`bg-white rounded-xl p-4 shadow-sm border cursor-pointer transition-all ${filter === 'offer' ? 'border-primary ring-2 ring-primary/20' : 'hover:border-gray-300'}`}
          >
            <p className="text-sm text-gray-500">{isRTL ? 'عروض عمل' : 'Offres d\'emploi'}</p>
            <p className="text-2xl font-bold text-primary">{stats.offers}</p>
          </div>
          
          <div 
            onClick={() => setFilter('request')}
            className={`bg-white rounded-xl p-4 shadow-sm border cursor-pointer transition-all ${filter === 'request' ? 'border-accent ring-2 ring-accent/20' : 'hover:border-gray-300'}`}
          >
            <p className="text-sm text-gray-500">{isRTL ? 'طلبات عمل' : 'Demandes d\'emploi'}</p>
            <p className="text-2xl font-bold text-accent">{stats.requests}</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              categoryFilter === 'all'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100 border'
            }`}
          >
            {isRTL ? 'الكل' : 'Tous'}
          </button>
          {Object.entries(JOB_CATEGORIES).map(([key, value]) => (
            <button
              key={key}
              onClick={() => setCategoryFilter(key)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                categoryFilter === key
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border'
              }`}
            >
              {isRTL ? value.ar : value.fr}
            </button>
          ))}
        </div>

        {jobs.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <Icons.Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              {isRTL ? 'لا توجد وظائف حالياً' : 'Aucune offre pour le moment'}
            </h2>
            <p className="text-gray-500 mb-6">
              {isRTL ? 'كن أول من ينشر وظيفة!' : 'Soyez le premier à publier une offre!'}
            </p>
            <Link href={`/${locale}/jobs/create`} className="btn-primary">
              {isRTL ? 'إضافة وظيفة' : 'Publier une offre'}
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow border"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        job.jobType === 'offer'
                          ? 'bg-primary/10 text-primary'
                          : 'bg-accent/10 text-accent'
                      }`}>
                        {job.jobType === 'offer' 
                          ? (isRTL ? 'عرض عمل' : 'Offre')
                          : (isRTL ? 'طلب عمل' : 'Demande')}
                      </span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {isRTL 
                          ? JOB_CATEGORIES[job.category].ar 
                          : JOB_CATEGORIES[job.category].fr}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      {isRTL ? job.titleAr : job.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {isRTL ? job.descriptionAr : job.description}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Icons.MapPin className="w-4 h-4" />
                        {isRTL ? job.locationAr : job.location}
                      </span>
                      {job.salary && (
                        <span className="flex items-center gap-1 font-medium text-green-600">
                          {formatPrice(job.salary)}/{job.salaryType === 'daily' ? (isRTL ? '/يوم' : '/jour') : (isRTL ? '/شهر' : '/mois')}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex md:flex-col items-center gap-3">
                    <div className="text-center">
                      <p className="text-sm text-gray-500">{isRTL ? 'الناشر' : 'Publié par'}</p>
                      <p className="font-medium text-gray-800">{job.contactName}</p>
                    </div>
                    <button
                      onClick={() => handleContact(job)}
                      className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
                    >
                      <Icons.ChatAlt className="w-4 h-4" />
                      {isRTL ? 'تواصل' : 'Contacter'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
