# NeedThat Social Product Discovery Platform - Implementation Plan

## Requirements Summary
- **Scope**: All 6 screens (Home Feed, Product Page, Review Post Screen, User Profile, Company Profile, Shopping Cart)
- **Timeline**: MVP in weeks
- **Backend**: Frontend focus with mock APIs (backend planned later)
- **Video**: Mock/placeholder videos initially
- **Auth**: Anonymous browsing for MVP
- **Persistence**: Mock data only (session-based)
- **Video Feed**: Full-screen 1:1 posts (TikTok-style)
- **UI Interactions**: Basic buttons (no complex gestures)
- **State Management**: Dedicated library (Zustand recommended)

## Current Codebase Status
- React Native/Expo with TypeScript
- Expo Router for navigation (file-based routing)
- Existing theming system (light/dark mode)
- No state management, no API layer, no backend
- Reusable components: ThemedView, ThemedText, ParallaxScrollView, Collapsible, IconSymbol

## Architecture Overview
1. **Data Layer**: Mock data + Zustand store (global state for cart, bookmarks, current user)
2. **API Layer**: Service interfaces for future backend integration (API contracts ready)
3. **Navigation**: Tab-based home, stacked screens for Product/Profile/Cart, modal for Review composition
4. **Video Feed**: Full-screen vertical scroll with FlatList + Reanimated for smooth transitions
5. **Components**: Hierarchy of reusable UI components (Post, Product Card, UserCard, etc.)

## Implementation Phases

### Phase 1: Foundation & Data Layer (Days 1-2)
Establish mock data, state management, and API contracts.

1.1 **Create Mock Data Structure**
- Create `src/data/mockData.ts` with:
  - Products array (id, name, brand, price, AI rating, video URL, description)
  - Brands array (id, name, description, logo, posts)
  - Posts array (id, posterId, type='product'|'review', video, description, likes, comments, bookmarks)
  - Reviews array (postId, rating, pros, cons, reviewText)
  - Users array (id, name, avatar, reputation, reviews, bookmarks)
  - Comments array (id, postId, userId, text)

1.2 **Set Up Zustand Store**
- Install Zustand: `npm install zustand`
- Create `src/store/index.ts` with:
  - `cartStore`: items[], totalPrice()
  - `bookmarkStore`: savedPostIds[], toggleBookmark()
  - `userStore`: currentUserProfile, likedPostIds[]
  - `feedStore`: currentPost, currentProductPage
- Add TypeScript types file `src/types/index.ts` (Post, Product, Brand, User, Review, Comment)

1.3 **Create API Service Layer (Contracts for Backend)**
- Create `src/services/api.ts` with mock implementations:
  - `getFeedPosts()` → returns paginated posts
  - `getProductDetails(id)` → returns product + reviews
  - `getUserProfile(id)` → returns user data
  - `getBrandProfile(id)` → returns brand + product catalog
  - `addToCart(productId, quantity)` → client-side for now
  - `createPost()` → for review upload flow (WIP)

### Phase 2: Navigation & Screen Scaffolds (Days 2-3)
Set up routing and create empty screen shells with mock content flow.

2.1 **Update Navigation Structure**
- Modify `app/_layout.tsx`: Add ProductDetailsScreen as modal/stack
- Modify `app/(tabs)/_layout.tsx`: Rename/refactor Home → Feed, Explore → Profile/Cart
- Create new nested routes:
  - `app/(tabs)/feed.tsx` → Home Feed
  - `app/(tabs)/profile.tsx` → User Profile
  - `app/(tabs)/cart.tsx` → Shopping Cart
  - `app/product-details.tsx` → Product Page (deep-link route)
  - `app/brand-profile.tsx` → Company Profile (deep-link route)
  - `app/review-post.tsx` → Review Post composition modal

2.2 **Create Screen Shells**
- Move existing home content to Feed screen; replace with feed placeholder
- Create empty skeleton screens for each route (component structure only, no logic)
- Verify navigation flows between tabs and to detail screens

### Phase 3: Home Feed Screen - Core Experience (Days 3-5)
Build the TikTok-style full-screen vertical feed.

3.1 **Create Feed Components**
- `components/FeedPost.tsx`: Single full-screen post component
  - Displays: video thumbnail, product name, brand, price, likes/comments/bookmarks count
  - Layout: video centered, product info overlay at bottom
  - Buttons: Like, Comment, Bookmark, Share
  - Gesture: Vertical scroll to next post (via FlatList scroll)

3.2 **Create Feed Container**
- `components/VideoFeed.tsx`: FlatList-based vertical feed
  - Full-screen height per post
  - Infinite scroll (append mock data as user scrolls)
  - Pull-to-refresh capability
  - Smooth Reanimated transitions between posts

3.3 **Implement Like/Bookmark/Share Actions**
- Hook to Zustand: `useBookmarkStore().toggleBookmark(postId)`
- Like counter (increment in UI, Zustand tracks liked statefor current session)
- Share button (basic share sheet for iOS/Android)
- Comment button (navigate to ProductDetails with comments tab focused)

3.4 **Fill Home Feed Screen**
- `app/(tabs)/feed.tsx` → render VideoFeed with mock data

### Phase 4: Product Details Screen (Days 4-5)
Build detailed product page with reviews and cart integration.

4.1 **Create Product Page Layout**
- `components/ProductHeader.tsx`: Product image/video, name, brand, price, AI rating (stars)
- `components/ProductDescription.tsx`: Full description text, specs
- `components/ProductReviews.tsx`: List of user reviews (rating, pros/cons, reviewer name)
- `components/ProductActions.tsx`: "Add to Cart" button + quantity selector

4.2 **Create Reviews List Component**
- `components/ReviewItem.tsx`: Single review card (avatar, name, rating, pros/cons, timestamp)
- Filter/sort reviews by rating (high to low, low to high)

4.3 **Connect to Navigation**
- Create `app/product-details/[id].tsx` route
- Parse URL param `id`, fetch product from mock data
- Wire up "Add to Cart" to Zustand cartStore
- Back navigation to Feed

### Phase 5: User Profile Screen (Days 5-6)
Build profile with bookmarks and review history.

5.1 **Create Profile Components**
- `components/UserHeader.tsx`: Avatar, name, reputation level (badge), stats (reviews posted, followers)
- `components/BookmarksTab.tsx`: Grid of bookmarked posts (tap to view post/product)
- `components/ReviewsTab.tsx`: List of reviews posted by user
- `components/ReputationBadge.tsx`: Visual badge (Beginner/Trusted/Expert)

5.2 **Fill Profile Screen**
- `app/(tabs)/profile.tsx`: Tab layout for Bookmarks / Reviews sections
- Mock user data hardcoded to "current user"
- Tap on bookmarked post → navigate to ProductDetails
- Tap on review → open ProductDetails page where review is visible

### Phase 6: Company Profile Screen (Days 6)
Build brand marketing page with product catalog.

6.1 **Create Company Profile Components**
- `components/CompanyHeader.tsx`: Brand logo, name, description, follower count
- `components/ProductCatalog.tsx`: Grid of brand's products
- `components/BrandPostsFeed.tsx`: Feed of marketing posts/announcements

6.2 **Create Brand Profile Route**
- `app/brand-profile/[id].tsx`: Deep-link route
- Parse URL param `id`, fetch brand/products from mock data
- Tap on product → navigate to ProductDetails
- Tap on marketing post → view in ProductDetails with comments

### Phase 7: Shopping Cart Screen (Days 6-7)
Build cart with item management and checkout flow.

7.1 **Create Cart Components**
- `components/CartItem.tsx`: Product in cart (image, name, brand, price, quantity, remove button)
- `components/CartSummary.tsx`: Itemized list + total price + tax estimate (mock)
- `components/CheckoutButton.tsx`: "Proceed to Checkout" (placeholder for future payment integration)

7.2 **Fill Cart Screen**
- `app/(tabs)/cart.tsx`: Render CartItems + CartSummary
- Wire up Zustand cartStore for real-time updates
- Remove item button deletes from cart
- Quantity input updates total

### Phase 8: Review Post Creation Screen (Days 7-8)
Build modal for users to create product reviews.

8.1 **Create Review Composition Components**
- `components/ReviewComposer.tsx`: Modal form with:
  - Product selector (dropdown or recent products)
  - Video selector (mock: select from gallery or use placeholder)
  - Star rating picker (1-5 stars)
  - Pros input (text, tag-based)
  - Cons input (text, tag-based)
  - Review text area
  - Post button

8.2 **Create Review Post Route**
- `app/review-post.tsx`: Modal screen
- Navigate from Home Feed → tap "Create Review" FAB or context menu
- Or navigate from ProductDetails → "Write a Review" button
- On submit: Add to mock posts array (local state for MVP, will hit API later)

### Phase 9: Polish & Cross-Screen QA (Days 8-9)
Refine UI, connect edge cases, ensure consistent UX.

9.1 **UI Polish**
- Ensure all screens respect light/dark mode (theming)
- Add empty states (no posts, no reviews, empty cart, etc.)
- Loading states for screens (skeleton screens)
- Error handling for future API calls

9.2 **Navigation QA**
- Test all tab navigation flows
- Test deep links: productId → ProductDetails
- Test modal open/close for ReviewPost
- Test back button on all platforms (iOS gesture + Android button)

9.3 **Data Flow QA**
- Add to Cart → see in Cart screen
- Bookmark → see in Profile Bookmarks
- Write Review → see on ProductDetails + in Profile Reviews
- Like post → counter increments (session-only)

9.4 **Video Placeholder Integration**
- Replace mock video URLs with placeholder images or short clips
- Ensure video component handles missing/broken URLs gracefully

## File Structure (After Implementation)

```
frontend/
├── app/
│   ├── _layout.tsx (updated: add modals)
│   ├── (tabs)/
│   │   ├── _layout.tsx (updated: feed, profile, cart)
│   │   ├── feed.tsx (home feed - replaces index.tsx content)
│   │   ├── profile.tsx (user profile - replaces explore.tsx)
│   │   └── cart.tsx (shopping cart)
│   ├── product-details/
│   │   └── [id].tsx (product details page)
│   ├── brand-profile/
│   │   └── [id].tsx (company profile)
│   └── review-post.tsx (review creation modal)
├── components/
│   ├── VideoFeed.tsx (main feed container)
│   ├── FeedPost.tsx (single post card)
│   ├── ProductHeader.tsx
│   ├── ProductDescription.tsx
│   ├── ProductReviews.tsx
│   ├── ProductActions.tsx
│   ├── ReviewItem.tsx
│   ├── UserHeader.tsx
│   ├── BookmarksTab.tsx
│   ├── ReviewsTab.tsx
│   ├── ReputationBadge.tsx
│   ├── CompanyHeader.tsx
│   ├── ProductCatalog.tsx
│   ├── BrandPostsFeed.tsx
│   ├── CartItem.tsx
│   ├── CartSummary.tsx
│   ├── CheckoutButton.tsx
│   ├── ReviewComposer.tsx
│   └── ui/ (existing components stay)
├── store/
│   └── index.ts (Zustand stores: cart, bookmarks, user, feed)
├── services/
│   └── api.ts (API contracts with mock implementations)
├── data/
│   └── mockData.ts (mock products, brands, posts, users, reviews)
├── types/
│   └── index.ts (TypeScript types for all entities)
└── ... (existing assets, constants, hooks)
```

## Verification Checklist

### Functional
- [ ] Feed displays 10+ mock posts in vertical scroll
- [ ] Tap post → navigate to ProductDetails
- [ ] ProductDetails shows product info, reviews, "Add to Cart" button works
- [ ] Add to Cart → item appears in Cart tab with correct price
- [ ] Bookmarked posts appear in Profile → Bookmarks tab
- [ ] Profile → Reviews shows posts user created
- [ ] Company Profile shows brand name + product grid
- [ ] Review Post modal opens from Home Feed, form fills, post appears in feed after submission

### Navigation
- [ ] All tabs accessible from bottom nav (Feed, Profile, Cart)
- [ ] Deep links work: `/product-details/1` opens Product Page
- [ ] Modal opens/closes smoothly (ReviewPost)
- [ ] Back button works on all platforms

### UI/UX
- [ ] Dark/light mode toggles correctly on all screens
- [ ] Empty states display when no data (empty cart, no bookmarks, etc.)
- [ ] All text readable without truncation on common phone sizes
- [ ] Images/videos have proper aspect ratios and don't stretch

### Data Flow
- [ ] Like button increments counter (session-only)
- [ ] Share button opens platform share sheet
- [ ] Bookmark toggle works (bookmark/unbookmark)
- [ ] Cart total price updates correctly when quantity changes

## Dependencies to Install
- `zustand` - State management
- (Already installed: react-native-reanimated, react-navigation, expo-router, expo-image)

## Decisions & Assumptions
1. **Mock data only**: All data stored in memory; resets on app restart (no database, no backend APIs yet)
2. **TikTok-style feed**: Full-screen vertical posts, infinite scroll with FlatList
3. **No authentication**: All users browse as "anonymous"; profile points to mock "current user"
4. **Comments feature**: Can view comments on products but no read/write implementation (scope: basic buttons only)
5. **Video placeholders**: Use placeholder images or simple video clips; real video upload deferred to backend phase
6. **Theming**: Extend existing light/dark mode support; no custom brand colors per company (future)

## Implementation Clarifications - APPROVED ✓
1. **Comment system**: Read-only for MVP (show existing comments on product page, tap comment button navigates to ProductDetails with comments section visible)
2. **Share button**: Use React Native's Share API (native iOS/Android sheet)
3. **Video playback**: Auto-play when post enters viewport (like TikTok), tap video toggles pause/play

## Next Steps for User
1. ✅ Plan approved and clarifications confirmed
2. Ready to start Phase 1 (mock data + Zustand setup)
3. Will parallelize: Phase 2 (scaffold screens) can start while Phase 1 finishes
