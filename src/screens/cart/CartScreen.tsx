import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Header } from '../../components/common/Header';
import { ProductCard } from '../../components/product/ProductCard';
import { CartSummary } from '../../components/cart/CartSummary';
import { CartItem } from '../../types';

// Mock data - replace with actual cart state management
const mockCartItems: CartItem[] = [
  {
    id: '1',
    name: 'Organic Bananas',
    price: 2.99,
    unit: 'lb',
    imageUrl: 'https://example.com/bananas.jpg',
    category: 'Fruits',
    description: 'Fresh organic bananas',
    inStock: true,
    quantity: 2,
  },
  {
    id: '2',
    name: 'Whole Milk',
    price: 3.99,
    unit: 'gallon',
    imageUrl: 'https://example.com/milk.jpg',
    category: 'Dairy',
    description: 'Fresh whole milk',
    inStock: true,
    quantity: 1,
  },
  {
    id: '3',
    name: 'Bread',
    price: 2.49,
    unit: 'loaf',
    imageUrl: 'https://example.com/bread.jpg',
    category: 'Bakery',
    description: 'Fresh baked bread',
    inStock: true,
    quantity: 2,
  },
];

export const CartScreen: React.FC = () => {
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>(mockCartItems);

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
    } else {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  const handleCheckout = () => {
    // Implement checkout logic
  };

  const handleViewCart = () => {
    // Already in cart screen
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Implement refresh logic
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.08; // 8% tax
  const deliveryFee = 2.99;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Shopping Cart"
        showBackButton
        onBackPress={() => {
          // Handle back navigation
        }}
      />

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {cartItems.map((item) => (
          <ProductCard
            key={item.id}
            product={item}
            quantity={item.quantity}
            onQuantityChange={(newQuantity) => handleUpdateQuantity(item.id, newQuantity)}
            readOnly={false}
          />
        ))}
      </ScrollView>

      {cartItems.length > 0 && (
        <CartSummary
          items={cartItems}
          subtotal={subtotal}
          tax={tax}
          deliveryFee={deliveryFee}
          onCheckout={handleCheckout}
          onViewCart={handleViewCart}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
}); 