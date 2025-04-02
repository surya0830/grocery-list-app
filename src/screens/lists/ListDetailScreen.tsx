import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchLists, 
  setCurrentList,
  addItemToList 
} from '../../store/slices/grocerySlice';
import { RootState } from '../../store';

const ListDetailScreen = ({ route, navigation }: any) => {
  const { listId } = route.params;
  const dispatch = useDispatch();
  const { lists, isLoading } = useSelector((state: RootState) => state.grocery);
  const [currentList, setLocalCurrentList] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    quantity: '1',
    unit: 'item',
    category: 'Other'
  });

  useEffect(() => {
    // Find the list from the store
    const list = lists.find((l: any) => l._id === listId);
    if (list) {
      setLocalCurrentList(list);
      dispatch(setCurrentList(list));
    } else {
      // If list not found in store, fetch lists again
      dispatch(fetchLists() as any).then(() => {
        const updatedList = lists.find((l: any) => l._id === listId);
        if (updatedList) {
          setLocalCurrentList(updatedList);
          dispatch(setCurrentList(updatedList));
        } else {
          Alert.alert('Error', 'List not found');
          navigation.goBack();
        }
      });
    }
  }, [listId, lists, dispatch, navigation]);

  const handleAddItem = async () => {
    if (!newItem.name.trim()) {
      Alert.alert('Error', 'Please enter an item name');
      return;
    }

    try {
      await dispatch(addItemToList({
        listId,
        item: {
          name: newItem.name.trim(),
          quantity: parseInt(newItem.quantity) || 1,
          unit: newItem.unit,
          category: newItem.category
        }
      }) as any);
      
      // Clear form and close modal
      setNewItem({
        name: '',
        quantity: '1',
        unit: 'item',
        category: 'Other'
      });
      setModalVisible(false);
    } catch (error) {
      // Error is handled in the slice
    }
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemInfo}>{item.quantity} {item.unit} • {item.category}</Text>
      </View>
      <TouchableOpacity style={styles.checkBox}>
        {item.isCompleted && <Text style={styles.checkMark}>✓</Text>}
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{currentList?.name || 'List'}</Text>
        <View style={{ width: 50 }} />
      </View>

      <View style={styles.content}>
        {currentList?.items?.length > 0 ? (
          <FlatList
            data={currentList.items}
            renderItem={renderItem}
            keyExtractor={(item, index) => item._id || index.toString()}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No items in this list yet</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>+ Add Item</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for adding new item */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Item</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Item Name"
              value={newItem.name}
              onChangeText={(text) => setNewItem({...newItem, name: text})}
            />
            
            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.quantityInput]}
                placeholder="Quantity"
                value={newItem.quantity}
                onChangeText={(text) => setNewItem({...newItem, quantity: text})}
                keyboardType="numeric"
              />
              
              <TextInput
                style={[styles.input, styles.unitInput]}
                placeholder="Unit"
                value={newItem.unit}
                onChangeText={(text) => setNewItem({...newItem, unit: text})}
              />
            </View>
            
            <TextInput
              style={styles.input}
              placeholder="Category"
              value={newItem.category}
              onChangeText={(text) => setNewItem({...newItem, category: text})}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleAddItem}
                disabled={isLoading}
              >
                <Text style={styles.saveButtonText}>Add Item</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  content: {
    flex: 1,
    padding: 15,
  },
  listContainer: {
    paddingBottom: 20,
  },
  itemContainer: {
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
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemInfo: {
    fontSize: 14,
    color: '#757575',
    marginTop: 5,
  },
  checkBox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkMark: {
    color: '#4CAF50',
    fontSize: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    margin: 20,
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
  },
  quantityInput: {
    flex: 1,
    marginRight: 10,
  },
  unitInput: {
    flex: 2,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    borderRadius: 8,
    padding: 12,
    flex: 1,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButtonText: {
    color: '#757575',
  },
  saveButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default ListDetailScreen;
