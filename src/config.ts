import Constants from 'expo-constants';

export const API_BASE_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000/api';

export const APP_CONFIG = {
  // Add other app configuration here
  minOrderAmount: 10,
  deliveryFee: 2.99,
  taxRate: 0.08,
  maxCartItems: 50,
  maxQuantityPerItem: 10,
  supportedPaymentMethods: ['credit_card', 'debit_card', 'apple_pay', 'google_pay'],
  orderStatuses: {
    pending: 'pending',
    processing: 'processing',
    shopping: 'shopping',
    ready: 'ready',
    delivering: 'delivering',
    delivered: 'delivered',
    cancelled: 'cancelled',
  },
  deliveryTimeRanges: {
    standard: '30-45 min',
    express: '15-30 min',
  },
}; 