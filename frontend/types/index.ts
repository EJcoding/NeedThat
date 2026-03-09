/**
 * NeedThat App - TypeScript Type Definitions
 * Defines all core entities (Products, Brands, Posts, Users, Reviews, Comments)
 */

// ============ PRODUCT & BRAND TYPES ============

export interface Product {
  id: string;
  name: string;
  brandId: string;
  price: number;
  aiRating: number; // 0-5 stars
  videoUrl: string;
  description: string;
  specs?: string[];
  category?: string;
  createdAt: Date;
}

export interface Brand {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  followerCount: number;
  productIds: string[];
  createdAt: Date;
}

// ============ USER & PROFILE TYPES ============

export type ReputationLevel = 'Beginner' | 'Trusted' | 'Expert';

export interface User {
  id: string;
  name: string;
  avatar: string;
  reputationLevel: ReputationLevel;
  reputationScore: number;
  bio?: string;
  createdAt: Date;
}

export interface UserProfile extends User {
  reviewCount: number;
  followerCount: number;
  followingCount: number;
  bookmarkedPostIds: string[];
  likedPostIds: string[];
}

// ============ POST & FEED TYPES ============

export type PostType = 'product' | 'review';

export interface Post {
  id: string;
  posterId: string; // User ID or Brand ID
  posterType: 'user' | 'brand'; // Who posted it
  type: PostType; // 'product' or 'review'
  productId: string;
  videoUrl: string;
  description: string;
  likes: number;
  commentCount: number;
  bookmarkCount: number;
  shareCount: number;
  isLikedByCurrentUser?: boolean;
  isBookmarkedByCurrentUser?: boolean;
  createdAt: Date;
}

// ============ REVIEW TYPES ============

export interface Review {
  id: string;
  postId: string;
  productId: string;
  userId: string;
  rating: number; // 1-5 stars
  pros: string[];
  cons: string[];
  reviewText: string;
  helpful: number;
  unhelpful: number;
  createdAt: Date;
}

// ============ COMMENT TYPES ============

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  likes: number;
  createdAt: Date;
}

// ============ CART TYPES ============

export interface CartItem {
  productId: string;
  quantity: number;
  product?: Product; // Populated when fetching cart
}

export interface Cart {
  items: CartItem[];
  totalPrice: number;
}

// ============ API RESPONSE TYPES ============

export interface FeedResponse {
  posts: Post[];
  nextCursor?: string; // For pagination
  hasMore: boolean;
}

export interface ProductDetailsResponse {
  product: Product;
  brand: Brand;
  reviews: Review[];
  comments: Comment[];
  rating: number; // Average rating
  reviewCount: number;
}

export interface BrandDetailsResponse {
  brand: Brand;
  products: Product[];
  posts: Post[];
}

export interface UserProfileResponse {
  user: UserProfile;
  bookmarkedPosts: Post[];
  reviewPosts: Post[];
}

// ============ STORE STATE TYPES ============

export interface CartStore {
  items: CartItem[];
  addToCart: (productId: string, quantity: number, product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export interface BookmarkStore {
  bookmarkedPostIds: Set<string>;
  toggleBookmark: (postId: string) => void;
  isBookmarked: (postId: string) => boolean;
  getBookmarkedPosts: () => string[];
}

export interface UserStore {
  currentUser: UserProfile | null;
  likedPostIds: Set<string>;
  toggleLike: (postId: string) => void;
  isLiked: (postId: string) => boolean;
  setCurrentUser: (user: UserProfile) => void;
}

export interface FeedStore {
  currentPostIndex: number;
  setCurrentPostIndex: (index: number) => void;
  isLoadingMore: boolean;
  setIsLoadingMore: (loading: boolean) => void;
}
