/**
 * VideoFeed Component
 * Full-screen vertical feed using FlatList
 * Displays one post per screen height
 */

import { mockBrands, mockProducts } from '@/data/mockData';
import { getFeedPosts } from '@/services/api';
import { Post } from '@/types/index';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, StyleSheet, View } from 'react-native';
import { FeedPost } from './FeedPost';

interface VideoFeedProps {
  onRefresh?: () => void;
}

const { height: screenHeight } = Dimensions.get('window');

export function VideoFeed({ onRefresh }: VideoFeedProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(true);

  // Load initial posts
  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      const response = await getFeedPosts(10, cursor);
      setPosts((prev) => (cursor ? [...prev, ...response.posts] : response.posts));
      setCursor(response.nextCursor);
      setHasMore(response.hasMore);
    } catch (error) {
      console.error('Error loading feed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMorePosts = async () => {
    if (!hasMore || isLoadingMore) return;

    try {
      setIsLoadingMore(true);
      const response = await getFeedPosts(10, cursor);
      setPosts((prev) => [...prev, ...response.posts]);
      setCursor(response.nextCursor);
      setHasMore(response.hasMore);
    } catch (error) {
      console.error('Error loading more posts:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleRefresh = async () => {
    setCursor(undefined);
    setHasMore(true);
    await loadPosts();
    onRefresh?.();
  };

  const renderPost = ({ item }: { item: Post }) => {
    const product = mockProducts.find((p) => p.id === item.productId);
    const brand = product ? mockBrands.find((b) => b.id === product.brandId) : null;

    return (
      <View style={styles.postContainer}>
        <FeedPost post={item} product={product || undefined} brand={brand || undefined} />
      </View>
    );
  };

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <FlatList
      data={posts}
      renderItem={renderPost}
      keyExtractor={(item) => item.id}
      pagingEnabled
      snapToInterval={screenHeight}
      snapToAlignment="start"
      decelerationRate="fast"
      scrollEnabled={true}
      onEndReached={loadMorePosts}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      refreshing={isLoading}
      onRefresh={handleRefresh}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  postContainer: {
    height: screenHeight,
    width: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  footerLoader: {
    height: screenHeight,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
});
