import { useCallback, useEffect, useRef, useState } from 'react';

// Types for the real-time data hook
export interface RealTimeConfig {
  enabled: boolean;
  interval: number; // in milliseconds
  maxRetries: number;
  retryDelay: number;
}

export interface RealTimeState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  isRefreshing: boolean;
  retryCount: number;
}

export interface RealTimeActions {
  refresh: () => Promise<void>;
  toggle: () => void;
  updateConfig: (config: Partial<RealTimeConfig>) => void;
}

// Default configuration
const DEFAULT_CONFIG: RealTimeConfig = {
  enabled: true,
  interval: 30000, // 30 seconds
  maxRetries: 3,
  retryDelay: 2000, // 2 seconds
};

/**
 * Custom hook for managing real-time data updates
 * @param fetchFn Function to fetch the data
 * @param config Configuration for the real-time updates
 * @returns State and actions for real-time data
 */
export function useRealTimeData<T>(
  fetchFn: () => Promise<T>,
  config: Partial<RealTimeConfig> = {}
): [RealTimeState<T>, RealTimeActions] {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const [configuration, setConfiguration] = useState(finalConfig);

  const [state, setState] = useState<RealTimeState<T>>({
    data: null,
    loading: true,
    error: null,
    lastUpdated: null,
    isRefreshing: false,
    retryCount: 0,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
  }, []);

  // Fetch data function with error handling and retries
  const fetchData = useCallback(
    async (isRefresh = false) => {
      if (!mountedRef.current) return;

      setState((prev) => ({
        ...prev,
        loading: !isRefresh,
        isRefreshing: isRefresh,
        error: null,
      }));

      try {
        const data = await fetchFn();

        if (!mountedRef.current) return;

        setState((prev) => ({
          ...prev,
          data,
          loading: false,
          isRefreshing: false,
          error: null,
          lastUpdated: new Date(),
          retryCount: 0,
        }));
      } catch (error) {
        if (!mountedRef.current) return;

        const errorMessage =
          error instanceof Error ? error.message : 'Failed to fetch data';

        setState((prev) => {
          const newRetryCount = prev.retryCount + 1;

          // If we haven't exceeded max retries, schedule a retry
          if (newRetryCount < configuration.maxRetries) {
            retryTimeoutRef.current = setTimeout(() => {
              if (mountedRef.current) {
                fetchData(isRefresh);
              }
            }, configuration.retryDelay);
          }

          return {
            ...prev,
            loading: false,
            isRefreshing: false,
            error: errorMessage,
            retryCount: newRetryCount,
          };
        });
      }
    },
    [fetchFn, configuration.maxRetries, configuration.retryDelay]
  );

  // Manual refresh function
  const refresh = useCallback(async () => {
    await fetchData(true);
  }, [fetchData]);

  // Toggle real-time updates
  const toggle = useCallback(() => {
    setConfiguration((prev) => ({
      ...prev,
      enabled: !prev.enabled,
    }));
  }, []);

  // Update configuration
  const updateConfig = useCallback((newConfig: Partial<RealTimeConfig>) => {
    setConfiguration((prev) => ({
      ...prev,
      ...newConfig,
    }));
  }, []);

  // Set up polling interval
  useEffect(() => {
    if (configuration.enabled) {
      // Initial fetch
      fetchData();

      // Set up polling
      intervalRef.current = setInterval(() => {
        fetchData(true);
      }, configuration.interval);
    } else {
      cleanup();
    }

    return cleanup;
  }, [configuration.enabled, configuration.interval, fetchData, cleanup]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      cleanup();
    };
  }, [cleanup]);

  const actions: RealTimeActions = {
    refresh,
    toggle,
    updateConfig,
  };

  return [state, actions];
}

// Utility hook for dashboard-specific real-time data
export interface DashboardStats {
  totalExams: number;
  completedExams: number;
  processingExams: number;
  errorExams: number;
  creditsRemaining: number;
  averageScore: number | null;
  recentActivity: Array<{
    id: string;
    type: 'exam_completed' | 'exam_started' | 'credit_used';
    message: string;
    timestamp: Date;
  }>;
}

// Hook specifically for dashboard statistics
export function useDashboardStats(userId: string) {
  const fetchStats = useCallback(async (): Promise<DashboardStats> => {
    // TODO: Replace with actual API call to fetch dashboard stats
    // This would typically call your Supabase API or Next.js API route

    // Mock implementation for now
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay

    return {
      totalExams: Math.floor(Math.random() * 20) + 10,
      completedExams: Math.floor(Math.random() * 15) + 5,
      processingExams: Math.floor(Math.random() * 5),
      errorExams: Math.floor(Math.random() * 2),
      creditsRemaining: Math.floor(Math.random() * 100) + 50,
      averageScore: Math.random() * 100,
      recentActivity: [],
    };
  }, [userId]);

  return useRealTimeData(fetchStats, {
    interval: 30000, // 30 seconds for dashboard stats
    enabled: true,
  });
}
