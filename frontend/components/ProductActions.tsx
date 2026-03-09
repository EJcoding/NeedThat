/**
 * ProductActions Component
 * Displays action buttons: "Add to Cart" and quantity selector
 */

import { addToCart } from '@/services/api';
import { useCartStore } from '@/store/index';
import { Product } from '@/types/index';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from './themed-text';
import { IconSymbol } from './ui/icon-symbol';

interface ProductActionsProps {
  product: Product;
  onAddedToCart?: () => void;
}

export function ProductActions({
  product,
  onAddedToCart,
}: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const cartAddToCart = useCartStore((state) => state.addToCart);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await addToCart(product.id, quantity);
      cartAddToCart(product.id, quantity, product);
      setIsAdded(true);
      onAddedToCart?.();

      // Reset after 2 seconds
      setTimeout(() => {
        setIsAdded(false);
      }, 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Quantity Selector */}
      <View style={styles.quantityContainer}>
        <ThemedText style={styles.quantityLabel}>Quantity:</ThemedText>
        <View style={styles.quantitySelector}>
          <Pressable
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1}>
            <IconSymbol name="minus" size={16} color="#007AFF" />
          </Pressable>

          <View style={styles.quantityDisplay}>
            <ThemedText style={styles.quantityText}>{quantity}</ThemedText>
          </View>

          <Pressable
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(quantity + 1)}
            disabled={quantity >= 10}>
            <IconSymbol name="plus" size={16} color="#007AFF" />
          </Pressable>
        </View>
      </View>

      {/* Add to Cart Button */}
      <Pressable
        style={[
          styles.addToCartButton,
          isAdded && styles.addedToCartButton,
          isAdding && styles.addingButton,
        ]}
        onPress={handleAddToCart}
        disabled={isAdding || isAdded}>
        <View style={styles.buttonContent}>
          <IconSymbol
            name={isAdded ? 'checkmark' : 'bag.badge.plus'}
            size={20}
            color="white"
          />
          <ThemedText style={styles.addToCartText}>
            {isAdded ? 'Added to Cart!' : 'Add to Cart'}
          </ThemedText>
        </View>
      </Pressable>

      {/* Stock Info */}
      <View style={styles.stockInfo}>
        <IconSymbol name="checkmark.circle" size={14} color="#34C759" />
        <ThemedText style={styles.stockText}>In stock - Order today</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#f9f9f9',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  quantityLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  quantityButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  quantityDisplay: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minWidth: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#e0e0e0',
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '600',
  },
  addToCartButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  addingButton: {
    opacity: 0.7,
  },
  addedToCartButton: {
    backgroundColor: '#34C759',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addToCartText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  stockInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'center',
  },
  stockText: {
    fontSize: 12,
    color: '#34C759',
    fontWeight: '500',
  },
});
