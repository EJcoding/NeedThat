/**
 * ProductHeader Component
 * Displays product video/image, name, brand, price, and AI rating
 */

import { Brand, Product } from '@/types/index';
import { useRouter } from 'expo-router';
import { Dimensions, Image, Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from './themed-text';
import { IconSymbol } from './ui/icon-symbol';

interface ProductHeaderProps {
  product: Product;
  brand?: Brand;
}

const { width: screenWidth } = Dimensions.get('window');

export function ProductHeader({ product, brand }: ProductHeaderProps) {
  const router = useRouter();

  const handleBrandTap = () => {
    if (brand) {
      router.push({
        pathname: '/brand-profile/[id]' as any,
        params: { id: brand.id },
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Product Video/Image */}
      <View style={styles.videoContainer}>
        <Image
          source={{ uri: product.videoUrl }}
          style={styles.video}
          resizeMode="cover"
        />
      </View>

      {/* Product Info */}
      <View style={styles.infoContainer}>
        <ThemedText type="title" style={styles.productName}>
          {product.name}
        </ThemedText>

        {/* Brand */}
        <Pressable onPress={handleBrandTap}>
          <ThemedText type="subtitle" style={styles.brandName}>
            {brand?.name || 'Unknown Brand'}
          </ThemedText>
        </Pressable>

        {/* Price and Rating Row */}
        <View style={styles.priceRatingRow}>
          <ThemedText type="defaultSemiBold" style={styles.price}>
            ${product.price.toFixed(2)}
          </ThemedText>

          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <IconSymbol
                key={star}
                name={star <= Math.round(product.aiRating) ? 'star.fill' : 'star'}
                size={16}
                color={star <= Math.round(product.aiRating) ? '#FFD700' : '#ccc'}
              />
            ))}
            <ThemedText style={styles.ratingText}>
              {product.aiRating.toFixed(1)}
            </ThemedText>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9f9f9',
  },
  videoContainer: {
    width: screenWidth,
    height: 300,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  productName: {
    fontSize: 22,
    marginBottom: 4,
  },
  brandName: {
    fontSize: 14,
    marginBottom: 12,
    color: '#666',
  },
  priceRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 24,
    color: '#007AFF',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  ratingText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
});
