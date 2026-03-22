'use client';

import { useState, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Listing } from '@/types';
import { categories } from '@/data/categories';
import { useAppStore } from '@/store';

const MOROCCAN_CITIES = [
  { value: 'agadir', labelAr: 'أكادير', labelFr: 'Agadir' },
  { value: 'beni-mellal', labelAr: 'بني ملال', labelFr: 'Beni Mellal' },
  { value: 'casablanca', labelAr: 'الدار البيضاء', labelFr: 'Casablanca' },
  { value: 'el-jadida', labelAr: 'الجديدة', labelFr: 'El Jadida' },
  { value: 'errachidia', labelAr: 'الرشيدية', labelFr: 'Errachidia' },
  { value: 'essaouira', labelAr: 'الصويرة', labelFr: 'Essaouira' },
  { value: 'fes', labelAr: 'فاس', labelFr: 'Fès' },
  { value: 'ifrane', labelAr: 'إيفران', labelFr: 'Ifrane' },
  { value: 'kenitra', labelAr: 'القنيطرة', labelFr: 'Kénitra' },
  { value: 'khemisset', labelAr: 'الخميسات', labelFr: 'Khemisset' },
  { value: 'khouribga', labelAr: 'خريبكة', labelFr: 'Khouribga' },
  { value: 'marrakech', labelAr: 'مراكش', labelFr: 'Marrakech' },
  { value: 'meknes', labelAr: 'مكناس', labelFr: 'Meknès' },
  { value: 'ouarzazate', labelAr: 'ورزازات', labelFr: 'Ouarzazate' },
  { value: 'rabat', labelAr: 'الرباط', labelFr: 'Rabat' },
  { value: 'safi', labelAr: 'آسفي', labelFr: 'Safi' },
  { value: 'settat', labelAr: 'سطات', labelFr: 'Settat' },
  { value: 'soussa', labelAr: 'سوس', labelFr: 'Souss' },
  { value: 'taza', labelAr: 'تازة', labelFr: 'Taza' },
  { value: 'tanger', labelAr: 'طنجة', labelFr: 'Tanger' },
  { value: 'zagora', labelAr: 'زاكورة', labelFr: 'Zagora' },
];

interface FormData {
  titleAr: string;
  titleFr: string;
  descriptionAr: string;
  descriptionFr: string;
  categorySlug: string;
  subcategorySlug: string;
  price: string;
  type: 'sale' | 'rent';
  city: string;
  contactName: string;
  contactPhone: string;
  images: string[];
}

interface FormErrors {
  [key: string]: string | undefined;
}

interface ListingFormProps {
  locale: 'ar' | 'fr';
  initialData?: Listing;
  listingId?: string;
  onSuccess?: () => void;
}

export default function ListingForm({ locale, initialData, listingId, onSuccess }: ListingFormProps) {
  const t = useTranslations('listingForm');
  const tErrors = useTranslations('listingForm.errors');
  const router = useRouter();
  const { addListing, updateListing } = useAppStore();
  const isRTL = locale === 'ar';

  const initialFormData: FormData = useMemo(() => ({
    titleAr: initialData?.titleAr || '',
    titleFr: initialData?.titleFr || '',
    descriptionAr: initialData?.descriptionAr || '',
    descriptionFr: initialData?.descriptionFr || '',
    categorySlug: initialData?.categorySlug || '',
    subcategorySlug: initialData?.subcategorySlug || '',
    price: initialData?.price?.toString() || '',
    type: initialData?.type || 'sale',
    city: initialData?.location || '',
    contactName: initialData?.contactName || '',
    contactPhone: initialData?.contactPhone || '',
    images: initialData?.images || [],
  }), [initialData]);

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const selectedCategory = useMemo(() => 
    categories.find(c => c.slug === formData.categorySlug),
    [formData.categorySlug]
  );

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.titleAr.trim()) {
      newErrors.titleAr = tErrors('titleAr');
    }
    if (!formData.titleFr.trim()) {
      newErrors.titleFr = tErrors('titleFr');
    }
    if (!formData.descriptionAr.trim()) {
      newErrors.descriptionAr = tErrors('descriptionAr');
    }
    if (!formData.descriptionFr.trim()) {
      newErrors.descriptionFr = tErrors('descriptionFr');
    }
    if (!formData.categorySlug) {
      newErrors.categorySlug = tErrors('category');
    }
    if (!formData.subcategorySlug) {
      newErrors.subcategorySlug = tErrors('subcategory');
    }
    if (!formData.price.trim()) {
      newErrors.price = tErrors('price');
    } else if (Number(formData.price) <= 0) {
      newErrors.price = tErrors('pricePositive');
    }
    if (!formData.city) {
      newErrors.city = tErrors('city');
    }
    if (!formData.contactName.trim()) {
      newErrors.contactName = tErrors('contactName');
    }
    if (!formData.contactPhone.trim()) {
      newErrors.contactPhone = tErrors('contactPhone');
    } else if (!/^\+?[0-9\s-]{8,}$/.test(formData.contactPhone)) {
      newErrors.contactPhone = tErrors('invalidPhone');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, tErrors]);

  const handleInputChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  }, [errors]);

  const handleCategoryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ 
      ...prev, 
      categorySlug: value, 
      subcategorySlug: '' 
    }));
    if (errors.categorySlug) {
      setErrors(prev => ({ ...prev, categorySlug: undefined }));
    }
    if (errors.subcategorySlug) {
      setErrors(prev => ({ ...prev, subcategorySlug: undefined }));
    }
  }, [errors]);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: string[] = [];
    for (let i = 0; i < Math.min(files.length, 5); i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          newImages.push(event.target.result as string);
          if (newImages.length === Math.min(files.length, 5)) {
            setFormData(prev => ({ 
              ...prev, 
              images: [...prev.images, ...newImages].slice(0, 5) 
            }));
          }
        }
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const removeImage = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const cityData = MOROCCAN_CITIES.find(c => c.value === formData.city);
      
      const listingData = {
        title: formData.titleFr,
        titleAr: formData.titleAr,
        description: formData.descriptionFr,
        descriptionAr: formData.descriptionAr,
        price: Number(formData.price),
        categorySlug: formData.categorySlug,
        subcategorySlug: formData.subcategorySlug,
        location: cityData?.labelFr || formData.city,
        locationAr: cityData?.labelAr || formData.city,
        images: formData.images.length > 0 ? formData.images : ['/images/placeholder.jpg'],
        featured: false,
        type: formData.type,
        status: 'active' as const,
        views: 0,
        favorites: 0,
        contactName: formData.contactName,
        contactPhone: formData.contactPhone,
      };

      if (listingId) {
        updateListing(listingId, listingData);
        setShowSuccess(true);
        setTimeout(() => {
          router.push(`/${locale}/dashboard`);
          onSuccess?.();
        }, 1500);
      } else {
        addListing(listingData);
        setShowSuccess(true);
        setTimeout(() => {
          router.push(`/${locale}/dashboard`);
          onSuccess?.();
        }, 1500);
      }
    } catch {
      setErrors({ submit: 'common.error' });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, addListing, updateListing, listingId, router, locale, onSuccess]);

  const inputClass = (errorKey?: string) => `
    w-full px-4 py-3 border-2 rounded-xl outline-none transition-all duration-200
    ${errorKey 
      ? 'border-red-400 bg-red-50 focus:border-red-500' 
      : 'border-gray-200 bg-gray-50 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20'
    }
  `;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {showSuccess && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-xl flex items-center gap-3">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>{listingId ? t('updated') : t('success')}</span>
        </div>
      )}

      <section className="bg-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <span className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-bold">
            1
          </span>
          {t('basicInfo')}
        </h2>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('titleArLabel')}
              </label>
              <input
                type="text"
                name="titleAr"
                value={formData.titleAr}
                onChange={handleInputChange}
                placeholder={t('titleArPlaceholder')}
                className={inputClass(errors.titleAr)}
                dir="rtl"
              />
              {errors.titleAr && (
                <p className="mt-1 text-sm text-red-600">{errors.titleAr}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('titleFrLabel')}
              </label>
              <input
                type="text"
                name="titleFr"
                value={formData.titleFr}
                onChange={handleInputChange}
                placeholder={t('titleFrPlaceholder')}
                className={inputClass(errors.titleFr)}
                dir="ltr"
              />
              {errors.titleFr && (
                <p className="mt-1 text-sm text-red-600">{errors.titleFr}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('descriptionArLabel')}
              </label>
              <textarea
                name="descriptionAr"
                value={formData.descriptionAr}
                onChange={handleInputChange}
                placeholder={t('descriptionArPlaceholder')}
                rows={4}
                className={`${inputClass(errors.descriptionAr)} resize-none`}
                dir="rtl"
              />
              {errors.descriptionAr && (
                <p className="mt-1 text-sm text-red-600">{errors.descriptionAr}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('descriptionFrLabel')}
              </label>
              <textarea
                name="descriptionFr"
                value={formData.descriptionFr}
                onChange={handleInputChange}
                placeholder={t('descriptionFrPlaceholder')}
                rows={4}
                className={`${inputClass(errors.descriptionFr)} resize-none`}
                dir="ltr"
              />
              {errors.descriptionFr && (
                <p className="mt-1 text-sm text-red-600">{errors.descriptionFr}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('categoryLabel')}
              </label>
              <select
                name="categorySlug"
                value={formData.categorySlug}
                onChange={handleCategoryChange}
                className={inputClass(errors.categorySlug)}
              >
                <option value="">{t('categoryPlaceholder')}</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.slug}>
                    {isRTL ? cat.nameAr : cat.nameFr}
                  </option>
                ))}
              </select>
              {errors.categorySlug && (
                <p className="mt-1 text-sm text-red-600">{errors.categorySlug}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('subcategoryLabel')}
              </label>
              <select
                name="subcategorySlug"
                value={formData.subcategorySlug}
                onChange={handleInputChange}
                disabled={!selectedCategory}
                className={inputClass(errors.subcategorySlug)}
              >
                <option value="">{t('subcategoryPlaceholder')}</option>
                {selectedCategory?.subcategories.map(sub => (
                  <option key={sub.id} value={sub.slug}>
                    {isRTL ? sub.nameAr : sub.nameFr}
                  </option>
                ))}
              </select>
              {errors.subcategorySlug && (
                <p className="mt-1 text-sm text-red-600">{errors.subcategorySlug}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <span className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-bold">
            2
          </span>
          {t('pricing')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('priceLabel')}
            </label>
            <div className="relative">
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder={t('pricePlaceholder')}
                min="0"
                step="100"
                className={inputClass(errors.price)}
              />
              <span className={`absolute ${isRTL ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 text-gray-400`}>
                MAD
              </span>
            </div>
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('typeLabel')}
            </label>
            <div className="flex gap-4">
              <label className={`
                flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 rounded-xl cursor-pointer transition-all
                ${formData.type === 'sale' 
                  ? 'border-primary bg-primary/5 text-primary' 
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }
              `}>
                <input
                  type="radio"
                  name="type"
                  value="sale"
                  checked={formData.type === 'sale'}
                  onChange={() => setFormData(prev => ({ ...prev, type: 'sale' }))}
                  className="sr-only"
                />
                <span className="font-medium">{t('typeSale')}</span>
              </label>
              <label className={`
                flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 rounded-xl cursor-pointer transition-all
                ${formData.type === 'rent' 
                  ? 'border-primary bg-primary/5 text-primary' 
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }
              `}>
                <input
                  type="radio"
                  name="type"
                  value="rent"
                  checked={formData.type === 'rent'}
                  onChange={() => setFormData(prev => ({ ...prev, type: 'rent' }))}
                  className="sr-only"
                />
                <span className="font-medium">{t('typeRent')}</span>
              </label>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <span className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-bold">
            3
          </span>
          {t('locationSection')}
        </h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('cityLabel')}
          </label>
          <select
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            className={inputClass(errors.city)}
          >
            <option value="">{t('cityPlaceholder')}</option>
            {MOROCCAN_CITIES.map(city => (
              <option key={city.value} value={city.value}>
                {isRTL ? city.labelAr : city.labelFr}
              </option>
            ))}
          </select>
          {errors.city && (
            <p className="mt-1 text-sm text-red-600">{errors.city}</p>
          )}
        </div>
      </section>

      <section className="bg-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <span className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-bold">
            4
          </span>
          {t('contactSection')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('contactNameLabel')}
            </label>
            <input
              type="text"
              name="contactName"
              value={formData.contactName}
              onChange={handleInputChange}
              placeholder={t('contactNamePlaceholder')}
              className={inputClass(errors.contactName)}
            />
            {errors.contactName && (
              <p className="mt-1 text-sm text-red-600">{errors.contactName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('contactPhoneLabel')}
            </label>
            <input
              type="tel"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleInputChange}
              placeholder={t('contactPhonePlaceholder')}
              className={inputClass(errors.contactPhone)}
            />
            {errors.contactPhone && (
              <p className="mt-1 text-sm text-red-600">{errors.contactPhone}</p>
            )}
          </div>
        </div>
      </section>

      <section className="bg-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <span className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-bold">
            5
          </span>
          {t('imagesSection')}
        </h2>

        <div className="space-y-4">
          <div className={`
            border-2 border-dashed border-gray-300 rounded-xl p-8 text-center
            hover:border-primary hover:bg-gray-50 transition-all cursor-pointer
            ${formData.images.length >= 5 ? 'opacity-50 pointer-events-none' : ''}
          `}>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
              disabled={formData.images.length >= 5}
            />
            <label htmlFor="image-upload" className="cursor-pointer">
              <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-600 mb-2">{t('dragDrop')}</p>
              <p className="text-sm text-gray-400">{t('imagesHint')}</p>
            </label>
          </div>

          {formData.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {formData.images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  {index === 0 && (
                    <span className="absolute bottom-1 left-1 px-2 py-0.5 bg-primary text-white text-xs rounded-full">
                      {isRTL ? 'الرئيسية' : 'Principal'}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="flex gap-4 justify-end">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 border-2 border-gray-300 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 transition-all"
        >
          {t('cancel')}
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-3 bg-gradient-to-r from-primary to-primary-light text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </span>
          ) : (
            listingId ? t('update') : t('submit')
          )}
        </button>
      </div>
    </form>
  );
}
