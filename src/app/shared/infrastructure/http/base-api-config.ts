/**
 * Base configuration for API requests. Whether to use path or query parameters in requests.
 */
export interface BaseApiConfig {
  usePathParams: boolean;
  /**
   * Primary API base URL (AWS)
   */
  primaryBaseUrl?: string;
  /**
   * Fallback API base URL (Supabase)
   */
  fallbackBaseUrl?: string;
  /**
   * Whether to enable fallback to secondary API on primary failure
   */
  enableFallback?: boolean;
}
