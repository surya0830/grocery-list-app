import { renderHook, act } from '@testing-library/react-hooks';
import { useApi } from '../useApi';

describe('useApi', () => {
  const mockApiFunction = jest.fn();
  const mockOnSuccess = jest.fn();
  const mockOnError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle successful API call', async () => {
    const mockData = { id: 1, name: 'Test' };
    mockApiFunction.mockResolvedValueOnce(mockData);

    const { result } = renderHook(() =>
      useApi(mockApiFunction, {
        onSuccess: mockOnSuccess,
        onError: mockOnError,
      })
    );

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);

    await act(async () => {
      await result.current.execute();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(mockOnSuccess).toHaveBeenCalledWith(mockData);
    expect(mockOnError).not.toHaveBeenCalled();
  });

  it('should handle API error', async () => {
    const mockError = new Error('API Error');
    mockApiFunction.mockRejectedValueOnce(mockError);

    const { result } = renderHook(() =>
      useApi(mockApiFunction, {
        onSuccess: mockOnSuccess,
        onError: mockOnError,
      })
    );

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);

    await act(async () => {
      await result.current.execute();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(mockError);
    expect(mockOnSuccess).not.toHaveBeenCalled();
    expect(mockOnError).toHaveBeenCalledWith(mockError);
  });

  it('should handle unknown error type', async () => {
    mockApiFunction.mockRejectedValueOnce('Unknown error');

    const { result } = renderHook(() =>
      useApi(mockApiFunction, {
        onSuccess: mockOnSuccess,
        onError: mockOnError,
      })
    );

    await act(async () => {
      await result.current.execute();
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('An error occurred. Please try again.');
  });

  it('should pass arguments to API function', async () => {
    const mockData = { id: 1, name: 'Test' };
    mockApiFunction.mockResolvedValueOnce(mockData);

    const { result } = renderHook(() =>
      useApi(mockApiFunction, {
        onSuccess: mockOnSuccess,
        onError: mockOnError,
      })
    );

    const args = ['arg1', 'arg2'];
    await act(async () => {
      await result.current.execute(...args);
    });

    expect(mockApiFunction).toHaveBeenCalledWith(...args);
  });

  it('should handle loading state', async () => {
    mockApiFunction.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));

    const { result } = renderHook(() =>
      useApi(mockApiFunction, {
        onSuccess: mockOnSuccess,
        onError: mockOnError,
      })
    );

    act(() => {
      result.current.execute();
    });

    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    expect(result.current.isLoading).toBe(false);
  });

  it('should not show error alert when showErrorAlert is false', async () => {
    const mockError = new Error('API Error');
    mockApiFunction.mockRejectedValueOnce(mockError);

    const { result } = renderHook(() =>
      useApi(mockApiFunction, {
        onSuccess: mockOnSuccess,
        onError: mockOnError,
        showErrorAlert: false,
      })
    );

    await act(async () => {
      await result.current.execute();
    });

    expect(result.current.error).toBe(mockError);
    expect(mockOnError).toHaveBeenCalledWith(mockError);
  });

  it('should use custom error message', async () => {
    const mockError = new Error('API Error');
    mockApiFunction.mockRejectedValueOnce(mockError);

    const customErrorMessage = 'Custom error message';
    const { result } = renderHook(() =>
      useApi(mockApiFunction, {
        onSuccess: mockOnSuccess,
        onError: mockOnError,
        errorMessage: customErrorMessage,
      })
    );

    await act(async () => {
      await result.current.execute();
    });

    expect(result.current.error?.message).toBe(customErrorMessage);
  });
}); 