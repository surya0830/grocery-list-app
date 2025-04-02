interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
}

interface AnalyticsService {
  trackEvent(eventName: string, properties?: Record<string, any>): void;
  trackScreenView(screenName: string): void;
  trackUserAction(action: string, properties?: Record<string, any>): void;
  trackError(errorName: string, properties?: Record<string, any>): void;
  setUserProperty(key: string, value: any): void;
  identify(userId: string, properties?: Record<string, any>): void;
  reset(): void;
  trackPurchase(properties: {
    order_id: string;
    total: number;
    currency: string;
    items: Array<{
      product_id: string;
      quantity: number;
      price: number;
    }>;
  }): void;
  trackSearch(query: string, properties?: Record<string, any>): void;
  trackProductView(properties: {
    product_id: string;
    product_name: string;
    category: string;
    price: number;
  }): void;
  trackCartUpdate(properties: {
    cart_id: string;
    item_count: number;
    total: number;
    items: Array<{
      product_id: string;
      quantity: number;
      price: number;
    }>;
  }): void;
}

class AnalyticsServiceImpl implements AnalyticsService {
  private static instance: AnalyticsServiceImpl;
  private userProperties: Record<string, any> = {};

  private constructor() {}

  static getInstance(): AnalyticsServiceImpl {
    if (!AnalyticsServiceImpl.instance) {
      AnalyticsServiceImpl.instance = new AnalyticsServiceImpl();
    }
    return AnalyticsServiceImpl.instance;
  }

  trackEvent(eventName: string, properties?: Record<string, any>): void {
    console.log('[Analytics] Event:', {
      name: eventName,
      properties: {
        ...properties,
        ...this.userProperties,
      },
      timestamp: new Date().toISOString(),
      platform: 'mobile',
    });
  }

  trackScreenView(screenName: string): void {
    this.trackEvent('screen_view', { screen_name: screenName });
  }

  trackUserAction(action: string, properties?: Record<string, any>): void {
    this.trackEvent('user_action', {
      action,
      ...properties,
    });
  }

  trackError(errorName: string, properties?: Record<string, any>): void {
    this.trackEvent('error', {
      error_name: errorName,
      ...properties,
    });
  }

  setUserProperty(key: string, value: any): void {
    this.userProperties[key] = value;
  }

  identify(userId: string, properties?: Record<string, any>): void {
    this.userProperties = {
      ...this.userProperties,
      user_id: userId,
      ...properties,
    };
  }

  reset(): void {
    this.userProperties = {};
  }

  trackPurchase(properties: {
    order_id: string;
    total: number;
    currency: string;
    items: Array<{
      product_id: string;
      quantity: number;
      price: number;
    }>;
  }): void {
    this.trackEvent('purchase', properties);
  }

  trackSearch(query: string, properties?: Record<string, any>): void {
    this.trackEvent('search', {
      query,
      ...properties,
    });
  }

  trackProductView(properties: {
    product_id: string;
    product_name: string;
    category: string;
    price: number;
  }): void {
    this.trackEvent('product_view', properties);
  }

  trackCartUpdate(properties: {
    cart_id: string;
    item_count: number;
    total: number;
    items: Array<{
      product_id: string;
      quantity: number;
      price: number;
    }>;
  }): void {
    this.trackEvent('cart_update', properties);
  }
}

export const AnalyticsService = AnalyticsServiceImpl; 