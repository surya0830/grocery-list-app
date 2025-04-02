import React from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Header } from '../../components/common/Header';
import { Button } from '../../components/common/Button';
import { Ionicons } from '@expo/vector-icons';
import { Order } from '../../types';

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

export const OrderConfirmationScreen: React.FC = () => {
  const { colors } = useTheme();

  const handleTrackOrder = () => {
    // Navigate to order tracking screen
  };

  const handleViewOrderHistory = () => {
    // Navigate to order history screen
  };

  const handleContinueShopping = () => {
    // Navigate to store screen
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Order Confirmed"
        showBackButton
        onBackPress={() => {
          // Handle back navigation
        }}
      />

      <ScrollView style={styles.scrollView}>
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Ionicons
            name="checkmark-circle"
            size={64}
            color={colors.success}
            style={styles.icon}
          />
          <Text style={[styles.title, { color: colors.text }]}>
            Order Placed Successfully!
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Thank you for your order. We'll notify you when it's ready for pickup.
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Order Details
          </Text>
          <Text style={[styles.orderNumber, { color: colors.text }]}>
            Order #{mockOrder.id}
          </Text>
          <Text style={[styles.orderDate, { color: colors.textSecondary }]}>
            {new Date(mockOrder.date).toLocaleString()}
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Order Summary
          </Text>
          {mockOrder.items.map((item) => (
            <View key={item.id} style={styles.orderItem}>
              <Text style={[styles.itemName, { color: colors.text }]}>
                {item.name}
              </Text>
              <Text style={[styles.itemQuantity, { color: colors.textSecondary }]}>
                {item.quantity} x ${item.price.toFixed(2)}
              </Text>
            </View>
          ))}
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: colors.text }]}>
              Total
            </Text>
            <Text style={[styles.totalValue, { color: colors.text }]}>
              ${mockOrder.total.toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Button
            title="Track Order"
            onPress={handleTrackOrder}
            style={styles.button}
          />
          <Button
            title="View Order History"
            onPress={handleViewOrderHistory}
            variant="outline"
            style={styles.button}
          />
          <Button
            title="Continue Shopping"
            onPress={handleContinueShopping}
            variant="outline"
            style={styles.button}
          />
        </View>
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
  icon: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  orderNumber: {
    fontSize: 16,
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 16,
  },
  itemQuantity: {
    fontSize: 16,
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  actions: {
    padding: 16,
  },
  button: {
    marginBottom: 12,
  },
}); 