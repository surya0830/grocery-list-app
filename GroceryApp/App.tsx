import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/store';
import Navigation from './src/navigation';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <Provider store={store}>
      <StatusBar style="auto" />
      <Navigation />
    </Provider>
  );
}
