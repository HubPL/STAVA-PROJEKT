// Production-safe logger
const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
  log: (...args) => {
    if (isDevelopment) {
      console.log('[STAVA]', ...args);
    }
  },
  
  warn: (...args) => {
    if (isDevelopment) {
      console.warn('[STAVA WARN]', ...args);
    }
  },
  
  error: (...args) => {
    // Błędy zawsze logujemy (dla monitoring)
    console.error('[STAVA ERROR]', ...args);
  },
  
  info: (...args) => {
    if (isDevelopment) {
      console.info('[STAVA INFO]', ...args);
    }
  }
};

// Helper do debugowania (tylko development)
export const debug = (...args) => {
  if (isDevelopment) {
    console.debug('[STAVA DEBUG]', ...args);
  }
};