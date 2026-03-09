/**
 * ProductDescription Component
 * Displays full product description and specifications
 */

import { Product } from '@/types/index';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from './themed-text';

interface ProductDescriptionProps {
  product: Product;
}

export function ProductDescription({ product }: ProductDescriptionProps) {
  return (
    <View style={styles.container}>
      <ThemedText type="subtitle" style={styles.heading}>
        About this product
      </ThemedText>

      <ThemedText style={styles.description}>{product.description}</ThemedText>

      {product.specs && product.specs.length > 0 && (
        <>
          <ThemedText type="subtitle" style={[styles.heading, styles.specsHeading]}>
            Key Features
          </ThemedText>

          {product.specs.map((spec, index) => (
            <View key={index} style={styles.specItem}>
              <ThemedText style={styles.specBullet}>•</ThemedText>
              <ThemedText style={styles.specText}>{spec}</ThemedText>
            </View>
          ))}
        </>
      )}

      {product.category && (
        <View style={styles.categoryContainer}>
          <ThemedText style={styles.categoryLabel}>Category:</ThemedText>
          <ThemedText style={styles.categoryValue}>{product.category}</ThemedText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  heading: {
    fontSize: 16,
    marginBottom: 12,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
    marginBottom: 16,
  },
  specsHeading: {
    marginTop: 8,
  },
  specItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  specBullet: {
    fontSize: 16,
    marginRight: 8,
    marginTop: -2,
  },
  specText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  categoryContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  categoryValue: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
});
