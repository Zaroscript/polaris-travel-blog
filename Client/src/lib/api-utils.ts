import { AxiosError } from "axios";

/**
 * Generic API handler for making API calls with standardized error handling
 * 
 * @param apiCall - The function that makes the API call
 * @param setLoading - Function to set loading state
 * @param setError - Function to set error state
 * @returns A wrapped function that handles errors and loading states
 */
export const createApiHandler = <T,>(
  apiCall: () => Promise<T>,
  setLoading?: (isLoading: boolean) => void,
  setError?: (error: string | null) => void
) => {
  return async () => {
    try {
      setLoading?.(true);
      setError?.(null);
      const result = await apiCall();
      return result;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setError?.(errorMessage);
      throw error;
    } finally {
      setLoading?.(false);
    }
  };
};

/**
 * Extract meaningful error message from various error types
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || error.message || 'An unknown error occurred';
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unknown error occurred';
};

/**
 * Create a safe data fetcher that handles loading, error states, and type safety
 */
export const createSafeFetcher = <T, P extends any[]>(
  fetchFn: (...args: P) => Promise<T>,
  options?: {
    onSuccess?: (data: T) => void;
    onError?: (error: unknown) => void;
    initialData?: T;
  }
) => {
  return async (...args: P): Promise<{ data: T | null; error: string | null; isLoading: boolean }> => {
    let data: T | null = options?.initialData || null;
    let error: string | null = null;
    let isLoading = true;
    
    try {
      data = await fetchFn(...args);
      options?.onSuccess?.(data);
    } catch (err) {
      error = getErrorMessage(err);
      options?.onError?.(err);
    } finally {
      isLoading = false;
    }
    
    return { data, error, isLoading };
  };
};
