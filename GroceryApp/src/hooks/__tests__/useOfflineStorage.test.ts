import { renderHook, act } from '@testing-library/react-hooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { useOfflineStorage } from '../useOfflineStorage';

jest.mock('@react-native-async-storage/async-storage');
jest.mock('@react-native-community/netinfo');

describe('useOfflineStorage', () => {
  const mockKey = 'test-key';
  const mockInitialValue = { data: 'initial' };
  const mockOnSync = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
    (AsyncStorage.removeItem as jest.Mock).mockResolvedValue(undefined);
    (NetInfo.addEventListener as jest.Mock).mockReturnValue(jest.fn());
    (NetInfo.fetch as jest.Mock).mockResolvedValue({ isConnected: true });
  });

  it('should initialize with initial value', () => {
    const { result } = renderHook(() =>
      useOfflineStorage({
        key: mockKey,
        initialValue: mockInitialValue,
      })
    );

    expect(result.current.value).toEqual(mockInitialValue);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSyncing).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.isOnline).toBe(true);
  });

  it('should load stored value on mount', async () => {
    const storedValue = { data: 'stored' };
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(storedValue));

    const { result } = renderHook(() =>
      useOfflineStorage({
        key: mockKey,
        initialValue: mockInitialValue,
      })
    );

    expect(result.current.isLoading).toBe(true);
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.value).toEqual(storedValue);
    expect(result.current.isLoading).toBe(false);
  });

  it('should handle storage error on load', async () => {
    const storageError = new Error('Storage error');
    (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(storageError);

    const { result } = renderHook(() =>
      useOfflineStorage({
        key: mockKey,
        initialValue: mockInitialValue,
      })
    );

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.error).toBe(storageError);
    expect(result.current.isLoading).toBe(false);
  });

  it('should update value and persist to storage', async () => {
    const { result } = renderHook(() =>
      useOfflineStorage({
        key: mockKey,
        initialValue: mockInitialValue,
      })
    );

    const newValue = { data: 'new' };
    await act(async () => {
      await result.current.updateValue(newValue);
    });

    expect(result.current.value).toEqual(newValue);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(mockKey, JSON.stringify(newValue));
  });

  it('should handle storage error on update', async () => {
    const storageError = new Error('Storage error');
    (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(storageError);

    const { result } = renderHook(() =>
      useOfflineStorage({
        key: mockKey,
        initialValue: mockInitialValue,
      })
    );

    const newValue = { data: 'new' };
    await act(async () => {
      await result.current.updateValue(newValue);
    });

    expect(result.current.error).toBe(storageError);
  });

  it('should clear data', async () => {
    const { result } = renderHook(() =>
      useOfflineStorage({
        key: mockKey,
        initialValue: mockInitialValue,
      })
    );

    await act(async () => {
      await result.current.clearData();
    });

    expect(result.current.value).toEqual(mockInitialValue);
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith(mockKey);
  });

  it('should handle storage error on clear', async () => {
    const storageError = new Error('Storage error');
    (AsyncStorage.removeItem as jest.Mock).mockRejectedValueOnce(storageError);

    const { result } = renderHook(() =>
      useOfflineStorage({
        key: mockKey,
        initialValue: mockInitialValue,
      })
    );

    await act(async () => {
      await result.current.clearData();
    });

    expect(result.current.error).toBe(storageError);
  });

  it('should sync data when online', async () => {
    const { result } = renderHook(() =>
      useOfflineStorage({
        key: mockKey,
        initialValue: mockInitialValue,
        onSync: mockOnSync,
      })
    );

    await act(async () => {
      await result.current.updateValue({ data: 'new' });
    });

    expect(mockOnSync).toHaveBeenCalledWith({ data: 'new' });
  });

  it('should not sync data when offline', async () => {
    (NetInfo.fetch as jest.Mock).mockResolvedValueOnce({ isConnected: false });

    const { result } = renderHook(() =>
      useOfflineStorage({
        key: mockKey,
        initialValue: mockInitialValue,
        onSync: mockOnSync,
      })
    );

    await act(async () => {
      await result.current.updateValue({ data: 'new' });
    });

    expect(mockOnSync).not.toHaveBeenCalled();
  });

  it('should handle sync error', async () => {
    const syncError = new Error('Sync error');
    mockOnSync.mockRejectedValueOnce(syncError);

    const { result } = renderHook(() =>
      useOfflineStorage({
        key: mockKey,
        initialValue: mockInitialValue,
        onSync: mockOnSync,
      })
    );

    await act(async () => {
      await result.current.updateValue({ data: 'new' });
    });

    expect(result.current.error).toBe(syncError);
  });

  it('should force sync', async () => {
    const { result } = renderHook(() =>
      useOfflineStorage({
        key: mockKey,
        initialValue: mockInitialValue,
        onSync: mockOnSync,
      })
    );

    await act(async () => {
      await result.current.forceSync();
    });

    expect(mockOnSync).toHaveBeenCalledWith(mockInitialValue);
  });

  it('should handle network status changes', async () => {
    const mockUnsubscribe = jest.fn();
    (NetInfo.addEventListener as jest.Mock).mockReturnValueOnce(mockUnsubscribe);

    const { unmount } = renderHook(() =>
      useOfflineStorage({
        key: mockKey,
        initialValue: mockInitialValue,
      })
    );

    unmount();
    expect(mockUnsubscribe).toHaveBeenCalled();
  });
}); 