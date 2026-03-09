/**
 * NeedThat App - API Service Layer
 * Mock API implementations for future backend integration
 * All functions return Promise to mimic real async API calls
 */

import {
    currentUser,
    mockBrands,
    mockComments,
    mockPosts,
    mockProducts,
    mockReviews,
    mockUsers,
} from '../data/mockData';
import {
    Brand,
    BrandDetailsResponse,
    Comment,
    FeedResponse,
    Post,
    Product,
    ProductDetailsResponse,
    Review,
    UserProfile,
    UserProfileResponse,
} from '../types/index';

// ============ FEED API ============

/**
 * Get paginated feed posts
 * @param pageSize - Number of posts per page
 * @param cursor - Pagination cursor (optional)
 * @returns Feed response with posts and pagination info
 */
export async function getFeedPosts(
  pageSize: number = 10,
  cursor?: string
): Promise<FeedResponse> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const startIndex = cursor ? parseInt(cursor) : 0;
  const endIndex = startIndex + pageSize;

  // In real app: rotate mock data for infinite scroll
  const posts = [...mockPosts];
  const paginatedPosts = posts.slice(startIndex, endIndex);

  // Add isLikedByCurrentUser and isBookmarkedByCurrentUser
  const enrichedPosts = paginatedPosts.map((post) => ({
    ...post,
    isLikedByCurrentUser: Math.random() > 0.7, // Mock random likes
    isBookmarkedByCurrentUser: Math.random() > 0.85, // Mock random bookmarks
  }));

  return {
    posts: enrichedPosts,
    nextCursor: endIndex < mockPosts.length ? endIndex.toString() : undefined,
    hasMore: endIndex < mockPosts.length,
  };
}

// ============ PRODUCT API ============

/**
 * Get detailed product information with reviews and comments
 * @param productId - ID of the product
 * @returns Product details with reviews and comments
 */
export async function getProductDetails(productId: string): Promise<ProductDetailsResponse> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 400));

  const product = mockProducts.find((p) => p.id === productId);
  if (!product) {
    throw new Error(`Product ${productId} not found`);
  }

  const brand = mockBrands.find((b) => b.id === product.brandId);
  if (!brand) {
    throw new Error(`Brand ${product.brandId} not found`);
  }

  const productReviews = mockReviews.filter((r) => r.productId === productId);
  const avgRating = productReviews.length > 0
    ? productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length
    : product.aiRating;

  // Get comments from posts related to this product
  const productPostIds = mockPosts
    .filter((p) => p.productId === productId)
    .map((p) => p.id);
  const productComments = mockComments.filter((c) => productPostIds.includes(c.postId));

  return {
    product,
    brand,
    reviews: productReviews,
    comments: productComments,
    rating: avgRating,
    reviewCount: productReviews.length,
  };
}

/**
 * Search products by query
 * @param query - Search query string
 * @returns Matching products
 */
export async function searchProducts(query: string): Promise<Product[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const lowercaseQuery = query.toLowerCase();
  return mockProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(lowercaseQuery) ||
      p.description.toLowerCase().includes(lowercaseQuery)
  );
}

// ============ BRAND API ============

/**
 * Get brand profile with products and posts
 * @param brandId - ID of the brand
 * @returns Brand details with products and marketing posts
 */
export async function getBrandDetails(brandId: string): Promise<BrandDetailsResponse> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 350));

  const brand = mockBrands.find((b) => b.id === brandId);
  if (!brand) {
    throw new Error(`Brand ${brandId} not found`);
  }

  const products = mockProducts.filter((p) => p.brandId === brandId);
  const brandPosts = mockPosts.filter((p) => p.posterId === brandId && p.posterType === 'brand');

  return {
    brand,
    products,
    posts: brandPosts,
  };
}

// ============ USER PROFILE API ============

/**
 * Get user profile with bookmarks and reviews
 * @param userId - ID of the user (or 'current' for logged-in user)
 * @returns User profile with bookmarked posts and review posts
 */
export async function getUserProfile(userId: string): Promise<UserProfileResponse> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 350));

  const user = userId === 'current' 
    ? currentUser 
    : mockUsers.find((u) => u.id === userId);

  if (!user) {
    throw new Error(`User ${userId} not found`);
  }

  // Get posts created by user (reviews)
  const userReviewPosts = mockPosts.filter(
    (p) => p.posterId === user.id && p.posterType === 'user' && p.type === 'review'
  );

  // Get bookmarked posts (for demo: return first 5 posts as bookmarks)
  const bookmarkedPosts = mockPosts.slice(0, 5);

  return {
    user,
    bookmarkedPosts,
    reviewPosts: userReviewPosts,
  };
}

// ============ REVIEW API ============

/**
 * Create a new review post
 * @param productId - ID of product being reviewed
 * @param rating - Star rating (1-5)
 * @param pros - List of pros
 * @param cons - List of cons
 * @param reviewText - Review text
 * @returns Created review object
 */
export async function createReview(
  productId: string,
  rating: number,
  pros: string[],
  cons: string[],
  reviewText: string
): Promise<Review> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // In real app: send to backend
  // For now: create local review object
  const reviewId = `review_${Date.now()}`;
  const postId = `post_${Date.now()}`;

  // Create a new post for this review
  const newPost: Post = {
    id: postId,
    posterId: currentUser.id,
    posterType: 'user',
    type: 'review',
    productId,
    videoUrl: 'https://via.placeholder.com/540x960?text=User+Review',
    description: reviewText.substring(0, 100) + '...',
    likes: 0,
    commentCount: 0,
    bookmarkCount: 0,
    shareCount: 0,
    createdAt: new Date(),
  };

  // Add to mock data
  mockPosts.unshift(newPost);

  const review: Review = {
    id: reviewId,
    postId,
    productId,
    userId: currentUser.id,
    rating,
    pros,
    cons,
    reviewText,
    helpful: 0,
    unhelpful: 0,
    createdAt: new Date(),
  };

  mockReviews.push(review);

  return review;
}

/**
 * Get all reviews for a product
 * @param productId - ID of the product
 * @returns List of reviews for the product
 */
export async function getProductReviews(productId: string): Promise<Review[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  return mockReviews.filter((r) => r.productId === productId);
}

// ============ COMMENT API ============

/**
 * Get comments for a post
 * @param postId - ID of the post
 * @returns List of comments on the post
 */
export async function getPostComments(postId: string): Promise<Comment[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 250));

  return mockComments.filter((c) => c.postId === postId);
}

/**
 * Create a new comment on a post
 * @param postId - ID of the post
 * @param text - Comment text
 * @returns Created comment object
 */
export async function createComment(postId: string, text: string): Promise<Comment> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const commentId = `comment_${Date.now()}`;
  const comment: Comment = {
    id: commentId,
    postId,
    userId: currentUser.id,
    userName: currentUser.name,
    userAvatar: currentUser.avatar,
    text,
    likes: 0,
    createdAt: new Date(),
  };

  mockComments.push(comment);

  return comment;
}

// ============ INTERACTION API ============

/**
 * Like a post
 * @param postId - ID of the post to like
 * @returns Updated post object
 */
export async function likePost(postId: string): Promise<Post> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  const post = mockPosts.find((p) => p.id === postId);
  if (!post) {
    throw new Error(`Post ${postId} not found`);
  }

  post.likes += 1;
  post.isLikedByCurrentUser = true;

  return post;
}

/**
 * Unlike a post
 * @param postId - ID of the post to unlike
 * @returns Updated post object
 */
export async function unlikePost(postId: string): Promise<Post> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  const post = mockPosts.find((p) => p.id === postId);
  if (!post) {
    throw new Error(`Post ${postId} not found`);
  }

  if (post.likes > 0) {
    post.likes -= 1;
  }
  post.isLikedByCurrentUser = false;

  return post;
}

/**
 * Bookmark a post
 * @param postId - ID of the post to bookmark
 * @returns Updated post object
 */
export async function bookmarkPost(postId: string): Promise<Post> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  const post = mockPosts.find((p) => p.id === postId);
  if (!post) {
    throw new Error(`Post ${postId} not found`);
  }

  post.bookmarkCount += 1;
  post.isBookmarkedByCurrentUser = true;

  return post;
}

/**
 * Remove bookmark from a post
 * @param postId - ID of the post to unbookmark
 * @returns Updated post object
 */
export async function unbookmarkPost(postId: string): Promise<Post> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  const post = mockPosts.find((p) => p.id === postId);
  if (!post) {
    throw new Error(`Post ${postId} not found`);
  }

  if (post.bookmarkCount > 0) {
    post.bookmarkCount -= 1;
  }
  post.isBookmarkedByCurrentUser = false;

  return post;
}

// ============ CART API ============

/**
 * Add item to cart
 * @param productId - ID of the product
 * @param quantity - Quantity to add
 * @returns Product object
 */
export async function addToCart(
  productId: string,
  quantity: number
): Promise<Product> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  const product = mockProducts.find((p) => p.id === productId);
  if (!product) {
    throw new Error(`Product ${productId} not found`);
  }

  // In real app: add to backend cart
  return product;
}

/**
 * Remove item from cart
 * @param productId - ID of the product
 * @returns Success status
 */
export async function removeFromCart(productId: string): Promise<boolean> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  // In real app: remove from backend cart
  return true;
}

// ============ UTILITY API FUNCTIONS ============

/**
 * Get a single post by ID
 * @param postId - ID of the post
 * @returns Post object
 */
export async function getPost(postId: string): Promise<Post> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  const post = mockPosts.find((p) => p.id === postId);
  if (!post) {
    throw new Error(`Post ${postId} not found`);
  }

  return post;
}

/**
 * Get a single product by ID
 * @param productId - ID of the product
 * @returns Product object
 */
export async function getProduct(productId: string): Promise<Product> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  const product = mockProducts.find((p) => p.id === productId);
  if (!product) {
    throw new Error(`Product ${productId} not found`);
  }

  return product;
}

/**
 * Get a single brand by ID
 * @param brandId - ID of the brand
 * @returns Brand object
 */
export async function getBrand(brandId: string): Promise<Brand> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  const brand = mockBrands.find((b) => b.id === brandId);
  if (!brand) {
    throw new Error(`Brand ${brandId} not found`);
  }

  return brand;
}

/**
 * Get a single user by ID
 * @param userId - ID of the user
 * @returns User object
 */
export async function getUser(userId: string): Promise<UserProfile> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  const user = mockUsers.find((u) => u.id === userId);
  if (!user) {
    throw new Error(`User ${userId} not found`);
  }

  return user;
}
