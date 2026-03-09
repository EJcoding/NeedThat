/**
 * ProductReviews Component
 * Displays list of product reviews with sorting options
 */

import { Review } from '@/types/index';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ReviewItem } from './ReviewItem';
import { ThemedText } from './themed-text';
import { IconSymbol } from './ui/icon-symbol';

interface ProductReviewsProps {
  reviews: Review[];
  averageRating: number;
  reviewCount: number;
}

type SortOption = 'helpful' | 'recent' | 'rating-high' | 'rating-low';

export function ProductReviews({
  reviews,
  averageRating,
  reviewCount,
}: ProductReviewsProps) {
  const [sortBy, setSortBy] = useState<SortOption>('helpful');

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'helpful':
        return b.helpful - a.helpful;
      case 'recent':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'rating-high':
        return b.rating - a.rating;
      case 'rating-low':
        return a.rating - b.rating;
      default:
        return 0;
    }
  });

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => r.rating === rating).length,
  }));

  return (
    <View style={styles.container}>
      {/* Rating Summary */}
      <View style={styles.summaryContainer}>
        <View style={styles.averageRating}>
          <ThemedText type="title" style={styles.averageNumber}>
            {averageRating.toFixed(1)}
          </ThemedText>
          <View style={styles.averageStars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <IconSymbol
                key={star}
                name={star <= Math.round(averageRating) ? 'star.fill' : 'star'}
                size={14}
                color={star <= Math.round(averageRating) ? '#FFD700' : '#ccc'}
              />
            ))}
          </View>
          <ThemedText style={styles.totalReviews}>
            {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
          </ThemedText>
        </View>

        <View style={styles.distributionContainer}>
          {ratingDistribution.map(({ rating, count }) => (
            <View key={rating} style={styles.ratingRow}>
              <ThemedText style={styles.ratingLabel}>{rating}★</ThemedText>
              <View style={styles.barContainer}>
                <View
                  style={[
                    styles.bar,
                    {
                      width: reviewCount > 0 ? `${(count / reviewCount) * 100}%` : '0%',
                    },
                  ]}
                />
              </View>
              <ThemedText style={styles.ratingCount}>{count}</ThemedText>
            </View>
          ))}
        </View>
      </View>

      {/* Sort Options */}
      <View style={styles.sortContainer}>
        <ThemedText style={styles.sortLabel}>Sort by:</ThemedText>
        <View style={styles.sortOptions}>
          {(['helpful', 'recent', 'rating-high', 'rating-low'] as SortOption[]).map(
            (option) => (
              <Pressable
                key={option}
                onPress={() => setSortBy(option)}
                style={[
                  styles.sortButton,
                  sortBy === option && styles.sortButtonActive,
                ]}>
                <ThemedText
                  style={[
                    styles.sortButtonText,
                    sortBy === option && styles.sortButtonTextActive,
                  ]}>
                  {option === 'helpful'
                    ? 'Helpful'
                    : option === 'recent'
                      ? 'Recent'
                      : option === 'rating-high'
                        ? 'Highest'
                        : 'Lowest'}
                </ThemedText>
              </Pressable>
            )
          )}
        </View>
      </View>

      {/* Reviews List */}
      {sortedReviews.length > 0 ? (
        <View style={styles.reviewsList}>
          {sortedReviews.map((review) => (
            <ReviewItem key={review.id} review={review} />
          ))}
        </View>
      ) : (
        <View style={styles.noReviews}>
          <ThemedText style={styles.noReviewsText}>
            No reviews yet. Be the first to review!
          </ThemedText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  averageRating: {
    alignItems: 'center',
    minWidth: 60,
  },
  averageNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  averageStars: {
    flexDirection: 'row',
    marginVertical: 4,
    gap: 2,
  },
  totalReviews: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
  },
  distributionContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  ratingLabel: {
    fontSize: 12,
    fontWeight: '500',
    width: 25,
  },
  barContainer: {
    flex: 1,
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 2,
  },
  ratingCount: {
    fontSize: 12,
    color: '#999',
    width: 25,
    textAlign: 'right',
  },
  sortContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sortLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  sortOptions: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  sortButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  sortButtonText: {
    fontSize: 12,
    color: '#333',
  },
  sortButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  reviewsList: {},
  noReviews: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  noReviewsText: {
    color: '#999',
    fontSize: 13,
  },
});
