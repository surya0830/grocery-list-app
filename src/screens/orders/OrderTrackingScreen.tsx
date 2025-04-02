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
  status: 'processing',
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
  shopper: {
    name: 'John Doe',
    phone: '(555) 123-4567',
    rating: 4.8,
  },
};

const steps = [
  { id: 'confirmed', label: 'Order Confirmed' },
  { id: 'processing', label: 'Processing' },
  { id: 'shopping', label: 'Shopping' },
  { id: 'ready', label: 'Ready for Pickup' },
];

export const OrderTrackingScreen: React.FC = () => {
  const { colors } = useTheme();

  const handleContactShopper = () => {
    // Implement contact shopper functionality
  };

  const handleViewReceipt = () => {
    // Implement view receipt functionality
  };

  const getCurrentStepIndex = () => {
    switch (mockOrder.status) {
      case 'pending':
        return 0;
      case 'processing':
        return 1;
      case 'delivering':
        return 2;
      case 'delivered':
        return 3;
      default:
        return 0;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Track Order"
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
            {new Date(mockOrder.date).toLocaleString()}
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Shopper Information
          </Text>
          <View style={styles.shopperInfo}>
            <Text style={[styles.shopperName, { color: colors.text }]}>
              {mockOrder.shopper?.name}
            </Text>
            <Text style={[styles.shopperPhone, { color: colors.textSecondary }]}>
              {mockOrder.shopper?.phone}
            </Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color={colors.warning} />
              <Text style={[styles.rating, { color: colors.text }]}>
                {mockOrder.shopper?.rating}
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Order Status
          </Text>
          {steps.map((step, index) => {
            const isCompleted = index < getCurrentStepIndex();
            const isCurrent = index === getCurrentStepIndex();

            return (
              <View key={step.id} style={styles.stepContainer}>
                <View style={styles.stepIconContainer}>
                  <View
                    style={[
                      styles.stepIcon,
                      {
                        backgroundColor: isCompleted
                          ? colors.success
                          : isCurrent
                          ? colors.primary
                          : colors.border,
                      },
                    ]}
                  >
                    {isCompleted ? (
                      <Ionicons name="checkmark" size={16} color={colors.surface} />
                    ) : (
                      <Text
                        style={[
                          styles.stepNumber,
                          { color: isCurrent ? colors.surface : colors.text },
                        ]}
                      >
                        {index + 1}
                      </Text>
                    )}
                  </View>
                  {index < steps.length - 1 && (
                    <View
                      style={[
                        styles.stepLine,
                        {
                          backgroundColor: isCompleted
                            ? colors.success
                            : colors.border,
                        },
                      ]}
                    />
                  )}
                </View>
                <View style={styles.stepLabelContainer}>
                  <Text
                    style={[
                      styles.stepLabel,
                      {
                        color: isCurrent ? colors.primary : colors.text,
                        fontWeight: isCurrent ? 'bold' : 'normal',
                      },
                    ]}
                  >
                    {step.label}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.actions}>
          <Button
            title="Contact Shopper"
            onPress={handleContactShopper}
            style={styles.button}
          />
          <Button
            title="View Receipt"
            onPress={handleViewReceipt}
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
  orderNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  shopperInfo: {
    marginBottom: 8,
  },
  shopperName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  shopperPhone: {
    fontSize: 14,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    marginLeft: 4,
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  stepIconContainer: {
    alignItems: 'center',
    marginRight: 16,
  },
  stepIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  stepLine: {
    width: 2,
    height: 40,
    marginTop: -8,
  },
  stepLabelContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  stepLabel: {
    fontSize: 16,
  },
  actions: {
    padding: 16,
  },
  button: {
    marginBottom: 12,
  },
}); 