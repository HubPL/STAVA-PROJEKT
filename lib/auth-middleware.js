import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

/**
 * Weryfikuje czy użytkownik jest zalogowanym administratorem
 * @returns {Promise<User|null>} Zalogowany użytkownik lub null
 */
export const verifyAdminAuth = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      if (user) {
        resolve(user);
      } else {
        reject(new Error('Nieuprawniony dostęp - wymagane logowanie'));
      }
    }, (error) => {
      unsubscribe();
      reject(error);
    });
  });
};

/**
 * Middleware do weryfikacji autentyfikacji w API routes
 * @param {Request} request - Request object
 * @returns {Promise<{isAuthorized: boolean, user?: any, error?: string}>}
 */
export const authMiddleware = async (request) => {
  try {
    // Sprawdź czy request zawiera token autoryzacji
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        isAuthorized: false,
        error: 'Brak tokenu autoryzacji'
      };
    }

    // W prawdziwej implementacji tutaj weryfikowalibyśmy token Firebase
    // Na razie zwracamy false, ponieważ API routes wymagają innego podejścia
    return {
      isAuthorized: false,
      error: 'API endpoints wyłączone - używaj panelu administracyjnego'
    };

  } catch (error) {
    return {
      isAuthorized: false,
      error: 'Błąd weryfikacji autoryzacji'
    };
  }
};

/**
 * Sprawdza czy request pochodzi z dozwolonej domeny
 * @param {Request} request - Request object
 * @returns {boolean}
 */
export const verifyOrigin = (request) => {
  const origin = request.headers.get('origin');
  const allowedOrigins = [
    'https://stavakiszewa.pl',
    'https://www.stavakiszewa.pl',
    'http://localhost:3000', // dla developmentu
    'http://localhost:3001',
  ];
  
  return !origin || allowedOrigins.includes(origin);
}; 