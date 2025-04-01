import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLists } from '../../store/slices/grocerySlice';
import { logout } from '../../store/slices/authSlice';
import { RootState } from '../../store';

const HomeScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const { lists, isLoading } = useSelector((state: RootState) => state.grocery);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchLists() as any);
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout() as any);
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => navigation.navigate('ListDetail', { listId: item._id })}
    >
      <View>
        <Text style={styles.listName}>{item.name}</Text>
        <Text style={styles.itemCount}>
          {item.items?.length || 0} items
        </Text>
      </View>
      <Text style={styles.arrow}>→</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {user?.name || 'User'}!</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logout}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>My Grocery Lists</Text>

        {isLoading ? (
          <ActivityIndicator size="large" color="#4CAF50" />
        ) : lists.length > 0 ? (
          <FlatList
            data={lists}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>You don't have any lists yet</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('Lists')}
        >
          <Text style={styles.addButtonText}>+ Create New List</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#4CAF50',
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  logout: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  listItem: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  listName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemCount: {
    fontSize: 14,
    color: '#757575',
    marginTop: 5,
  },
  arrow: {
    fontSize: 18,
    color: '#757575',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
