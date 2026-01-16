/**
 * Configuration utilities for the KNOUX PID™ Web Intelligence Engine
 */

// Define environment variable names to check
const API_KEY_VARIABLES = [
  'VITE_GEMINI_API_KEY',
  'GEMINI_API_KEY',
  'REACT_APP_GEMINI_API_KEY',
  'NEXT_PUBLIC_GEMINI_API_KEY',
  'API_KEY'
];

/**
 * Get the API key from environment variables
 * @returns The API key string
 * @throws Error if no API key is found
 */
export const getApiKey = (): string => {
  let apiKey: string | undefined;
  
  for (const varName of API_KEY_VARIABLES) {
    apiKey = process.env[varName];
    if (apiKey) {
      break;
    }
  }
  
  if (!apiKey) {
    throw new Error(
      `API key not found. Please set one of the following environment variables: ${API_KEY_VARIABLES.join(', ')}. ` +
      `Create a .env.local file in the root directory and add: VITE_GEMINI_API_KEY=your_api_key_here`
    );
  }
  
  // Validate basic API key format (Google API keys are typically 39 characters starting with 'AI')
  if (apiKey.length < 30 || !apiKey.startsWith('AI')) {
    console.warn('API key format looks unusual. Make sure it starts with "AI" and is at least 30 characters.');
  }
  
  return apiKey;
};

/**
 * Validate if the environment is properly configured
 */
export const validateEnvironment = (): boolean => {
  try {
    getApiKey();
    return true;
  } catch (error) {
    console.error('Environment validation failed:', error);
    return false;
  }
};

/**
 * Configuration object with defaults and environment-based overrides
 */
export const Config = {
  get API_KEY(): string {
    return getApiKey();
  },
  
  get IS_DEV(): boolean {
    return process.env.NODE_ENV === 'development';
  },
  
  get IS_PROD(): boolean {
    return process.env.NODE_ENV === 'production';
  },
  
  // Timeout configurations
  REQUEST_TIMEOUT: parseInt(process.env.VITE_REQUEST_TIMEOUT || '30000', 10), // 30 seconds default
  
  // Rate limiting
  RATE_LIMIT_DELAY: parseInt(process.env.VITE_RATE_LIMIT_DELAY || '1000', 10), // 1 second default
  
  // Feature flags
  ENABLE_ANALYTICS: process.env.VITE_ENABLE_ANALYTICS === 'true',
  ENABLE_DEBUG_LOGS: process.env.VITE_ENABLE_DEBUG_LOGS === 'true' || process.env.NODE_ENV === 'development',
  
  // API settings
  get API_SETTINGS() {
    return {
      apiKey: this.API_KEY,
      timeout: this.REQUEST_TIMEOUT,
      maxRetries: 3,
    };
  }
};