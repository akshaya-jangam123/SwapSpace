import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { messageService } from '../services/messageService';
import { Message, ConversationItem } from '../types';
import { Avatar } from '../components/common/Avatar';
import { Badge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import {
  MessageSquare,
  Send,
  ArrowLeftRight,
  Clock,
  Check,
  CheckCheck,
  Repeat,
  Info,
} from 'lucide-react';

export const Messages: React.FC = () => {
  const { user } = useAuth();
  const { error } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const exchangeIdParam = searchParams.get('exchange') || '';

  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [selectedExchangeId, setSelectedExchangeId] = useState<string>(exchangeIdParam);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [loadingConversations, setLoadingConversations] = useState<boolean>(true);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
  const [sending, setSending] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (exchangeIdParam) {
      setSelectedExchangeId(exchangeIdParam);
    }
  }, [exchangeIdParam]);

  // Load messages when selected exchange changes
  useEffect(() => {
    if (selectedExchangeId) {
      fetchMessages(selectedExchangeId);

      // Simple 3-second database polling for chat updates
      const interval = setInterval(() => {
        fetchMessagesSilently(selectedExchangeId);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [selectedExchangeId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversations = async () => {
    setLoadingConversations(true);
    try {
      const res = await messageService.getConversationsList();
      if (res.success) {
        setConversations(res.conversations);
        if (!selectedExchangeId && res.conversations.length > 0) {
          setSelectedExchangeId(res.conversations[0].exchange._id);
        }
      }
    } catch (err: any) {
      console.error('Failed to load conversations:', err);
    } finally {
      setLoadingConversations(false);
    }
  };

  const fetchMessages = async (exchangeId: string) => {
    setLoadingMessages(true);
    try {
      const res = await messageService.getExchangeMessages(exchangeId);
      if (res.success) {
        setMessages(res.messages);
      }
    } catch (err: any) {
      error(err.message || 'Failed to fetch messages.');
    } finally {
      setLoadingMessages(false);
    }
  };

  const fetchMessagesSilently = async (exchangeId: string) => {
    try {
      const res = await messageService.getExchangeMessages(exchangeId);
      if (res.success) {
        setMessages(res.messages);
      }
    } catch (err) {
      // Background poll silently fails without error toast
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedExchangeId) return;

    const content = newMessage.trim();
    setNewMessage('');
    setSending(true);

    try {
      const res = await messageService.sendMessage(selectedExchangeId, content);
      if (res.success) {
        setMessages(prev => [...prev, res.message]);
        // Update conversation last message in list
        fetchConversations();
      }
    } catch (err: any) {
      error(err.message || 'Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  const activeConversation = conversations.find(c => c.exchange._id === selectedExchangeId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden h-[80vh] flex flex-col md:flex-row">
        {/* Left: Conversations Sidebar */}
        <div className="w-full md:w-80 lg:w-96 border-r border-slate-200/80 flex flex-col bg-slate-50/50">
          <div className="p-4 border-b border-slate-200/80 bg-white">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-600" />
              Conversations
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Chat unlocked for accepted and completed trades
            </p>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {loadingConversations ? (
              <LoadingSpinner size="sm" message="Loading chats..." />
            ) : conversations.length > 0 ? (
              conversations.map(conv => {
                const isSelected = conv.exchange._id === selectedExchangeId;
                const offerTitle =
                  conv.exchange.offeredSkill?.name ||
                  conv.exchange.offeredItem?.name ||
                  conv.exchange.customOfferText;

                return (
                  <button
                    key={conv.exchange._id}
                    type="button"
                    onClick={() => {
                      setSelectedExchangeId(conv.exchange._id);
                      setSearchParams({ exchange: conv.exchange._id });
                    }}
                    className={`w-full p-4 text-left flex items-start gap-3 transition ${
                      isSelected ? 'bg-indigo-50/70 border-l-4 border-indigo-600' : 'hover:bg-slate-100/60'
                    }`}
                  >
                    <Avatar src={conv.otherUser.avatar} name={conv.otherUser.name} size="md" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {conv.otherUser.name}
                        </h4>
                        <Badge
                          variant={conv.exchange.status === 'Completed' ? 'completed' : 'accepted'}
                          size="sm"
                        >
                          {conv.exchange.status}
                        </Badge>
                      </div>

                      <p className="text-[11px] font-medium text-indigo-600 truncate mb-1">
                        Swap: {offerTitle}
                      </p>

                      <p className="text-xs text-slate-500 truncate">
                        {conv.lastMessage ? conv.lastMessage.content : 'No messages yet...'}
                      </p>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="p-8 text-center text-xs text-slate-400 space-y-2">
                <p>No active conversations yet.</p>
                <p className="text-[11px]">Accept an exchange proposal to unlock peer chat.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Message Window */}
        <div className="flex-1 flex flex-col bg-white">
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-200/80 flex items-center justify-between gap-4 bg-slate-50/30">
                <div className="flex items-center gap-3">
                  <Avatar
                    src={activeConversation.otherUser.avatar}
                    name={activeConversation.otherUser.name}
                    size="md"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {activeConversation.otherUser.name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {activeConversation.otherUser.college}
                    </p>
                  </div>
                </div>

                <Link
                  to={`/exchanges/${activeConversation.exchange._id}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 bg-white border border-slate-200 rounded-xl shadow-sm transition"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                  View Exchange
                </Link>
              </div>

              {/* Message List */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/20">
                {/* Intro Exchange Alert in Chat */}
                <div className="max-w-md mx-auto p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-2xl text-center text-xs text-indigo-900 space-y-1">
                  <span className="font-bold block">🤝 Active Peer Swap</span>
                  <p className="text-[11px] text-indigo-700">
                    Coordinate exchange timing, location, or study meeting links here.
                  </p>
                </div>

                {loadingMessages ? (
                  <LoadingSpinner size="sm" message="Loading message history..." />
                ) : (
                  messages.map(msg => {
                    const isMine = msg.sender._id === user?._id || msg.sender._id === user?.id;

                    return (
                      <div
                        key={msg._id}
                        className={`flex items-end gap-2 ${isMine ? 'justify-end' : 'justify-start'}`}
                      >
                        {!isMine && (
                          <Avatar
                            src={msg.sender.avatar}
                            name={msg.sender.name}
                            size="xs"
                            className="mb-1"
                          />
                        )}
                        <div
                          className={`max-w-sm sm:max-w-md px-4 py-2.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                            isMine
                              ? 'bg-indigo-600 text-white rounded-br-none'
                              : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                          }`}
                        >
                          <p>{msg.content}</p>
                          <div
                            className={`flex items-center justify-end gap-1 text-[10px] mt-1 ${
                              isMine ? 'text-indigo-200' : 'text-slate-400'
                            }`}
                          >
                            <span>
                              {new Date(msg.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                            {isMine && (
                              <span>
                                {msg.isRead ? (
                                  <CheckCheck className="w-3 h-3 text-emerald-300" />
                                ) : (
                                  <Check className="w-3 h-3" />
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Form */}
              <form
                onSubmit={handleSendMessage}
                className="p-4 border-t border-slate-200/80 bg-white flex items-center gap-3"
              >
                <input
                  type="text"
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  placeholder="Type your message here..."
                  className="flex-1 px-4 py-3 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || sending}
                  className="inline-flex items-center justify-center p-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition disabled:opacity-40"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8">
              <EmptyState
                icon={<MessageSquare className="w-8 h-8 text-slate-400" />}
                title="Select a Conversation"
                description="Choose an exchange from the left panel to message your peer and coordinate your swap."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
