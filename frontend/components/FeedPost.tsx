/**
 * FeedPost Component
 * Displays a single full-screen post in the video feed
 * Shows video, product info, and interaction buttons
 */

import { bookmarkPost, likePost, unbookmarkPost, unlikePost } from '@/services/api';
import { useIsPostBookmarked, useIsPostLiked } from '@/store/index';
import { Brand, Post, Product } from '@/types/index';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, Share, StyleSheet, View } from 'react-native';
import { ThemedText } from './themed-text';
import { IconSymbol } from './ui/icon-symbol';

interface FeedPostProps {
  post: Post;
  product?: Product;
  brand?: Brand;
  onCommentPress?: () => void;
}

export function FeedPost({
  post,
  product,
  brand,
  onCommentPress,
}: FeedPostProps) {
  const router = useRouter();
  const [isLiking, setIsLiking] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [postLikes, setPostLikes] = useState(post.likes);

  const { isLiked, toggleLike } = useIsPostLiked(post.id);
  const { isBookmarked, toggleBookmark } = useIsPostBookmarked(post.id);

  const handleLikeTap = async () => {
    setIsLiking(true);
    try {
      if (isLiked) {
        await unlikePost(post.id);
        setPostLikes((prev) => Math.max(0, prev - 1));
      } else {
        await likePost(post.id);
        setPostLikes((prev) => prev + 1);
      }
      toggleLike();
    } catch (error) {
      console.error('Error liking post:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleBookmarkTap = async () => {
    setIsBookmarking(true);
    try {
      if (isBookmarked) {
        await unbookmarkPost(post.id);
      } else {
        await bookmarkPost(post.id);
      }
      toggleBookmark();
    } catch (error) {
      console.error('Error bookmarking post:', error);
    } finally {
      setIsBookmarking(false);
    }
  };

  const handleShareTap = async () => {
    try {
      await Share.share({
        message: `Check out ${product?.name || 'this product'} on NeedThat!`,
        title: 'Share on NeedThat',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleProductTap = () => {
    if (product) {
      router.push({
        pathname: '/product-details/[id]' as any,
        params: { id: product.id },
      });
    }
  };

  const handleBrandTap = () => {
    if (brand) {
      router.push({
        pathname: '/brand-profile/[id]' as any,
        params: { id: brand.id },
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Video Section */}
      <Pressable
        style={styles.videoContainer}
        onPress={() => {
          // TODO: Pause/play video on tap
        }}>
        <Image
          source={{ uri: post.videoUrl }}
          style={styles.video}
          resizeMode="cover"
        />
      </Pressable>

      {/* Product Info Overlay */}
      <View style={styles.overlay}>
        {/* Left side: Product info */}
        <View style={styles.infoSection}>
          <Pressable onPress={handleProductTap}>
            <ThemedText type="defaultSemiBold" style={styles.productName}>
              {product?.name || 'Product'}
            </ThemedText>
            <Pressable onPress={handleBrandTap}>
              <ThemedText type="subtitle" style={styles.brandName}>
                {brand?.name || 'Brand'}
              </ThemedText>
            </Pressable>
          </Pressable>

          {product && (
            <View style={styles.priceRatingContainer}>
              <ThemedText type="defaultSemiBold" style={styles.price}>
                ${product.price.toFixed(2)}
              </ThemedText>
              <View style={styles.ratingContainer}>
                <IconSymbol name="star.fill" size={14} color="#FFD700" />
                <ThemedText style={styles.rating}>
                  {product.aiRating.toFixed(1)}
                </ThemedText>
              </View>
            </View>
          )}

          <ThemedText
            type="subtitle"
            numberOfLines={2}
            style={styles.description}>
            {post.description}
          </ThemedText>
        </View>

        {/* Right side: Action buttons */}
        <View style={styles.actionButtons}>
          {/* Like Button */}
          <Pressable
            style={styles.actionButton}
            onPress={handleLikeTap}
            disabled={isLiking}>
            <IconSymbol
              name={isLiked ? 'heart.fill' : 'heart'}
              size={28}
              color={isLiked ? '#FF3B30' : 'white'}
            />
            <ThemedText style={styles.actionLabel}>
              {postLikes > 999 ? `${(postLikes / 1000).toFixed(1)}k` : postLikes}
            </ThemedText>
          </Pressable>

          {/* Comment Button - Opens Review Post Modal */}
          <Pressable
            style={styles.actionButton}
            onPress={() => {
              onCommentPress?.();
              router.push('review-post' as any);
            }}>
            <IconSymbol name="bubble.right" size={28} color="white" />
            <ThemedText style={styles.actionLabel}>
              {post.commentCount > 999
                ? `${(post.commentCount / 1000).toFixed(1)}k`
                : post.commentCount}
            </ThemedText>
          </Pressable>

          {/* Bookmark Button */}
          <Pressable
            style={styles.actionButton}
            onPress={handleBookmarkTap}
            disabled={isBookmarking}>
            <IconSymbol
              name={isBookmarked ? 'bookmark.fill' : 'bookmark'}
              size={28}
              color={isBookmarked ? '#007AFF' : 'white'}
            />
            <ThemedText style={styles.actionLabel}>
              {isBookmarked ? 'Saved' : 'Save'}
            </ThemedText>
          </Pressable>

          {/* Share Button */}
          <Pressable
            style={styles.actionButton}
            onPress={handleShareTap}>
            <IconSymbol name="arrowshape.turn.up.right" size={28} color="white" />
            <ThemedText style={styles.actionLabel}>Share</ThemedText>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    position: 'relative',
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    flexDirection: 'row',
    paddingBottom: 20,
    paddingHorizontal: 12,
    justifyContent: 'space-between',
    pointerEvents: 'box-none',
  },
  infoSection: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingRight: 12,
  },
  productName: {
    color: 'white',
    fontSize: 16,
    marginBottom: 4,
  },
  brandName: {
    color: '#ccc',
    fontSize: 12,
    marginBottom: 8,
  },
  priceRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  price: {
    color: 'white',
    fontSize: 18,
    marginRight: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  rating: {
    color: 'white',
    fontSize: 12,
    marginLeft: 4,
  },
  description: {
    color: 'white',
    fontSize: 12,
  },
  actionButtons: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: 4,
  },
  actionButton: {
    alignItems: 'center',
    marginVertical: 16,
    padding: 8,
  },
  actionLabel: {
    color: 'white',
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
  },
});
