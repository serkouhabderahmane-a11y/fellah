import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Locale, User, Listing, Message, Notification, Conversation, ChatMessage, Review, Bid, Job, PLAN_LIMITS } from '@/types';
import { sampleListings } from '@/data/listings';

interface AppState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  updateUserProfile: (profile: Partial<User>) => void;
  updateUserPlan: (plan: 'free' | 'pro' | 'enterprise') => void;
  canCreateListing: () => { allowed: boolean; remaining: number; limit: number };
  getUserListingCount: () => number;
  isMenuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  
  listings: Listing[];
  addListing: (listing: Omit<Listing, 'id' | 'createdAt'>) => Listing;
  updateListing: (id: string, listing: Partial<Listing>) => void;
  deleteListing: (id: string) => void;
  getListingById: (id: string) => Listing | undefined;
  getUserListings: (userId?: string) => Listing[];
  
  favorites: string[];
  addToFavorites: (listingId: string) => void;
  removeFromFavorites: (listingId: string) => void;
  toggleFavorite: (listingId: string) => void;
  isFavorite: (listingId: string) => boolean;
  getFavoriteListings: () => Listing[];
  
  conversations: Conversation[];
  chatMessages: ChatMessage[];
  currentConversationId: string | null;
  
  createConversation: (data: { listingId: string; listingTitle: string; listingTitleAr: string; participantId: string; participantName: string; participantAvatar?: string }) => Conversation;
  getOrCreateConversation: (listingId: string, participantId: string) => Conversation | undefined;
  setCurrentConversation: (conversationId: string | null) => void;
  sendMessage: (conversationId: string, senderId: string, senderName: string, senderAvatar?: string, content?: string) => void;
  markConversationAsRead: (conversationId: string) => void;
  getConversationMessages: (conversationId: string) => ChatMessage[];
  getConversationById: (conversationId: string) => Conversation | undefined;
  getTotalUnreadCount: () => number;
  
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => void;
  getSellerReviews: (sellerId: string) => Review[];
  getSellerRating: (sellerId: string) => { average: number; count: number };
  hasReviewed: (sellerId: string, reviewerId: string) => boolean;
  
  bids: Bid[];
  placeBid: (listingId: string, amount: number) => boolean;
  getListingBids: (listingId: string) => Bid[];
  getAuctionListings: () => Listing[];
  getHighestBid: (listingId: string) => number;
  isAuctionEnded: (listingId: string) => boolean;
  
  getInvestmentListings: () => Listing[];
  
  jobs: Job[];
  addJob: (job: Omit<Job, 'id' | 'createdAt' | 'views'>) => Job;
  getJobs: () => Job[];
  getJobById: (id: string) => Job | undefined;
  getJobsByType: (type: 'offer' | 'request') => Job[];
  updateJob: (id: string, job: Partial<Job>) => void;
  deleteJob: (id: string) => void;
  
  messages: Message[];
  addMessage: (message: Omit<Message, 'id' | 'createdAt'>) => void;
  markMessageAsRead: (messageId: string) => void;
  getUnreadMessagesCount: () => number;
  
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;
  getUnreadNotificationsCount: () => number;
  
  adminListings: Listing[];
  adminUsers: User[];
  adminApproveListing: (id: string) => void;
  adminRejectListing: (id: string, reason: string) => void;
  adminToggleFeatured: (id: string) => void;
  adminDeleteListing: (id: string) => void;
  adminUpdateListing: (id: string, data: Partial<Listing>) => void;
  adminCreateListing: (listing: Omit<Listing, 'id' | 'createdAt'>) => Listing;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      locale: 'ar',
      setLocale: (locale) => set({ locale }),
      user: { id: 'user_demo', name: 'مستخدم تجريبي', email: 'user@fellahsouq.ma', phone: '+212 6XX XXX XXX', role: 'admin' as const, verified: true, createdAt: new Date().toISOString(), plan: 'enterprise' as const },
      setUser: (user) => set({ user }),
      updateUserProfile: (profile) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...profile } : null,
        }));
      },
      updateUserPlan: (plan) => {
        set((state) => ({
          user: state.user ? { ...state.user, plan } : null,
        }));
      },
      canCreateListing: () => {
        const user = get().user;
        if (!user) return { allowed: false, remaining: 0, limit: 0 };
        const limit = PLAN_LIMITS[user.plan];
        const count = get().getUserListingCount();
        const remaining = Math.max(0, limit - count);
        return { allowed: count < limit, remaining, limit };
      },
      getUserListingCount: () => {
        const user = get().user;
        if (!user) return 0;
        return get().listings.filter(l => l.contactPhone === user.phone).length;
      },
      isMenuOpen: false,
      setMenuOpen: (open) => set({ isMenuOpen: open }),
      
      listings: sampleListings.map(l => ({ ...l, status: 'active' as const, views: Math.floor(Math.random() * 500), favorites: Math.floor(Math.random() * 50) })),
      
      addListing: (listingData) => {
        const { allowed } = get().canCreateListing();
        if (!allowed) {
          throw new Error('LISTING_LIMIT_REACHED');
        }
        const newListing: Listing = {
          ...listingData,
          id: `listing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString().split('T')[0],
          status: 'active',
          views: 0,
          favorites: 0,
        };
        set((state) => ({
          listings: [newListing, ...state.listings],
        }));
        return newListing;
      },
      
      updateListing: (id, listingData) => {
        set((state) => ({
          listings: state.listings.map((listing) =>
            listing.id === id
              ? { ...listing, ...listingData }
              : listing
          ),
        }));
      },
      
      deleteListing: (id) => {
        set((state) => ({
          listings: state.listings.filter((listing) => listing.id !== id),
          favorites: state.favorites.filter(fid => fid !== id),
        }));
      },
      
      getListingById: (id) => {
        return get().listings.find((listing) => listing.id === id);
      },
      
      getUserListings: (userId?: string) => {
        if (!userId) return get().listings;
        return get().listings.filter((listing) => listing.contactPhone.includes(userId));
      },
      
      favorites: [],
      
      addToFavorites: (listingId) => {
        set((state) => ({
          favorites: state.favorites.includes(listingId)
            ? state.favorites
            : [...state.favorites, listingId],
        }));
        get().updateListing(listingId, { favorites: (get().getListingById(listingId)?.favorites || 0) + 1 });
      },
      
      removeFromFavorites: (listingId) => {
        set((state) => ({
          favorites: state.favorites.filter(id => id !== listingId),
        }));
        const listing = get().getListingById(listingId);
        if (listing && listing.favorites > 0) {
          get().updateListing(listingId, { favorites: listing.favorites - 1 });
        }
      },
      
      toggleFavorite: (listingId) => {
        if (get().favorites.includes(listingId)) {
          get().removeFromFavorites(listingId);
        } else {
          get().addToFavorites(listingId);
        }
      },
      
      isFavorite: (listingId) => {
        return get().favorites.includes(listingId);
      },
      
      getFavoriteListings: () => {
        const { favorites, listings } = get();
        return listings.filter(listing => favorites.includes(listing.id));
      },
      
      conversations: [],
      chatMessages: [],
      currentConversationId: null,
      
      createConversation: (data) => {
        const existing = get().conversations.find(
          c => c.listingId === data.listingId && c.participants.some(p => p.id === data.participantId)
        );
        if (existing) return existing;
        
        const newConversation: Conversation = {
          id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          listingId: data.listingId,
          listingTitle: data.listingTitle,
          listingTitleAr: data.listingTitleAr,
          participants: [
            { id: 'user_demo', name: 'مستخدم تجريبي' },
            { id: data.participantId, name: data.participantName, avatar: data.participantAvatar },
          ],
          unreadCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          conversations: [newConversation, ...state.conversations],
        }));
        return newConversation;
      },
      
      getOrCreateConversation: (listingId, participantId) => {
        const { conversations, createConversation, listings } = get();
        const existing = conversations.find(
          c => c.listingId === listingId && c.participants.some(p => p.id === participantId)
        );
        if (existing) return existing;
        
        const listing = listings.find(l => l.id === listingId);
        if (!listing) return undefined;
        
        return createConversation({
          listingId,
          listingTitle: listing.title,
          listingTitleAr: listing.titleAr,
          participantId,
          participantName: listing.contactName,
        });
      },
      
      setCurrentConversation: (conversationId) => {
        set({ currentConversationId: conversationId });
        if (conversationId) {
          get().markConversationAsRead(conversationId);
        }
      },
      
      sendMessage: (conversationId, senderId, senderName, senderAvatar, content) => {
        const defaultMessage = senderId === 'user_demo' 
          ? 'مرحباً، أنا مهتم بهذا الإعلان. هل لا يزال متوفراً؟' 
          : 'Bonjour, je suis intéressé par cette annonce. Est-elle toujours disponible?';
        
        const newMessage: ChatMessage = {
          id: `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          conversationId,
          senderId,
          senderName,
          senderAvatar,
          content: content || defaultMessage,
          createdAt: new Date().toISOString(),
          read: false,
        };
        
        set((state) => ({
          chatMessages: [...state.chatMessages, newMessage],
          conversations: state.conversations.map(conv =>
            conv.id === conversationId
              ? {
                  ...conv,
                  lastMessage: { content: newMessage.content, createdAt: newMessage.createdAt, senderId },
                  updatedAt: new Date().toISOString(),
                  unreadCount: conv.id === state.currentConversationId ? 0 : conv.unreadCount + 1,
                }
              : conv
          ),
        }));
      },
      
      markConversationAsRead: (conversationId) => {
        set((state) => ({
          conversations: state.conversations.map(conv =>
            conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
          ),
          chatMessages: state.chatMessages.map(msg =>
            msg.conversationId === conversationId ? { ...msg, read: true } : msg
          ),
        }));
      },
      
      getConversationMessages: (conversationId) => {
        return get().chatMessages.filter(msg => msg.conversationId === conversationId);
      },
      
      getConversationById: (conversationId) => {
        return get().conversations.find(c => c.id === conversationId);
      },
      
      getTotalUnreadCount: () => {
        return get().conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
      },
      
      reviews: [],
      
      addReview: (reviewData) => {
        const newReview: Review = {
          ...reviewData,
          id: `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          reviews: [newReview, ...state.reviews],
        }));
      },
      
      getSellerReviews: (sellerId) => {
        return get().reviews.filter(r => r.sellerId === sellerId);
      },
      
      getSellerRating: (sellerId) => {
        const sellerReviews = get().reviews.filter(r => r.sellerId === sellerId);
        if (sellerReviews.length === 0) return { average: 0, count: 0 };
        const sum = sellerReviews.reduce((acc, r) => acc + r.rating, 0);
        return {
          average: Math.round((sum / sellerReviews.length) * 10) / 10,
          count: sellerReviews.length,
        };
      },
      
      hasReviewed: (sellerId, reviewerId) => {
        return get().reviews.some(r => r.sellerId === sellerId && r.reviewerId === reviewerId);
      },
      
      bids: [],
      
      placeBid: (listingId, amount) => {
        const listing = get().getListingById(listingId);
        if (!listing?.isAuction) return false;
        
        const endTime = new Date(listing.auctionEndTime || '');
        if (endTime <= new Date()) return false;
        
        const currentHighest = listing.currentBid || listing.startingPrice || listing.price;
        if (amount <= currentHighest) return false;
        
        const newBid: Bid = {
          id: `bid_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          listingId,
          bidderId: get().user?.id || 'anonymous',
          bidderName: get().user?.name || 'مزايد مجهول',
          amount,
          createdAt: new Date().toISOString(),
        };
        
        set((state) => ({
          bids: [newBid, ...state.bids],
          listings: state.listings.map(l =>
            l.id === listingId
              ? { ...l, currentBid: amount, bidCount: (l.bidCount || 0) + 1 }
              : l
          ),
        }));
        
        return true;
      },
      
      getListingBids: (listingId) => {
        return get().bids.filter(b => b.listingId === listingId).sort((a, b) => b.amount - a.amount);
      },
      
      getAuctionListings: () => {
        return get().listings.filter(l => l.isAuction && l.status === 'active');
      },
      
      getHighestBid: (listingId) => {
        const listing = get().getListingById(listingId);
        return listing?.currentBid || listing?.startingPrice || listing?.price || 0;
      },
      
      isAuctionEnded: (listingId) => {
        const listing = get().getListingById(listingId);
        if (!listing?.auctionEndTime) return true;
        return new Date(listing.auctionEndTime) <= new Date();
      },
      
      getInvestmentListings: () => {
        return get().listings.filter(l => 
          l.categorySlug === 'agricultural-investment' && 
          l.status === 'active' &&
          l.requiredInvestment
        );
      },
      
      jobs: [
        {
          id: 'job-1',
          title: 'Experienced Farm Manager Needed',
          titleAr: 'مطلوب مدير مزرعة متمرس',
          description: 'Looking for an experienced farm manager to oversee citrus farm operations.',
          descriptionAr: 'نبحث عن مدير مزرعة متمرس لإدارة عمليات بستان الحمضيات.',
          location: 'Agadir',
          locationAr: 'أكادير',
          salary: 15000,
          salaryType: 'monthly',
          jobType: 'offer',
          category: 'management',
          status: 'active',
          contactName: 'رشيد العمراني',
          contactPhone: '+212 665 567 890',
          createdAt: '2026-03-20',
          views: 45,
        },
        {
          id: 'job-2',
          title: 'Seeking Agricultural Work',
          titleAr: 'أبحث عن عمل فلاحي',
          description: 'Experienced farmer looking for seasonal or permanent agricultural work.',
          descriptionAr: 'فلاح متمرس يبحث عن عمل فلاحي موسمي أو دائم.',
          location: 'Meknes',
          locationAr: 'مكناس',
          salary: 300,
          salaryType: 'daily',
          jobType: 'request',
          category: 'farming',
          status: 'active',
          contactName: 'مصطفى الريسوني',
          contactPhone: '+212 666 678 901',
          createdAt: '2026-03-19',
          views: 23,
        },
        {
          id: 'job-3',
          title: 'Tractor Operator Required',
          titleAr: 'مطلوب سائق جرار',
          description: 'Need experienced tractor operator for plowing and harvesting season.',
          descriptionAr: 'نحتاج سائق جرار متمرس لموسم الحراثة والحصاد.',
          location: 'Settat',
          locationAr: 'سطات',
          salary: 400,
          salaryType: 'daily',
          jobType: 'offer',
          category: 'equipment',
          status: 'active',
          contactName: 'كريم الحداد',
          contactPhone: '+212 669 901 234',
          createdAt: '2026-03-18',
          views: 67,
        },
        {
          id: 'job-4',
          title: 'Livestock Specialist Position',
          titleAr: 'وظيفة أخصائي تربية الماشية',
          description: 'Dairy farm seeking qualified livestock specialist for herd management.',
          descriptionAr: 'مزرعة ألبان تبحث عن أخصائي مؤهل لتربية قطعان.',
          location: 'Beni Mellal',
          locationAr: 'بني ملال',
          salary: 12000,
          salaryType: 'monthly',
          jobType: 'offer',
          category: 'livestock',
          status: 'active',
          contactName: 'سعيد البحري',
          contactPhone: '+212 664 456 789',
          createdAt: '2026-03-17',
          views: 34,
        },
        {
          id: 'job-5',
          title: 'Olive Harvest Workers Needed',
          titleAr: 'مطلوب عمال لحصاد الزيتون',
          description: 'Olive farm needs 20 workers for upcoming harvest season.',
          descriptionAr: 'مزرعة زيتون تحتاج 20 عاملاً لموسم الحصاد القادم.',
          location: 'Taza',
          locationAr: 'تازة',
          salary: 350,
          salaryType: 'daily',
          jobType: 'offer',
          category: 'farming',
          status: 'active',
          contactName: 'كريم الغزال',
          contactPhone: '+212 663 345 678',
          createdAt: '2026-03-16',
          views: 89,
        },
        {
          id: 'job-6',
          title: 'Looking for Farm Management Role',
          titleAr: 'أبحث عن وظيفة إدارة مزرعة',
          description: 'Agricultural engineer with 5 years experience seeking management position.',
          descriptionAr: 'مهندس زراعي بخبرة 5 سنوات يبحث عن وظيفة إدارة.',
          location: 'Marrakech',
          locationAr: 'مراكش',
          salary: 18000,
          salaryType: 'monthly',
          jobType: 'request',
          category: 'management',
          status: 'active',
          contactName: 'دكتور عمراني',
          contactPhone: '+212 674 456 789',
          createdAt: '2026-03-15',
          views: 56,
        },
        {
          id: 'job-7',
          title: 'Food Processing Technician',
          titleAr: 'تقني في معالجة الأغذية',
          description: 'Modern dairy processing facility needs qualified technician.',
          descriptionAr: 'منشأة حديثة لمعالجة الألبان تحتاج تقني مؤهل.',
          location: 'Casablanca',
          locationAr: 'الدار البيضاء',
          salary: 10000,
          salaryType: 'monthly',
          jobType: 'offer',
          category: 'processing',
          status: 'active',
          contactName: 'سعيد المالكي',
          contactPhone: '+212 673 345 678',
          createdAt: '2026-03-14',
          views: 41,
        },
        {
          id: 'job-8',
          title: 'Experienced Shepherd Available',
          titleAr: 'راعي ماشية متاح',
          description: 'Experienced shepherd with 15 years in livestock care available for hire.',
          descriptionAr: 'راعي متمرس بخبرة 15 سنة في رعاية الماشية متاح للتعاقد.',
          location: 'Errachidia',
          locationAr: 'الرشيدية',
          salary: 8000,
          salaryType: 'monthly',
          jobType: 'request',
          category: 'livestock',
          status: 'active',
          contactName: 'عبدو الخالدي',
          contactPhone: '+212 671 123 456',
          createdAt: '2026-03-13',
          views: 28,
        },
      ],
      
      addJob: (jobData) => {
        const newJob: Job = {
          ...jobData,
          id: `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString().split('T')[0],
          views: 0,
        };
        set((state) => ({
          jobs: [newJob, ...state.jobs],
        }));
        return newJob;
      },
      
      getJobs: () => {
        return get().jobs.filter(j => j.status === 'active');
      },
      
      getJobById: (id) => {
        return get().jobs.find(j => j.id === id);
      },
      
      getJobsByType: (type) => {
        return get().jobs.filter(j => j.jobType === type && j.status === 'active');
      },
      
      updateJob: (id, jobData) => {
        set((state) => ({
          jobs: state.jobs.map(j => j.id === id ? { ...j, ...jobData } : j),
        }));
      },
      
      deleteJob: (id) => {
        set((state) => ({
          jobs: state.jobs.filter(j => j.id !== id),
        }));
      },
      
      messages: [],
      
      addMessage: (messageData) => {
        const newMessage: Message = {
          ...messageData,
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
          read: false,
        };
        set((state) => ({
          messages: [newMessage, ...state.messages],
        }));
      },
      
      markMessageAsRead: (messageId) => {
        set((state) => ({
          messages: state.messages.map(msg =>
            msg.id === messageId ? { ...msg, read: true } : msg
          ),
        }));
      },
      
      getUnreadMessagesCount: () => {
        return get().messages.filter(msg => !msg.read).length;
      },
      
      notifications: [],
      
      addNotification: (notificationData) => {
        const newNotification: Notification = {
          ...notificationData,
          id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
          read: false,
        };
        set((state) => ({
          notifications: [newNotification, ...state.notifications],
        }));
      },
      
      markNotificationAsRead: (notificationId) => {
        set((state) => ({
          notifications: state.notifications.map(notif =>
            notif.id === notificationId ? { ...notif, read: true } : notif
          ),
        }));
      },
      
      markAllNotificationsAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map(notif => ({ ...notif, read: true })),
        }));
      },
      
      getUnreadNotificationsCount: () => {
        return get().notifications.filter(notif => !notif.read).length;
      },
      
      adminListings: [],
      
      adminUsers: [
        { id: 'user_demo', name: 'مستخدم تجريبي', email: 'user@fellahsouq.ma', phone: '+212 6XX XXX XXX', role: 'admin', verified: true, createdAt: new Date().toISOString(), plan: 'enterprise' },
        { id: 'admin_demo', name: 'المدير', email: 'admin@fellahsouq.ma', phone: '+212 6XX XXX XXX', role: 'admin', verified: true, createdAt: new Date().toISOString(), plan: 'enterprise' },
        { id: 'user_2', name: 'أحمد محمد', email: 'ahmed@fellahsouq.ma', phone: '+212 661 123 456', role: 'seller', verified: true, createdAt: new Date().toISOString(), plan: 'pro' },
        { id: 'user_3', name: 'علي يوسف', email: 'ali@fellahsouq.ma', phone: '+212 662 234 567', role: 'buyer', verified: false, createdAt: new Date().toISOString(), plan: 'free' },
        { id: 'user_4', name: 'سعيد البحري', email: 'said@fellahsouq.ma', phone: '+212 664 456 789', role: 'seller', verified: true, createdAt: new Date().toISOString(), plan: 'pro' },
      ],
      
      adminApproveListing: (id) => {
        set((state) => ({
          listings: state.listings.map(l =>
            l.id === id ? { ...l, status: 'active' } : l
          ),
        }));
      },
      
      adminRejectListing: (id, reason) => {
        set((state) => ({
          listings: state.listings.map(l =>
            l.id === id ? { ...l, status: 'rejected' } : l
          ),
        }));
      },
      
      adminToggleFeatured: (id) => {
        set((state) => ({
          listings: state.listings.map(l =>
            l.id === id ? { ...l, featured: !l.featured } : l
          ),
        }));
      },
      
      adminDeleteListing: (id) => {
        set((state) => ({
          listings: state.listings.filter(l => l.id !== id),
        }));
      },
      
      adminUpdateListing: (id, data) => {
        set((state) => ({
          listings: state.listings.map(l =>
            l.id === id ? { ...l, ...data } : l
          ),
        }));
      },
      
      adminCreateListing: (listingData) => {
        const newListing: Listing = {
          ...listingData,
          id: `listing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString().split('T')[0],
          views: 0,
          favorites: 0,
        };
        set((state) => ({
          listings: [newListing, ...state.listings],
        }));
        return newListing;
      },
    }),
    {
      name: 'fellahsouq-storage',
      partialize: (state) => ({
        listings: state.listings,
        locale: state.locale,
        user: state.user,
        favorites: state.favorites,
        conversations: state.conversations,
        chatMessages: state.chatMessages,
        messages: state.messages,
        notifications: state.notifications,
        reviews: state.reviews,
        bids: state.bids,
        jobs: state.jobs,
      }),
    }
  )
);
