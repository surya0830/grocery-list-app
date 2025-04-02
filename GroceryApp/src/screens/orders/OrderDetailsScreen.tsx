import React from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Header } from '../../components/navigation/Header';
import { Button } from '../../components/common/Button';
import { Ionicons } from '@expo/vector-icons';

// Mock data - replace with actual order data
const mockOrder = {
  id: 'ORD123456',
  date: '2024-03-15',
  store: {
    name: 'Fresh Market',
    address: '123 Main St, City, State',
    phone: '(555) 123-4567',
  },
  deliveryAddress: {
    street: '789 Pine St',
    city: 'City',
    state: 'State',
    zipCode: '12345',
  },
  status: 'delivered',
  deliveryTime: '11:30 AM',
  items: [
    {
      id: '1',
      name: 'Organic Bananas',
      price: 2.99,
      unit: 'lb',
      quantity: 2,
      imageUrl: 'https://example.com/bananas.jpg',
      category: 'Fruits',
      description: 'Fresh organic bananas',
    },
    {
      id: '2',
      name: 'Whole Milk',
      price: 3.99,
      unit: 'gallon',
      quantity: 1,
      imageUrl: 'https://example.com/milk.jpg',
      category: 'Dairy',
      description: 'Farm fresh whole milk',
    },
  ],
  subtotal: 9.97,
  tax: 0.80,
  deliveryFee: 2.99,
  total: 13.76,
  paymentMethod: {
    type: 'credit_card',
    last4: '4242',
  },
  shopper: {
    name: 'John D.',
    rating: 4.8,
    photoUrl: 'https://example.com/shopper.jpg',
  },
};

export const OrderDetailsScreen: React.FC = () => {
  const { colors, spacing } = useTheme();

  const handleReorder = () => {
    // Implement reorder functionality
  };

  const handleContactStore = () => {
    // Implement store contact functionality
  };

  const handleRateOrder = () => {
    // Navigate to rating screen
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Order Details"
        showBackButton
        onBackPress={() => {
          // Handle back navigation
        }}
      />

      <ScrollView style={styles.scrollView}>
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.orderNumber, { color: colors.text }]}>
            Order #{mockOrder.id}
          </Text>
          <Text style={[styles.orderDate, { color: colors.textSecondary }]}>
            {new Date(mockOrder.date).toLocaleDateString()}
          </Text>
          <View style={styles.statusContainer}>
            <Ionicons
              name="checkmark-circle"
              size={20}
              color={colors.success}
            />
            <Text style={[styles.statusText, { color: colors.success }]}>
              Delivered at {mockOrder.deliveryTime}
            </Text>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Store Information
          </Text>
          <View style={styles.storeInfo}>
            <Ionicons name="storefront" size={20} color={colors.text} />
            <View style={styles.storeDetails}>
              <Text style={[styles.storeName, { color: colors.text }]}>
                {mockOrder.store.name}
              </Text>
              <Text style={[styles.storeAddress, { color: colors.textSecondary }]}>
                {mockOrder.store.address}
              </Text>
            </View>
          </View>
          <Button
            title="Contact Store"
            onPress={handleContactStore}
            variant="outline"
            style={styles.contactButton}
          />
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Delivery Address
          </Text>
          <View style={styles.addressContainer}>
            <Ionicons name="location" size={20} color={colors.text} />
            <Text style={[styles.addressText, { color: colors.text }]}>
              {mockOrder.deliveryAddress.street}
            </Text>
          </View>
          <Text style={[styles.addressText, { color: colors.text }]}>
            {mockOrder.deliveryAddress.city}, {mockOrder.deliveryAddress.state}{' '}
            {mockOrder.deliveryAddress.zipCode}
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Order Items
          </Text>
          {mockOrder.items.map((item) => (
            <View key={item.id} style={styles.itemContainer}>
              <View style={styles.itemInfo}>
                <Text style={[styles.itemName, { color: colors.text }]}>
                  {item.name}
                </Text>
                <Text style={[styles.itemDescription, { color: colors.textSecondary }]}>
                  {item.description}
                </Text>
              </View>
              <View style={styles.itemQuantity}>
                <Text style={[styles.quantity, { color: colors.text }]}>
                  {item.quantity}x
                </Text>
                <Text style={[styles.price, { color: colors.text }]}>
                  ${(item.price * item.quantity).toFixed(2)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Payment Information
          </Text>
          <View style={styles.paymentInfo}>
            <Ionicons name="card" size={20} color={colors.text} />
            <Text style={[styles.paymentText, { color: colors.text }]}>
              •••• {mockOrder.paymentMethod.last4}
            </Text>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Order Summary
          </Text>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.text }]}>
              Subtotal
            </Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              ${mockOrder.subtotal.toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.text }]}>
              Tax
            </Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              ${mockOrder.tax.toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.text }]}>
              Delivery Fee
            </Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              ${mockOrder.deliveryFee.toFixed(2)}
            </Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={[styles.summaryLabel, styles.totalLabel, { color: colors.text }]}>
              Total
            </Text>
            <Text style={[styles.summaryValue, styles.totalValue, { color: colors.text }]}>
              ${mockOrder.total.toFixed(2)}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.buttonContainer, { backgroundColor: colors.surface }]}>
        <Button
          title="Reorder"
          onPress={handleReorder}
          style={styles.button}
        />
        <Button
          title="Rate Order"
          onPress={handleRateOrder}
          variant="outline"
          style={styles.button}
        />
      </View>
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
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  storeInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  storeDetails: {
    marginLeft: 8,
    flex: 1,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  storeAddress: {
    fontSize: 14,
  },
  contactButton: {
    marginTop: 8,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  addressText: {
    marginLeft: 8,
    fontSize: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
  },
  itemQuantity: {
    alignItems: 'flex-end',
  },
  quantity: {
    fontSize: 14,
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: '500',
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentText: {
    marginLeft: 8,
    fontSize: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  totalRow: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  button: {
    marginBottom: 12,
  },
}); 