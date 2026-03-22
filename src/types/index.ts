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
  titleFr?: string;
  description: string;
  descriptionAr: string;
  descriptionFr?: string;
  price: number;
  categorySlug: string;
  subcategorySlug: string;
  location: string;
  locationAr: string;
  images: string[];
  createdAt: string;
  featured: boolean;
  type: 'sale' | 'rent';
  status: 'active' | 'pending' | 'sold' | 'expired';
  contactName: string;
  contactPhone: string;
  views: number;
  favorites: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'buyer' | 'seller' | 'investor' | 'worker' | 'admin';
  verified: boolean;
  createdAt: string;
  avatar?: string;
  bio?: string;
  location?: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  createdAt: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  listingId: string;
  listingTitle: string;
  listingTitleAr: string;
  participants: {
    id: string;
    name: string;
    avatar?: string;
  }[];
  lastMessage?: {
    content: string;
    createdAt: string;
    senderId: string;
  };
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  listingId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  createdAt: string;
  read: boolean;
}

export interface Notification {
  id: string;
  type: 'message' | 'favorite' | 'view' | 'system';
  title: string;
  content: string;
  createdAt: string;
  read: boolean;
  link?: string;
}

export type Locale = 'ar' | 'fr';
