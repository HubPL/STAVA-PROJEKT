import { getStorage, ref, getDownloadURL } from "firebase/storage";
import app from './firebase'; // Upewnij się, że app jest poprawnie zainicjalizowana i eksportowana

const storage = getStorage(app);

/**
 * Pobiera publiczny URL dla pliku przechowywanego w Firebase Storage.
 * @param {string} path Ścieżka do pliku w Firebase Storage (np. 'global/logo.png').
 * @returns {Promise<string|null>} URL do pliku lub null w przypadku błędu.
 */
export const getStorageUrl = async (path) => {
  if (!path) {
    console.error("Path is undefined or empty in getStorageUrl");
    return null;
  }
  try {
    const storageRef = ref(storage, path);
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.error(`Error getting storage URL for path: ${path}`, error);
    // W przypadku błędu (np. plik nie istnieje), można zwrócić null lub placeholder
    // To zależy od tego, jak aplikacja ma obsługiwać brakujące obrazy.
    // Zwrócenie nulla jest bezpieczniejsze, aby uniknąć błędów ładowania nieistniejącego placeholdera.
    if (error.code === 'storage/object-not-found') {
      console.warn(`File not found at path: ${path}`);
    }
    return null;
  }
}; 