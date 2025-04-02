import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Define types
interface PantryItem {
  id: string;
  name: string;
  quantity: number;
  imageUrl?: string;
  expiryDate?: string;
}

interface PantryState {
  items: PantryItem[];
  scannedItems: string[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: PantryState = {
  items: [],
  scannedItems: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchPantryItems = createAsyncThunk(
  'pantry/fetchItems',
  async (_, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      // For demo purposes, returning mock data
      return [
        {
          id: '1',
          name: 'Milk',
          quantity: 1,
          expiryDate: '2023-06-30',
        },
        {
          id: '2',
          name: 'Eggs',
          quantity: 12,
          expiryDate: '2023-06-25',
        },
      ];
    } catch (error) {
      return rejectWithValue('Failed to fetch pantry items');
    }
  }
);

export const savePantryItems = createAsyncThunk(
  'pantry/saveItems',
  async (items: string[], { rejectWithValue }) => {
    try {
      // Here you would typically call your API to save the items
      // For now, we'll just return the items
      
      // Convert string items to PantryItems
      const pantryItems: PantryItem[] = items.map((name, index) => ({
        id: `scan-${Date.now()}-${index}`,
        name,
        quantity: 1,
      }));
      
      return pantryItems;
    } catch (error) {
      return rejectWithValue('Failed to save pantry items');
    }
  }
);

// Create the slice
const pantrySlice = createSlice({
  name: 'pantry',
  initialState,
  reducers: {
    addScannedItems: (state, action: PayloadAction<string[]>) => {
      state.scannedItems = [...action.payload];
    },
    clearScannedItems: (state) => {
      state.scannedItems = [];
    },
    updateItemQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const { id, quantity } = action.payload;
      const itemIndex = state.items.findIndex(item => item.id === id);
      if (itemIndex !== -1) {
        state.items[itemIndex].quantity = quantity;
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch pantry items
      .addCase(fetchPantryItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPantryItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchPantryItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Save scanned items
      .addCase(savePantryItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(savePantryItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = [...state.items, ...action.payload];
        state.scannedItems = [];
      })
      .addCase(savePantryItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions and reducer
export const { 
  addScannedItems, 
  clearScannedItems, 
  updateItemQuantity, 
  removeItem 
} = pantrySlice.actions;

export default pantrySlice.reducer; 