import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

// Import screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import HomeScreen from '../screens/home/HomeScreen';
import ListScreen from '../screens/lists/ListScreen';
import ListDetailScreen from '../screens/lists/ListDetailScreen';
import PantryScreen from '../screens/pantry/PantryScreen';
import PantryScanner from '../screens/pantry/PantryScanner';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          // Authenticated routes
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Lists" component={ListScreen} />
            <Stack.Screen name="ListDetail" component={ListDetailScreen} />
            <Stack.Screen name="Pantry" component={PantryScreen} />
            <Stack.Screen 
              name="PantryScanner" 
              component={PantryScanner} 
              options={{
                presentation: 'fullScreenModal',
                animation: 'slide_from_bottom',
              }}
            />
          </>
        ) : (
          // Public routes
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
