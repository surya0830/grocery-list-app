import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import groceryReducer from './slices/grocerySlice';
import pantryReducer from './features/pantrySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    grocery: groceryReducer,
    pantry: pantryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
