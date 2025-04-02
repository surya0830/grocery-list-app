import React, { useState } from 'react';
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

export const AddAddressScreen: React.FC = () => {
  const { colors } = useTheme();
  const [name, setName] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!name || !street || !city || !state || !zipCode) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);
      // TODO: Implement add address API call
      Alert.alert(
        'Success',
        'Address added successfully',
        [{ text: 'OK', onPress: () => NavigationService.goBack() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to add address. Please try again.');
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
        title="Add Address"
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
            title="Save Address"
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