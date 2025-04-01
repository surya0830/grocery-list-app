import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Header } from '../../components/common/Header';
import { NavigationService } from '../../navigation/NavigationService';
import { Ionicons } from '@expo/vector-icons';

type SettingItemType = 'switch' | 'button' | 'text';

interface BaseSettingItem {
  icon: string;
  title: string;
  type: SettingItemType;
}

interface SwitchSettingItem extends BaseSettingItem {
  type: 'switch';
  value: boolean;
  onValueChange: (value: boolean) => void;
}

interface ButtonSettingItem extends BaseSettingItem {
  type: 'button';
  onPress: () => void;
}

interface TextSettingItem extends BaseSettingItem {
  type: 'text';
  value: string;
}

type SettingItem = SwitchSettingItem | ButtonSettingItem | TextSettingItem;

interface SettingSection {
  title: string;
  items: SettingItem[];
}

export const SettingsScreen: React.FC = () => {
  const { colors } = useTheme();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [locationServices, setLocationServices] = useState(true);

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'Are you sure you want to clear the app cache?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          onPress: () => {
            // TODO: Implement cache clearing
            Alert.alert('Success', 'Cache cleared successfully');
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement account deletion
            NavigationService.reset('Login');
          },
        },
      ]
    );
  };

  const settingsSections: SettingSection[] = [
    {
      title: 'Appearance',
      items: [
        {
          icon: 'moon-outline',
          title: 'Dark Mode',
          type: 'switch',
          value: darkMode,
          onValueChange: setDarkMode,
        },
      ],
    },
    {
      title: 'Notifications',
      items: [
        {
          icon: 'notifications-outline',
          title: 'Push Notifications',
          type: 'switch',
          value: notifications,
          onValueChange: setNotifications,
        },
        {
          icon: 'mail-outline',
          title: 'Email Notifications',
          type: 'switch',
          value: emailNotifications,
          onValueChange: setEmailNotifications,
        },
      ],
    },
    {
      title: 'Location',
      items: [
        {
          icon: 'location-outline',
          title: 'Location Services',
          type: 'switch',
          value: locationServices,
          onValueChange: setLocationServices,
        },
      ],
    },
    {
      title: 'Storage',
      items: [
        {
          icon: 'trash-outline',
          title: 'Clear Cache',
          type: 'button',
          onPress: handleClearCache,
        },
      ],
    },
    {
      title: 'Account',
      items: [
        {
          icon: 'lock-closed-outline',
          title: 'Change Password',
          type: 'button',
          onPress: () => {
            NavigationService.navigate('ChangePassword');
          },
        },
        {
          icon: 'trash-outline',
          title: 'Delete Account',
          type: 'button',
          onPress: handleDeleteAccount,
        },
      ],
    },
    {
      title: 'About',
      items: [
        {
          icon: 'information-circle-outline',
          title: 'App Version',
          type: 'text',
          value: '1.0.0',
        },
        {
          icon: 'document-text-outline',
          title: 'Terms of Service',
          type: 'button',
          onPress: () => {
            NavigationService.navigate('TermsOfService');
          },
        },
        {
          icon: 'shield-outline',
          title: 'Privacy Policy',
          type: 'button',
          onPress: () => {
            NavigationService.navigate('PrivacyPolicy');
          },
        },
      ],
    },
  ];

  const renderSettingItem = (item: SettingItem) => {
    switch (item.type) {
      case 'switch':
        return (
          <Switch
            value={item.value}
            onValueChange={item.onValueChange}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.surface}
          />
        );
      case 'text':
        return (
          <Text style={[styles.menuItemValue, { color: colors.textSecondary }]}>
            {item.value}
          </Text>
        );
      case 'button':
        return (
          <Ionicons
            name="chevron-forward"
            size={24}
            color={colors.textSecondary}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Settings"
        showBackButton
        onBackPress={() => NavigationService.goBack()}
      />

      <ScrollView style={styles.scrollView}>
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
              {section.title}
            </Text>
            {section.items.map((item, itemIndex) => (
              <TouchableOpacity
                key={itemIndex}
                style={[
                  styles.menuItem,
                  { backgroundColor: colors.surface },
                ]}
                onPress={item.type === 'button' ? item.onPress : undefined}
              >
                <View style={styles.menuItemLeft}>
                  <Ionicons
                    name={item.icon as any}
                    size={24}
                    color={colors.text}
                  />
                  <Text style={[styles.menuItemTitle, { color: colors.text }]}>
                    {item.title}
                  </Text>
                </View>
                {renderSettingItem(item)}
              </TouchableOpacity>
            ))}
          </View>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 16,
    textTransform: 'uppercase',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemTitle: {
    fontSize: 16,
    marginLeft: 16,
  },
  menuItemValue: {
    fontSize: 16,
  },
}); 