
import { useState, useCallback } from 'react';
import { AsyncOperationState } from '@/types/common';

interface UseAsyncOperationOptions {
  onSuccess?: (result: any) => void;
  onError?: (error: Error) => void;
  showToast?: boolean;
}

export function useAsyncOperation<T = any>(options: UseAsyncOperationOptions = {}) {
  const [state, setState] = useState<AsyncOperationState>({
    isLoading: false,
    error: null,
    isSubmitting: false,
    success: false
  });

  const execute = useCallback(async (
    operation: () => Promise<T>
  ): Promise<T | null> => {
    setState(prev => ({
      ...prev,
      isLoading: true,
      isSubmitting: true,
      error: null,
      success: false
    }));

    try {
      const result = await operation();
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        isSubmitting: false,
        success: true,
        lastUpdated: new Date()
      }));

      options.onSuccess?.(result);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        isSubmitting: false,
        error: errorMessage,
        success: false
      }));

      options.onError?.(error instanceof Error ? error : new Error(errorMessage));
      return null;
    }
  }, [options]);

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      isSubmitting: false,
      success: false
    });
  }, []);

  return {
    ...state,
    execute,
    reset
  };
}
