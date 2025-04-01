import React, { useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchPantryItems, removeItem, updateItemQuantity } from '../../store/features/pantrySlice';

const PantryScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.pantry);

  useEffect(() => {
    dispatch(fetchPantryItems());
  }, [dispatch]);

  const handleScanPantry = () => {
    navigation.navigate('PantryScanner' as never);
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      // Confirm deletion if quantity is reduced to zero
      Alert.alert(
        'Remove Item',
        'Do you want to remove this item from your pantry?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Remove',
            onPress: () => dispatch(removeItem(id)),
            style: 'destructive',
          },
        ]
      );
    } else {
      dispatch(updateItemQuantity({ id, quantity }));
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={() => dispatch(fetchPantryItems())}>
          <Text style={styles.retryButton}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Pantry</Text>
        <TouchableOpacity 
          style={styles.scanButton} 
          onPress={handleScanPantry}
        >
          <Text style={styles.scanButtonText}>Scan Pantry</Text>
        </TouchableOpacity>
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            Your pantry is empty. Tap "Scan Pantry" to add items.
          </Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                {item.expiryDate && (
                  <Text style={styles.itemExpiry}>
                    Expires: {item.expiryDate}
                  </Text>
                )}
              </View>
              <View style={styles.quantityControl}>
                <TouchableOpacity
                  onPress={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                >
                  <Text style={styles.quantityButton}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantity}>{item.quantity}</Text>
                <TouchableOpacity
                  onPress={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                >
                  <Text style={styles.quantityButton}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  scanButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  scanButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
  itemExpiry: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4CAF50',
    paddingHorizontal: 12,
  },
  quantity: {
    fontSize: 18,
    fontWeight: '500',
    width: 30,
    textAlign: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#f44336',
    marginBottom: 10,
  },
  retryButton: {
    fontSize: 16,
    color: '#2196F3',
    fontWeight: 'bold',
  },
});

export default PantryScreen; 