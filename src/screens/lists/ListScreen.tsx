import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { createList, fetchLists } from '../../store/slices/grocerySlice';
import { RootState } from '../../store';

const ListScreen = ({ navigation }: any) => {
  const [newListName, setNewListName] = useState('');
  const dispatch = useDispatch();
  const { lists, isLoading } = useSelector((state: RootState) => state.grocery);

  const handleCreateList = async () => {
    if (!newListName.trim()) {
      Alert.alert('Error', 'Please enter a list name');
      return;
    }

    try {
      await dispatch(createList(newListName.trim()) as any);
      setNewListName('');
      // Refresh lists
      dispatch(fetchLists() as any);
    } catch (error) {
      // Error is handled in the slice
    }
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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Lists</Text>
          <View style={{ width: 50 }} />
        </View>

        <View style={styles.createContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter new list name"
            value={newListName}
            onChangeText={setNewListName}
          />
          <TouchableOpacity 
            style={styles.createButton}
            onPress={handleCreateList}
            disabled={isLoading}
          >
            <Text style={styles.createButtonText}>Create</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.listsContainer}>
          <Text style={styles.sectionTitle}>All Lists</Text>
          <FlatList
            data={lists}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContainer}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    fontSize: 16,
    color: '#4CAF50',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  createContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  createButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
  },
  createButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  listsContainer: {
    flex: 1,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
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
});

export default ListScreen;
