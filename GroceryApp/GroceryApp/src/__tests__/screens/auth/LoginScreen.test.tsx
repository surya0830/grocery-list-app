import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { describe, it, expect, jest } from '@jest/globals';
import LoginScreen from '../../../screens/auth/LoginScreen';
import authReducer from '../../../store/slices/authSlice';

// Mock the navigation prop
const mockNavigation = {
  navigate: jest.fn(),
};

// Create a mock store
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: {
      auth: {
        isLoading: false,
        error: null,
        user: null,
        ...initialState,
      },
    },
  });
};

describe('LoginScreen', () => {
  it('renders correctly', () => {
    const store = createMockStore();
    const { getByPlaceholderText, getByText } = render(
      <Provider store={store}>
        <LoginScreen navigation={mockNavigation} />
      </Provider>
    );

    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('Sign In')).toBeTruthy();
  });

  it('shows error when submitting empty form', () => {
    const store = createMockStore();
    const { getByText } = render(
      <Provider store={store}>
        <LoginScreen navigation={mockNavigation} />
      </Provider>
    );

    fireEvent.press(getByText('Sign In'));

    expect(getByText('Please enter both email and password')).toBeTruthy();
  });

  it('handles login attempt', async () => {
    const store = createMockStore();
    const { getByPlaceholderText, getByText } = render(
      <Provider store={store}>
        <LoginScreen navigation={mockNavigation} />
      </Provider>
    );

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.press(getByText('Sign In'));

    await waitFor(() => {
      // Add assertions based on your login logic
      // For example, checking if the login action was dispatched
    });
  });
}); 