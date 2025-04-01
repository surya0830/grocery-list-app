import { useState, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

interface UseErrorBoundaryOptions {
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  fallback?: React.ReactNode;
  showErrorAlert?: boolean;
}

export const useErrorBoundary = (options: UseErrorBoundaryOptions = {}) => {
  const {
    onError,
    showErrorAlert = true,
  } = options;

  const [state, setState] = useState<ErrorBoundaryState>({
    hasError: false,
    error: null,
    errorInfo: null,
  });

  const handleError = useCallback((error: Error, errorInfo: React.ErrorInfo) => {
    setState({
      hasError: true,
      error,
      errorInfo,
    });

    onError?.(error, errorInfo);

    if (showErrorAlert) {
      Alert.alert(
        'Error',
        'Something went wrong. Please try again.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Optionally handle error recovery
              setState({
                hasError: false,
                error: null,
                errorInfo: null,
              });
            },
          },
        ]
      );
    }
  }, [onError, showErrorAlert]);

  const resetError = useCallback(() => {
    setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  }, []);

  // Log errors to error reporting service
  useEffect(() => {
    if (state.error) {
      // Example: Log to error reporting service
      console.error('Error:', state.error);
      console.error('Error Info:', state.errorInfo);
    }
  }, [state.error, state.errorInfo]);

  return {
    ...state,
    handleError,
    resetError,
  };
}; 