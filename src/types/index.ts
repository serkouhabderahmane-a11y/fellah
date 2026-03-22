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
  status: 'active' | 'pending' | 'sold' | 'expired' | 'rejected';
  contactName: string;
  contactPhone: string;
  views: number;
  favorites: number;
  isAuction?: boolean;
  startingPrice?: number;
  currentBid?: number;
  auctionEndTime?: string;
  bidCount?: number;
  requiredInvestment?: number;
  expectedReturn?: number;
  duration?: string;
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
  plan: 'free' | 'pro' | 'enterprise';
}

export const PLAN_LIMITS = {
  free: 3,
  pro: 20,
  enterprise: Infinity,
} as const;

export const PLAN_INFO = {
  free: { nameAr: 'مجاني', nameFr: 'Gratuit', color: 'gray', price: 0 },
  pro: { nameAr: 'احترافي', nameFr: 'Pro', color: 'blue', price: 199 },
  enterprise: { nameAr: 'مؤسسات', nameFr: 'Entreprise', color: 'purple', price: 499 },
} as const;

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

export interface Review {
  id: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar?: string;
  sellerId: string;
  listingId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Bid {
  id: string;
  listingId: string;
  bidderId: string;
  bidderName: string;
  amount: number;
  createdAt: string;
}

export interface Job {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  location: string;
  locationAr: string;
  salary?: number;
  salaryType?: 'monthly' | 'daily' | 'seasonal';
  jobType: 'offer' | 'request';
  category: 'farming' | 'livestock' | 'equipment' | 'management' | 'processing' | 'other';
  status: 'active' | 'filled' | 'expired';
  contactName: string;
  contactPhone: string;
  createdAt: string;
  views: number;
}
