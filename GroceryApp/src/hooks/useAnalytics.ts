import { useCallback } from 'react';
import { AnalyticsService } from '../services/analytics';

export const useAnalytics = () => {
  const analytics = AnalyticsService.getInstance();

  const trackEvent = useCallback(
    (eventName: string, properties?: Record<string, any>) => {
      analytics.trackEvent(eventName, properties);
    },
    [analytics]
  );

  const trackScreenView = useCallback(
    (screenName: string) => {
      analytics.trackScreenView(screenName);
    },
    [analytics]
  );

  const trackUserAction = useCallback(
    (action: string, properties?: Record<string, any>) => {
      analytics.trackUserAction(action, properties);
    },
    [analytics]
  );

  const trackError = useCallback(
    (errorName: string, properties?: Record<string, any>) => {
      analytics.trackError(errorName, properties);
    },
    [analytics]
  );

  const setUserProperty = useCallback(
    (key: string, value: any) => {
      analytics.setUserProperty(key, value);
    },
    [analytics]
  );

  const identify = useCallback(
    (userId: string, properties?: Record<string, any>) => {
      analytics.identify(userId, properties);
    },
    [analytics]
  );

  const reset = useCallback(() => {
    analytics.reset();
  }, [analytics]);

  const trackPurchase = useCallback(
    (properties: {
      order_id: string;
      total: number;
      currency: string;
      items: Array<{
        product_id: string;
        quantity: number;
        price: number;
      }>;
    }) => {
      analytics.trackPurchase(properties);
    },
    [analytics]
  );

  const trackSearch = useCallback(
    (query: string, properties?: Record<string, any>) => {
      analytics.trackSearch(query, properties);
    },
    [analytics]
  );

  const trackProductView = useCallback(
    (properties: {
      product_id: string;
      product_name: string;
      category: string;
      price: number;
    }) => {
      analytics.trackProductView(properties);
    },
    [analytics]
  );

  const trackCartUpdate = useCallback(
    (properties: {
      cart_id: string;
      item_count: number;
      total: number;
      items: Array<{
        product_id: string;
        quantity: number;
        price: number;
      }>;
    }) => {
      analytics.trackCartUpdate(properties);
    },
    [analytics]
  );

  return {
    trackEvent,
    trackScreenView,
    trackUserAction,
    trackError,
    setUserProperty,
    identify,
    reset,
    trackPurchase,
    trackSearch,
    trackProductView,
    trackCartUpdate,
  };
}; 