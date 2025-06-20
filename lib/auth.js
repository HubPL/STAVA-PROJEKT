import { 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth } from './firebase';

/**
 * Logowanie administratora
 * @param {string} email - Email administratora
 * @param {string} password - Hasło administratora
 * @returns {Promise<User>} Zalogowany użytkownik
 */
export const loginAdmin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Błąd logowania:', error);
    
    switch (error.code) {
      case 'auth/user-not-found':
        throw new Error('Nie znaleziono użytkownika o podanym adresie email.');
      case 'auth/wrong-password':
        throw new Error('Nieprawidłowe hasło.');
      case 'auth/invalid-email':
        throw new Error('Nieprawidłowy format adresu email.');
      case 'auth/user-disabled':
        throw new Error('Konto użytkownika zostało wyłączone.');
      case 'auth/too-many-requests':
        throw new Error('Za dużo nieudanych prób logowania. Spróbuj ponownie później.');
      default:
        throw new Error('Wystąpił błąd podczas logowania. Spróbuj ponownie.');
    }
  }
};

/**
 * Wylogowanie administratora
 * @returns {Promise<void>}
 */
export const logoutAdmin = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Błąd wylogowania:', error);
    throw new Error('Wystąpił błąd podczas wylogowania.');
  }
};

/**
 * Sprawdza czy użytkownik jest zalogowany
 * @returns {Promise<User|null>} Zalogowany użytkownik lub null
 */
export const getCurrentUser = () => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

/**
 * Słuchacz zmian stanu autentyfikacji
 * @param {function} callback - Funkcja wywoływana przy zmianie stanu
 * @returns {function} Funkcja do anulowania subskrypcji
 */
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
}; 