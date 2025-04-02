import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

interface UseOfflineStorageOptions<T> {
  key: string;
  initialValue: T;
  onSync?: (data: T) => Promise<void>;
  syncInterval?: number;
}

export const useOfflineStorage = <T>({
  key,
  initialValue,
  onSync,
  syncInterval = 5000, // Default sync interval: 5 seconds
}: UseOfflineStorageOptions<T>) => {
  const [value, setValue] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isOnline, setIsOnline] = useState(true);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedData = await AsyncStorage.getItem(key);
        if (storedData) {
          setValue(JSON.parse(storedData));
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load data'));
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [key]);

  // Monitor network status
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected ?? true);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Sync data when online
  useEffect(() => {
    let syncIntervalId: NodeJS.Timeout;

    const syncData = async () => {
      if (isOnline && onSync && !isSyncing) {
        try {
          setIsSyncing(true);
          await onSync(value);
        } catch (err) {
          setError(err instanceof Error ? err : new Error('Failed to sync data'));
        } finally {
          setIsSyncing(false);
        }
      }
    };

    if (isOnline) {
      syncIntervalId = setInterval(syncData, syncInterval);
    }

    return () => {
      if (syncIntervalId) {
        clearInterval(syncIntervalId);
      }
    };
  }, [isOnline, onSync, value, syncInterval, isSyncing]);

  const updateValue = async (newValue: T) => {
    try {
      setValue(newValue);
      await AsyncStorage.setItem(key, JSON.stringify(newValue));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to save data'));
    }
  };

  const clearData = async () => {
    try {
      await AsyncStorage.removeItem(key);
      setValue(initialValue);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to clear data'));
    }
  };

  const forceSync = async () => {
    if (onSync && !isSyncing) {
      try {
        setIsSyncing(true);
        await onSync(value);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to sync data'));
      } finally {
        setIsSyncing(false);
      }
    }
  };

  return {
    value,
    isLoading,
    isSyncing,
    error,
    isOnline,
    updateValue,
    clearData,
    forceSync,
  };
}; 