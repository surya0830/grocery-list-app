import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text, RefreshControl } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Header } from '../../components/common/Header';
import { ProductCard } from '../../components/product/ProductCard';
import { CartSummary } from '../../components/cart/CartSummary';
import { Order, CartItem } from '../../types';

const mockOrder: Order = {
  id: '1',
  date: '2024-03-20T10:00:00Z',
  store: {
    id: '1',
    name: 'Fresh Grocery Store',
    address: '123 Main St, City, State',
    rating: 4.5,
    deliveryTime: '30-45 min',
    minimumOrder: 10,
  },
  deliveryAddress: '456 Delivery St, City, State 12345',
  status: 'pending',
  items: [
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
  ],
  subtotal: 16.44,
  tax: 1.32,
  deliveryFee: 2.99,
  total: 20.75,
  paymentMethod: '•••• 4242',
};

export const CheckoutScreen: React.FC = () => {
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    // Implement order placement logic
    setTimeout(() => {
      setIsProcessing(false);
    }, 2000);
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Implement refresh logic
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Checkout"
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
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Delivery Address
          </Text>
          <Text style={[styles.address, { color: colors.text }]}>
            {mockOrder.deliveryAddress}
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Payment Method
          </Text>
          <Text style={[styles.paymentMethod, { color: colors.text }]}>
            {mockOrder.paymentMethod}
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Order Items
          </Text>
          {mockOrder.items.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              quantity={item.quantity}
              readOnly={true}
            />
          ))}
        </View>

        <CartSummary
          items={mockOrder.items}
          subtotal={mockOrder.subtotal}
          tax={mockOrder.tax}
          deliveryFee={mockOrder.deliveryFee}
          onCheckout={handlePlaceOrder}
          isProcessing={isProcessing}
        />
      </ScrollView>
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
  section: {
    padding: 16,
    margin: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  address: {
    fontSize: 16,
    marginTop: 8,
  },
  paymentMethod: {
    fontSize: 16,
    marginTop: 8,
  },
}); 