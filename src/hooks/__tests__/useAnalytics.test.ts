import { renderHook, act } from '@testing-library/react-hooks';
import { useAnalytics } from '../useAnalytics';

describe('useAnalytics', () => {
  const mockTrackEvent = jest.fn();
  const mockSetUserProperty = jest.fn();
  const mockIdentify = jest.fn();
  const mockReset = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock the analytics service
    jest.mock('../services/analytics', () => ({
      AnalyticsService: {
        getInstance: jest.fn().mockReturnValue({
          trackEvent: mockTrackEvent,
          setUserProperty: mockSetUserProperty,
          identify: mockIdentify,
          reset: mockReset,
        }),
      },
    }));
  });

  it('should track event with properties', () => {
    const { result } = renderHook(() => useAnalytics());

    act(() => {
      result.current.trackEvent('test_event', { property1: 'value1' });
    });

    expect(mockTrackEvent).toHaveBeenCalledWith('test_event', {
      property1: 'value1',
    });
  });

  it('should track screen view', () => {
    const { result } = renderHook(() => useAnalytics());

    act(() => {
      result.current.trackScreenView('HomeScreen');
    });

    expect(mockTrackEvent).toHaveBeenCalledWith('screen_view', {
      screen_name: 'HomeScreen',
    });
  });

  it('should track user action', () => {
    const { result } = renderHook(() => useAnalytics());

    act(() => {
      result.current.trackUserAction('add_to_cart', {
        product_id: '123',
        quantity: 1,
      });
    });

    expect(mockTrackEvent).toHaveBeenCalledWith('user_action', {
      action: 'add_to_cart',
      product_id: '123',
      quantity: 1,
    });
  });

  it('should track error', () => {
    const { result } = renderHook(() => useAnalytics());

    act(() => {
      result.current.trackError('test_error', {
        error_code: 'E001',
        error_message: 'Test error message',
      });
    });

    expect(mockTrackEvent).toHaveBeenCalledWith('error', {
      error_name: 'test_error',
      error_code: 'E001',
      error_message: 'Test error message',
    });
  });

  it('should set user property', () => {
    const { result } = renderHook(() => useAnalytics());

    act(() => {
      result.current.setUserProperty('user_type', 'premium');
    });

    expect(mockSetUserProperty).toHaveBeenCalledWith('user_type', 'premium');
  });

  it('should identify user', () => {
    const { result } = renderHook(() => useAnalytics());

    act(() => {
      result.current.identify('user123', {
        email: 'test@example.com',
        name: 'Test User',
      });
    });

    expect(mockIdentify).toHaveBeenCalledWith('user123', {
      email: 'test@example.com',
      name: 'Test User',
    });
  });

  it('should reset analytics', () => {
    const { result } = renderHook(() => useAnalytics());

    act(() => {
      result.current.reset();
    });

    expect(mockReset).toHaveBeenCalled();
  });

  it('should track purchase event', () => {
    const { result } = renderHook(() => useAnalytics());

    act(() => {
      result.current.trackPurchase({
        order_id: 'ORDER123',
        total: 99.99,
        currency: 'USD',
        items: [
          {
            product_id: 'PROD1',
            quantity: 2,
            price: 49.99,
          },
        ],
      });
    });

    expect(mockTrackEvent).toHaveBeenCalledWith('purchase', {
      order_id: 'ORDER123',
      total: 99.99,
      currency: 'USD',
      items: [
        {
          product_id: 'PROD1',
          quantity: 2,
          price: 49.99,
        },
      ],
    });
  });

  it('should track search event', () => {
    const { result } = renderHook(() => useAnalytics());

    act(() => {
      result.current.trackSearch('organic', {
        query: 'apples',
        filters: ['organic', 'local'],
        result_count: 10,
      });
    });

    expect(mockTrackEvent).toHaveBeenCalledWith('search', {
      query: 'apples',
      filters: ['organic', 'local'],
      result_count: 10,
    });
  });

  it('should track product view', () => {
    const { result } = renderHook(() => useAnalytics());

    act(() => {
      result.current.trackProductView({
        product_id: 'PROD1',
        product_name: 'Organic Apples',
        category: 'Fruits',
        price: 4.99,
      });
    });

    expect(mockTrackEvent).toHaveBeenCalledWith('product_view', {
      product_id: 'PROD1',
      product_name: 'Organic Apples',
      category: 'Fruits',
      price: 4.99,
    });
  });

  it('should track cart update', () => {
    const { result } = renderHook(() => useAnalytics());

    act(() => {
      result.current.trackCartUpdate({
        cart_id: 'CART123',
        item_count: 3,
        total: 149.97,
        items: [
          {
            product_id: 'PROD1',
            quantity: 2,
            price: 49.99,
          },
          {
            product_id: 'PROD2',
            quantity: 1,
            price: 49.99,
          },
        ],
      });
    });

    expect(mockTrackEvent).toHaveBeenCalledWith('cart_update', {
      cart_id: 'CART123',
      item_count: 3,
      total: 149.97,
      items: [
        {
          product_id: 'PROD1',
          quantity: 2,
          price: 49.99,
        },
        {
          product_id: 'PROD2',
          quantity: 1,
          price: 49.99,
        },
      ],
    });
  });

  it('should handle multiple events in sequence', () => {
    const { result } = renderHook(() => useAnalytics());

    act(() => {
      result.current.trackEvent('event1', { data: 'value1' });
      result.current.trackEvent('event2', { data: 'value2' });
      result.current.setUserProperty('property1', 'value1');
    });

    expect(mockTrackEvent).toHaveBeenCalledTimes(2);
    expect(mockSetUserProperty).toHaveBeenCalledTimes(1);
  });
}); 