import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Alert,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Header } from '../../components/common/Header';
import { Button } from '../../components/common/Button';
import { NavigationService } from '../../navigation/NavigationService';
import { apiClient } from '../../api/client';

interface PaymentMethod {
  id: string;
  type: 'credit' | 'debit';
  last4: string;
  brand: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault: boolean;
}

export const PaymentMethodsScreen: React.FC = () => {
  const { colors } = useTheme();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      setIsLoading(true);
      // TODO: Implement get payment methods API call
      // For now, using mock data
      const mockPaymentMethods: PaymentMethod[] = [
        {
          id: '1',
          type: 'credit',
          last4: '4242',
          brand: 'Visa',
          expiryMonth: '12',
          expiryYear: '2025',
          isDefault: true,
        },
        {
          id: '2',
          type: 'debit',
          last4: '8888',
          brand: 'Mastercard',
          expiryMonth: '08',
          expiryYear: '2024',
          isDefault: false,
        },
      ];
      setPaymentMethods(mockPaymentMethods);
    } catch (error) {
      Alert.alert('Error', 'Failed to load payment methods. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      setIsLoading(true);
      // TODO: Implement set default payment method API call
      setPaymentMethods(
        paymentMethods.map((method) => ({
          ...method,
          isDefault: method.id === id,
        }))
      );
      Alert.alert('Success', 'Default payment method updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update default payment method. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    Alert.alert(
      'Delete Payment Method',
      'Are you sure you want to delete this payment method?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoading(true);
              // TODO: Implement delete payment method API call
              setPaymentMethods(paymentMethods.filter((method) => method.id !== id));
              Alert.alert('Success', 'Payment method deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete payment method. Please try again.');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const renderPaymentMethod = ({ item }: { item: PaymentMethod }) => (
    <View style={[styles.paymentMethodCard, { backgroundColor: colors.surface }]}>
      <View style={styles.cardHeader}>
        <View style={styles.cardInfo}>
          <Image
            source={
              item.brand === 'Visa'
                ? require('../../assets/images/visa.png')
                : require('../../assets/images/mastercard.png')
            }
            style={styles.cardLogo}
          />
          <Text style={[styles.cardType, { color: colors.text }]}>
            {item.type.charAt(0).toUpperCase() + item.type.slice(1)} Card
          </Text>
        </View>
        {item.isDefault && (
          <View style={[styles.defaultBadge, { backgroundColor: colors.primary }]}>
            <Text style={styles.defaultText}>Default</Text>
          </View>
        )}
      </View>

      <Text style={[styles.cardNumber, { color: colors.text }]}>
        •••• •••• •••• {item.last4}
      </Text>
      <Text style={[styles.cardExpiry, { color: colors.textSecondary }]}>
        Expires {item.expiryMonth}/{item.expiryYear}
      </Text>

      <View style={styles.cardActions}>
        {!item.isDefault && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleSetDefault(item.id)}
          >
            <Text style={[styles.actionText, { color: colors.primary }]}>
              Set as Default
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDelete(item.id)}
        >
          <Text style={[styles.actionText, { color: colors.error }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Payment Methods"
        showBackButton
        onBackPress={() => NavigationService.goBack()}
      />

      <FlatList
        data={paymentMethods}
        renderItem={renderPaymentMethod}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshing={isLoading}
        onRefresh={loadPaymentMethods}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No payment methods added yet
            </Text>
          </View>
        }
      />

      <Button
        title="Add Payment Method"
        onPress={() => NavigationService.navigate('AddPaymentMethod')}
        style={styles.addButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  paymentMethodCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardLogo: {
    width: 40,
    height: 25,
    marginRight: 8,
  },
  cardType: {
    fontSize: 16,
    fontWeight: '600',
  },
  defaultBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  cardNumber: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardExpiry: {
    fontSize: 14,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingTop: 16,
  },
  actionButton: {
    marginLeft: 16,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
  },
  addButton: {
    margin: 16,
  },
}); 