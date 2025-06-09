// Rate limiting system using in-memory store
// W produkcji lepiej użyć Redis lub innej zewnętrznej bazy

const requests = new Map();

export function rateLimit(ip, maxRequests = 5, windowMs = 15 * 60 * 1000) {
  const now = Date.now();
  const key = `${ip}`;
  
  if (!requests.has(key)) {
    requests.set(key, []);
  }
  
  const userRequests = requests.get(key);
  
  // Usuń stare requesty spoza okna czasowego
  const validRequests = userRequests.filter(time => now - time < windowMs);
  
  if (validRequests.length >= maxRequests) {
    return false; // Rate limit przekroczony
  }
  
  validRequests.push(now);
  requests.set(key, validRequests);
  
  return true; // OK
}

export function getClientIP(request) {
  // Sprawdź różne nagłówki dla IP w środowisku Vercel
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  return request.headers.get('x-real-ip') || 
         request.headers.get('cf-connecting-ip') || 
         '127.0.0.1';
} 