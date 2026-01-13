/**
 * Get server-side environment variables
 */
export function getServerEnv() {
  return {
    POSTHOG_HOST: process.env.POSTHOG_HOST || 'https://app.posthog.com',
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:1080',
    API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:8000',
  };
}

/**
 * Get client-side environment variables
 */
export function getClientEnv() {
  return {
    API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
    POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
  };
}