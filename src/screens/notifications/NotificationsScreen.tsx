import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Switch,
  Alert,
  ScrollView,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Header } from '../../components/common/Header';
import { Button } from '../../components/common/Button';
import { NavigationService } from '../../navigation/NavigationService';
import { apiClient } from '../../api/client';

interface NotificationPreferences {
  orderUpdates: boolean;
  deliveryUpdates: boolean;
  promotions: boolean;
  newsletters: boolean;
  pushNotifications: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
}

export const NotificationsScreen: React.FC = () => {
  const { colors } = useTheme();
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    orderUpdates: true,
    deliveryUpdates: true,
    promotions: true,
    newsletters: false,
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      setIsLoading(true);
      // TODO: Implement get notification preferences API call
      // For now, using mock data
    } catch (error) {
      Alert.alert('Error', 'Failed to load notification preferences. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (key: keyof NotificationPreferences) => {
    try {
      setIsLoading(true);
      // TODO: Implement update notification preference API call
      setPreferences((prev) => ({
        ...prev,
        [key]: !prev[key],
      }));
    } catch (error) {
      Alert.alert('Error', 'Failed to update notification preference. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderNotificationItem = (
    title: string,
    description: string,
    key: keyof NotificationPreferences
  ) => (
    <View style={styles.notificationItem}>
      <View style={styles.notificationInfo}>
        <Text style={[styles.notificationTitle, { color: colors.text }]}>
          {title}
        </Text>
        <Text style={[styles.notificationDescription, { color: colors.textSecondary }]}>
          {description}
        </Text>
      </View>
      <Switch
        value={preferences[key]}
        onValueChange={() => handleToggle(key)}
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor={colors.surface}
      />
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Notifications"
        showBackButton
        onBackPress={() => NavigationService.goBack()}
      />

      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Order Notifications
          </Text>
          {renderNotificationItem(
            'Order Updates',
            'Get notified about your order status changes',
            'orderUpdates'
          )}
          {renderNotificationItem(
            'Delivery Updates',
            'Receive updates about your delivery status',
            'deliveryUpdates'
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Marketing Notifications
          </Text>
          {renderNotificationItem(
            'Promotions',
            'Get notified about special offers and discounts',
            'promotions'
          )}
          {renderNotificationItem(
            'Newsletters',
            'Receive our weekly newsletter with updates',
            'newsletters'
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Notification Channels
          </Text>
          {renderNotificationItem(
            'Push Notifications',
            'Receive notifications on your device',
            'pushNotifications'
          )}
          {renderNotificationItem(
            'Email Notifications',
            'Get notifications via email',
            'emailNotifications'
          )}
          {renderNotificationItem(
            'SMS Notifications',
            'Receive notifications via text message',
            'smsNotifications'
          )}
        </View>
      </ScrollView>

      <Button
        title="Save Changes"
        onPress={loadPreferences}
        loading={isLoading}
        style={styles.saveButton}
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
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  notificationInfo: {
    flex: 1,
    marginRight: 16,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  notificationDescription: {
    fontSize: 14,
  },
  saveButton: {
    margin: 16,
  },
}); 