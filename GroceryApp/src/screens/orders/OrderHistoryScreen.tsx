import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Header } from '../../components/navigation/Header';
import { Button } from '../../components/common/Button';
import { Ionicons } from '@expo/vector-icons';

// Mock data - replace with actual order history data
const mockOrders = [
  {
    id: 'ORD123456',
    date: '2024-03-15',
    store: {
      name: 'Fresh Market',
      address: '123 Main St, City, State',
    },
    status: 'delivered',
    total: 45.99,
    items: [
      {
        name: 'Organic Bananas',
        quantity: 2,
        price: 2.99,
      },
      {
        name: 'Whole Milk',
        quantity: 1,
        price: 3.99,
      },
    ],
  },
  {
    id: 'ORD123455',
    date: '2024-03-14',
    store: {
      name: 'Organic Grocers',
      address: '456 Oak Ave, City, State',
    },
    status: 'delivered',
    total: 32.50,
    items: [
      {
        name: 'Fresh Spinach',
        quantity: 1,
        price: 4.99,
      },
      {
        name: 'Greek Yogurt',
        quantity: 2,
        price: 3.99,
      },
    ],
  },
];

type OrderStatus = 'all' | 'delivered' | 'in_progress' | 'cancelled';

export const OrderHistoryScreen: React.FC = () => {
  const { colors, spacing } = useTheme();
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>('all');

  const handleOrderPress = (orderId: string) => {
    // Navigate to order details screen
  };

  const handleReorder = (orderId: string) => {
    // Implement reorder functionality
  };

  const filteredOrders = mockOrders.filter((order) => {
    if (selectedStatus === 'all') return true;
    return order.status === selectedStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return colors.success;
      case 'in_progress':
        return colors.warning;
      case 'cancelled':
        return colors.error;
      default:
        return colors.text;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'checkmark-circle';
      case 'in_progress':
        return 'time';
      case 'cancelled':
        return 'close-circle';
      default:
        return 'help-circle';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Order History"
        showBackButton
        onBackPress={() => {
          // Handle back navigation
        }}
      />

      <ScrollView style={styles.scrollView}>
        <View style={[styles.filterContainer, { backgroundColor: colors.surface }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {['all', 'delivered', 'in_progress', 'cancelled'].map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.filterButton,
                  {
                    backgroundColor:
                      selectedStatus === status ? colors.primary : colors.surface,
                  },
                ]}
                onPress={() => setSelectedStatus(status as OrderStatus)}
              >
                <Text
                  style={[
                    styles.filterText,
                    {
                      color:
                        selectedStatus === status ? colors.white : colors.text,
                    },
                  ]}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {filteredOrders.map((order) => (
          <TouchableOpacity
            key={order.id}
            style={[styles.orderCard, { backgroundColor: colors.surface }]}
            onPress={() => handleOrderPress(order.id)}
          >
            <View style={styles.orderHeader}>
              <View>
                <Text style={[styles.orderNumber, { color: colors.text }]}>
                  Order #{order.id}
                </Text>
                <Text style={[styles.orderDate, { color: colors.textSecondary }]}>
                  {new Date(order.date).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.statusContainer}>
                <Ionicons
                  name={getStatusIcon(order.status)}
                  size={20}
                  color={getStatusColor(order.status)}
                />
                <Text
                  style={[
                    styles.statusText,
                    { color: getStatusColor(order.status) },
                  ]}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Text>
              </View>
            </View>

            <View style={styles.storeInfo}>
              <Ionicons name="storefront" size={20} color={colors.text} />
              <Text style={[styles.storeName, { color: colors.text }]}>
                {order.store.name}
              </Text>
            </View>

            <View style={styles.orderSummary}>
              <Text style={[styles.itemCount, { color: colors.textSecondary }]}>
                {order.items.length} items
              </Text>
              <Text style={[styles.totalAmount, { color: colors.text }]}>
                ${order.total.toFixed(2)}
              </Text>
            </View>

            <Button
              title="Reorder"
              onPress={() => handleReorder(order.id)}
              variant="outline"
              style={styles.reorderButton}
            />
          </TouchableOpacity>
        ))}
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
  filterContainer: {
    padding: 16,
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  orderCard: {
    padding: 16,
    margin: 16,
    borderRadius: 8,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
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
  storeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  storeName: {
    marginLeft: 8,
    fontSize: 16,
  },
  orderSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemCount: {
    fontSize: 14,
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  reorderButton: {
    marginTop: 8,
  },
}); 