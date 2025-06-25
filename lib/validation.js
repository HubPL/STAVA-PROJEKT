/**
 * Centralna biblioteka walidacji dla STAVA
 */

/**
 * Waliduje adres email
 * @param {string} email - Adres email do walidacji
 * @returns {boolean} - True jeśli email jest poprawny
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  
  // Regex zgodny z HTML5 specification dla type="email"
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
};

/**
 * Waliduje polski numer telefonu
 * @param {string} phone - Numer telefonu do walidacji
 * @returns {boolean} - True jeśli telefon jest poprawny
 */
export const validatePolishPhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  
  // Usuń wszystkie spacje, myślniki i znaki specjalne
  const cleaned = phone.replace(/[\s\-\(\)\+]/g, '');
  
  // Sprawdź czy to polski numer telefonu
  // Może zaczynać się od 48 (kod kraju) lub być 9-cyfrowy
  const polishPhoneRegex = /^(48)?[4-9]\d{8}$/;
  
  return polishPhoneRegex.test(cleaned);
};

/**
 * Waliduje imię lub nazwisko
 * @param {string} name - Imię lub nazwisko do walidacji
 * @param {number} minLength - Minimalna długość (domyślnie 2)
 * @returns {boolean} - True jeśli nazwa jest poprawna
 */
export const validateName = (name, minLength = 2) => {
  if (!name || typeof name !== 'string') return false;
  
  const trimmed = name.trim();
  return trimmed.length >= minLength && /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s\-']+$/.test(trimmed);
};

/**
 * Sanityzuje i waliduje email (dla kompatybilności z istniejącym kodem)
 * @param {string} email - Email do walidacji
 * @returns {string|null} - Oczyszczony email lub null jeśli niepoprawny
 */
export const validateAndSanitizeEmail = (email) => {
  if (!validateEmail(email)) return null;
  return email.trim().toLowerCase();
}; 