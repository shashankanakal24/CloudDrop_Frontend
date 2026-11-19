import { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiError } from '../types';

/**
 * Request Middleware (Axios Request Interceptor)
 * Intercepts every outgoing HTTP call to inject headers, normalize baseURL,
 * and record request start timestamps for latency tracking.
 */
export function requestMiddleware(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  // Attach metadata for performance measurement
  (config as any).metadata = { startTime: performance.now() };

  if (import.meta.env.DEV) {
    console.debug(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
  }

  return config;
}

/**
 * Response Middleware (Axios Response Interceptor)
 * Intercepts successful responses to track latency and log metrics.
 */
export function responseSuccessMiddleware(response: AxiosResponse): AxiosResponse {
  const config = response.config as any;
  if (config?.metadata?.startTime) {
    const duration = Math.round(performance.now() - config.metadata.startTime);
    if (import.meta.env.DEV) {
      console.debug(`[API Response] ${response.status} ${config.url} (${duration}ms)`);
    }
  }
  return response;
}

/**
 * Error Middleware (Axios Error Interceptor)
 * Intercepts HTTP errors and normalizes them into structured, user-friendly messages.
 */
export function responseErrorMiddleware(error: AxiosError<any>): Promise<never> {
  const normalizedError: ApiError = {
    statusCode: error.response?.status || 0,
    message: 'An unexpected network error occurred.',
    error: error.message,
  };

  if (error.response) {
    // Backend returned an HTTP error response
    const data = error.response.data;
    const status = error.response.status;

    if (Array.isArray(data?.message)) {
      normalizedError.message = data.message.join(', ');
    } else if (typeof data?.message === 'string') {
      normalizedError.message = data.message;
    } else if (status === 404) {
      normalizedError.message = 'The requested file or resource could not be found.';
    } else if (status === 400 && data?.message?.includes('expired')) {
      normalizedError.message = 'This file transfer link has expired and is no longer available.';
    } else if (status === 500) {
      normalizedError.message = 'Internal server error. Please try again later.';
    }

    normalizedError.statusCode = status;
  } else if (error.request) {
    // Request was made but no response was received (Network down or CORS blocked)
    normalizedError.message =
      'Unable to connect to the CloudDrop backend server. Please check your internet connection or verify the server status.';
    normalizedError.statusCode = 0;
  }

  // Attach normalized error to the error object for consumers
  (error as any).normalized = normalizedError;

  return Promise.reject(error);
}

