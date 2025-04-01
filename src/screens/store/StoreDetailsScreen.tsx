import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Header } from '../../components/common/Header';
import { SearchBar } from '../../components/common/SearchBar';
import { ProductCard } from '../../components/product/ProductCard';
import { CartSummary } from '../../components/cart/CartSummary';
import { Store, Product, CartItem } from '../../types';

const mockStore: Store = {
  id: '1',
  name: 'Fresh Grocery Store',
  address: '123 Main St, City, State',
  rating: 4.5,
  deliveryTime: '30-45 min',
  minimumOrder: 10,
};

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Organic Bananas',
    price: 2.99,
    unit: 'lb',
    imageUrl: 'https://example.com/bananas.jpg',
    category: 'Fruits',
    description: 'Fresh organic bananas',
    inStock: true,
  },
  {
    id: '2',
    name: 'Whole Milk',
    price: 3.99,
    unit: 'gallon',
    imageUrl: 'https://example.com/milk.jpg',
    category: 'Dairy',
    description: 'Fresh whole milk',
    inStock: true,
  },
  {
    id: '3',
    name: 'Bread',
    price: 2.49,
    unit: 'loaf',
    imageUrl: 'https://example.com/bread.jpg',
    category: 'Bakery',
    description: 'Fresh baked bread',
    inStock: true,
  },
];

export const StoreDetailsScreen: React.FC = () => {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    // Implement product search functionality
  };

  const handleAddToCart = (product: Product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const handleCheckout = () => {
    // Implement checkout logic
  };

  const handleViewCart = () => {
    // Navigate to cart screen
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Implement refresh logic
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.08; // 8% tax
  const deliveryFee = 2.99;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title={mockStore.name}
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
          placeholder="Search products..."
        />

        {mockProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onPress={() => handleAddToCart(product)}
            quantity={cartItems.find(item => item.id === product.id)?.quantity || 0}
            onQuantityChange={(newQuantity) => {
              if (newQuantity === 0) {
                setCartItems(prevItems => prevItems.filter(item => item.id !== product.id));
              } else {
                setCartItems(prevItems =>
                  prevItems.map(item =>
                    item.id === product.id
                      ? { ...item, quantity: newQuantity }
                      : item
                  )
                );
              }
            }}
          />
        ))}
      </ScrollView>

      {cartItems.length > 0 && (
        <CartSummary
          items={cartItems}
          subtotal={subtotal}
          tax={tax}
          deliveryFee={deliveryFee}
          onCheckout={handleCheckout}
          onViewCart={handleViewCart}
        />
      )}
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