import { Listing } from '@/types';
import { User } from '@/types';

export interface AdminListing extends Listing {
  isApproved: boolean;
  rejectionReason?: string;
}

export interface AdminUser extends User {
  isActive: boolean;
  listingsCount: number;
}

export const LISTING_STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  REJECTED: 'rejected',
  SOLD: 'sold',
  EXPIRED: 'expired',
} as const;

export const POST_TYPES = {
  LISTING: 'listing',
  AUCTION: 'auction',
  INVESTMENT: 'investment',
  JOB: 'job',
} as const;

export type PostType = typeof POST_TYPES[keyof typeof POST_TYPES];
