import { renderHook, act } from '@testing-library/react-hooks';
import { usePerformance } from '../usePerformance';

describe('usePerformance', () => {
  const mockOnMetricComplete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should start and end metric', () => {
    const { result } = renderHook(() =>
      usePerformance({
        onMetricComplete: mockOnMetricComplete,
      })
    );

    act(() => {
      result.current.startMetric('test-metric');
    });

    act(() => {
      result.current.endMetric('test-metric');
    });

    expect(mockOnMetricComplete).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'test-metric',
        duration: expect.any(Number),
      })
    );
  });

  it('should handle metric with metadata', () => {
    const { result } = renderHook(() =>
      usePerformance({
        onMetricComplete: mockOnMetricComplete,
      })
    );

    const metadata = { userId: '123', action: 'test' };

    act(() => {
      result.current.startMetric('test-metric', metadata);
    });

    act(() => {
      result.current.endMetric('test-metric', { additional: 'data' });
    });

    expect(mockOnMetricComplete).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'test-metric',
        metadata: {
          ...metadata,
          additional: 'data',
        },
      })
    );
  });

  it('should measure interaction', async () => {
    const mockInteraction = jest.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() =>
      usePerformance({
        onMetricComplete: mockOnMetricComplete,
      })
    );

    await act(async () => {
      await result.current.measureInteraction('test-interaction', mockInteraction);
    });

    expect(mockInteraction).toHaveBeenCalled();
    expect(mockOnMetricComplete).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'test-interaction',
      })
    );
  });

  it('should measure render', () => {
    const { result } = renderHook(() =>
      usePerformance({
        onMetricComplete: mockOnMetricComplete,
      })
    );

    const cleanup = result.current.measureRender('test-render');
    cleanup();

    expect(mockOnMetricComplete).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'test-render',
      })
    );
  });

  it('should measure network request', async () => {
    const mockRequest = Promise.resolve({ data: 'success' });
    const { result } = renderHook(() =>
      usePerformance({
        onMetricComplete: mockOnMetricComplete,
      })
    );

    await act(async () => {
      await result.current.measureNetworkRequest('test-request', mockRequest);
    });

    expect(mockOnMetricComplete).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'test-request',
        metadata: {
          success: true,
        },
      })
    );
  });

  it('should handle failed network request', async () => {
    const mockError = new Error('Request failed');
    const mockRequest = Promise.reject(mockError);
    const { result } = renderHook(() =>
      usePerformance({
        onMetricComplete: mockOnMetricComplete,
      })
    );

    await act(async () => {
      try {
        await result.current.measureNetworkRequest('test-request', mockRequest);
      } catch (error) {
        // Expected error
      }
    });

    expect(mockOnMetricComplete).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'test-request',
        metadata: {
          success: false,
          error: mockError,
        },
      })
    );
  });

  it('should measure screen load', () => {
    const { result } = renderHook(() =>
      usePerformance({
        onMetricComplete: mockOnMetricComplete,
      })
    );

    act(() => {
      result.current.measureScreenLoad('test-screen');
    });

    act(() => {
      jest.runAllTimers();
    });

    expect(mockOnMetricComplete).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'test-screen',
      })
    );
  });

  it('should get all metrics', () => {
    const { result } = renderHook(() =>
      usePerformance({
        onMetricComplete: mockOnMetricComplete,
      })
    );

    act(() => {
      result.current.startMetric('metric1');
      result.current.startMetric('metric2');
    });

    const metrics = result.current.getMetrics();
    expect(metrics).toHaveLength(2);
    expect(metrics).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'metric1' }),
        expect.objectContaining({ name: 'metric2' }),
      ])
    );
  });

  it('should clear metrics', () => {
    const { result } = renderHook(() =>
      usePerformance({
        onMetricComplete: mockOnMetricComplete,
      })
    );

    act(() => {
      result.current.startMetric('metric1');
      result.current.startMetric('metric2');
    });

    act(() => {
      result.current.clearMetrics();
    });

    const metrics = result.current.getMetrics();
    expect(metrics).toHaveLength(0);
  });

  it('should handle non-existent metric end', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const { result } = renderHook(() =>
      usePerformance({
        onMetricComplete: mockOnMetricComplete,
      })
    );

    act(() => {
      result.current.endMetric('non-existent-metric');
    });

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      '[Performance] No metric found with name: non-existent-metric'
    );
    expect(mockOnMetricComplete).not.toHaveBeenCalled();
  });
}); 