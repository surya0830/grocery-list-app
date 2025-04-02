import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
  style?: ViewStyle;
  quantity?: number;
  onQuantityChange?: (quantity: number) => void;
  readOnly?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  style,
  quantity = 0,
  onQuantityChange,
  readOnly = false,
}) => {
  const { colors, spacing } = useTheme();

  const handleQuantityChange = (newQuantity: number) => {
    if (!readOnly && onQuantityChange) {
      onQuantityChange(newQuantity);
    }
  };

  const containerStyle: ViewStyle = {
    ...styles.container,
    ...style,
  };

  return (
    <Card style={containerStyle}>
      <TouchableOpacity
        style={styles.content}
        onPress={onPress}
        disabled={!onPress}
      >
        <Image
          source={{ uri: product.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.details}>
          <Text style={[styles.name, { color: colors.text }]}>
            {product.name}
          </Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {product.description}
          </Text>
          <Text style={[styles.price, { color: colors.primary }]}>
            ${product.price.toFixed(2)} / {product.unit}
          </Text>
        </View>
      </TouchableOpacity>

      {!readOnly && (
        <View style={styles.actions}>
          {quantity > 0 ? (
            <View style={styles.quantityControls}>
              <Button
                title="-"
                onPress={() => handleQuantityChange(quantity - 1)}
                variant="outline"
                style={styles.quantityButton}
              />
              <Text style={[styles.quantity, { color: colors.text }]}>
                {quantity}
              </Text>
              <Button
                title="+"
                onPress={() => handleQuantityChange(quantity + 1)}
                variant="outline"
                style={styles.quantityButton}
              />
            </View>
          ) : (
            <Button
              title="Add to Cart"
              onPress={() => handleQuantityChange(1)}
            />
          )}
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 8,
  },
  content: {
    flexDirection: 'row',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  details: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    marginTop: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
  actions: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 40,
    height: 40,
    padding: 0,
    marginHorizontal: 8,
  },
  quantity: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 8,
  },
}); 