import { createNavigationContainerRef } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
  // Auth Stack
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ChangePassword: undefined;

  // Main Stack
  Home: undefined;
  Store: undefined;
  StoreDetails: { storeId: string };
  Cart: undefined;
  Checkout: undefined;
  OrderConfirmation: { orderId: string };
  OrderTracking: { orderId: string };
  OrderHistory: undefined;
  OrderDetails: { orderId: string };
  Profile: undefined;
  Settings: undefined;
  Addresses: undefined;
  AddAddress: undefined;
  EditAddress: { addressId: string };
  PaymentMethods: undefined;
  AddPaymentMethod: undefined;
  Notifications: undefined;

  // Legal Stack
  TermsOfService: undefined;
  PrivacyPolicy: undefined;
};

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export class NavigationService {
  static navigate<RouteName extends keyof RootStackParamList>(
    name: RouteName,
    params?: RootStackParamList[RouteName]
  ) {
    if (navigationRef.isReady()) {
      navigationRef.navigate(name, params);
    }
  }

  static goBack() {
    if (navigationRef.isReady() && navigationRef.canGoBack()) {
      navigationRef.goBack();
    }
  }

  static reset<RouteName extends keyof RootStackParamList>(
    name: RouteName,
    params?: RootStackParamList[RouteName]
  ) {
    if (navigationRef.isReady()) {
      navigationRef.reset({
        index: 0,
        routes: [{ name, params }],
      });
    }
  }

  static getCurrentRoute() {
    if (navigationRef.isReady()) {
      return navigationRef.getCurrentRoute()?.name;
    }
    return undefined;
  }

  static getCurrentParams() {
    if (navigationRef.isReady()) {
      return navigationRef.getCurrentRoute()?.params;
    }
    return undefined;
  }
}

export type NavigationProp = StackNavigationProp<RootStackParamList>; 