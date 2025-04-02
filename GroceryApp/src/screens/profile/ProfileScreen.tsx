import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Header } from '../../components/common/Header';
import { Button } from '../../components/common/Button';
import { apiClient } from '../../api/client';
import { NavigationService } from '../../navigation/NavigationService';
import { Ionicons } from '@expo/vector-icons';

interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
}

export const ProfileScreen: React.FC = () => {
  const { colors } = useTheme();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      // TODO: Implement get profile API call
      setProfile({
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await apiClient.logout();
      NavigationService.reset('Login');
    } catch (error) {
      Alert.alert('Error', 'Failed to logout');
    }
  };

  const menuItems = [
    {
      icon: 'person-outline',
      title: 'Edit Profile',
      onPress: () => NavigationService.navigate('Profile'),
    },
    {
      icon: 'location-outline',
      title: 'Addresses',
      onPress: () => NavigationService.navigate('Addresses'),
    },
    {
      icon: 'card-outline',
      title: 'Payment Methods',
      onPress: () => NavigationService.navigate('PaymentMethods'),
    },
    {
      icon: 'notifications-outline',
      title: 'Notifications',
      onPress: () => NavigationService.navigate('Notifications'),
    },
    {
      icon: 'settings-outline',
      title: 'Settings',
      onPress: () => NavigationService.navigate('Settings'),
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Profile"
        showBackButton={false}
      />

      <ScrollView style={styles.scrollView}>
        <View style={[styles.profileSection, { backgroundColor: colors.surface }]}>
          <View style={styles.avatarContainer}>
            {profile?.avatar ? (
              <Image
                source={{ uri: profile.avatar }}
                style={styles.avatar}
              />
            ) : (
              <View style={[styles.avatarPlaceholder, { backgroundColor: colors.primary }]}>
                <Text style={styles.avatarText}>
                  {profile?.name?.charAt(0) || '?'}
                </Text>
              </View>
            )}
          </View>

          <Text style={[styles.name, { color: colors.text }]}>
            {profile?.name || 'Loading...'}
          </Text>
          <Text style={[styles.email, { color: colors.textSecondary }]}>
            {profile?.email || 'Loading...'}
          </Text>
          {profile?.phone && (
            <Text style={[styles.phone, { color: colors.textSecondary }]}>
              {profile.phone}
            </Text>
          )}
        </View>

        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem,
                { backgroundColor: colors.surface },
              ]}
              onPress={item.onPress}
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
              <Ionicons
                name="chevron-forward"
                size={24}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          ))}
        </View>

        <Button
          title="Logout"
          onPress={handleLogout}
          variant="outline"
          style={styles.logoutButton}
        />
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
  profileSection: {
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 40,
    color: '#fff',
    fontWeight: 'bold',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    marginBottom: 4,
  },
  phone: {
    fontSize: 16,
  },
  menuSection: {
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemTitle: {
    fontSize: 16,
    marginLeft: 16,
  },
  logoutButton: {
    margin: 16,
  },
}); 