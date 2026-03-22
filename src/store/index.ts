import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Locale, User, Listing, Message, Notification, Conversation, ChatMessage } from '@/types';
import { sampleListings } from '@/data/listings';

interface AppState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  updateUserProfile: (profile: Partial<User>) => void;
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
  
  messages: Message[];
  addMessage: (message: Omit<Message, 'id' | 'createdAt'>) => void;
  markMessageAsRead: (messageId: string) => void;
  getUnreadMessagesCount: () => number;
  
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;
  getUnreadNotificationsCount: () => number;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      locale: 'ar',
      setLocale: (locale) => set({ locale }),
      user: { id: 'user_demo', name: 'مستخدم تجريبي', email: 'user@fellahsouq.ma', phone: '+212 6XX XXX XXX', role: 'seller' as const, verified: true, createdAt: new Date().toISOString() },
      setUser: (user) => set({ user }),
      updateUserProfile: (profile) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...profile } : null,
        }));
      },
      isMenuOpen: false,
      setMenuOpen: (open) => set({ isMenuOpen: open }),
      
      listings: sampleListings.map(l => ({ ...l, status: 'active' as const, views: Math.floor(Math.random() * 500), favorites: Math.floor(Math.random() * 50) })),
      
      addListing: (listingData) => {
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
      }),
    }
  )
);
