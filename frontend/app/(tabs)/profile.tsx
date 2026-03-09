/**
 * User Profile Screen - Complete Implementation
 * Shows user bookmarks, reviews, and reputation
 */

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { mockPosts, mockProducts } from '@/data/mockData';
import { useBookmarkStore, useUserStore } from '@/store/index';
import { useRouter } from 'expo-router';
import { Dimensions, Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');
const itemWidth = (screenWidth - 20) / 2;

export default function ProfileScreen() {
  const currentUser = useUserStore((state) => state.currentUser);
  const bookmarkedPostIds = useBookmarkStore((state) => state.bookmarkedPostIds);
  const router = useRouter();

  const bookmarkedPosts = mockPosts.filter((p) => bookmarkedPostIds.has(p.id));
  const userReviewPosts = mockPosts.filter(
    (p) => p.posterId === currentUser?.id && p.type === 'review'
  );

  const reputationColor =
    currentUser?.reputationLevel === 'Expert'
      ? '#FF9500'
      : currentUser?.reputationLevel === 'Trusted'
        ? '#34C759'
        : '#999';

  const handlePostTap = (productId: string) => {
    router.push({
      pathname: '/product-details/[id]' as any,
      params: { id: productId },
    });
  };

  const renderBookmarkedPost = ({ item }: { item: typeof bookmarkedPosts[0] }) => {
    const product = mockProducts.find((p) => p.id === item.productId);
    return (
      <Pressable
        style={styles.postGrid}
        onPress={() => handlePostTap(item.productId)}>
        <Image source={{ uri: item.videoUrl }} style={styles.postImage} />
        <View style={styles.postOverlay}>
          <ThemedText numberOfLines={1} style={styles.postTitle}>
            {product?.name}
          </ThemedText>
        </View>
      </Pressable>
    );
  };

  const renderReviewPost = ({ item }: { item: typeof userReviewPosts[0] }) => {
    const product = mockProducts.find((p) => p.id === item.productId);
    return (
      <Pressable
        style={styles.reviewCard}
        onPress={() => handlePostTap(item.productId)}>
        <View style={styles.reviewHeader}>
          <ThemedText type="defaultSemiBold">{product?.name}</ThemedText>
          <ThemedText style={styles.reviewDate}>
            {new Date(item.createdAt).toLocaleDateString()}
          </ThemedText>
        </View>
        <ThemedText numberOfLines={2} style={styles.reviewText}>
          {item.description}
        </ThemedText>
        <View style={styles.reviewStats}>
          <View style={styles.stat}>
            <IconSymbol name="heart.fill" size={12} color="#FF3B30" />
            <ThemedText style={styles.statText}>{item.likes}</ThemedText>
          </View>
          <View style={styles.stat}>
            <IconSymbol name="bubble.right" size={12} color="#007AFF" />
            <ThemedText style={styles.statText}>{item.commentCount}</ThemedText>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* User Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Image
              source={{ uri: currentUser?.avatar }}
              style={styles.avatarImage}
            />
          </View>

          <View style={styles.userInfo}>
            <ThemedText type="title">{currentUser?.name}</ThemedText>
            <View style={styles.reputationRow}>
              <View style={[styles.reputationBadge, { borderColor: reputationColor }]}>
                <IconSymbol name="star.fill" size={12} color={reputationColor} />
                <ThemedText style={[styles.reputationText, { color: reputationColor }]}>
                  {currentUser?.reputationLevel}
                </ThemedText>
              </View>
              <ThemedText style={styles.score}>
                Score: {currentUser?.reputationScore}
              </ThemedText>
            </View>
            {currentUser?.bio && (
              <ThemedText style={styles.bio}>{currentUser.bio}</ThemedText>
            )}
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <ThemedText type="defaultSemiBold" style={styles.statNumber}>
              {currentUser?.reviewCount}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Reviews</ThemedText>
          </View>
          <View style={styles.statBox}>
            <ThemedText type="defaultSemiBold" style={styles.statNumber}>
              {currentUser?.followerCount}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Followers</ThemedText>
          </View>
          <View style={styles.statBox}>
            <ThemedText type="defaultSemiBold" style={styles.statNumber}>
              {bookmarkedPostIds.size}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Saved</ThemedText>
          </View>
        </View>

        {/* Bookmarks Section */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Saved Posts
          </ThemedText>
          {bookmarkedPosts.length > 0 ? (
            <View style={styles.gridContainer}>
              {bookmarkedPosts.map((post) => (
                <View key={post.id}>
                  {renderBookmarkedPost({ item: post })}
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <IconSymbol name="bookmark" size={32} color="#ccc" />
              <ThemedText style={styles.emptyText}>
                No saved posts yet
              </ThemedText>
            </View>
          )}
        </View>

        {/* Reviews Section */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            My Reviews
          </ThemedText>
          {userReviewPosts.length > 0 ? (
            <View style={styles.reviewsContainer}>
              {userReviewPosts.map((post) => (
                <View key={post.id}>
                  {renderReviewPost({ item: post })}
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <IconSymbol name="square.and.pencil" size={32} color="#ccc" />
              <ThemedText style={styles.emptyText}>
                You haven't posted any reviews yet
              </ThemedText>
            </View>
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'flex-start',
  },
  avatar: {
    marginRight: 16,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e0e0e0',
  },
  userInfo: {
    flex: 1,
  },
  reputationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  reputationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
  },
  reputationText: {
    fontSize: 11,
    fontWeight: '600',
  },
  score: {
    fontSize: 11,
    color: '#666',
  },
  bio: {
    fontSize: 12,
    color: '#666',
    marginTop: 6,
    lineHeight: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  statNumber: {
    fontSize: 18,
  },
  statLabel: {
    fontSize: 11,
    color: '#666',
    marginTop: 4,
  },
  section: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sectionTitle: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
    gap: 8,
  },
  postGrid: {
    width: itemWidth,
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
  postOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  postTitle: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
  },
  reviewsContainer: {
    gap: 8,
    paddingHorizontal: 16,
  },
  reviewCard: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewDate: {
    fontSize: 11,
    color: '#999',
  },
  reviewText: {
    fontSize: 12,
    color: '#333',
    lineHeight: 16,
    marginBottom: 8,
  },
  reviewStats: {
    flexDirection: 'row',
    gap: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 11,
    color: '#666',
  },
  emptyState: {
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: '#999',
    marginTop: 12,
  },
});
