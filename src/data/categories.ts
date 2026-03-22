import { Category } from '@/types';

export const categories: Category[] = [
  {
    id: '1',
    slug: 'agricultural-lands',
    nameAr: 'الأراضي الزراعية',
    nameFr: 'Terrains agricoles',
    icon: 'MapIcon',
    descriptionAr: 'أراضي ومزارع للبيع أو الإيجار',
    descriptionFr: 'Terrains et fermes à vendre ou à louer',
    subcategories: [
      { id: '1-1', slug: 'land-for-sale', nameAr: 'أرض للبيع', nameFr: 'Terrain à vendre' },
      { id: '1-2', slug: 'land-for-rent', nameAr: 'أرض للإيجار', nameFr: 'Terrain à louer' },
      { id: '1-3', slug: 'farm-for-sale', nameAr: 'مزرعة للبيع', nameFr: 'Ferme à vendre' },
      { id: '1-4', slug: 'farm-for-rent', nameAr: 'مزرعة للإيجار', nameFr: 'Ferme à louer' },
      { id: '1-5', slug: 'partnerships', nameAr: 'شراكات', nameFr: 'Partenariats' },
      { id: '1-6', slug: 'investment-land', nameAr: 'أرض استثمارية', nameFr: 'Terrain d\'investissement' }
    ]
  },
  {
    id: '2',
    slug: 'farm-equipment',
    nameAr: 'المعدات الزراعية',
    nameFr: 'Équipements agricoles',
    icon: 'TruckIcon',
    descriptionAr: 'tractارات، حصادات، ومعدات زراعية',
    descriptionFr: 'Tracteurs, récolteuses et équipements',
    subcategories: [
      { id: '2-1', slug: 'equipment-for-sale', nameAr: 'معدات للبيع', nameFr: 'Équipements à vendre' },
      { id: '2-2', slug: 'equipment-for-rent', nameAr: 'معدات للإيجار', nameFr: 'Équipements à louer' },
      { id: '2-3', slug: 'spare-parts', nameAr: 'قطع غيار', nameFr: 'Pièces de rechange' }
    ]
  },
  {
    id: '3',
    slug: 'farm-supplies',
    nameAr: 'المستلزمات الزراعية',
    nameFr: 'Fournitures agricoles',
    icon: 'BeakerIcon',
    descriptionAr: 'بذور، أسمدة، مبيدات، وأعلاف',
    descriptionFr: 'Semences, engrais, pesticides et aliments',
    subcategories: [
      { id: '3-1', slug: 'seeds', nameAr: 'بذور', nameFr: 'Semences' },
      { id: '3-2', slug: 'fertilizers', nameAr: 'أسمدة', nameFr: 'Engrais' },
      { id: '3-3', slug: 'pesticides', nameAr: 'مبيدات', nameFr: 'Pesticides' },
      { id: '3-4', slug: 'animal-feed', nameAr: 'أعلاف', nameFr: 'Aliments pour bétail' },
      { id: '3-5', slug: 'irrigation-systems', nameAr: 'أنظمة ري', nameFr: 'Systèmes d\'irrigation' }
    ]
  },
  {
    id: '4',
    slug: 'livestock',
    nameAr: 'الماشية',
    nameFr: 'Bétail',
    icon: 'PawPrintIcon',
    descriptionAr: 'ماشية، دواجن، ونحل للبيع',
    descriptionFr: 'Bétail, volailles et ruches à vendre',
    subcategories: [
      { id: '4-1', slug: 'cattle', nameAr: 'أبقار', nameFr: 'Bovins' },
      { id: '4-2', slug: 'sheep', nameAr: 'غنم', nameFr: 'Moutons' },
      { id: '4-3', slug: 'goats', nameAr: 'ماعز', nameFr: 'Chèvres' },
      { id: '4-4', slug: 'poultry', nameAr: 'دواجن', nameFr: 'Volailles' },
      { id: '4-5', slug: 'rabbits', nameAr: 'أرانب', nameFr: 'Lapins' },
      { id: '4-6', slug: 'bee-hives', nameAr: 'خلايا نحل', nameFr: 'Ruches' }
    ]
  },
  {
    id: '5',
    slug: 'agricultural-investment',
    nameAr: 'الاستثمار الزراعي',
    nameFr: 'Investissement agricole',
    icon: 'ChartBarIcon',
    descriptionAr: 'فرص استثمارية وشراكات زراعية',
    descriptionFr: 'Opportunités d\'investissement et partenariats',
    subcategories: [
      { id: '5-1', slug: 'investment-opportunities', nameAr: 'فرص استثمارية', nameFr: 'Opportunités d\'investissement' },
      { id: '5-2', slug: 'partnerships', nameAr: 'شراكات', nameFr: 'Partenariats' },
      { id: '5-3', slug: 'project-funding', nameAr: 'تمويل مشاريع', nameFr: 'Financement de projets' }
    ]
  },
  {
    id: '6',
    slug: 'farm-services',
    nameAr: 'الخدمات الزراعية',
    nameFr: 'Services agricoles',
    icon: 'WrenchScrewdriverIcon',
    descriptionAr: 'خدمات زراعية متنوعة',
    descriptionFr: 'Divers services agricoles',
    subcategories: [
      { id: '6-1', slug: 'plowing', nameAr: 'حراثة', nameFr: 'Labour' },
      { id: '6-2', slug: 'irrigation', nameAr: 'ري', nameFr: 'Irrigation' },
      { id: '6-3', slug: 'spraying', nameAr: 'رش', nameFr: 'Pulvérisation' },
      { id: '6-4', slug: 'harvesting', nameAr: 'حصاد', nameFr: 'Récolte' },
      { id: '6-5', slug: 'repair', nameAr: 'إصلاح', nameFr: 'Réparation' }
    ]
  },
  {
    id: '7',
    slug: 'farm-products',
    nameAr: 'منتجات الفلاح',
    nameFr: 'Produits du fermier',
    icon: 'FruitIcon',
    descriptionAr: 'خضروات، فواكه، زيت زيتون، وعسل',
    descriptionFr: 'Légumes, fruits, huile d\'olive et miel',
    subcategories: [
      { id: '7-1', slug: 'vegetables', nameAr: 'خضروات', nameFr: 'Légumes' },
      { id: '7-2', slug: 'fruits', nameAr: 'فواكه', nameFr: 'Fruits' },
      { id: '7-3', slug: 'grains', nameAr: 'حبوب', nameFr: 'Céréales' },
      { id: '7-4', slug: 'olive-oil', nameAr: 'زيت زيتون', nameFr: 'Huile d\'olive' },
      { id: '7-5', slug: 'honey', nameAr: 'عسل', nameFr: 'Miel' },
      { id: '7-6', slug: 'dates', nameAr: 'تمر', nameFr: 'Dattes' }
    ]
  },
  {
    id: '8',
    slug: 'auctions',
    nameAr: 'المزادات',
    nameFr: 'Enchères',
    icon: 'FireIcon',
    descriptionAr: 'مزادات على معدات وأراضي وماشية',
    descriptionFr: 'Enchères sur équipements, terres et bétail',
    subcategories: [
      { id: '8-1', slug: 'equipment-auctions', nameAr: 'مزادات معدات', nameFr: 'Enchères d\'équipements' },
      { id: '8-2', slug: 'land-auctions', nameAr: 'مزادات أراضٍ', nameFr: 'Enchères de terres' },
      { id: '8-3', slug: 'livestock-auctions', nameAr: 'مزادات ماشية', nameFr: 'Enchères de bétail' }
    ]
  },
  {
    id: '9',
    slug: 'agri-jobs',
    nameAr: 'وظائف زراعية',
    nameFr: 'Emplois agricoles',
    icon: 'BriefcaseIcon',
    descriptionAr: 'وظائف وطلبات عمل في القطاع الزراعي',
    descriptionFr: 'Emplois et demandes d\'emploi dans le secteur agricole',
    subcategories: [
      { id: '9-1', slug: 'job-offers', nameAr: 'عروض عمل', nameFr: 'Offres d\'emploi' },
      { id: '9-2', slug: 'job-requests', nameAr: 'طلبات عمل', nameFr: 'Demandes d\'emploi' }
    ]
  }
];

export const getCategoryBySlug = (slug: string): Category | undefined => {
  return categories.find(cat => cat.slug === slug);
};

export const getSubcategoryBySlug = (categorySlug: string, subcategorySlug: string) => {
  const category = getCategoryBySlug(categorySlug);
  return category?.subcategories.find(sub => sub.slug === subcategorySlug);
};
