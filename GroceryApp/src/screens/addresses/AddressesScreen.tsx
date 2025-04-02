import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Header } from '../../components/common/Header';
import { Button } from '../../components/common/Button';
import { NavigationService } from '../../navigation/NavigationService';
import { Ionicons } from '@expo/vector-icons';
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

export const AddressesScreen: React.FC = () => {
  const { colors } = useTheme();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      // TODO: Implement get addresses API call
      setAddresses([
        {
          id: '1',
          name: 'Home',
          street: '123 Main St',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94105',
          isDefault: true,
        },
        {
          id: '2',
          name: 'Work',
          street: '456 Market St',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94103',
          isDefault: false,
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to load addresses');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
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
              // TODO: Implement delete address API call
              setAddresses(addresses.filter(addr => addr.id !== addressId));
              Alert.alert('Success', 'Address deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete address');
            }
          },
        },
      ]
    );
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      // TODO: Implement set default address API call
      setAddresses(addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === addressId,
      })));
      Alert.alert('Success', 'Default address updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update default address');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Addresses"
        showBackButton
        onBackPress={() => NavigationService.goBack()}
      />

      <ScrollView style={styles.scrollView}>
        {addresses.map((address) => (
          <View
            key={address.id}
            style={[
              styles.addressCard,
              { backgroundColor: colors.surface },
            ]}
          >
            <View style={styles.addressHeader}>
              <View style={styles.addressTitleContainer}>
                <Text style={[styles.addressName, { color: colors.text }]}>
                  {address.name}
                </Text>
                {address.isDefault && (
                  <View style={[styles.defaultBadge, { backgroundColor: colors.primary }]}>
                    <Text style={styles.defaultText}>Default</Text>
                  </View>
                )}
              </View>
              <View style={styles.addressActions}>
                <TouchableOpacity
                  onPress={() => handleSetDefault(address.id)}
                  style={styles.actionButton}
                >
                  <Ionicons
                    name={address.isDefault ? 'star' : 'star-outline'}
                    size={24}
                    color={address.isDefault ? colors.primary : colors.textSecondary}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => NavigationService.navigate('EditAddress', { addressId: address.id })}
                  style={styles.actionButton}
                >
                  <Ionicons
                    name="pencil-outline"
                    size={24}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDeleteAddress(address.id)}
                  style={styles.actionButton}
                >
                  <Ionicons
                    name="trash-outline"
                    size={24}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={[styles.addressText, { color: colors.text }]}>
              {address.street}
            </Text>
            <Text style={[styles.addressText, { color: colors.text }]}>
              {address.city}, {address.state} {address.zipCode}
            </Text>
          </View>
        ))}
      </ScrollView>

      <Button
        title="Add New Address"
        onPress={() => NavigationService.navigate('AddAddress')}
        style={styles.addButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  addressCard: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  defaultBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  addressActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 4,
    marginLeft: 8,
  },
  addressText: {
    fontSize: 16,
    marginBottom: 4,
  },
  addButton: {
    margin: 16,
  },
}); 