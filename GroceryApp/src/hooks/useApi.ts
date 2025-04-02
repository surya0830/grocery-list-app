import { useState, useCallback } from 'react';
import { Alert } from 'react-native';

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  showErrorAlert?: boolean;
  errorMessage?: string;
}

export const useApi = <T>(
  apiFunction: (...args: any[]) => Promise<T>,
  options: UseApiOptions = {}
) => {
  const {
    onSuccess,
    onError,
    showErrorAlert = true,
    errorMessage = 'An error occurred. Please try again.',
  } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (...args: any[]) => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await apiFunction(...args);
        onSuccess?.(data);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(errorMessage);
        setError(error);
        onError?.(error);
        if (showErrorAlert) {
          Alert.alert('Error', error.message || errorMessage);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [apiFunction, onSuccess, onError, showErrorAlert, errorMessage]
  );

  return {
    execute,
    isLoading,
    error,
  };
}; 