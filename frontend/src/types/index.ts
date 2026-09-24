export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type ItemCategory =
  | 'Books'
  | 'Electronics'
  | 'Study Materials'
  | 'Stationery'
  | 'Sports'
  | 'Accessories'
  | 'Other';

export type ItemCondition = 'New' | 'Like New' | 'Good' | 'Used';

export type ExchangeStatus = 'Pending' | 'Accepted' | 'Rejected' | 'Completed' | 'Cancelled';

export type ExchangeType = 'Skill' | 'Item' | 'Mixed';

export interface User {
  _id: string;
  id?: string;
  name: string;
  email: string;
  college: string;
  location: string;
  bio?: string;
  avatar?: string;
  skillsOffered: string[];
  skillsWanted: string[];
  itemsOffered: string[];
  itemsWanted: string[];
  role: 'user' | 'admin';
  isDisabled?: boolean;
  avgRating: number;
  totalReviews: number;
  createdAt?: string;
}

export interface Skill {
  _id: string;
  owner: User;
  name: string;
  category: string;
  description: string;
  level: SkillLevel;
  availability: string;
  wantInExchange: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Item {
  _id: string;
  owner: User;
  name: string;
  category: ItemCategory;
  description: string;
  condition: ItemCondition;
  imageUrl?: string;
  availability: string;
  wantInExchange: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ExchangeRequest {
  _id: string;
  sender: User;
  receiver: User;
  exchangeType: ExchangeType;
  offeredSkill?: Skill;
  offeredItem?: Item;
  requestedSkill?: Skill;
  requestedItem?: Item;
  customOfferText?: string;
  customRequestText?: string;
  message: string;
  status: ExchangeStatus;
  completedBySender: boolean;
  completedByReceiver: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  sender: User;
  receiver: User;
  exchange: string | ExchangeRequest;
  content: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationItem {
  exchange: ExchangeRequest;
  otherUser: User;
  lastMessage?: Message;
  unreadCount: number;
}

export interface Review {
  _id: string;
  reviewer: User;
  reviewee: User;
  exchange: string | ExchangeRequest;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Report {
  _id: string;
  reporter: User;
  targetType: 'User' | 'Skill' | 'Item' | 'Message';
  targetId: string;
  targetTitle?: string;
  reason: string;
  description: string;
  status: 'Pending' | 'Reviewed' | 'Resolved';
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MatchResult {
  user: User;
  score: number;
  matchType: 'perfect' | 'one-way' | 'partial';
  userAWantsUserBOffers: string[];
  userBWantsUserAOffers: string[];
}

export interface DashboardStats {
  totalListings: number;
  totalSkills: number;
  totalItems: number;
  activeSwaps: number;
  pendingRequests: number;
  pendingSent: number;
  pendingReceived: number;
  completedSwaps: number;
  avgRating: number;
  totalReviews: number;
}

export interface AdminStats {
  totalUsers: number;
  totalSkills: number;
  totalItems: number;
  activeExchanges: number;
  completedExchanges: number;
  pendingReports: number;
  totalReviews: number;
}
