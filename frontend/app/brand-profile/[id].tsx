/**
 * Brand Profile Screen - Complete Implementation
 * Shows brand info, product catalog, and marketing posts
 */

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { mockBrands, mockPosts, mockProducts } from '@/data/mockData';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Dimensions, Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');
const productWidth = (screenWidth - 20) / 2;

export default function BrandProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const brand = mockBrands.find((b) => b.id === id);
  const products = mockProducts.filter((p) => p.brandId === id);
  const brandPosts = mockPosts.filter((p) => p.posterId === id && p.posterType === 'brand');

  if (!brand) {
    return (
      <ThemedView style={styles.errorContainer}>
        <ThemedText type="title">Brand not found</ThemedText>
      </ThemedView>
    );
  }

  const handleProductTap = (productId: string) => {
    router.push({
      pathname: '/product-details/[id]' as any,
      params: { id: productId },
    });
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Brand Header */}
        <View style={styles.headerContainer}>
          <Image source={{ uri: brand.logoUrl }} style={styles.logo} />
          <View style={styles.brandInfo}>
            <ThemedText type="title">{brand.name}</ThemedText>
            <View style={styles.followerRow}>
              <IconSymbol name="person.2.fill" size={14} color="#666" />
              <ThemedText style={styles.followers}>
                {brand.followerCount.toLocaleString()} followers
              </ThemedText>
            </View>
            <ThemedText style={styles.description}>{brand.description}</ThemedText>
          </View>
        </View>

        {/* Follow Button */}
        <Pressable
          style={styles.followButton}
          onPress={() => alert('Follow action coming soon!')}>
          <IconSymbol name="star.fill" size={16} color="white" />
          <ThemedText style={styles.followButtonText}>Follow Brand</ThemedText>
        </Pressable>

        {/* Brand Posts Section */}
        {brandPosts.length > 0 && (
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Latest Posts
            </ThemedText>
            {brandPosts.slice(0, 3).map((post) => {
              const product = mockProducts.find((p) => p.id === post.productId);
              return (
                <Pressable
                  key={post.id}
                  style={styles.postCard}
                  onPress={() => handleProductTap(post.productId)}>
                  <Image source={{ uri: post.videoUrl }} style={styles.postImage} />
                  <View style={styles.postContent}>
                    <ThemedText type="defaultSemiBold" numberOfLines={1}>
                      {product?.name}
                    </ThemedText>
                    <ThemedText numberOfLines={2} style={styles.postDescription}>
                      {post.description}
                    </ThemedText>
                    <View style={styles.postStats}>
                      <View style={styles.statItem}>
                        <IconSymbol name="heart.fill" size={12} color="#FF3B30" />
                        <ThemedText style={styles.statText}>{post.likes}</ThemedText>
                      </View>
                      <View style={styles.statItem}>
                        <IconSymbol name="bubble.right" size={12} color="#007AFF" />
                        <ThemedText style={styles.statText}>{post.commentCount}</ThemedText>
                      </View>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}

        {/* Product Catalog Section */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Product Catalog ({products.length})
          </ThemedText>
          <View style={styles.catalogContainer}>
            {products.map((product) => (
              <Pressable
                key={product.id}
                style={styles.productCard}
                onPress={() => handleProductTap(product.id)}>
                <Image source={{ uri: product.videoUrl }} style={styles.productImage} />
                <View style={styles.productOverlay}>
                  <ThemedText
                    type="defaultSemiBold"
                    numberOfLines={1}
                    style={styles.productName}>
                    {product.name}
                  </ThemedText>
                  <View style={styles.ratingRow}>
                    <IconSymbol name="star.fill" size={12} color="#FFD700" />
                    <ThemedText style={styles.rating}>
                      {product.aiRating.toFixed(1)}
                    </ThemedText>
                  </View>
                  <ThemedText style={styles.productPrice}>
                    ${product.price.toFixed(2)}
                  </ThemedText>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
    backgroundColor: '#e0e0e0',
  },
  brandInfo: {},
  followerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  followers: {
    fontSize: 12,
    color: '#666',
  },
  description: {
    fontSize: 13,
    color: '#333',
    marginTop: 8,
    lineHeight: 18,
  },
  followButton: {
    marginHorizontal: 16,
    marginVertical: 12,
    backgroundColor: '#007AFF',
    paddingVertical: 11,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  followButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  section: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sectionTitle: {
    marginBottom: 12,
    fontSize: 16,
  },
  postCard: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
  },
  postImage: {
    width: 80,
    height: 80,
    backgroundColor: '#e0e0e0',
  },
  postContent: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  postDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  postStats: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 11,
    color: '#666',
  },
  catalogContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  productCard: {
    width: productWidth,
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#e0e0e0',
    justifyContent: 'flex-end',
  },
  productImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  productOverlay: {
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  productName: {
    color: 'white',
    fontSize: 12,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  rating: {
    color: '#FFD700',
    fontSize: 11,
    fontWeight: '600',
  },
  productPrice: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },
});
