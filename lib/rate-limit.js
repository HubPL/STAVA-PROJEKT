// System ograniczania liczby żądań
const requests = new Map();

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