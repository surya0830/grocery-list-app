import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/client';

export const fetchLists = createAsyncThunk('grocery/fetchLists', async (_, { rejectWithValue }) => {
  try {
    const response = await apiClient.get('/grocery/lists');
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch lists');
  }
});

export const createList = createAsyncThunk(
  'grocery/createList',
  async (name: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/grocery/lists', { name });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create list');
    }
  }
);

export const addItemToList = createAsyncThunk(
  'grocery/addItem',
  async ({ listId, item }: { listId: string; item: any }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/grocery/items', { listId, ...item });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add item');
    }
  }
);

interface GroceryState {
  lists: any[];
  currentList: any | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: GroceryState = {
  lists: [],
  currentList: null,
  isLoading: false,
  error: null,
};

const grocerySlice = createSlice({
  name: 'grocery',
  initialState,
  reducers: {
    setCurrentList: (state, action) => {
      state.currentList = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLists.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchLists.fulfilled, (state, action) => {
        state.isLoading = false;
        state.lists = action.payload;
      })
      .addCase(fetchLists.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      .addCase(createList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.lists.push(action.payload);
      })
      .addCase(createList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      .addCase(addItemToList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addItemToList.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update list in state
        const index = state.lists.findIndex(list => list._id === action.payload._id);
        if (index !== -1) {
          state.lists[index] = action.payload;
        }
        // Update current list if needed
        if (state.currentList && state.currentList._id === action.payload._id) {
          state.currentList = action.payload;
        }
      })
      .addCase(addItemToList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentList, clearError } = grocerySlice.actions;
export default grocerySlice.reducer;
