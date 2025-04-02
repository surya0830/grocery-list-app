import { useEffect, useRef } from 'react';
import { InteractionManager } from 'react-native';

interface PerformanceMetric {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, any>;
}

interface UsePerformanceOptions {
  onMetricComplete?: (metric: PerformanceMetric) => void;
  logToConsole?: boolean;
}

export const usePerformance = (options: UsePerformanceOptions = {}) => {
  const { onMetricComplete, logToConsole = true } = options;
  const metrics = useRef<Map<string, PerformanceMetric>>(new Map());

  const startMetric = (name: string, metadata?: Record<string, any>) => {
    const metric: PerformanceMetric = {
      name,
      startTime: Date.now(),
      metadata,
    };

    metrics.current.set(name, metric);

    if (logToConsole) {
      console.log(`[Performance] Started metric: ${name}`);
    }
  };

  const endMetric = (name: string, additionalMetadata?: Record<string, any>) => {
    const metric = metrics.current.get(name);
    if (!metric) {
      console.warn(`[Performance] No metric found with name: ${name}`);
      return;
    }

    const endTime = Date.now();
    const duration = endTime - metric.startTime;

    const completedMetric: PerformanceMetric = {
      ...metric,
      endTime,
      duration,
      metadata: {
        ...metric.metadata,
        ...additionalMetadata,
      },
    };

    metrics.current.delete(name);

    if (logToConsole) {
      console.log(`[Performance] Completed metric: ${name}`, {
        duration: `${duration}ms`,
        metadata: completedMetric.metadata,
      });
    }

    onMetricComplete?.(completedMetric);
  };

  const measureInteraction = async (
    name: string,
    interaction: () => Promise<void>,
    metadata?: Record<string, any>
  ) => {
    startMetric(name, metadata);

    try {
      await interaction();
    } finally {
      endMetric(name);
    }
  };

  const measureRender = (name: string, metadata?: Record<string, any>) => {
    startMetric(name, metadata);

    return () => {
      endMetric(name);
    };
  };

  const measureNetworkRequest = async (
    name: string,
    request: Promise<any>,
    metadata?: Record<string, any>
  ) => {
    startMetric(name, metadata);

    try {
      const response = await request;
      endMetric(name, { success: true });
      return response;
    } catch (error) {
      endMetric(name, { success: false, error });
      throw error;
    }
  };

  const measureScreenLoad = (name: string, metadata?: Record<string, any>) => {
    startMetric(name, metadata);

    InteractionManager.runAfterInteractions(() => {
      endMetric(name);
    });
  };

  const getMetrics = () => {
    return Array.from(metrics.current.values());
  };

  const clearMetrics = () => {
    metrics.current.clear();
  };

  return {
    startMetric,
    endMetric,
    measureInteraction,
    measureRender,
    measureNetworkRequest,
    measureScreenLoad,
    getMetrics,
    clearMetrics,
  };
}; 