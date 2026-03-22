export interface Category {
  id: string;
  slug: string;
  nameAr: string;
  nameFr: string;
  icon: string;
  descriptionAr: string;
  descriptionFr: string;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  slug: string;
  nameAr: string;
  nameFr: string;
}

export interface Listing {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  price: number;
  categorySlug: string;
  subcategorySlug: string;
  location: string;
  locationAr: string;
  images: string[];
  createdAt: string;
  featured: boolean;
  type: 'sale' | 'rent';
  contactName: string;
  contactPhone: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'buyer' | 'seller' | 'investor' | 'worker' | 'admin';
  verified: boolean;
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  listingId: string;
  content: string;
  createdAt: string;
  read: boolean;
}

export type Locale = 'ar' | 'fr';
