/**
 * Review Post Creation Modal - Complete Implementation
 * Allows users to create product review posts
 */

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { mockProducts } from '@/data/mockData';
import { createReview } from '@/services/api';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

export default function ReviewPostScreen() {
  const router = useRouter();
  const [selectedProductId, setSelectedProductId] = useState<string>(mockProducts[0].id);
  const [rating, setRating] = useState(5);
  const [pros, setPros] = useState<string[]>([]);
  const [prosInput, setProsInput] = useState('');
  const [cons, setCons] = useState<string[]>([]);
  const [consInput, setConsInput] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showProductPicker, setShowProductPicker] = useState(false);

  const selectedProduct = mockProducts.find((p) => p.id === selectedProductId);

  const handleAddPro = () => {
    if (prosInput.trim()) {
      setPros([...pros, prosInput.trim()]);
      setProsInput('');
    }
  };

  const handleRemovePro = (index: number) => {
    setPros(pros.filter((_, i) => i !== index));
  };

  const handleAddCon = () => {
    if (consInput.trim()) {
      setCons([...cons, consInput.trim()]);
      setConsInput('');
    }
  };

  const handleRemoveCon = (index: number) => {
    setCons(cons.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!reviewText.trim() || pros.length === 0 || cons.length === 0) {
      alert('Please fill in rating, pros, cons, and review text');
      return;
    }

    setIsSubmitting(true);
    try {
      await createReview(selectedProductId, rating, pros, cons, reviewText);
      alert('Review posted successfully!');
      router.back();
    } catch (error) {
      console.error('Error creating review:', error);
      alert('Failed to post review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <IconSymbol name="xmark" size={24} color="#007AFF" />
        </Pressable>
        <ThemedText type="title" style={styles.headerTitle}>
          Create Review
        </ThemedText>
        <Pressable
          style={styles.postButton}
          onPress={handleSubmit}
          disabled={isSubmitting}>
          <ThemedText
            style={[
              styles.postButtonText,
              isSubmitting && styles.postButtonTextDisabled,
            ]}>
            {isSubmitting ? 'Posting...' : 'Post'}
          </ThemedText>
        </Pressable>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Product Selector */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.label}>
            Product
          </ThemedText>
          <Pressable
            style={styles.productSelector}
            onPress={() => setShowProductPicker(!showProductPicker)}>
            <ThemedText numberOfLines={1}>{selectedProduct?.name}</ThemedText>
            <IconSymbol
              name={showProductPicker ? 'chevron.up' : 'chevron.down'}
              size={20}
              color="#007AFF"
            />
          </Pressable>

          {showProductPicker && (
            <View style={styles.productList}>
              {mockProducts.slice(0, 5).map((product) => (
                <Pressable
                  key={product.id}
                  style={[
                    styles.productOption,
                    selectedProductId === product.id && styles.productOptionSelected,
                  ]}
                  onPress={() => {
                    setSelectedProductId(product.id);
                    setShowProductPicker(false);
                  }}>
                  <ThemedText
                    style={{
                      fontWeight: selectedProductId === product.id ? '600' : 'normal',
                    }}>
                    {product.name}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {/* Rating Selector */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.label}>
            Rate this product
          </ThemedText>
          <View style={styles.ratingSelector}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Pressable key={star} onPress={() => setRating(star)}>
                <IconSymbol
                  name={star <= rating ? 'star.fill' : 'star'}
                  size={40}
                  color={star <= rating ? '#FFD700' : '#ccc'}
                />
              </Pressable>
            ))}
          </View>
          <ThemedText style={styles.ratingText}>
            {rating === 5
              ? 'Excellent'
              : rating === 4
                ? 'Good'
                : rating === 3
                  ? 'Average'
                  : rating === 2
                    ? 'Poor'
                    : 'Terrible'}
          </ThemedText>
        </View>

        {/* Pros */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.label}>
            Pros (What do you like?)
          </ThemedText>
          {pros.map((pro, index) => (
            <View key={index} style={styles.tagContainer}>
              <View style={styles.tag}>
                <IconSymbol name="checkmark.circle.fill" size={14} color="#34C759" />
                <ThemedText style={styles.tagText}>{pro}</ThemedText>
              </View>
              <Pressable onPress={() => handleRemovePro(index)}>
                <IconSymbol name="xmark.circle.fill" size={16} color="#FF3B30" />
              </Pressable>
            </View>
          ))}
          <View style={styles.tagInputContainer}>
            <TextInput
              style={styles.tagInput}
              placeholder="Add a pro..."
              placeholderTextColor="#999"
              value={prosInput}
              onChangeText={setProsInput}
              onSubmitEditing={handleAddPro}
            />
            <Pressable onPress={handleAddPro}>
              <IconSymbol name="plus.circle.fill" size={20} color="#007AFF" />
            </Pressable>
          </View>
        </View>

        {/* Cons */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.label}>
            Cons (What could be better?)
          </ThemedText>
          {cons.map((con, index) => (
            <View key={index} style={styles.tagContainer}>
              <View style={styles.tag}>
                <IconSymbol name="xmark.circle.fill" size={14} color="#FF3B30" />
                <ThemedText style={styles.tagText}>{con}</ThemedText>
              </View>
              <Pressable onPress={() => handleRemoveCon(index)}>
                <IconSymbol name="xmark.circle.fill" size={16} color="#FF3B30" />
              </Pressable>
            </View>
          ))}
          <View style={styles.tagInputContainer}>
            <TextInput
              style={styles.tagInput}
              placeholder="Add a con..."
              placeholderTextColor="#999"
              value={consInput}
              onChangeText={setConsInput}
              onSubmitEditing={handleAddCon}
            />
            <Pressable onPress={handleAddCon}>
              <IconSymbol name="plus.circle.fill" size={20} color="#007AFF" />
            </Pressable>
          </View>
        </View>

        {/* Review Text */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.label}>
            Your Review
          </ThemedText>
          <TextInput
            style={styles.reviewInput}
            placeholder="Share your detailed thoughts about this product..."
            placeholderTextColor="#999"
            value={reviewText}
            onChangeText={setReviewText}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
          <ThemedText style={styles.charCount}>
            {reviewText.length} characters
          </ThemedText>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },
  postButton: {
    paddingHorizontal: 12,
  },
  postButtonText: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 14,
  },
  postButtonTextDisabled: {
    opacity: 0.5,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    marginBottom: 12,
  },
  productSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  productList: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginTop: 8,
    overflow: 'hidden',
  },
  productOption: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  productOptionSelected: {
    backgroundColor: '#f0f7ff',
  },
  ratingSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 12,
  },
  ratingText: {
    textAlign: 'center',
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  tagContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f7ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 1,
    gap: 6,
  },
  tagText: {
    fontSize: 13,
    flex: 1,
  },
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    gap: 8,
  },
  tagInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 13,
    color: '#333',
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#333',
    height: 120,
  },
  charCount: {
    fontSize: 11,
    color: '#999',
    marginTop: 6,
    textAlign: 'right',
  },
});
