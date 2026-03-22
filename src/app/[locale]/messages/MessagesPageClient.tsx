'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAppStore } from '@/store';
import { Icons } from '@/components/ui/Icons';
import { Conversation, ChatMessage } from '@/types';

interface MessagesPageProps {
  locale: string;
}

export default function MessagesPage({ locale }: MessagesPageProps) {
  const isRTL = locale === 'ar';
  const searchParams = useSearchParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messageInput, setMessageInput] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  
  const { 
    conversations, 
    chatMessages, 
    setCurrentConversation, 
    sendMessage, 
    getConversationMessages,
    getOrCreateConversation,
    listings
  } = useAppStore();

  useEffect(() => {
    const conversationId = searchParams.get('conversation');
    if (conversationId) {
      const conv = conversations.find(c => c.id === conversationId);
      if (conv) {
        setSelectedConversation(conv);
        setCurrentConversation(conv.id);
      }
    } else if (conversations.length > 0 && !selectedConversation) {
      setSelectedConversation(conversations[0]);
      setCurrentConversation(conversations[0].id);
    }
  }, [searchParams, conversations, selectedConversation, setCurrentConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, selectedConversation]);

  const messages = selectedConversation 
    ? getConversationMessages(selectedConversation.id)
    : [];

  const handleSendMessage = useCallback(() => {
    if (!messageInput.trim() || !selectedConversation) return;
    
    sendMessage(
      selectedConversation.id,
      'user_demo',
      'مستخدم تجريبي',
      undefined,
      messageInput.trim()
    );
    setMessageInput('');
  }, [messageInput, selectedConversation, sendMessage]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString(isRTL ? 'ar-MA' : 'fr-MA', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return isRTL ? 'اليوم' : "Aujourd'hui";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return isRTL ? 'أمس' : 'Hier';
    } else {
      return date.toLocaleDateString(isRTL ? 'ar-MA' : 'fr-MA', {
        day: 'numeric',
        month: 'short'
      });
    }
  };

  const getOtherParticipant = (conversation: Conversation) => {
    return conversation.participants.find(p => p.id !== 'user_demo');
  };

  const getListingImage = (listingId: string) => {
    const listing = listings.find(l => l.id === listingId);
    return listing?.images?.[0];
  };

  const emptyTranslations = {
    noMessages: isRTL 
      ? 'لا توجد رسائل بعد' 
      : 'Aucune conversation pour le moment',
    noMessagesHint: isRTL 
      ? 'ابدأ محادثة من صفحة إعلان' 
      : 'Commencez une conversation depuis une page d\'annonce',
    typePlaceholder: isRTL 
      ? 'اكتب رسالتك...' 
      : 'Tapez votre message...',
    send: isRTL ? 'إرسال' : 'Envoyer',
    messages: isRTL ? 'الرسائل' : 'Messages',
    aboutListing: isRTL ? 'بخصوص الإعلان' : 'Concernant l\'annonce',
    selectConversation: isRTL 
      ? 'اختر محادثة من القائمة' 
      : 'Sélectionnez une conversation dans la liste',
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container-custom py-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          {emptyTranslations.messages}
        </h1>

        <div className="bg-white rounded-xl overflow-hidden shadow-sm h-[calc(100vh-200px)] min-h-[500px] flex">
          <div className={`w-full md:w-80 border-e ${isRTL ? 'border-l' : 'border-r'} flex flex-col ${selectedConversation ? 'hidden md:flex' : 'flex'}`}>
            <div className="p-4 border-b bg-gray-50">
              <h2 className="font-semibold text-gray-800">
                {isRTL ? 'المحادثات' : 'Conversations'}
              </h2>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <Icons.ChatAlt className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>{emptyTranslations.noMessages}</p>
                  <p className="text-sm mt-1">{emptyTranslations.noMessagesHint}</p>
                </div>
              ) : (
                conversations.map((conversation) => {
                  const otherParticipant = getOtherParticipant(conversation);
                  const isSelected = selectedConversation?.id === conversation.id;
                  
                  return (
                    <button
                      key={conversation.id}
                      onClick={() => {
                        setSelectedConversation(conversation);
                        setCurrentConversation(conversation.id);
                      }}
                      className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors text-start ${
                        isSelected ? 'bg-primary/5 border-b border-gray-100' : ''
                      }`}
                    >
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-bold">
                          {otherParticipant?.name?.charAt(0) || '?'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-gray-800 truncate">
                            {otherParticipant?.name}
                          </span>
                          {conversation.lastMessage && (
                            <span className="text-xs text-gray-400">
                              {formatDate(conversation.lastMessage.createdAt)}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 truncate">
                          {isRTL ? 'بخصوص:' : 'Concernant:'} {isRTL ? conversation.listingTitleAr : conversation.listingTitle}
                        </p>
                        {conversation.lastMessage && (
                          <p className="text-xs text-gray-400 truncate mt-1">
                            {conversation.lastMessage.senderId === 'user_demo' 
                              ? (isRTL ? 'أنت: ' : 'Vous: ') 
                              : ''}{conversation.lastMessage.content}
                          </p>
                        )}
                      </div>
                      {conversation.unreadCount > 0 && (
                        <span className="w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <div className={`flex-1 flex flex-col ${!selectedConversation ? 'hidden md:flex' : 'flex'}`}>
            {selectedConversation ? (
              <>
                <div className="p-4 border-b bg-white flex items-center gap-3">
                  <button 
                    onClick={() => setSelectedConversation(null)}
                    className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <Icons.ArrowRight className={`w-5 h-5 ${isRTL ? '' : 'rotate-180'}`} />
                  </button>
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold">
                      {getOtherParticipant(selectedConversation)?.name?.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">
                      {getOtherParticipant(selectedConversation)?.name}
                    </h3>
                    <Link 
                      href={`/${locale}/listing/${selectedConversation.listingId}`}
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      <Icons.ExternalLink className="w-3 h-3" />
                      {emptyTranslations.aboutListing}: {isRTL ? selectedConversation.listingTitleAr : selectedConversation.listingTitle}
                    </Link>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-500 py-12">
                      <p>{emptyTranslations.noMessages}</p>
                    </div>
                  ) : (
                    messages.map((message, index) => {
                      const isOwn = message.senderId === 'user_demo';
                      const showDate = index === 0 || 
                        new Date(message.createdAt).toDateString() !== 
                        new Date(messages[index - 1].createdAt).toDateString();
                      
                      return (
                        <div key={message.id}>
                          {showDate && (
                            <div className="text-center my-4">
                              <span className="bg-white px-3 py-1 rounded-full text-xs text-gray-500 shadow-sm">
                                {formatDate(message.createdAt)}
                              </span>
                            </div>
                          )}
                          <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[75%] ${isOwn ? 'order-2' : 'order-1'}`}>
                              <div className={`rounded-2xl px-4 py-2 ${
                                isOwn 
                                  ? 'bg-primary text-white rounded-tr-sm' 
                                  : 'bg-white text-gray-800 rounded-tl-sm shadow-sm'
                              }`}>
                                <p className="leading-relaxed">{message.content}</p>
                              </div>
                              <p className={`text-xs text-gray-400 mt-1 ${isOwn ? 'text-end' : 'text-start'}`}>
                                {formatTime(message.createdAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-4 border-t bg-white">
                  <div className="flex items-end gap-2">
                    <textarea
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={emptyTranslations.typePlaceholder}
                      className="flex-1 resize-none rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      rows={1}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim()}
                      className="p-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Icons.PaperAirplane className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500 bg-gray-50">
                <div className="text-center">
                  <Icons.ChatAlt className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>{emptyTranslations.selectConversation}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
