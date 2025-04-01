import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Header } from '../../components/navigation/Header';
import { SearchBar } from '../../components/common/SearchBar';
import { StoreCard } from '../../components/store/StoreCard';

// Mock data - replace with actual API calls
const mockStores = [
  {
    id: '1',
    name: 'Fresh Market',
    address: '123 Main St, City, State',
    distance: 0.5,
    rating: 4.8,
    imageUrl: 'https://example.com/store1.jpg',
    isOpen: true,
    deliveryTime: '30-45 min',
    minimumOrder: 15.00,
  },
  {
    id: '2',
    name: 'Organic Grocers',
    address: '456 Oak Ave, City, State',
    distance: 1.2,
    rating: 4.6,
    imageUrl: 'https://example.com/store2.jpg',
    isOpen: true,
    deliveryTime: '45-60 min',
    minimumOrder: 20.00,
  },
  // Add more stores...
];

export const StoreScreen: React.FC = () => {
  const { colors, spacing } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedStore, setSelectedStore] = useState<string | null>(null);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    // Implement store search functionality
  };

  const handleStorePress = (storeId: string) => {
    setSelectedStore(storeId);
    // Navigate to store details or start shopping
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Implement refresh logic
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Select Store"
        showBackButton
        onBackPress={() => {
          // Handle back navigation
        }}
      />

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <SearchBar
          value={searchQuery}
          onChangeText={handleSearch}
          placeholder="Search stores..."
        />

        {mockStores.map((store) => (
          <StoreCard
            key={store.id}
            store={store}
            onPress={() => handleStorePress(store.id)}
            isSelected={selectedStore === store.id}
          />
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
}); 