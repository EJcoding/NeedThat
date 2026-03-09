/**
 * Shopping Cart Screen - Complete Implementation
 * Displays items in cart with quantity management and total price
 */

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useCartStore, useCartTotal } from '@/store/index';
import { useRouter } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';

const TAX_RATE = 0.08;

export default function CartScreen() {
  const { items, totalPrice } = useCartTotal();
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const router = useRouter();

  const taxAmount = totalPrice * TAX_RATE;
  const finalTotal = totalPrice + taxAmount;

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity > 0) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemove = (productId: string) => {
    removeFromCart(productId);
  };

  const handleProductTap = (productId: string) => {
    router.push({
      pathname: '/product-details/[id]' as any,
      params: { id: productId },
    });
  };

  const handleCheckout = () => {
    // TODO: Implement checkout flow
    alert('Checkout coming soon!');
  };

  return (
    <ThemedView style={styles.container}>
      {items.length > 0 ? (
        <>
          <ScrollView style={styles.itemsScroll} showsVerticalScrollIndicator={false}>
            <View style={styles.itemsContainer}>
              {items.map((item) => (
                <Pressable
                  key={item.productId}
                  style={styles.cartItem}
                  onPress={() => handleProductTap(item.productId)}>
                  {/* Product Image */}
                  <Image
                    source={{ uri: item.product?.videoUrl || '' }}
                    style={styles.itemImage}
                  />

                  {/* Product Info */}
                  <View style={styles.itemInfo}>
                    <ThemedText type="defaultSemiBold" numberOfLines={1}>
                      {item.product?.name}
                    </ThemedText>
                    <ThemedText style={styles.itemPrice}>
                      ${item.product?.price.toFixed(2) || '0.00'}
                    </ThemedText>

                    {/* Quantity Control */}
                    <View style={styles.quantityControl}>
                      <Pressable
                        style={styles.qtyButton}
                        onPress={() =>
                          handleQuantityChange(item.productId, item.quantity - 1)
                        }>
                        <IconSymbol name="minus" size={14} color="#007AFF" />
                      </Pressable>

                      <ThemedText style={styles.qtyText}>{item.quantity}</ThemedText>

                      <Pressable
                        style={styles.qtyButton}
                        onPress={() =>
                          handleQuantityChange(item.productId, item.quantity + 1)
                        }>
                        <IconSymbol name="plus" size={14} color="#007AFF" />
                      </Pressable>
                    </View>
                  </View>

                  {/* Total + Remove */}
                  <View style={styles.itemRight}>
                    <ThemedText type="defaultSemiBold" style={styles.itemTotal}>
                      ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                    </ThemedText>
                    <Pressable
                      style={styles.removeButton}
                      onPress={() => handleRemove(item.productId)}>
                      <IconSymbol name="trash" size={18} color="#FF3B30" />
                    </Pressable>
                  </View>
                </Pressable>
              ))}
            </View>
          </ScrollView>

          {/* Summary */}
          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <ThemedText>Subtotal:</ThemedText>
              <ThemedText>${totalPrice.toFixed(2)}</ThemedText>
            </View>
            <View style={styles.summaryRow}>
              <ThemedText>Tax ({(TAX_RATE * 100).toFixed(0)}%):</ThemedText>
              <ThemedText>${taxAmount.toFixed(2)}</ThemedText>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <ThemedText type="defaultSemiBold" style={styles.totalLabel}>
                Total:
              </ThemedText>
              <ThemedText type="defaultSemiBold" style={styles.totalAmount}>
                ${finalTotal.toFixed(2)}
              </ThemedText>
            </View>

            <Pressable style={styles.checkoutButton} onPress={handleCheckout}>
              <ThemedText style={styles.checkoutText}>Proceed to Checkout</ThemedText>
            </Pressable>
          </View>
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <IconSymbol name="bag" size={64} color="#ccc" />
          <ThemedText type="title" style={styles.emptyTitle}>
            Your Cart is Empty
          </ThemedText>
          <ThemedText style={styles.emptyText}>
            Start shopping by exploring products in the Feed!
          </ThemedText>
          <Pressable
            style={styles.continueShopping}
            onPress={() => router.push('feed' as any)}>
            <ThemedText style={styles.continueShoppingText}>
              Continue Shopping
            </ThemedText>
          </Pressable>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemsScroll: {
    flex: 1,
  },
  itemsContainer: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    gap: 12,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },
  itemInfo: {
    flex: 1,
  },
  itemPrice: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
    marginTop: 2,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    width: 90,
  },
  qtyButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  qtyText: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  itemRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  itemTotal: {
    fontSize: 14,
    color: '#333',
  },
  removeButton: {
    padding: 4,
  },
  summary: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    fontSize: 13,
  },
  totalRow: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  totalLabel: {
    fontSize: 16,
  },
  totalAmount: {
    fontSize: 16,
    color: '#007AFF',
  },
  checkoutButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  checkoutText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginBottom: 24,
  },
  continueShopping: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  continueShoppingText: {
    color: 'white',
    fontWeight: '600',
  },
});
