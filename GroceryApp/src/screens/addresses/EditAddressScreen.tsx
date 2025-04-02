import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Text,
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

interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

export const EditAddressScreen: React.FC = () => {
  const { colors } = useTheme();
  const [address, setAddress] = useState<Address | null>(null);
  const [name, setName] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadAddress();
  }, []);

  const loadAddress = async () => {
    try {
      setIsLoading(true);
      // TODO: Implement get address API call
      // For now, using mock data
      const mockAddress: Address = {
        id: '1',
        name: 'Home',
        street: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94105',
        isDefault: true,
      };
      setAddress(mockAddress);
      setName(mockAddress.name);
      setStreet(mockAddress.street);
      setCity(mockAddress.city);
      setState(mockAddress.state);
      setZipCode(mockAddress.zipCode);
      setIsDefault(mockAddress.isDefault);
    } catch (error) {
      Alert.alert('Error', 'Failed to load address. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!name || !street || !city || !state || !zipCode) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);
      // TODO: Implement update address API call
      Alert.alert(
        'Success',
        'Address updated successfully',
        [{ text: 'OK', onPress: () => NavigationService.goBack() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update address. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
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
              // TODO: Implement delete address API call
              Alert.alert(
                'Success',
                'Address deleted successfully',
                [{ text: 'OK', onPress: () => NavigationService.goBack() }]
              );
            } catch (error) {
              Alert.alert('Error', 'Failed to delete address. Please try again.');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  if (isLoading && !address) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header
          title="Edit Address"
          showBackButton
          onBackPress={() => NavigationService.goBack()}
        />
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Loading address...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Header
        title="Edit Address"
        showBackButton
        onBackPress={() => NavigationService.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.form}>
          <Text style={[styles.label, { color: colors.text }]}>Address Name</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
            placeholder="e.g., Home, Work"
            placeholderTextColor={colors.textSecondary}
            value={name}
            onChangeText={setName}
          />

          <Text style={[styles.label, { color: colors.text }]}>Street Address</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
            placeholder="Enter street address"
            placeholderTextColor={colors.textSecondary}
            value={street}
            onChangeText={setStreet}
          />

          <View style={styles.row}>
            <View style={[styles.column, { flex: 2 }]}>
              <Text style={[styles.label, { color: colors.text }]}>City</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
                placeholder="Enter city"
                placeholderTextColor={colors.textSecondary}
                value={city}
                onChangeText={setCity}
              />
            </View>
            <View style={[styles.column, { flex: 1 }]}>
              <Text style={[styles.label, { color: colors.text }]}>State</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
                placeholder="State"
                placeholderTextColor={colors.textSecondary}
                value={state}
                onChangeText={setState}
                maxLength={2}
              />
            </View>
          </View>

          <Text style={[styles.label, { color: colors.text }]}>ZIP Code</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
            placeholder="Enter ZIP code"
            placeholderTextColor={colors.textSecondary}
            value={zipCode}
            onChangeText={setZipCode}
            keyboardType="numeric"
            maxLength={5}
          />

          <View style={styles.defaultContainer}>
            <Text style={[styles.defaultLabel, { color: colors.text }]}>
              Set as default address
            </Text>
            <Switch
              value={isDefault}
              onValueChange={setIsDefault}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.surface}
            />
          </View>

          <Button
            title="Save Changes"
            onPress={handleSave}
            loading={isLoading}
            style={styles.saveButton}
          />

          <Button
            title="Delete Address"
            onPress={handleDelete}
            loading={isLoading}
            style={styles.deleteButton}
            variant="secondary"
            textStyle={{ color: colors.error }}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
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
  deleteButton: {
    marginTop: 16,
  },
}); 