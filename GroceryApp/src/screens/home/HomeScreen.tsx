import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Header } from '../../components/navigation/Header';
import { SearchBar } from '../../components/common/SearchBar';
import { CategoryList } from '../../components/category/CategoryList';
import { FeaturedDeals } from '../../components/deals/FeaturedDeals';
import { CartSummary } from '../../components/cart/CartSummary';

// Mock data - replace with actual API calls
const mockCategories = [
  { id: '1', name: 'Fresh Produce', imageUrl: 'https://example.com/produce.jpg', itemCount: 150 },
  { id: '2', name: 'Meat & Seafood', imageUrl: 'https://example.com/meat.jpg', itemCount: 100 },
  { id: '3', name: 'Dairy & Eggs', imageUrl: 'https://example.com/dairy.jpg', itemCount: 80 },
  { id: '4', name: 'Pantry', imageUrl: 'https://example.com/pantry.jpg', itemCount: 200 },
];

const mockDeals = [
  {
    id: '1',
    title: 'Fresh Organic Bananas',
    description: 'Get 20% off on organic bananas',
    imageUrl: 'https://example.com/bananas.jpg',
    discount: '20%',
    originalPrice: 2.99,
    discountedPrice: 2.39,
    validUntil: '2024-04-07',
  },
  // Add more deals...
];

const mockCartItems = [
  { id: '1', name: 'Organic Bananas', price: 2.39, quantity: 2 },
  { id: '2', name: 'Whole Milk', price: 3.99, quantity: 1 },
];

export const HomeScreen: React.FC = () => {
  const { colors, spacing } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    // Implement search functionality
  };

  const handleCategoryPress = (categoryId: string) => {
    // Navigate to category screen
  };

  const handleDealPress = (dealId: string) => {
    // Navigate to deal details
  };

  const handleCheckout = () => {
    // Navigate to checkout
  };

  const handleViewCart = () => {
    // Navigate to cart
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
        title="Grocery App"
        rightIcon={{
          name: 'notifications-outline',
          onPress: () => {
            // Handle notifications
          },
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
          placeholder="Search for groceries..."
        />

        <CategoryList
          categories={mockCategories}
          onCategoryPress={handleCategoryPress}
        />

        <FeaturedDeals
          deals={mockDeals}
          onDealPress={handleDealPress}
        />

        <CartSummary
          items={mockCartItems}
          subtotal={8.77}
          tax={0.88}
          deliveryFee={2.99}
          onCheckout={handleCheckout}
          onViewCart={handleViewCart}
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
});
