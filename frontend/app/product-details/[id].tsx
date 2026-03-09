/**
 * Product Details Screen
 * Shows product info, reviews, and "Add to Cart" button
 */

import { ProductActions } from '@/components/ProductActions';
import { ProductDescription } from '@/components/ProductDescription';
import { ProductHeader } from '@/components/ProductHeader';
import { ProductReviews } from '@/components/ProductReviews';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getProductDetails } from '@/services/api';
import { Brand, Product, Review } from '@/types/index';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet } from 'react-native';

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [brand, setBrand] = useState<Brand | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProductDetails();
  }, [id]);

  const loadProductDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      if (!id) throw new Error('Product ID not provided');

      const details = await getProductDetails(id);
      setProduct(details.product);
      setBrand(details.brand);
      setReviews(details.reviews);
      setAverageRating(details.rating);
    } catch (err) {
      console.error('Error loading product:', err);
      setError('Failed to load product details');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <ThemedText style={styles.loadingText}>Loading product...</ThemedText>
      </ThemedView>
    );
  }

  if (error || !product) {
    return (
      <ThemedView style={styles.errorContainer}>
        <ThemedText type="title" style={styles.errorText}>
          {error || 'Product not found'}
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={true}
        bounces={true}>
        {/* Product Header */}
        <ProductHeader product={product} brand={brand || undefined} />

        {/* Description */}
        <ProductDescription product={product} />

        {/* Reviews */}
        <ProductReviews
          reviews={reviews}
          averageRating={averageRating}
          reviewCount={reviews.length}
        />

        {/* Actions - Add to Cart */}
        <ProductActions product={product} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    textAlign: 'center',
    color: '#FF3B30',
  },
});
