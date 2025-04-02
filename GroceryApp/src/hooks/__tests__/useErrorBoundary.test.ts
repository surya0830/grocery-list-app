import { renderHook, act } from '@testing-library/react-hooks';
import { useErrorBoundary } from '../useErrorBoundary';

describe('useErrorBoundary', () => {
  const mockOnError = jest.fn();
  const mockAlert = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(global, 'alert').mockImplementation(mockAlert);
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() =>
      useErrorBoundary({
        onError: mockOnError,
      })
    );

    expect(result.current.hasError).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.errorInfo).toBe(null);
  });

  it('should handle error', () => {
    const { result } = renderHook(() =>
      useErrorBoundary({
        onError: mockOnError,
      })
    );

    const error = new Error('Test error');
    const errorInfo = { componentStack: 'Test stack' };

    act(() => {
      result.current.handleError(error, errorInfo as React.ErrorInfo);
    });

    expect(result.current.hasError).toBe(true);
    expect(result.current.error).toBe(error);
    expect(result.current.errorInfo).toBe(errorInfo);
    expect(mockOnError).toHaveBeenCalledWith(error, errorInfo);
    expect(mockAlert).toHaveBeenCalledWith(
      'Error',
      'Something went wrong. Please try again.',
      expect.any(Array)
    );
  });

  it('should not show alert when showErrorAlert is false', () => {
    const { result } = renderHook(() =>
      useErrorBoundary({
        onError: mockOnError,
        showErrorAlert: false,
      })
    );

    const error = new Error('Test error');
    const errorInfo = { componentStack: 'Test stack' };

    act(() => {
      result.current.handleError(error, errorInfo as React.ErrorInfo);
    });

    expect(result.current.hasError).toBe(true);
    expect(result.current.error).toBe(error);
    expect(result.current.errorInfo).toBe(errorInfo);
    expect(mockOnError).toHaveBeenCalledWith(error, errorInfo);
    expect(mockAlert).not.toHaveBeenCalled();
  });

  it('should reset error state', () => {
    const { result } = renderHook(() =>
      useErrorBoundary({
        onError: mockOnError,
      })
    );

    const error = new Error('Test error');
    const errorInfo = { componentStack: 'Test stack' };

    act(() => {
      result.current.handleError(error, errorInfo as React.ErrorInfo);
    });

    expect(result.current.hasError).toBe(true);

    act(() => {
      result.current.resetError();
    });

    expect(result.current.hasError).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.errorInfo).toBe(null);
  });

  it('should handle error recovery through alert', () => {
    const { result } = renderHook(() =>
      useErrorBoundary({
        onError: mockOnError,
      })
    );

    const error = new Error('Test error');
    const errorInfo = { componentStack: 'Test stack' };

    act(() => {
      result.current.handleError(error, errorInfo as React.ErrorInfo);
    });

    expect(result.current.hasError).toBe(true);

    // Simulate alert OK button press
    const alertCall = mockAlert.mock.calls[0];
    const okButton = alertCall[2][0];
    act(() => {
      okButton.onPress();
    });

    expect(result.current.hasError).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.errorInfo).toBe(null);
  });

  it('should handle multiple errors', () => {
    const { result } = renderHook(() =>
      useErrorBoundary({
        onError: mockOnError,
      })
    );

    const error1 = new Error('First error');
    const error2 = new Error('Second error');
    const errorInfo = { componentStack: 'Test stack' };

    act(() => {
      result.current.handleError(error1, errorInfo as React.ErrorInfo);
    });

    expect(result.current.error).toBe(error1);

    act(() => {
      result.current.handleError(error2, errorInfo as React.ErrorInfo);
    });

    expect(result.current.error).toBe(error2);
  });

  it('should handle error without errorInfo', () => {
    const { result } = renderHook(() =>
      useErrorBoundary({
        onError: mockOnError,
      })
    );

    const error = new Error('Test error');

    act(() => {
      result.current.handleError(error, null as unknown as React.ErrorInfo);
    });

    expect(result.current.hasError).toBe(true);
    expect(result.current.error).toBe(error);
    expect(result.current.errorInfo).toBe(null);
    expect(mockOnError).toHaveBeenCalledWith(error, null);
  });

  it('should handle non-Error objects', () => {
    const { result } = renderHook(() =>
      useErrorBoundary({
        onError: mockOnError,
      })
    );

    const error = 'String error';
    const errorInfo = { componentStack: 'Test stack' };

    act(() => {
      result.current.handleError(error as unknown as Error, errorInfo as React.ErrorInfo);
    });

    expect(result.current.hasError).toBe(true);
    expect(result.current.error).toBe(error);
    expect(result.current.errorInfo).toBe(errorInfo);
  });
}); 