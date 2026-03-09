/**
 * ReviewItem Component
 * Displays a single product review
 */

import { mockUsers } from '@/data/mockData';
import { Review } from '@/types/index';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from './themed-text';
import { IconSymbol } from './ui/icon-symbol';

interface ReviewItemProps {
  review: Review;
}

export function ReviewItem({ review }: ReviewItemProps) {
  const reviewer = mockUsers.find((u) => u.id === review.userId);

  const renderStars = (rating: number) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <IconSymbol
        key={star}
        name={star <= rating ? 'star.fill' : 'star'}
        size={12}
        color={star <= rating ? '#FFD700' : '#ccc'}
      />
    ));
  };

  return (
    <View style={styles.container}>
      {/* Reviewer Info */}
      <View style={styles.reviewerRow}>
        <View>
          <ThemedText type="defaultSemiBold" style={styles.reviewerName}>
            {reviewer?.name || 'Anonymous'}
          </ThemedText>
          <ThemedText style={styles.reputationBadge}>
            {reviewer?.reputationLevel || 'User'}
          </ThemedText>
        </View>
        <View style={styles.ratingStars}>{renderStars(review.rating)}</View>
      </View>

      {/* Pros and Cons */}
      {review.pros.length > 0 && (
        <View style={styles.prosConsContainer}>
          <View style={styles.prosContainer}>
            <View style={styles.prosHeader}>
              <IconSymbol name="checkmark.circle.fill" size={14} color="#34C759" />
              <ThemedText style={styles.prosLabel}>Pros:</ThemedText>
            </View>
            {review.pros.map((pro, index) => (
              <ThemedText key={index} style={styles.prosText}>
                {pro}
              </ThemedText>
            ))}
          </View>
        </View>
      )}

      {review.cons.length > 0 && (
        <View style={styles.prosConsContainer}>
          <View style={styles.consContainer}>
            <View style={styles.consHeader}>
              <IconSymbol name="xmark.circle.fill" size={14} color="#FF3B30" />
              <ThemedText style={styles.consLabel}>Cons:</ThemedText>
            </View>
            {review.cons.map((con, index) => (
              <ThemedText key={index} style={styles.consText}>
                {con}
              </ThemedText>
            ))}
          </View>
        </View>
      )}

      {/* Review Text */}
      <ThemedText style={styles.reviewText}>{review.reviewText}</ThemedText>

      {/* Helpful Footer */}
      <View style={styles.helpfulContainer}>
        <View style={styles.helpfulLeft}>
          <ThemedText style={styles.timestamp}>
            {new Date(review.createdAt).toLocaleDateString()}
          </ThemedText>
        </View>
        <View style={styles.helpfulRight}>
          <View style={styles.helpfulItem}>
            <IconSymbol name="hand.thumbsup" size={12} color="#666" />
            <ThemedText style={styles.helpfulCount}>{review.helpful}</ThemedText>
          </View>
          <View style={styles.helpfulItem}>
            <IconSymbol name="hand.thumbsdown" size={12} color="#666" />
            <ThemedText style={styles.helpfulCount}>{review.unhelpful}</ThemedText>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  reviewerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  reviewerName: {
    fontSize: 14,
    marginBottom: 2,
  },
  reputationBadge: {
    fontSize: 11,
    color: '#666',
    fontStyle: 'italic',
  },
  ratingStars: {
    flexDirection: 'row',
    gap: 2,
  },
  prosConsContainer: {
    marginBottom: 12,
  },
  prosContainer: {
    marginBottom: 0,
  },
  consContainer: {
    marginBottom: 0,
  },
  prosHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  consHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  prosLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#34C759',
  },
  consLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF3B30',
  },
  prosText: {
    fontSize: 12,
    color: '#333',
    marginBottom: 4,
    marginLeft: 20,
  },
  consText: {
    fontSize: 12,
    color: '#333',
    marginBottom: 4,
    marginLeft: 20,
  },
  reviewText: {
    fontSize: 13,
    lineHeight: 18,
    color: '#333',
    marginBottom: 12,
  },
  helpfulContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  helpfulLeft: {},
  helpfulRight: {
    flexDirection: 'row',
    gap: 12,
  },
  helpfulItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  helpfulCount: {
    fontSize: 11,
    color: '#666',
  },
  timestamp: {
    fontSize: 11,
    color: '#999',
  },
});
