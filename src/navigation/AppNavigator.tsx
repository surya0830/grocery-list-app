import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { navigationRef } from './NavigationService';
import { RootStackParamList } from './NavigationService';

// Import screens
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { ForgotPasswordScreen } from '../screens/auth/ForgotPasswordScreen';
import { ChangePasswordScreen } from '../screens/auth/ChangePasswordScreen';
import { HomeScreen } from '../screens/home/HomeScreen';
import { StoreScreen } from '../screens/store/StoreScreen';
import { StoreDetailsScreen } from '../screens/store/StoreDetailsScreen';
import { CartScreen } from '../screens/cart/CartScreen';
import { CheckoutScreen } from '../screens/checkout/CheckoutScreen';
import { OrderConfirmationScreen } from '../screens/checkout/OrderConfirmationScreen';
import { OrderTrackingScreen } from '../screens/orders/OrderTrackingScreen';
import { OrderHistoryScreen } from '../screens/orders/OrderHistoryScreen';
import { OrderDetailsScreen } from '../screens/orders/OrderDetailsScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { SettingsScreen } from '../screens/settings/SettingsScreen';
import { AddressesScreen } from '../screens/addresses/AddressesScreen';
import { AddAddressScreen } from '../screens/addresses/AddAddressScreen';
import { EditAddressScreen } from '../screens/addresses/EditAddressScreen';
import { PaymentMethodsScreen } from '../screens/payment/PaymentMethodsScreen';
import { AddPaymentMethodScreen } from '../screens/payment/AddPaymentMethodScreen';
import { NotificationsScreen } from '../screens/notifications/NotificationsScreen';
import { TermsOfServiceScreen } from '../screens/legal/TermsOfServiceScreen';
import { PrivacyPolicyScreen } from '../screens/legal/PrivacyPolicyScreen';

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#fff' },
        }}
      >
        {/* Auth Stack */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />

        {/* Main Stack */}
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Store" component={StoreScreen} />
        <Stack.Screen name="StoreDetails" component={StoreDetailsScreen} />
        <Stack.Screen name="Cart" component={CartScreen} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
        <Stack.Screen name="OrderConfirmation" component={OrderConfirmationScreen} />
        <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
        <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
        <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Addresses" component={AddressesScreen} />
        <Stack.Screen name="AddAddress" component={AddAddressScreen} />
        <Stack.Screen name="EditAddress" component={EditAddressScreen} />
        <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
        <Stack.Screen name="AddPaymentMethod" component={AddPaymentMethodScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />

        {/* Legal Stack */}
        <Stack.Screen name="TermsOfService" component={TermsOfServiceScreen} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}; 