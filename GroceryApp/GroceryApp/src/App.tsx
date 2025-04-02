import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { store } from './store';
import RootNavigator from './navigation';

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <View testID="app-container" style={{ flex: 1 }}>
          <RootNavigator />
        </View>
      </NavigationContainer>
    </Provider>
  );
} 