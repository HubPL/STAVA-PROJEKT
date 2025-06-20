// System ograniczania liczby żądań, używany tymczasowo. 
const requests = new Map();

// Rate limiting store
const rateLimitStore = new Map();

/**
 * Sprawdza i ogranicza liczbę żądań z danego IP
 */
export function rateLimit(ip, maxRequests = 5, windowMs = 15 * 60 * 1000) {
  const now = Date.now();
  const key = `${ip}`;
  
  if (!requests.has(key)) {
    requests.set(key, []);
  }
  
  const userRequests = requests.get(key);
  const validRequests = userRequests.filter(time => now - time < windowMs);
  
  if (validRequests.length >= maxRequests) {
    return false;
  }
  
  validRequests.push(now);
  requests.set(key, validRequests);
  
  return true;
}

/**
 * Rate limiting funkcja
 * @param {string} identifier - IP lub inne ID
 * @param {number} limit - Maksymalna liczba żądań
 * @param {number} windowMs - Okno czasowe w milisekundach
 * @returns {boolean} true jeśli żądanie jest dozwolone
 */
export const rateLimitStoreFunction = (identifier, limit, windowMs) => {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  if (!rateLimitStore.has(identifier)) {
    rateLimitStore.set(identifier, []);
  }
  
  const requests = rateLimitStore.get(identifier);
  
  // Usuń stare żądania
  const validRequests = requests.filter(timestamp => timestamp > windowStart);
  
  if (validRequests.length >= limit) {
    return false;
  }
  
  // Dodaj nowe żądanie
  validRequests.push(now);
  rateLimitStore.set(identifier, validRequests);
  
  return true;
};

/**
 * Pobiera adres IP klienta z nagłówków żądania
 */
export function getClientIP(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  return request.headers.get('x-real-ip') || 
         request.headers.get('cf-connecting-ip') || 
         '127.0.0.1';
}

/**
 * Pobiera IP klienta z request
 */
export const getClientIPFromRequest = (request) => {
  const xForwardedFor = request.headers.get('x-forwarded-for');
  const xRealIP = request.headers.get('x-real-ip');
  const remoteAddr = request.headers.get('x-forwarded-for');
  
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim();
  }
  
  if (xRealIP) {
    return xRealIP;
  }
  
  if (remoteAddr) {
    return remoteAddr;
  }
  
  return 'unknown';
}; 