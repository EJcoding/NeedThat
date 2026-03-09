/**
 * NeedThat App - Zustand State Management
 * Global stores for cart, bookmarks, user interactions, and feed state
 */

import { create } from 'zustand';
import { currentUser as defaultUser } from '../data/mockData';
import {
    BookmarkStore,
    CartStore,
    FeedStore,
    Product,
    UserStore
} from '../types/index';

// ============ CART STORE ============

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addToCart: (productId: string, quantity: number, product: Product) => {
    set((state) => {
      const existingItem = state.items.find((item) => item.productId === productId);

      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.productId === productId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      }

      return {
        items: [...state.items, { productId, quantity, product }],
      };
    });
  },

  removeFromCart: (productId: string) => {
    set((state) => ({
      items: state.items.filter((item) => item.productId !== productId),
    }));
  },

  updateQuantity: (productId: string, quantity: number) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      ),
    }));
  },

  clearCart: () => {
    set({ items: [] });
  },

  getTotalPrice: () => {
    const { items } = get();
    return items.reduce((total, item) => {
      const price = item.product?.price || 0;
      return total + price * item.quantity;
    }, 0);
  },

  getTotalItems: () => {
    const { items } = get();
    return items.reduce((total, item) => total + item.quantity, 0);
  },
}));

// ============ BOOKMARK STORE ============

export const useBookmarkStore = create<BookmarkStore>((set, get) => ({
  bookmarkedPostIds: new Set<string>(),

  toggleBookmark: (postId: string) => {
    set((state) => {
      const newSet = new Set(state.bookmarkedPostIds);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return { bookmarkedPostIds: newSet };
    });
  },

  isBookmarked: (postId: string) => {
    const { bookmarkedPostIds } = get();
    return bookmarkedPostIds.has(postId);
  },

  getBookmarkedPosts: () => {
    const { bookmarkedPostIds } = get();
    return Array.from(bookmarkedPostIds);
  },
}));

// ============ USER STORE ============

export const useUserStore = create<UserStore>((set, get) => ({
  currentUser: {
    ...defaultUser,
    bookmarkedPostIds: [],
    likedPostIds: [],
  },

  likedPostIds: new Set<string>(),

  toggleLike: (postId: string) => {
    set((state) => {
      const newSet = new Set(state.likedPostIds);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return { likedPostIds: newSet };
    });
  },

  isLiked: (postId: string) => {
    const { likedPostIds } = get();
    return likedPostIds.has(postId);
  },

  setCurrentUser: (user) => {
    set({ currentUser: user });
  },
}));

// ============ FEED STORE ============

export const useFeedStore = create<FeedStore>((set) => ({
  currentPostIndex: 0,
  isLoadingMore: false,

  setCurrentPostIndex: (index: number) => {
    set({ currentPostIndex: index });
  },

  setIsLoadingMore: (loading: boolean) => {
    set({ isLoadingMore: loading });
  },
}));

// ============ UTILITY HOOKS ============

/**
 * Hook to get cart total for UI display
 */
export const useCartTotal = () => {
  const items = useCartStore((state) => state.items);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  // Call the method outside the selector
  const totalPrice = getTotalPrice();

  return {
    itemCount: items.length,
    totalPrice,
    items,
  };
};

/**
 * Hook to check if post is bookmarked
 */
export const useIsPostBookmarked = (postId: string) => {
  const bookmarkedPostIds = useBookmarkStore((state) => state.bookmarkedPostIds);
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);
  // Compute isBookmarked outside the selector
  const isBookmarked = bookmarkedPostIds.has(postId);

  return {
    isBookmarked,
    toggleBookmark: () => toggleBookmark(postId),
  };
};

/**
 * Hook to check if post is liked by user
 */
export const useIsPostLiked = (postId: string) => {
  const likedPostIds = useUserStore((state) => state.likedPostIds);
  const toggleLike = useUserStore((state) => state.toggleLike);
  // Compute isLiked outside the selector
  const isLiked = likedPostIds.has(postId);

  return {
    isLiked,
    toggleLike: () => toggleLike(postId),
  };
};
