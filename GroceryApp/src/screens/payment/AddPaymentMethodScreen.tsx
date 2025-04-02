import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Header } from '../../components/common/Header';
import { Button } from '../../components/common/Button';
import { NavigationService } from '../../navigation/NavigationService';
import { apiClient } from '../../api/client';

export const AddPaymentMethodScreen: React.FC = () => {
  const { colors } = useTheme();
  const [cardNumber, setCardNumber] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleaned;
  };

  const handleCardNumberChange = (text: string) => {
    const formatted = formatCardNumber(text);
    setCardNumber(formatted);
  };

  const handleExpiryMonthChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length <= 2) {
      setExpiryMonth(cleaned);
    }
  };

  const handleExpiryYearChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length <= 4) {
      setExpiryYear(cleaned);
    }
  };

  const handleCvvChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length <= 4) {
      setCvv(cleaned);
    }
  };

  const validateForm = () => {
    if (!cardNumber.replace(/\s/g, '')) {
      Alert.alert('Error', 'Please enter card number');
      return false;
    }
    if (!expiryMonth || !expiryYear) {
      Alert.alert('Error', 'Please enter expiry date');
      return false;
    }
    if (!cvv) {
      Alert.alert('Error', 'Please enter CVV');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      // TODO: Implement add payment method API call
      Alert.alert(
        'Success',
        'Payment method added successfully',
        [{ text: 'OK', onPress: () => NavigationService.goBack() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to add payment method. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Header
        title="Add Payment Method"
        showBackButton
        onBackPress={() => NavigationService.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.form}>
          <Text style={[styles.label, { color: colors.text }]}>Card Number</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
            placeholder="1234 5678 9012 3456"
            placeholderTextColor={colors.textSecondary}
            value={cardNumber}
            onChangeText={handleCardNumberChange}
            keyboardType="numeric"
            maxLength={19}
          />

          <View style={styles.row}>
            <View style={[styles.column, { flex: 1 }]}>
              <Text style={[styles.label, { color: colors.text }]}>Expiry Date</Text>
              <View style={styles.expiryContainer}>
                <TextInput
                  style={[
                    styles.expiryInput,
                    { backgroundColor: colors.surface, color: colors.text },
                  ]}
                  placeholder="MM"
                  placeholderTextColor={colors.textSecondary}
                  value={expiryMonth}
                  onChangeText={handleExpiryMonthChange}
                  keyboardType="numeric"
                  maxLength={2}
                />
                <Text style={[styles.expirySeparator, { color: colors.text }]}>/</Text>
                <TextInput
                  style={[
                    styles.expiryInput,
                    { backgroundColor: colors.surface, color: colors.text },
                  ]}
                  placeholder="YYYY"
                  placeholderTextColor={colors.textSecondary}
                  value={expiryYear}
                  onChangeText={handleExpiryYearChange}
                  keyboardType="numeric"
                  maxLength={4}
                />
              </View>
            </View>
            <View style={[styles.column, { flex: 1 }]}>
              <Text style={[styles.label, { color: colors.text }]}>CVV</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
                placeholder="123"
                placeholderTextColor={colors.textSecondary}
                value={cvv}
                onChangeText={handleCvvChange}
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry
              />
            </View>
          </View>

          <View style={styles.defaultContainer}>
            <Text style={[styles.defaultLabel, { color: colors.text }]}>
              Set as default payment method
            </Text>
            <Switch
              value={isDefault}
              onValueChange={setIsDefault}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.surface}
            />
          </View>

          <Button
            title="Add Payment Method"
            onPress={handleSave}
            loading={isLoading}
            style={styles.saveButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  form: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    marginHorizontal: -8,
  },
  column: {
    flex: 1,
    marginHorizontal: 8,
  },
  expiryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expiryInput: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  expirySeparator: {
    fontSize: 16,
    marginHorizontal: 8,
  },
  defaultContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  defaultLabel: {
    fontSize: 16,
  },
  saveButton: {
    marginTop: 8,
  },
}); 