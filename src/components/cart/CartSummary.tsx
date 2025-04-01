import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../common/Button';
import { CartItem } from '../../types';

interface CartSummaryProps {
  items: CartItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  onCheckout: () => void;
  onViewCart?: () => void;
  isProcessing?: boolean;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  items,
  subtotal,
  tax,
  deliveryFee,
  onCheckout,
  onViewCart,
  isProcessing = false,
}) => {
  const { colors } = useTheme();
  const total = subtotal + tax + deliveryFee;

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={styles.summary}>
        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.text }]}>Subtotal</Text>
          <Text style={[styles.value, { color: colors.text }]}>
            ${subtotal.toFixed(2)}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.text }]}>Tax</Text>
          <Text style={[styles.value, { color: colors.text }]}>
            ${tax.toFixed(2)}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.text }]}>
            Delivery Fee
          </Text>
          <Text style={[styles.value, { color: colors.text }]}>
            ${deliveryFee.toFixed(2)}
          </Text>
        </View>
        <View style={[styles.totalRow, { borderTopColor: colors.border }]}>
          <Text style={[styles.totalLabel, { color: colors.text }]}>Total</Text>
          <Text style={[styles.totalValue, { color: colors.text }]}>
            ${total.toFixed(2)}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        {onViewCart && (
          <Button
            title="View Cart"
            onPress={onViewCart}
            variant="outline"
            style={styles.viewCartButton}
          />
        )}
        <Button
          title={isProcessing ? 'Processing...' : 'Checkout'}
          onPress={onCheckout}
          disabled={isProcessing}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    margin: 16,
  },
  summary: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
  },
  value: {
    fontSize: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewCartButton: {
    marginRight: 16,
  },
}); 