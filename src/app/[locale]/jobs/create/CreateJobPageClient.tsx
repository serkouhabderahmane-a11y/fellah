'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store';
import { Icons } from '@/components/ui/Icons';
import Link from 'next/link';

interface CreateJobPageClientProps {
  locale: string;
}

const JOB_CATEGORIES = [
  { value: 'farming', labelAr: 'الفلاحة', labelFr: 'Agriculture' },
  { value: 'livestock', labelAr: 'تربية الماشية', labelFr: 'Élevage' },
  { value: 'equipment', labelAr: 'المعدات', labelFr: 'Équipement' },
  { value: 'management', labelAr: 'الإدارة', labelFr: 'Management' },
  { value: 'processing', labelAr: 'المعالجة', labelFr: 'Transformation' },
  { value: 'other', labelAr: 'أخرى', labelFr: 'Autre' },
];

export default function CreateJobPageClient({ locale }: CreateJobPageClientProps) {
  const isRTL = locale === 'ar';
  const router = useRouter();
  const { addJob, user } = useAppStore();
  
  const [formData, setFormData] = useState({
    title: '',
    titleAr: '',
    description: '',
    descriptionAr: '',
    location: '',
    locationAr: '',
    salary: '',
    salaryType: 'monthly' as 'monthly' | 'daily' | 'seasonal',
    jobType: 'offer' as 'offer' | 'request',
    category: 'farming' as 'farming' | 'livestock' | 'equipment' | 'management' | 'processing' | 'other',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.titleAr.trim()) {
      newErrors.titleAr = isRTL ? 'العنوان مطلوب' : 'Le titre est requis';
    }
    if (!formData.descriptionAr.trim()) {
      newErrors.descriptionAr = isRTL ? 'الوصف مطلوب' : 'La description est requise';
    }
    if (!formData.locationAr.trim()) {
      newErrors.locationAr = isRTL ? 'الموقع مطلوب' : 'La localisation est requise';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    addJob({
      title: formData.titleAr,
      titleAr: formData.titleAr,
      description: formData.descriptionAr,
      descriptionAr: formData.descriptionAr,
      location: formData.locationAr,
      locationAr: formData.locationAr,
      salary: formData.salary ? parseInt(formData.salary, 10) : undefined,
      salaryType: formData.salary ? formData.salaryType : undefined,
      jobType: formData.jobType,
      category: formData.category,
      status: 'active',
      contactName: user?.name || 'Anonymous',
      contactPhone: user?.phone || '+212 600 000 000',
    });
    
    setSuccess(true);
    setTimeout(() => {
      router.push(`/${locale}/jobs`);
    }, 2000);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (success) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="container-custom py-8">
          <div className="bg-white rounded-xl p-12 text-center max-w-lg mx-auto">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icons.Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {isRTL ? 'تم بنجاح!' : 'Succès!'}
            </h2>
            <p className="text-gray-600 mb-6">
              {isRTL ? 'تم نشر الوظيفة بنجاح' : 'L\'offre a été publiée avec succès'}
            </p>
            <Link href={`/${locale}/jobs`} className="btn-primary">
              {isRTL ? 'العودة للوظائف' : 'Retour aux offres'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container-custom py-8">
        <div className="mb-6">
          <Link href={`/${locale}/jobs`} className="text-primary hover:underline flex items-center gap-1">
            <Icons.ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            {isRTL ? 'العودة للوظائف' : 'Retour aux offres'}
          </Link>
        </div>

        <div className="bg-white rounded-xl p-6 max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            {isRTL ? 'إضافة وظيفة جديدة' : 'Publier une nouvelle offre'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border-b pb-4">
              <h2 className="font-semibold text-gray-800 mb-4">
                {isRTL ? 'نوع الوظيفة' : 'Type d\'offre'}
              </h2>
              <div className="flex gap-4">
                <label className={`flex-1 cursor-pointer`}>
                  <input
                    type="radio"
                    name="jobType"
                    value="offer"
                    checked={formData.jobType === 'offer'}
                    onChange={(e) => handleChange('jobType', e.target.value)}
                    className="peer sr-only"
                  />
                  <div className={`p-4 rounded-xl border-2 text-center transition-all peer-checked:border-primary peer-checked:bg-primary/5 ${
                    formData.jobType === 'offer' ? 'border-primary bg-primary/5' : 'border-gray-200'
                  }`}>
                    <p className="font-medium">{isRTL ? 'عرض عمل' : 'Offre d\'emploi'}</p>
                    <p className="text-sm text-gray-500">{isRTL ? 'أبحث عن موظفين' : 'Je cherche des employés'}</p>
                  </div>
                </label>
                <label className={`flex-1 cursor-pointer`}>
                  <input
                    type="radio"
                    name="jobType"
                    value="request"
                    checked={formData.jobType === 'request'}
                    onChange={(e) => handleChange('jobType', e.target.value)}
                    className="peer sr-only"
                  />
                  <div className={`p-4 rounded-xl border-2 text-center transition-all ${
                    formData.jobType === 'request' ? 'border-accent bg-accent/5' : 'border-gray-200'
                  }`}>
                    <p className="font-medium">{isRTL ? 'طلب عمل' : 'Demande d\'emploi'}</p>
                    <p className="text-sm text-gray-500">{isRTL ? 'أبحث عن عمل' : 'Je cherche un emploi'}</p>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isRTL ? 'العنوان *' : 'Titre *'}
              </label>
              <input
                type="text"
                value={formData.titleAr}
                onChange={(e) => handleChange('titleAr', e.target.value)}
                placeholder={isRTL ? 'مثال: فلاح متمرس للقيام...' : 'Exemple: Agriculteur expérimenté pour...'}
                className={`w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                  errors.titleAr ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {errors.titleAr && <p className="text-red-500 text-sm mt-1">{errors.titleAr}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isRTL ? 'الوصف *' : 'Description *'}
              </label>
              <textarea
                value={formData.descriptionAr}
                onChange={(e) => handleChange('descriptionAr', e.target.value)}
                placeholder={isRTL ? 'صف الوظيفة بالتفصيل...' : 'Décrivez le poste en détail...'}
                rows={4}
                className={`w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none ${
                  errors.descriptionAr ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {errors.descriptionAr && <p className="text-red-500 text-sm mt-1">{errors.descriptionAr}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isRTL ? 'الفئة' : 'Catégorie'}
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                {JOB_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {isRTL ? cat.labelAr : cat.labelFr}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isRTL ? 'الموقع *' : 'Localisation *'}
                </label>
                <input
                  type="text"
                  value={formData.locationAr}
                  onChange={(e) => handleChange('locationAr', e.target.value)}
                  placeholder={isRTL ? 'المدينة أو المنطقة' : 'Ville ou région'}
                  className={`w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                    errors.locationAr ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {errors.locationAr && <p className="text-red-500 text-sm mt-1">{errors.locationAr}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isRTL ? 'الراتب (اختياري)' : 'Salaire (optionnel)'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={formData.salary}
                    onChange={(e) => handleChange('salary', e.target.value)}
                    placeholder="0"
                    className="flex-1 rounded-lg border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <select
                    value={formData.salaryType}
                    onChange={(e) => handleChange('salaryType', e.target.value)}
                    className="rounded-lg border border-gray-200 px-3 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="monthly">{isRTL ? '/شهر' : '/mois'}</option>
                    <option value="daily">{isRTL ? '/يوم' : '/jour'}</option>
                    <option value="seasonal">{isRTL ? '/موسم' : '/saison'}</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors"
              >
                {isRTL ? 'نشر الوظيفة' : 'Publier l\'offre'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
